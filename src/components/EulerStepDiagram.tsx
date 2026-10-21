import React, { useState, useEffect } from 'react';
import { MathInline } from './MathView';
import { Triangle, Info, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EulerStepDiagramProps {
  className?: string;
  showExactCurve?: boolean;
}

/**
 * Componente didáctico interactivo que ilustra geométricamente un paso del Método de Euler
 * mediante el triángulo rectángulo formado entre (x_n, y_n) y (x_{n+1}, y_{n+1}):
 * - Base: paso h = Delta x
 * - Altura (cateto opuesto): Delta y = h * f(x_n, y_n)
 * - Hipotenusa: segmento de recta tangente con pendiente m = f(x_n, y_n)
 * - Brecha vertical del Error Local de Truncamiento O(h^2) frente a la Solución Exacta y(x)
 */
export const EulerStepDiagram: React.FC<EulerStepDiagramProps> = ({
  className = '',
  showExactCurve = true,
}) => {
  const { isDarkMode, isDark } = useTheme();
  const dark = isDarkMode !== undefined ? isDarkMode : isDark;

  // Estado interactivo para el tamaño del paso h (escala relativa: 0.20 a 1.00)
  const [h, setH] = useState<number>(1.0);

  // Detección de resolución móvil (< 768px) para adaptar viewBox, fuentes y posiciones en el SVG
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Coordenadas base en el lienzo SVG
  // Punto A fijo: (x_n, y_n)
  const Ax = 175;
  const Ay = 260;

  // Dimensiones máximas de referencia cuando h = 1.0
  const maxBasePx = isMobile ? 285 : 310;
  const maxHeightPx = isMobile ? 130 : 140;
  const maxErrorPx = isMobile ? 48 : 52;

  // Escala dinámica vinculada al estado h:
  // - La base crece linealmente con h: Delta x = h
  // - La altura crece linealmente con h: Delta y = h * f(x_n, y_n)
  // - El Error Local crece cuadráticamente con h: e_{n+1} = O(h^2)
  const basePx = maxBasePx * h;
  const heightPx = maxHeightPx * h;
  const errorPx = maxErrorPx * h * h;

  // Punto C: (x_{n+1}, y_n) - Vértice del ángulo recto
  const Cx = Ax + basePx;
  const Cy = Ay;

  // Punto B: (x_{n+1}, y_{n+1}) - Estimación numérica de Euler sobre la tangente
  const Bx = Cx;
  const By = Ay - heightPx;

  // Punto E: (x_{n+1}, y(x_{n+1})) - Valor exacto sobre la curva analítica en x_{n+1}
  const Ey = By - errorPx;

  // Función analítica exacta en coordenadas SVG (parábola cuadrática exacta tangente en A)
  const slopePx = maxHeightPx / maxBasePx;
  const curvaturePx = maxErrorPx / (maxBasePx * maxBasePx);
  const exactCurveY = (x: number) => {
    const dx = x - Ax;
    return Ay - slopePx * dx - curvaturePx * dx * dx;
  };
  const exactCurveSlope = (x: number) => {
    const dx = x - Ax;
    return -slopePx - 2 * curvaturePx * dx;
  };

  // Construcción exacta de la curva de Bézier cuadrática para y(x) en [curveStartX, curveEndX]
  const curveStartX = 110;
  const curveEndX = Ax + maxBasePx + 30;
  const curveStartY = exactCurveY(curveStartX);
  const curveEndY = exactCurveY(curveEndX);
  const curveCtrlX = (curveStartX + curveEndX) / 2;
  const curveCtrlY =
    curveStartY + exactCurveSlope(curveStartX) * (curveCtrlX - curveStartX);

  // Punto de anclaje en la curva verde para la etiqueta "Solución Exacta y(x)"
  const exactLabelAnchorX = Ax + maxBasePx * 0.92;
  const exactLabelAnchorY = exactCurveY(exactLabelAnchorX);

  // Extensión de la recta tangente para ilustrar la proyección lineal
  const tangentStartX = 110;
  const tangentStartY = Ay + slopePx * (Ax - tangentStartX);
  const tangentEndX = Ax + maxBasePx + 35;
  const tangentEndY = Ay - slopePx * (tangentEndX - Ax);

  // Posiciones dinámicas anti-colisión para las etiquetas
  const midHypX = (Ax + Bx) / 2;
  const midHypY = (Ay + By) / 2;
  const midCurveY = exactCurveY(midHypX);

  // Etiqueta de la hipotenusa: ubicada por encima de la curva sin superponerse con líneas
  const hypBadgeWidth = isMobile ? 162 : 194;
  const hypBadgeHeight = isMobile ? 22 : 25;
  const hypBadgeCenterX = Math.max(185, Math.min(midHypX - 35, 315));
  const hypBadgeCenterY = Math.min(midCurveY - (isMobile ? 38 : 44), 174);

  // Etiquetas derechas escalonadas verticalmente para evitar colisiones cuando h es pequeño
  const errBadgeHeight = isMobile ? 20 : 22;
  const errBadgeWidth = isMobile ? 108 : 124;
  const errBadgeCenterY = Math.min((By + Ey) / 2, By - (isMobile ? 14 : 16));

  const nodeBBadgeWidth = isMobile ? 92 : 104;
  const nodeBBadgeHeight = isMobile ? 20 : 22;
  const nodeBBadgeCenterY = By + (isMobile ? 14 : 15);

  const altBadgeWidth = isMobile ? 134 : 156;
  const altBadgeHeight = isMobile ? 22 : 26;
  const altBadgeCenterY = Math.max(
    (Cy + By) / 2 + 4,
    nodeBBadgeCenterY + (isMobile ? 26 : 30)
  );
  const altBadgeX = Math.min(Cx + (isMobile ? 20 : 26), 732 - altBadgeWidth);

  // Etiquetas sobre el eje Y con separación mínima garantizada
  const yAxisEulerLabelY = Math.min(By, Ay - 15);
  const yAxisExactLabelY = Math.min(Ey, yAxisEulerLabelY - 15);

  // Etiqueta x_{n+1} sobre el eje X con desplazamiento horizontal cuando h es pequeño
  const xAxisNextLabelX = Math.max(Cx, Ax + (isMobile ? 78 : 88));

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden ${className}`}
    >
      {/* Cabecera del componente didáctico */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-white flex items-center justify-center shadow-sm">
            <Triangle className="w-5 h-5 -rotate-90" />
          </span>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
              Interpretación Geométrica: El Triángulo del Paso <MathInline math="h" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualización interactiva del avance diferencial y la reducción cuadrática del Error Local
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <MathInline math="\tan(\alpha) = f(x_n, y_n)" />
          </span>
        </div>
      </div>

      {/* Contenedor del Lienzo SVG Didáctico */}
      <div className="p-2.5 sm:p-6 bg-gradient-to-b from-slate-50/40 to-white dark:from-slate-950/50 dark:to-slate-900/40">
        <div className="w-full max-w-3xl mx-auto">
          <svg
            viewBox={isMobile ? '8 5 724 415' : '0 0 740 430'}
            className="w-full h-auto select-none font-sans overflow-visible"
            role="img"
            aria-label="Diagrama interactivo del paso h del método de Euler con triángulo rectángulo y curva de solución exacta"
          >
            <defs>
              {/* Marcadores de flecha para ejes */}
              <marker
                id="axis-arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={dark ? '#94a3b8' : '#64748b'} />
              </marker>

              {/* Relleno suave con gradiente para el triángulo rectángulo */}
              <linearGradient id="triangle-fill" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={dark ? 0.22 : 0.14} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={dark ? 0.28 : 0.18} />
              </linearGradient>

              {/* Gradiente para la recta tangente */}
              <linearGradient id="tangent-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Ejes cartesianos */}
            <g stroke={dark ? '#475569' : '#cbd5e1'} strokeWidth="1.5">
              {/* Eje X */}
              <line x1="50" y1="360" x2="695" y2="360" markerEnd="url(#axis-arrow)" />
              {/* Eje Y */}
              <line x1="80" y1="380" x2="80" y2="35" markerEnd="url(#axis-arrow)" />
            </g>

            {/* Etiquetas de los ejes */}
            <text
              x="702"
              y="364"
              fill={dark ? '#cbd5e1' : '#334155'}
              fontSize={isMobile ? '12' : '14'}
              fontWeight="bold"
              dominantBaseline="middle"
            >
              x
            </text>
            <text
              x="80"
              y="22"
              fill={dark ? '#cbd5e1' : '#334155'}
              fontSize={isMobile ? '12' : '14'}
              fontWeight="bold"
              textAnchor="middle"
            >
              y
            </text>

            {/* Líneas guía punteadas proyectadas a los ejes */}
            <g
              stroke={dark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.35)'}
              strokeDasharray="4 4"
              strokeWidth="1.2"
            >
              {/* Proyección x_n */}
              <line x1={Ax} y1={Ay} x2={Ax} y2="360" />
              {/* Proyección x_{n+1} */}
              <line x1={Cx} y1={Cy} x2={Cx} y2="360" />
              {/* Proyección y_n */}
              <line x1="80" y1={Ay} x2={Ax} y2={Ay} />
              {/* Proyección y_{n+1} (Euler) */}
              <line x1="80" y1={By} x2={Bx} y2={By} />
              {/* Proyección y(x_{n+1}) (Exacta) */}
              {showExactCurve && <line x1="80" y1={Ey} x2={Bx} y2={Ey} />}
            </g>

            {/* Etiquetas sobre los ejes */}
            <g
              fill={dark ? '#94a3b8' : '#475569'}
              fontSize={isMobile ? '10.5' : '12'}
              fontWeight="600"
              textAnchor="middle"
            >
              <text x={Ax} y="380">
                xₙ
              </text>
              <text x={xAxisNextLabelX} y="380">
                xₙ₊₁ = xₙ + h
              </text>
            </g>
            <g
              fill={dark ? '#94a3b8' : '#475569'}
              fontSize={isMobile ? '10' : '12'}
              fontWeight="600"
              textAnchor="end"
              dominantBaseline="middle"
            >
              <text x="72" y={Ay}>
                yₙ
              </text>
              <text x="72" y={yAxisEulerLabelY} fill={dark ? '#818cf8' : '#4338ca'}>
                yₙ₊₁
              </text>
              {showExactCurve && (
                <text x="72" y={yAxisExactLabelY} fill={dark ? '#34d399' : '#047857'}>
                  y(xₙ₊₁)
                </text>
              )}
            </g>

            {/* Triángulo Rectángulo (Área sombreada dinámica) */}
            <polygon
              points={`${Ax},${Ay} ${Cx},${Cy} ${Bx},${By}`}
              fill="url(#triangle-fill)"
              stroke="none"
            />

            {/* Indicador de Ángulo Recto en (x_{n+1}, y_n) */}
            {basePx >= 28 && heightPx >= 22 && (
              <g stroke={dark ? '#94a3b8' : '#64748b'} strokeWidth="1.5" fill="none">
                <path d={`M ${Cx - 14} ${Cy} L ${Cx - 14} ${Cy - 14} L ${Cx} ${Cy - 14}`} />
                <circle cx={Cx - 7} cy={Cy - 7} r="1.5" fill={dark ? '#94a3b8' : '#64748b'} />
              </g>
            )}

            {/* Arco del ángulo alfa (pendiente en A) */}
            {basePx >= 55 && (
              <g>
                <path
                  d={`M ${Ax + 38} ${Ay} A 38 38 0 0 0 ${Ax + 35} ${Ay - 15}`}
                  fill="none"
                  stroke={dark ? '#fbbf24' : '#b45309'}
                  strokeWidth="1.8"
                />
                <text
                  x={Ax + 46}
                  y={Ay - 8}
                  fill={dark ? '#fbbf24' : '#9a3412'}
                  className="fill-orange-800 dark:fill-amber-400 font-bold"
                  fontSize={isMobile ? '10.5' : '12'}
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  α
                </text>
              </g>
            )}

            {/* 1. Base Horizontal: Paso h */}
            <line
              x1={Ax}
              y1={Ay}
              x2={Cx}
              y2={Cy}
              stroke={dark ? '#38bdf8' : '#0284c7'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Cota inferior del paso h */}
            <g>
              <path
                d={`M ${Ax} ${Ay + 10} L ${Ax} ${Ay + 18} M ${Ax} ${Ay + 14} L ${Cx} ${Cy + 14} M ${Cx} ${Cy + 10} L ${Cx} ${Cy + 18}`}
                stroke={dark ? '#38bdf8' : '#0284c7'}
                strokeWidth="1.5"
              />
              <rect
                x={(Ax + Cx) / 2 - (isMobile ? 42 : 48)}
                y={Ay + 20}
                width={isMobile ? 84 : 96}
                height={isMobile ? 20 : 22}
                rx="6"
                fill={dark ? '#0f172a' : '#ffffff'}
                stroke={dark ? '#38bdf8' : '#0284c7'}
                strokeWidth="1.2"
              />
              <text
                x={(Ax + Cx) / 2}
                y={Ay + (isMobile ? 33 : 35)}
                fill={dark ? '#38bdf8' : '#0369a1'}
                className="fill-sky-700 dark:fill-sky-400 font-bold"
                fontSize={isMobile ? '10' : '11.5'}
                fontWeight="bold"
                textAnchor="middle"
              >
                Base: h (Δx)
              </text>
            </g>

            {/* 2. Altura Vertical (Cateto Opuesto): h * f(x_n, y_n) */}
            <line
              x1={Cx}
              y1={Cy}
              x2={Bx}
              y2={By}
              stroke={dark ? '#f59e0b' : '#c2410c'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Cota lateral y cartel de la altura con alto contraste WCAG AA/AAA */}
            <g>
              <path
                d={`M ${Cx + 10} ${Cy} L ${Cx + 18} ${Cy} M ${Cx + 14} ${Cy} L ${Cx + 14} ${By} M ${Cx + 10} ${By} L ${Cx + 18} ${By}`}
                stroke={dark ? '#f59e0b' : '#c2410c'}
                strokeWidth="1.5"
              />
              <line
                x1={Cx + 14}
                y1={(Cy + By) / 2}
                x2={altBadgeX}
                y2={altBadgeCenterY}
                stroke={dark ? '#f59e0b' : '#c2410c'}
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <rect
                x={altBadgeX}
                y={altBadgeCenterY - altBadgeHeight / 2}
                width={altBadgeWidth}
                height={altBadgeHeight}
                rx="6"
                fill={dark ? '#0f172a' : '#ffffff'}
                stroke={dark ? '#f59e0b' : '#c2410c'}
                strokeWidth="1.3"
              />
              <text
                x={altBadgeX + altBadgeWidth / 2}
                y={altBadgeCenterY + (isMobile ? 3.5 : 4)}
                fill={dark ? '#fcd34d' : '#9a3412'}
                className="fill-orange-800 dark:fill-amber-300 text-orange-800 dark:text-amber-300 font-bold"
                fontSize={isMobile ? '10' : '11.5'}
                fontWeight="bold"
                textAnchor="middle"
              >
                Altura: h · f(xₙ, yₙ)
              </text>
            </g>

            {/* 3. Recta Tangente Extendida (Hipotenusa) */}
            {/* Línea extendida tenue */}
            <line
              x1={tangentStartX}
              y1={tangentStartY}
              x2={tangentEndX}
              y2={tangentEndY}
              stroke={dark ? '#fbbf24' : '#c2410c'}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              strokeOpacity="0.55"
            />
            {/* Segmento de hipotenusa destacado */}
            <line
              x1={Ax}
              y1={Ay}
              x2={Bx}
              y2={By}
              stroke="url(#tangent-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
            {/* Etiqueta flotante de la hipotenusa con línea indicadora limpia */}
            <g>
              <line
                x1={hypBadgeCenterX + 15}
                y1={hypBadgeCenterY + hypBadgeHeight / 2}
                x2={midHypX}
                y2={midHypY}
                stroke={dark ? '#818cf8' : '#4f46e5'}
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle cx={midHypX} cy={midHypY} r="3" fill={dark ? '#818cf8' : '#4f46e5'} />
              <rect
                x={hypBadgeCenterX - hypBadgeWidth / 2}
                y={hypBadgeCenterY - hypBadgeHeight / 2}
                width={hypBadgeWidth}
                height={hypBadgeHeight}
                rx="6"
                fill={dark ? '#0f172a' : '#ffffff'}
                stroke={dark ? '#818cf8' : '#4f46e5'}
                strokeWidth="1.2"
              />
              <text
                x={hypBadgeCenterX}
                y={hypBadgeCenterY + (isMobile ? 3.5 : 4)}
                fill={dark ? '#a5b4fc' : '#4338ca'}
                className="fill-indigo-700 dark:fill-indigo-300 font-bold"
                fontSize={isMobile ? '9.5' : '11'}
                fontWeight="bold"
                textAnchor="middle"
              >
                Hipotenusa (Recta Tangente)
              </text>
            </g>

            {/* Curva Analítica Verdadera y(x) para evidenciar el Error Local */}
            {showExactCurve && (
              <g>
                <path
                  d={`M ${curveStartX} ${curveStartY} Q ${curveCtrlX} ${curveCtrlY} ${curveEndX} ${curveEndY}`}
                  fill="none"
                  stroke={dark ? '#34d399' : '#059669'}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                {/* Etiqueta junto a la curva verde: "Solución Exacta y(x)" */}
                <g>
                  <line
                    x1={isMobile ? 375 : 395}
                    y1={isMobile ? 30 : 32}
                    x2={exactLabelAnchorX}
                    y2={exactLabelAnchorY}
                    stroke={dark ? '#34d399' : '#059669'}
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={exactLabelAnchorX}
                    cy={exactLabelAnchorY}
                    r="3.2"
                    fill={dark ? '#34d399' : '#059669'}
                  />
                  <rect
                    x={isMobile ? 235 : 245}
                    y={isMobile ? 16 : 18}
                    width={isMobile ? 140 : 154}
                    height={isMobile ? 22 : 24}
                    rx="6"
                    fill={dark ? '#064e3b' : '#ecfdf5'}
                    stroke={dark ? '#34d399' : '#059669'}
                    strokeWidth="1.2"
                  />
                  <text
                    x={isMobile ? 305 : 322}
                    y={isMobile ? 30.5 : 34}
                    fill={dark ? '#6ee7b7' : '#065f46'}
                    className="fill-emerald-800 dark:fill-emerald-300 font-bold"
                    fontSize={isMobile ? '10' : '11.5'}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Solución Exacta y(x)
                  </text>
                </g>

                {/* Segmento vertical del Error Local de Truncamiento */}
                <line
                  x1={Bx}
                  y1={By}
                  x2={Bx}
                  y2={Ey}
                  stroke={dark ? '#fb7185' : '#e11d48'}
                  strokeWidth="2.4"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={Bx}
                  cy={Ey}
                  r="4.5"
                  fill={dark ? '#34d399' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Cartel de Error Local con indicador adaptable */}
                <line
                  x1={Bx + 3}
                  y1={(By + Ey) / 2}
                  x2={Bx + (isMobile ? 14 : 18)}
                  y2={errBadgeCenterY}
                  stroke={dark ? '#f43f5e' : '#e11d48'}
                  strokeWidth="1.2"
                />
                <rect
                  x={Bx + (isMobile ? 14 : 18)}
                  y={errBadgeCenterY - errBadgeHeight / 2}
                  width={errBadgeWidth}
                  height={errBadgeHeight}
                  rx="5"
                  fill={dark ? '#881337' : '#ffe4e6'}
                  stroke={dark ? '#f43f5e' : '#e11d48'}
                  strokeWidth="1"
                />
                <text
                  x={Bx + (isMobile ? 14 : 18) + errBadgeWidth / 2}
                  y={errBadgeCenterY + (isMobile ? 3.5 : 4)}
                  fill={dark ? '#fecdd3' : '#9f1239'}
                  className="fill-rose-800 dark:fill-rose-200 font-bold"
                  fontSize={isMobile ? '9.5' : '10.5'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Error Local O(h²)
                </text>
              </g>
            )}

            {/* Nodos / Vértices Principales */}
            {/* Punto de inicio: (x_n, y_n) */}
            <g>
              <circle cx={Ax} cy={Ay} r="9" fill="#6366f1" fillOpacity="0.25" />
              <circle cx={Ax} cy={Ay} r="5.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
              <rect
                x={Ax - (isMobile ? 78 : 84)}
                y={Ay - 40}
                width={isMobile ? 74 : 82}
                height={isMobile ? 20 : 22}
                rx="6"
                fill={dark ? '#1e1b4b' : '#eef2ff'}
                stroke="#6366f1"
                strokeWidth="1"
              />
              <text
                x={Ax - (isMobile ? 41 : 43)}
                y={Ay - (isMobile ? 26.5 : 25.5)}
                fill={dark ? '#c7d2fe' : '#3730a3'}
                fontSize={isMobile ? '10' : '11.5'}
                fontWeight="bold"
                textAnchor="middle"
              >
                (xₙ, yₙ)
              </text>
            </g>

            {/* Nuevo punto de Euler: (x_{n+1}, y_{n+1}) */}
            <g>
              <circle cx={Bx} cy={By} r="10" fill="#f59e0b" fillOpacity="0.25" />
              <circle cx={Bx} cy={By} r="5.5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
              <line
                x1={Bx + 5}
                y1={By + 2}
                x2={Bx + (isMobile ? 14 : 18)}
                y2={nodeBBadgeCenterY}
                stroke={dark ? '#f59e0b' : '#b45309'}
                strokeWidth="1.2"
              />
              <rect
                x={Bx + (isMobile ? 14 : 18)}
                y={nodeBBadgeCenterY - nodeBBadgeHeight / 2}
                width={nodeBBadgeWidth}
                height={nodeBBadgeHeight}
                rx="6"
                fill={dark ? '#451a03' : '#fef3c7'}
                stroke={dark ? '#f59e0b' : '#d97706'}
                strokeWidth="1"
              />
              <text
                x={Bx + (isMobile ? 14 : 18) + nodeBBadgeWidth / 2}
                y={nodeBBadgeCenterY + (isMobile ? 3.5 : 4)}
                fill={dark ? '#fde68a' : '#92400e'}
                fontSize={isMobile ? '9.5' : '11'}
                fontWeight="bold"
                textAnchor="middle"
              >
                (xₙ₊₁, yₙ₊₁)
              </text>
            </g>
          </svg>
        </div>

        {/* Nota aclaratoria teórica debajo del contenedor del gráfico */}
        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 italic px-2">
          *Para ilustrar el Error Local, se asume que el punto <MathInline math="(x_n, y_n)" /> no arrastra error previo*
        </p>

        {/* Control interactivo (Slider) para ajustar dinámicamente el paso h */}
        <div className="mt-4 max-w-2xl mx-auto p-3.5 sm:p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <label
              htmlFor="euler-step-h-slider"
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                Tamaño del paso <MathInline math="h" /> (<MathInline math="\Delta x" />):
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-extrabold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                h = {h.toFixed(2)}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100/90 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Error Local <MathInline math="\mathcal{O}(h^2)" />: {(h * h * 100).toFixed(0)}%
              </span>
              {h !== 1.0 && (
                <button
                  type="button"
                  onClick={() => setH(1.0)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Restablecer paso h = 1.00"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reiniciar
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              0.20
            </span>
            <input
              id="euler-step-h-slider"
              type="range"
              min="0.20"
              max="1.00"
              step="0.05"
              value={h}
              onChange={(e) => setH(parseFloat(e.target.value))}
              aria-label="Ajustar tamaño del paso h"
              className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              1.00
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 text-center sm:text-left">
            Deslizá el control hacia la izquierda para reducir <MathInline math="h" />: observá cómo al reducir la base a la mitad (<MathInline math="h = 0.50" />), la brecha del <strong>Error Local</strong> se reduce a la cuarta parte (<MathInline math="25\%" />).
          </p>
        </div>
      </div>

      {/* Tarjetas didácticas explicativas de los 3 lados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
        {/* Cateto Adyacente: Base */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-sky-700 dark:text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>1. Cateto Base (<MathInline math="h" />)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Es el incremento horizontal discreto de la variable independiente:
          </p>
          <div className="pt-0.5 text-slate-900 dark:text-slate-100 font-semibold">
            <MathInline math="\Delta x = x_{n+1} - x_n = h" />
          </div>
        </div>

        {/* Cateto Opuesto: Altura */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-orange-800 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 dark:bg-amber-500" />
            <span>2. Cateto Altura (<MathInline math="\Delta y" />)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Multiplica la pendiente de la recta tangente por la longitud de la base:
          </p>
          <div className="pt-0.5 text-slate-900 dark:text-slate-100 font-semibold">
            <MathInline math="\Delta y = h \cdot f(x_n, y_n)" />
          </div>
        </div>

        {/* Hipotenusa: Recta Tangente */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>3. Hipotenusa (Tangente)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Une el punto conocido con el nuevo punto aproximado sobre la tangente:
          </p>
          <div className="pt-0.5 text-slate-900 dark:text-slate-100 font-semibold">
            <MathInline math="y_{n+1} = y_n + \Delta y" />
          </div>
        </div>
      </div>

      {/* Nota didáctica al pie */}
      <div className="px-4 py-3 bg-indigo-50/70 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <span>
          <strong>Fundamento trigonométrico:</strong> Dado que <MathInline math="\tan(\alpha) = \frac{\text{Cateto Opuesto}}{\text{Cateto Adyacente}} = f(x_n, y_n)" />, despejando la altura se obtiene exactamente <MathInline math="\Delta y = h \cdot f(x_n, y_n)" />, que sumado a <MathInline math="y_n" /> produce la fórmula iterativa de Euler.
        </span>
      </div>
    </div>
  );
};
