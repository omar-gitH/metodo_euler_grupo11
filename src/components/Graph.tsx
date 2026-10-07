import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EulerStep, createExactEvaluator, formatNum } from '../utils/euler';
import { MathInline } from './MathView';
import {
  TrendingUp,
  Layers,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Hand,
  BoxSelect,
  CircleDot,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GraphProps {
  steps: EulerStep[];
  expressionLatex: string;
  exactExprLatex?: string;
  /** Expresión analítica (mathjs) para muestrear la curva exacta con alta resolución al hacer zoom. */
  exactExpr?: string;
  hasExact: boolean;
}

interface View {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

type Tab = 'solution' | 'error';
type Tool = 'pan' | 'box';

interface ChartPoint {
  n: number;
  x: number;
  euler: number;
  slope: number;
  exact: number | null;
  err: number | null;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Genera marcas "bonitas" (1, 2, 5 × 10^n) para un rango dado. */
function niceTicks(min: number, max: number, target: number) {
  const span = max - min;
  if (!isFinite(span) || span <= 0) return { ticks: [min], step: 1 };
  const raw = span / Math.max(2, target);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start, i = 0; v <= max + step * 1e-9 && i < 60; v += step, i++) {
    ticks.push(Number(v.toFixed(12)));
  }
  return { ticks, step };
}

function formatTick(v: number, step: number) {
  if (Math.abs(v) < step * 1e-9) return '0';
  const a = Math.abs(v);
  if (a >= 1e6 || a < 1e-4) return v.toExponential(1).replace('e+', 'e');
  const dec = Math.min(8, Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));
  return v.toFixed(dec);
}

const GraphCanvas: React.FC<GraphProps> = ({
  steps,
  expressionLatex,
  exactExprLatex,
  exactExpr,
  hasExact,
}) => {
  const { isDarkMode, isDark } = useTheme();
  const dark = isDarkMode !== undefined ? isDarkMode : isDark;
  const uid = useId().replace(/:/g, '');

  const [activeTab, setActiveTab] = useState<Tab>('solution');
  const [showExact, setShowExact] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [tool, setTool] = useState<Tool>('pan');
  const [fullscreen, setFullscreen] = useState(false);
  const [chartHeight, setChartHeight] = useState(420);
  const tab: Tab = hasExact ? activeTab : 'solution';

  // ---------- Datos ----------
  const points = useMemo<ChartPoint[]>(
    () =>
      steps.map((s) => ({
        n: s.n,
        x: s.x,
        euler: s.y,
        slope: s.slope,
        exact: s.yExact != null && isFinite(s.yExact) ? s.yExact : null,
        err: s.absError != null && isFinite(s.absError) ? s.absError : null,
      })),
    [steps]
  );

  const exactFn = useMemo(
    () => (hasExact && exactExpr && exactExpr.trim() ? createExactEvaluator(exactExpr) : null),
    [hasExact, exactExpr]
  );

  const xFirst = points[0].x;
  const xLast = points[points.length - 1].x;

  /** Vista inicial que encuadra toda la información. */
  const fit = useMemo<View>(() => {
    const xp = (xLast - xFirst) * 0.04 || 1;
    const ys: number[] = [];
    if (tab === 'solution') {
      points.forEach((p) => {
        if (isFinite(p.euler)) ys.push(p.euler);
        if (hasExact && p.exact != null) ys.push(p.exact);
      });
      if (hasExact && exactFn) {
        for (let i = 0; i <= 120; i++) {
          const v = exactFn(xFirst + ((xLast - xFirst) * i) / 120);
          if (isFinite(v)) ys.push(v);
        }
      }
    } else {
      ys.push(0);
      points.forEach((p) => p.err != null && ys.push(p.err));
    }
    let min = ys.length ? Math.min(...ys) : 0;
    let max = ys.length ? Math.max(...ys) : 1;
    const span = max - min || Math.max(Math.abs(max), 1) * 0.2;
    const pad = span * (tab === 'error' ? 0.12 : 0.1);
    max += pad;
    min = tab === 'error' ? Math.min(0, min) - pad * 0.3 : min - pad;
    return { xMin: xFirst - xp, xMax: xLast + xp, yMin: min, yMax: max };
  }, [points, tab, hasExact, exactFn, xFirst, xLast]);

  // ---------- Vista (zoom/pan) ----------
  const fitRef = useRef(fit);
  fitRef.current = fit;
  const viewRef = useRef<View>(fit);
  const [view, setView] = useState<View>(fit);
  const rafRef = useRef(0);

  const applyView = useCallback((v: View) => {
    viewRef.current = v;
    setView(v);
  }, []);

  useLayoutEffect(() => {
    cancelAnimationFrame(rafRef.current);
    applyView(fit);
  }, [fit, applyView]);

  const animateTo = useCallback(
    (target: View) => {
      cancelAnimationFrame(rafRef.current);
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        applyView(target);
        return;
      }
      const from = viewRef.current;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / 260);
        const e = 1 - Math.pow(1 - t, 3);
        const lerp = (a: number, b: number) => a + (b - a) * e;
        applyView({
          xMin: lerp(from.xMin, target.xMin),
          xMax: lerp(from.xMax, target.xMax),
          yMin: lerp(from.yMin, target.yMin),
          yMax: lerp(from.yMax, target.yMax),
        });
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [applyView]
  );

  /** Escala el rango visible alrededor del punto (fx, fy) ∈ [0,1]² del área de trazado. */
  const scaleView = useCallback((base: View, fx: number, fy: number, k: number): View => {
    const f = fitRef.current;
    const sx = base.xMax - base.xMin;
    const sy = base.yMax - base.yMin;
    const fsx = f.xMax - f.xMin;
    const fsy = f.yMax - f.yMin;
    const nsx = clamp(sx * k, fsx * 1e-4, fsx * 40);
    const nsy = clamp(sy * k, fsy * 1e-4, fsy * 40);
    const ax = base.xMin + fx * sx;
    const ay = base.yMax - fy * sy;
    return {
      xMin: ax - fx * nsx,
      xMax: ax - fx * nsx + nsx,
      yMax: ay + fy * nsy,
      yMin: ay + fy * nsy - nsy,
    };
  }, []);

  // ---------- Tamaño ----------
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 720, h: 420 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.max(220, Math.floor(r.width)), h: Math.max(220, Math.floor(r.height)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const compact = size.w < 520;
  const m = compact ? { l: 48, r: 12, t: 14, b: 40 } : { l: 64, r: 22, t: 18, b: 46 };
  const W = size.w;
  const H = size.h;
  const pw = Math.max(40, W - m.l - m.r);
  const ph = Math.max(40, H - m.t - m.b);
  const geoRef = useRef({ l: m.l, t: m.t, pw, ph });
  geoRef.current = { l: m.l, t: m.t, pw, ph };

  const setPresetHeight = (h: number) => {
    setChartHeight(h);
    if (wrapRef.current) wrapRef.current.style.height = `${h}px`;
  };

  // ---------- Pantalla completa ----------
  const fullscreenRef = useRef(false);
  fullscreenRef.current = fullscreen;
  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [fullscreen]);

  // ---------- Rueda (Ctrl + rueda, o libre en pantalla completa) ----------
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey || fullscreenRef.current)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const g = geoRef.current;
      const fx = clamp((e.clientX - r.left - g.l) / g.pw, 0, 1);
      const fy = clamp((e.clientY - r.top - g.t) / g.ph, 0, 1);
      const dy = clamp(e.deltaY * (e.deltaMode === 1 ? 33 : 1), -150, 150);
      cancelAnimationFrame(rafRef.current);
      applyView(scaleView(viewRef.current, fx, fy, Math.exp(dy * 0.002)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyView, scaleView]);

  // ---------- Puntero (pan / pellizco / zoom por área / hover) ----------
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    type: 'pan' | 'box' | 'pinch';
    startView: View;
    start: { x: number; y: number };
    startDist?: number;
    startCenter?: { x: number; y: number };
    moved: boolean;
  } | null>(null);
  const boxRef = useRef<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [box, setBoxState] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const setBox = (b: typeof boxRef.current) => {
    boxRef.current = b;
    setBoxState(b);
  };

  const local = (e: { clientX: number; clientY: number }) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const updateHover = (p: { x: number; y: number }) => {
    const g = geoRef.current;
    if (p.x < g.l || p.x > g.l + g.pw || p.y < g.t || p.y > g.t + g.ph) {
      setHoverIdx(null);
      return;
    }
    const v = viewRef.current;
    const sx = v.xMax - v.xMin;
    let best = -1;
    let bd = Infinity;
    points.forEach((pt, i) => {
      const d = Math.abs(g.l + ((pt.x - v.xMin) / sx) * g.pw - p.x);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    setHoverIdx(bd <= 44 ? best : null);
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(rafRef.current);
    setHoverIdx(null);
    setDragging(true);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        type: 'pinch',
        startView: viewRef.current,
        start: p,
        startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        startCenter: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        moved: true,
      };
      setBox(null);
    } else {
      const isBox = tool === 'box' || e.shiftKey;
      gesture.current = { type: isBox ? 'box' : 'pan', startView: viewRef.current, start: p, moved: false };
      if (isBox) setBox({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = local(e);
    if (!pointers.current.has(e.pointerId)) {
      if (e.pointerType === 'mouse') updateHover(p);
      return;
    }
    pointers.current.set(e.pointerId, p);
    const g = gesture.current;
    if (!g) return;
    const { l, t, pw: gw, ph: gh } = geoRef.current;
    const sv = g.startView;
    const sx = sv.xMax - sv.xMin;
    const sy = sv.yMax - sv.yMin;

    if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const k = g.startDist! / dist;
      const c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const f = fitRef.current;
      const fsx = f.xMax - f.xMin;
      const fsy = f.yMax - f.yMin;
      const nsx = clamp(sx * k, fsx * 1e-4, fsx * 40);
      const nsy = clamp(sy * k, fsy * 1e-4, fsy * 40);
      const ax = sv.xMin + ((g.startCenter!.x - l) / gw) * sx;
      const ay = sv.yMax - ((g.startCenter!.y - t) / gh) * sy;
      const fx = (c.x - l) / gw;
      const fy = (c.y - t) / gh;
      applyView({
        xMin: ax - fx * nsx,
        xMax: ax - fx * nsx + nsx,
        yMax: ay + fy * nsy,
        yMin: ay + fy * nsy - nsy,
      });
    } else if (g.type === 'pan') {
      const dx = p.x - g.start.x;
      const dy = p.y - g.start.y;
      if (Math.hypot(dx, dy) > 3) g.moved = true;
      applyView({
        xMin: sv.xMin - (dx / gw) * sx,
        xMax: sv.xMax - (dx / gw) * sx,
        yMin: sv.yMin + (dy / gh) * sy,
        yMax: sv.yMax + (dy / gh) * sy,
      });
    } else if (g.type === 'box') {
      if (Math.hypot(p.x - g.start.x, p.y - g.start.y) > 3) g.moved = true;
      setBox({
        x0: clamp(g.start.x, l, l + gw),
        y0: clamp(g.start.y, t, t + gh),
        x1: clamp(p.x, l, l + gw),
        y1: clamp(p.y, t, t + gh),
      });
    }
  };

  const endPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    const p = local(e);
    pointers.current.delete(e.pointerId);

    if (g?.type === 'box' && boxRef.current) {
      const b = boxRef.current;
      const { l, t, pw: gw, ph: gh } = geoRef.current;
      if (Math.abs(b.x1 - b.x0) > 12 && Math.abs(b.y1 - b.y0) > 12) {
        const v = viewRef.current;
        const sx = v.xMax - v.xMin;
        const sy = v.yMax - v.yMin;
        const toX = (px: number) => v.xMin + ((px - l) / gw) * sx;
        const toY = (py: number) => v.yMax - ((py - t) / gh) * sy;
        animateTo({
          xMin: toX(Math.min(b.x0, b.x1)),
          xMax: toX(Math.max(b.x0, b.x1)),
          yMax: toY(Math.min(b.y0, b.y1)),
          yMin: toY(Math.max(b.y0, b.y1)),
        });
      }
      setBox(null);
    } else if (g && !g.moved && g.type !== 'pinch') {
      updateHover(p); // toque / clic sin arrastre → inspeccionar punto
    }

    if (g?.type === 'pinch' && pointers.current.size === 1) {
      const rest = [...pointers.current.values()][0];
      gesture.current = { type: 'pan', startView: viewRef.current, start: rest, moved: true };
    } else if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
    }
  };

  const zoomBy = (k: number) => animateTo(scaleView(viewRef.current, 0.5, 0.5, k));
  const resetView = () => animateTo(fitRef.current);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const v = viewRef.current;
    const sx = v.xMax - v.xMin;
    const sy = v.yMax - v.yMin;
    const move = (dx: number, dy: number) =>
      animateTo({ xMin: v.xMin + dx * sx, xMax: v.xMax + dx * sx, yMin: v.yMin + dy * sy, yMax: v.yMax + dy * sy });
    switch (e.key) {
      case '+':
      case '=':
        zoomBy(0.7);
        break;
      case '-':
      case '_':
        zoomBy(1 / 0.7);
        break;
      case '0':
        resetView();
        break;
      case 'ArrowLeft':
        move(-0.15, 0);
        break;
      case 'ArrowRight':
        move(0.15, 0);
        break;
      case 'ArrowUp':
        move(0, 0.15);
        break;
      case 'ArrowDown':
        move(0, -0.15);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  // ---------- Geometría de dibujo ----------
  const sxOf = (x: number) => m.l + ((x - view.xMin) / (view.xMax - view.xMin)) * pw;
  const syOf = (y: number) => m.t + (1 - (y - view.yMin) / (view.yMax - view.yMin)) * ph;
  const safeY = (y: number) => clamp(syOf(y), -1e4, 1e4);

  const toPath = (pts: { x: number; y: number | null }[]) => {
    let d = '';
    let pen = false;
    for (const p of pts) {
      if (p.y == null || !isFinite(p.y)) {
        pen = false;
        continue;
      }
      d += `${pen ? 'L' : 'M'}${sxOf(p.x).toFixed(2)} ${safeY(p.y).toFixed(2)}`;
      pen = true;
    }
    return d;
  };

  const mainPts = useMemo(
    () => points.map((p) => ({ x: p.x, y: tab === 'solution' ? p.euler : p.err })),
    [points, tab]
  );

  const exactPts = useMemo(() => {
    if (tab !== 'solution' || !hasExact || !showExact) return null;
    if (exactFn) {
      const a = Math.max(xFirst, view.xMin);
      const b = Math.min(xLast, view.xMax);
      if (b <= a) return [];
      const N = 360;
      const out: { x: number; y: number | null }[] = [];
      for (let i = 0; i <= N; i++) {
        const x = a + ((b - a) * i) / N;
        const y = exactFn(x);
        out.push({ x, y: isFinite(y) ? y : null });
      }
      return out;
    }
    return points.map((p) => ({ x: p.x, y: p.exact }));
  }, [tab, hasExact, showExact, exactFn, points, view.xMin, view.xMax, xFirst, xLast]);

  const xT = niceTicks(view.xMin, view.xMax, Math.max(3, Math.round(pw / 90)));
  const yT = niceTicks(view.yMin, view.yMax, Math.max(3, Math.round(ph / 56)));

  const mainPath = toPath(mainPts);
  const plotBottom = m.t + ph;
  const areaPath = mainPath
    ? `${mainPath}L${sxOf(mainPts[mainPts.length - 1].x).toFixed(2)} ${plotBottom}L${sxOf(mainPts[0].x).toFixed(2)} ${plotBottom}Z`
    : '';

  const visibleNodes = points.filter((p) => p.x >= view.xMin && p.x <= view.xMax).length;
  const drawNodes = showPoints && visibleNodes <= 160;

  const fitSpanX = fit.xMax - fit.xMin;
  const zoomFactor = fitSpanX / (view.xMax - view.xMin);
  const isZoomed = Math.abs(zoomFactor - 1) > 0.02 || Math.abs((fit.yMax - fit.yMin) / (view.yMax - view.yMin) - 1) > 0.02;

  // Paleta suave según tema
  const C = dark
    ? {
        euler: '#818cf8',
        exact: '#34d399',
        err: '#fb7185',
        grid: 'rgba(148,163,184,0.14)',
        axis: 'rgba(148,163,184,0.45)',
        text: '#94a3b8',
        title: '#cbd5e1',
        plot: 'rgba(15,23,42,0.45)',
        node: '#0b1020',
      }
    : {
        euler: '#6366f1',
        exact: '#10b981',
        err: '#f43f5e',
        grid: 'rgba(100,116,139,0.15)',
        axis: 'rgba(71,85,105,0.5)',
        text: '#64748b',
        title: '#334155',
        plot: 'rgba(248,250,255,0.75)',
        node: '#ffffff',
      };
  const mainColor = tab === 'solution' ? C.euler : C.err;

  const hover = hoverIdx != null ? points[hoverIdx] : null;
  const hoverY = hover ? (tab === 'solution' ? hover.euler : hover.err) : null;
  const hoverX = hover ? sxOf(hover.x) : 0;
  const hoverPy = hoverY != null ? safeY(hoverY) : 0;

  const toolBtn =
    'inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-sm transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-400';
  const toolBtnOn = 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm';
  const chip =
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer';

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-[100] flex flex-col p-2 sm:p-5 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-xl'
          : ''
      }
    >
      <div
        className={`surface p-4 sm:p-6 flex flex-col gap-4 ${fullscreen ? 'flex-1 min-h-0' : ''}`}
      >
        {/* Cabecera */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/25 shrink-0">
                <TrendingUp className="w-[18px] h-[18px]" />
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                {tab === 'solution'
                  ? 'Trayectoria numérica en el plano (x, y)'
                  : 'Evolución del error absoluto |y_exacta − y_Euler|'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                Ecuación: <MathInline math={`y' = ${expressionLatex}`} />
              </span>
              {hasExact && exactExprLatex && (
                <span>
                  · Solución exacta: <MathInline math={exactExprLatex} />
                </span>
              )}
            </p>
          </div>

          {hasExact && (
            <div className="segmented self-start shrink-0" role="tablist" aria-label="Tipo de gráfica">
              <button
                role="tab"
                aria-selected={tab === 'solution'}
                onClick={() => setActiveTab('solution')}
                className={tab === 'solution' ? 'segmented-on' : ''}
              >
                Solución y(x)
              </button>
              <button
                role="tab"
                aria-selected={tab === 'error'}
                onClick={() => setActiveTab('error')}
                className={tab === 'error' ? 'segmented-on segmented-on-warn' : ''}
              >
                Curva de error
              </button>
            </div>
          )}
        </div>

        {/* Leyenda + herramientas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`${chip} border-transparent bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200`}
              style={{ cursor: 'default' }}
            >
              <span className="w-3 h-1.5 rounded-full" style={{ background: mainColor }} />
              {tab === 'solution' ? 'Euler (numérica)' : 'Error absoluto'}
            </span>

            {tab === 'solution' && hasExact && (
              <button
                onClick={() => setShowExact((s) => !s)}
                aria-pressed={showExact}
                className={`${chip} ${
                  showExact
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                }`}
              >
                <span
                  className="w-3 h-0 border-t-2 border-dashed"
                  style={{ borderColor: showExact ? C.exact : 'currentColor' }}
                />
                Exacta
              </button>
            )}

            <button
              onClick={() => setShowPoints((s) => !s)}
              aria-pressed={showPoints}
              className={`${chip} ${
                showPoints
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300'
                  : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              Nodos
            </button>

            <button
              onClick={() => setShowGrid((s) => !s)}
              aria-pressed={showGrid}
              className={`${chip} ${
                showGrid
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Grilla
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
            <button
              onClick={() => setTool('pan')}
              className={`${toolBtn} ${tool === 'pan' ? toolBtnOn : ''}`}
              title="Mover: arrastrá el gráfico"
              aria-label="Herramienta mover"
              aria-pressed={tool === 'pan'}
            >
              <Hand className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('box')}
              className={`${toolBtn} ${tool === 'box' ? toolBtnOn : ''}`}
              title="Zoom por área: dibujá un rectángulo (o Shift + arrastrar)"
              aria-label="Herramienta zoom por área"
              aria-pressed={tool === 'box'}
            >
              <BoxSelect className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-slate-300/70 dark:bg-slate-600/70 mx-0.5" />
            <button onClick={() => zoomBy(0.7)} className={toolBtn} title="Acercar (+)" aria-label="Acercar">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => zoomBy(1 / 0.7)} className={toolBtn} title="Alejar (−)" aria-label="Alejar">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className={`${toolBtn} ${isZoomed ? 'text-indigo-600 dark:text-indigo-300' : ''}`}
              title="Restablecer vista (0 / doble clic)"
              aria-label="Restablecer vista"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-slate-300/70 dark:bg-slate-600/70 mx-0.5" />
            <button
              onClick={() => setFullscreen((f) => !f)}
              className={toolBtn}
              title={fullscreen ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'}
              aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Lienzo */}
        <div
          ref={wrapRef}
          className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/70 bg-gradient-to-b from-white/70 to-slate-50/60 dark:from-slate-900/60 dark:to-slate-950/60"
          style={
            fullscreen
              ? { flex: '1 1 0%', minHeight: 0, height: 'auto', resize: 'none' }
              : { flex: 'none', height: chartHeight, minHeight: 260, maxHeight: '85vh', resize: 'vertical' }
          }
        >
          <svg
            ref={svgRef}
            width={W}
            height={H}
            tabIndex={0}
            role="img"
            aria-label="Gráfica interactiva de la solución por el método de Euler. Use flechas para mover, más y menos para el zoom, 0 para restablecer."
            className="block select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 rounded-2xl"
            style={{
              touchAction: fullscreen ? 'none' : 'pan-y',
              cursor: tool === 'box' ? 'crosshair' : dragging ? 'grabbing' : 'grab',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onPointerLeave={(e) => e.pointerType === 'mouse' && !dragging && setHoverIdx(null)}
            onDoubleClick={resetView}
            onKeyDown={onKeyDown}
          >
            <defs>
              <clipPath id={`clip-${uid}`}>
                <rect x={m.l} y={m.t} width={pw} height={ph} />
              </clipPath>
              <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mainColor} stopOpacity={dark ? 0.28 : 0.22} />
                <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <rect x={m.l} y={m.t} width={pw} height={ph} rx={10} fill={C.plot} />

            {/* Grilla */}
            {showGrid && (
              <g>
                {xT.ticks.map((v) => (
                  <line key={`gx${v}`} x1={sxOf(v)} x2={sxOf(v)} y1={m.t} y2={plotBottom} stroke={C.grid} strokeDasharray="3 5" />
                ))}
                {yT.ticks.map((v) => (
                  <line key={`gy${v}`} x1={m.l} x2={m.l + pw} y1={syOf(v)} y2={syOf(v)} stroke={C.grid} strokeDasharray="3 5" />
                ))}
              </g>
            )}

            {/* Ejes en el origen */}
            {view.yMin < 0 && view.yMax > 0 && (
              <line x1={m.l} x2={m.l + pw} y1={syOf(0)} y2={syOf(0)} stroke={C.axis} strokeWidth={1.2} />
            )}
            {view.xMin < 0 && view.xMax > 0 && (
              <line x1={sxOf(0)} x2={sxOf(0)} y1={m.t} y2={plotBottom} stroke={C.axis} strokeWidth={1.2} />
            )}

            <g clipPath={`url(#clip-${uid})`}>
              {areaPath && <path d={areaPath} fill={`url(#area-${uid})`} />}

              {exactPts && exactPts.length > 0 && (
                <path
                  d={toPath(exactPts)}
                  fill="none"
                  stroke={C.exact}
                  strokeWidth={2.2}
                  strokeDasharray="7 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              <path
                d={mainPath}
                fill="none"
                stroke={mainColor}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {drawNodes &&
                mainPts.map((p, i) =>
                  p.y == null ? null : (
                    <circle
                      key={i}
                      cx={sxOf(p.x)}
                      cy={safeY(p.y)}
                      r={compact ? 3.2 : 4}
                      fill={mainColor}
                      stroke={C.node}
                      strokeWidth={1.6}
                    />
                  )
                )}

              {hover && hoverY != null && (
                <g pointerEvents="none">
                  <line x1={hoverX} x2={hoverX} y1={m.t} y2={plotBottom} stroke={mainColor} strokeOpacity={0.45} strokeDasharray="4 4" />
                  {tab === 'solution' && showExact && hover.exact != null && (
                    <circle cx={hoverX} cy={safeY(hover.exact)} r={5} fill={C.exact} stroke={C.node} strokeWidth={2} />
                  )}
                  <circle cx={hoverX} cy={hoverPy} r={11} fill={mainColor} fillOpacity={0.18} />
                  <circle cx={hoverX} cy={hoverPy} r={6} fill={mainColor} stroke={C.node} strokeWidth={2.2} />
                </g>
              )}
            </g>

            {/* Etiquetas de ejes */}
            <g fontSize={compact ? 10 : 11} fill={C.text} fontFamily="var(--font-mono)">
              {xT.ticks.map((v) => (
                <text key={`tx${v}`} x={sxOf(v)} y={plotBottom + 18} textAnchor="middle">
                  {formatTick(v, xT.step)}
                </text>
              ))}
              {yT.ticks.map((v) => (
                <text key={`ty${v}`} x={m.l - 8} y={syOf(v) + 3.5} textAnchor="end">
                  {formatTick(v, yT.step)}
                </text>
              ))}
            </g>
            <text x={m.l + pw / 2} y={H - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.title}>
              x
            </text>
            <text
              transform={`translate(${compact ? 11 : 14} ${m.t + ph / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill={C.title}
            >
              {tab === 'solution' ? 'y' : 'Error absoluto'}
            </text>

            {/* Zoom por área */}
            {box && (
              <rect
                x={Math.min(box.x0, box.x1)}
                y={Math.min(box.y0, box.y1)}
                width={Math.abs(box.x1 - box.x0)}
                height={Math.abs(box.y1 - box.y0)}
                fill={C.euler}
                fillOpacity={0.12}
                stroke={C.euler}
                strokeDasharray="5 4"
                rx={4}
                pointerEvents="none"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hover && hoverY != null && (
            <div
              className="absolute pointer-events-none z-10 min-w-[170px] rounded-xl border border-slate-200/80 dark:border-slate-600/70 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl shadow-slate-900/10 p-3 text-xs space-y-1 text-slate-800 dark:text-slate-100"
              style={{
                left: hoverX,
                top: clamp(hoverPy, 40, H - 40),
                transform: hoverX > W * 0.58 ? 'translate(calc(-100% - 16px), -50%)' : 'translate(16px, -50%)',
              }}
            >
              <p className="font-bold text-indigo-600 dark:text-indigo-300 border-b border-slate-200 dark:border-slate-700 pb-1">
                Iteración #{hover.n} · x = {formatNum(hover.x, 4)}
              </p>
              {tab === 'solution' ? (
                <>
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">Euler y</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">{formatNum(hover.euler, 6)}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">f(x,y)</span>
                    <span className="font-mono text-amber-600 dark:text-amber-300">{formatNum(hover.slope, 6)}</span>
                  </p>
                  {hover.exact != null && (
                    <>
                      <p className="flex justify-between gap-4">
                        <span className="text-slate-500 dark:text-slate-400">Exacta</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300">{formatNum(hover.exact, 6)}</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-slate-500 dark:text-slate-400">Error</span>
                        <span className="font-mono text-rose-600 dark:text-rose-300">{hover.err != null ? formatNum(hover.err, 6) : '—'}</span>
                      </p>
                    </>
                  )}
                </>
              ) : (
                <p className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Error absoluto</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-300">{formatNum(hoverY, 6)}</span>
                </p>
              )}
            </div>
          )}

          {/* Indicador de zoom */}
          <div className="absolute left-3 top-3 flex items-center gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/80 dark:border-slate-700/70 text-slate-600 dark:text-slate-300">
              {Math.round(zoomFactor * 100)}%
            </span>
          </div>

          {/* Tamaño rápido (no en pantalla completa) */}
          {!fullscreen && (
            <div className="absolute right-3 top-3 hidden sm:flex items-center gap-0.5 p-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/80 dark:border-slate-700/70">
              {[
                { label: 'S', h: 300, title: 'Gráfico compacto' },
                { label: 'M', h: 420, title: 'Gráfico mediano' },
                { label: 'L', h: 600, title: 'Gráfico grande' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPresetHeight(p.h)}
                  title={p.title}
                  aria-label={p.title}
                  className={`w-7 h-7 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                    chartHeight === p.h
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-200">Navegación:</strong> arrastrá para mover ·{' '}
            <kbd className="kbd">Ctrl</kbd> + rueda o pellizco para el zoom · <kbd className="kbd">Shift</kbd> + arrastrar para
            ampliar un área · doble clic para restablecer · podés estirar el borde inferior para cambiar la altura.
          </p>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Interpretación geométrica:</strong> los segmentos poligonales entre nodos ilustran el avance a lo largo de la
              recta tangente. La discrepancia entre la poligonal y la trayectoria analítica cuantifica el error numérico acumulado{' '}
              <MathInline math="\mathcal{O}(h)" />.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Graph: React.FC<GraphProps> = (props) => {
  if (!props.steps || props.steps.length === 0) {
    return (
      <div className="surface p-10 text-center text-slate-500 dark:text-slate-400">
        <TrendingUp className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p className="font-semibold">No hay datos para graficar.</p>
        <p className="text-xs text-slate-400 mt-1">
          Ingrese los parámetros en la calculadora y presione &quot;Calcular Solución&quot;.
        </p>
      </div>
    );
  }
  return <GraphCanvas {...props} />;
};
