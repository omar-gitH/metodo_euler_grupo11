import React, { useState, useEffect, useId } from 'react';
import { computeEuler, EulerResult, exprToLatex, formatNum } from '../utils/euler';
import { GUIDE_EXERCISES, GuideExercise } from '../data/exercises';
import { MathInline } from './MathView';
import { Graph } from './Graph';
import { MobileMathKeyboard } from './MobileMathKeyboard';
import {
  Calculator as CalcIcon,
  Play,
  Download,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  FileSpreadsheet,
  Code2,
  SlidersHorizontal,
} from 'lucide-react';

interface CalculatorProps {
  initialValues?: {
    fn: string;
    x0: number;
    y0: number;
    h: number;
    xf: number;
    exact?: string;
  };
}

export const Calculator: React.FC<CalculatorProps> = ({ initialValues }) => {
  const [fnInput, setFnInput] = useState<string>(initialValues?.fn || '-y + x + 1');
  const [x0Input, setX0Input] = useState<string>(String(initialValues?.x0 ?? 0));
  const [y0Input, setY0Input] = useState<string>(String(initialValues?.y0 ?? 1));
  const [hInput, setHInput] = useState<string>(String(initialValues?.h ?? 0.1));
  const [xfInput, setXfInput] = useState<string>(String(initialValues?.xf ?? 1.0));
  const [exactInput, setExactInput] = useState<string>(initialValues?.exact || 'x + exp(-x)');
  const [showAdvancedExact, setShowAdvancedExact] = useState<boolean>(true);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [activeMobileKeypadField, setActiveMobileKeypadField] = useState<'fn' | 'exact' | null>(null);

  const [result, setResult] = useState<EulerResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string>('utn-2a');
  const [showAllStepsBreakdown, setShowAllStepsBreakdown] = useState<boolean>(false);
  const [visibleIterationsLimit, setVisibleIterationsLimit] = useState<number | null>(null);

  // Redimensionar el canvas/SVG del gráfico al abrir o colapsar el panel lateral
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 320);
    return () => clearTimeout(timer);
  }, [isPanelOpen]);

  const fnInputId = useId();
  const x0InputId = useId();
  const y0InputId = useId();
  const hInputId = useId();
  const xfInputId = useId();
  const exactInputId = useId();

  const handleCalculate = () => {
    const x0 = parseFloat(x0Input);
    const y0 = parseFloat(y0Input);
    const h = parseFloat(hInput);
    const xf = parseFloat(xfInput);

    if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xf)) {
      setResult({
        steps: [],
        success: false,
        error: 'Todos los parámetros numéricos (x₀, y₀, h, x_f) deben ser valores numéricos válidos.',
        expressionSanitized: fnInput,
        expressionLatex: exprToLatex(fnInput),
        totalIterations: 0,
        h: isNaN(h) ? 0.1 : h,
        x0: isNaN(x0) ? 0 : x0,
        y0: isNaN(y0) ? 0 : y0,
        xf: isNaN(xf) ? 1 : xf,
      });
      return;
    }

    const res = computeEuler({
      expr: fnInput,
      x0,
      y0,
      h,
      xf,
      exactExpr: showAdvancedExact ? exactInput : '',
    });

    setResult(res);
    setVisibleIterationsLimit(null);
  };

  useEffect(() => {
    if (initialValues) {
      setFnInput(initialValues.fn);
      setX0Input(String(initialValues.x0));
      setY0Input(String(initialValues.y0));
      setHInput(String(initialValues.h));
      setXfInput(String(initialValues.xf));
      if (initialValues.exact) {
        setExactInput(initialValues.exact);
        setShowAdvancedExact(true);
      }
    }
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleLoadExercise = (ex: GuideExercise) => {
    setActiveExerciseId(ex.id);
    setFnInput(ex.fnString);
    setX0Input(String(ex.x0));
    setY0Input(String(ex.y0));
    setHInput(String(ex.h));
    setXfInput(String(ex.xf));
    if (ex.exactFormula) {
      setExactInput(ex.exactFormula);
      setShowAdvancedExact(true);
    } else {
      setExactInput('');
    }

    const res = computeEuler({
      expr: ex.fnString,
      x0: ex.x0,
      y0: ex.y0,
      h: ex.h,
      xf: ex.xf,
      exactExpr: ex.exactFormula || '',
    });
    setResult(res);
  };

  const handleHalveStep = () => {
    const curH = parseFloat(hInput);
    if (!isNaN(curH) && curH > 0) {
      const newH = Number((curH / 2).toFixed(6));
      setHInput(String(newH));
      const res = computeEuler({
        expr: fnInput,
        x0: parseFloat(x0Input),
        y0: parseFloat(y0Input),
        h: newH,
        xf: parseFloat(xfInput),
        exactExpr: showAdvancedExact ? exactInput : '',
      });
      setResult(res);
    }
  };

  const handleIterationsCountChange = (newN: number) => {
    const x0 = parseFloat(x0Input);
    const xf = parseFloat(xfInput);
    const y0 = parseFloat(y0Input);
    if (isNaN(x0) || isNaN(xf) || isNaN(y0) || newN < 1) return;

    const span = Math.abs(xf - x0);
    if (span <= 1e-9) return;

    const rawH = span / newN;
    const newH = Number(rawH.toFixed(6));
    if (newH <= 0) return;

    setHInput(String(newH));
    const res = computeEuler({
      expr: fnInput,
      x0,
      y0,
      h: newH,
      xf,
      exactExpr: showAdvancedExact ? exactInput : '',
    });
    setResult(res);
  };

  const handleExportCSV = () => {
    if (!result || result.steps.length === 0) return;
    const headers = ['n', 'x_n', 'y_n (Euler)', 'f(x_n, y_n)', 'y_{n+1}'];
    if (result.steps[0].yExact !== undefined && result.steps[0].yExact !== null) {
      headers.push('y_exact', 'error_absoluto', 'error_relativo_%');
    }

    const rows = result.steps.map((s) => {
      const row: (number | string)[] = [s.n, s.x, s.y, s.slope, s.nextY];
      if (s.yExact !== undefined && s.yExact !== null) {
        row.push(
          s.yExact,
          s.absError !== null && s.absError !== undefined ? s.absError : '',
          s.relErrorPercent !== null && s.relErrorPercent !== undefined ? s.relErrorPercent : ''
        );
      }
      return row.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `euler_solucion_${fnInput.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTable = () => {
    if (!result || result.steps.length === 0) return;
    const headers = ['n\tx_n\ty_n\tf(x_n, y_n)\ty_{n+1}'];
    if (result.steps[0].yExact !== undefined && result.steps[0].yExact !== null) {
      headers[0] += '\ty_exact\terror_abs';
    }
    const lines = result.steps.map((s) => {
      let line = `${s.n}\t${s.x}\t${formatNum(s.y)}\t${formatNum(s.slope)}\t${formatNum(s.nextY)}`;
      if (s.yExact !== undefined && s.yExact !== null) {
        line += `\t${formatNum(s.yExact)}\t${formatNum(s.absError ?? 0)}`;
      }
      return line;
    });

    navigator.clipboard.writeText([headers[0], ...lines].join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertToken = (token: string) => {
    setFnInput((prev) => prev + token);
  };

  const totalStepsCount = result?.steps.length ?? 0;
  const maxStepIndex = Math.max(0, totalStepsCount - 1);
  const currentStepLimit =
    visibleIterationsLimit !== null && visibleIterationsLimit <= maxStepIndex
      ? visibleIterationsLimit
      : maxStepIndex;
  const stepsToRender = result ? result.steps.slice(0, currentStepLimit + 1) : [];

  return (
    <section id="calculadora" className="euler-calculator space-y-6 scroll-mt-20">
      {/* Encabezado limpio de la sección */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <CalcIcon className="w-4 h-4" />
          <span>3. Simulador Interactivo</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Calculadora y Gráfico 2D
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl">
          Ingresá la ecuación diferencial y el paso <MathInline math="h" /> para visualizar la trayectoria numérica, la curva exacta y la evolución del error.
        </p>
      </div>

      {/* Contenedor Principal: Panel Lateral de Variables + Gráfico 2D */}
      <div className="surface overflow-hidden relative">
        {/* Barra superior de control para móviles y tablets (< 1024px) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Variables y Parámetros EDO</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="btn-soft !text-xs !py-1 !px-3 font-semibold"
            aria-expanded={isPanelOpen}
            aria-controls="euler-variables-panel"
          >
            {isPanelOpen ? (
              <>
                <span>Ocultar variables</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Editar variables</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch min-h-0 lg:min-h-[560px] relative">
          {/* Panel Lateral de Ingreso de Datos (sin espacio residual en móvil al ocultarse) */}
          <aside
            id="euler-variables-panel"
            aria-label="Panel lateral de variables y datos de la ecuación diferencial"
            className={`drawer-transition shrink-0 overflow-hidden ${
              isPanelOpen
                ? 'w-full lg:w-[380px] xl:w-[400px] opacity-100'
                : 'hidden lg:block lg:w-0 lg:max-w-0 lg:opacity-0 pointer-events-none'
            }`}
          >
            <div className="w-full lg:w-[380px] xl:w-[400px] p-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800 h-full">
              {/* Cabecera del panel (solo escritorio) */}
              <div className="hidden lg:flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Parámetros del P.V.I
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Ocultar panel lateral"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Ocultar</span>
                </button>
              </div>

              {/* Selector rápido de ejercicios UTN */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Ejercicios rápidos (Guía UTN)
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {GUIDE_EXERCISES.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleLoadExercise(ex)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeExerciseId === ex.id
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {ex.title.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entrada de Función diferencial + Vista previa integrada */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={fnInputId} className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Ecuación <MathInline math="y' = f(x, y)" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveMobileKeypadField('fn')}
                    className="lg:hidden inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 rounded-lg px-2 py-0.5 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <CalcIcon className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>Teclado móvil</span>
                  </button>
                </div>

                <input
                  id={fnInputId}
                  type="text"
                  value={fnInput}
                  onChange={(e) => setFnInput(e.target.value)}
                  onFocus={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setActiveMobileKeypadField('fn');
                    }
                  }}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setActiveMobileKeypadField('fn');
                    }
                  }}
                  placeholder="Ej: -y + x + 1"
                  className="field !text-sm !py-2"
                />

                {/* Previsualización KaTeX sutil e integrada */}
                <div className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2 text-xs overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">Vista previa</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    <MathInline math={`y' = ${exprToLatex(fnInput || '0')}`} />
                  </div>
                </div>

                {/* Atajos matemáticos discretos */}
                <div className="flex items-center flex-wrap gap-1">
                  {[
                    { label: 'e^(-x)', val: 'exp(-x)' },
                    { label: 'sen', val: 'sin(x)' },
                    { label: 'cos', val: 'cos(x)' },
                    { label: 'x²', val: 'x^2' },
                    { label: 'y²', val: 'y^2' },
                    { label: '√x', val: 'sqrt(x)' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => insertToken(item.val)}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condiciones Iniciales y Paso en grilla limpia */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Condición Inicial y Paso
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor={x0InputId} className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Inicial <MathInline math="x_0" />
                    </label>
                    <input
                      id={x0InputId}
                      type="number"
                      step="any"
                      value={x0Input}
                      onChange={(e) => setX0Input(e.target.value)}
                      className="field !text-xs !py-1.5"
                    />
                  </div>
                  <div>
                    <label htmlFor={y0InputId} className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Inicial <MathInline math="y_0" />
                    </label>
                    <input
                      id={y0InputId}
                      type="number"
                      step="any"
                      value={y0Input}
                      onChange={(e) => setY0Input(e.target.value)}
                      className="field !text-xs !py-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor={hInputId} className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Paso <MathInline math="h" />
                      </label>
                      <button
                        type="button"
                        onClick={handleHalveStep}
                        className="text-[10px] px-1.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 cursor-pointer"
                        title="Reducir paso a la mitad"
                      >
                        h/2
                      </button>
                    </div>
                    <input
                      id={hInputId}
                      type="number"
                      step="any"
                      value={hInput}
                      onChange={(e) => setHInput(e.target.value)}
                      className="field !text-xs !py-1.5"
                    />
                  </div>
                  <div>
                    <label htmlFor={xfInputId} className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Final <MathInline math="x_f" />
                    </label>
                    <input
                      id={xfInputId}
                      type="number"
                      step="any"
                      value={xfInput}
                      onChange={(e) => setXfInput(e.target.value)}
                      className="field !text-xs !py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Solución analítica exacta opcional (compacta y limpia) */}
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedExact(!showAdvancedExact)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                  >
                    {showAdvancedExact ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>Solución exacta <MathInline math="y(x)" /></span>
                  </button>
                  {showAdvancedExact && (
                    <button
                      type="button"
                      onClick={() => setActiveMobileKeypadField('exact')}
                      className="lg:hidden inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2 py-0.5 cursor-pointer"
                    >
                      <CalcIcon className="w-3 h-3" />
                      <span>Teclado</span>
                    </button>
                  )}
                </div>

                {showAdvancedExact && (
                  <input
                    id={exactInputId}
                    type="text"
                    value={exactInput}
                    onChange={(e) => setExactInput(e.target.value)}
                    onFocus={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setActiveMobileKeypadField('exact');
                      }
                    }}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setActiveMobileKeypadField('exact');
                      }
                    }}
                    placeholder="Opcional, ej: x + exp(-x)"
                    className="field !text-xs !py-1.5"
                  />
                )}
              </div>

              {/* Botón Principal de Cálculo */}
              <button
                type="button"
                onClick={handleCalculate}
                className="btn-primary w-full !py-2.5 !text-xs sm:!text-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Calcular solución</span>
              </button>

              {result && !result.success && result.error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{result.error}</span>
                </div>
              )}
            </div>
          </aside>

          {/* Área del Gráfico 2D */}
          <div className="flex-1 min-w-0 transition-all duration-300 relative flex flex-col">
            {result && result.success && result.steps.length > 0 ? (
              <Graph
                steps={result.steps}
                expression={fnInput}
                expressionLatex={result.expressionLatex}
                exactExprLatex={exactInput.trim() ? `y(x) = ${exprToLatex(exactInput)}` : undefined}
                exactExpr={showAdvancedExact ? exactInput : ''}
                hasExact={showAdvancedExact && !!exactInput.trim()}
                embedded={true}
                isPanelOpen={isPanelOpen}
                onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
                x0={result.x0}
                xf={result.xf}
                onIterationsCountChange={handleIterationsCountChange}
              />
            ) : (
              <div className="p-10 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center h-full min-h-[420px] m-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CalcIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">
                  Esperando parámetros para graficar
                </h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  {result && result.error
                    ? result.error
                    : 'Ingresá la ecuación diferencial en el panel y presioná "Calcular solución".'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Iteraciones Limpia */}
      {result && result.success && result.steps.length > 0 && (
        <div className="surface p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Tabla de iteraciones (<MathInline math={`N = ${result.steps.length - 1}`} />)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Resultado final: <strong className="font-mono text-indigo-600 dark:text-indigo-400">y({result.steps[result.steps.length - 1].x}) ≈ {formatNum(result.steps[result.steps.length - 1].y, 6)}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button onClick={() => setShowAllStepsBreakdown(!showAllStepsBreakdown)} className="btn-soft !text-xs">
                <Code2 className="w-3.5 h-3.5" />
                <span>{showAllStepsBreakdown ? 'Ocultar fórmulas' : 'Ver fórmulas'}</span>
              </button>
              <button onClick={handleCopyTable} className="btn-soft !text-xs">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button onClick={handleExportCSV} className="btn-soft btn-soft-accent !text-xs">
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[380px] rounded-xl border border-slate-200/80 dark:border-slate-800 custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 px-3 text-center font-bold">n</th>
                  <th className="py-2.5 px-3 font-bold"><MathInline math="x_n" /></th>
                  <th className="py-2.5 px-3 font-bold"><MathInline math="y_n" /> (Euler)</th>
                  <th className="py-2.5 px-3 font-bold"><MathInline math="f(x_n, y_n)" /></th>
                  <th className="py-2.5 px-3 font-bold"><MathInline math="y_{n+1}" /></th>
                  {showAdvancedExact && exactInput.trim() && (
                    <>
                      <th className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400"><MathInline math="y(x_n)" /></th>
                      <th className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-400">Error abs.</th>
                      <th className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-400">Error %</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {stepsToRender.map((s) => {
                  const isTerminal = s.n === result.steps[result.steps.length - 1].n;
                  return (
                    <React.Fragment key={s.n}>
                      <tr className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${isTerminal ? 'bg-indigo-50/40 dark:bg-indigo-950/20 font-bold' : ''}`}>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">{s.n}</td>
                        <td className="py-2 px-3 font-mono">{formatNum(s.x, 4)}</td>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatNum(s.y, 6)}</td>
                        <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">{isTerminal ? '—' : formatNum(s.slope, 6)}</td>
                        <td className="py-2 px-3 font-mono text-teal-700 dark:text-teal-400">{isTerminal ? '—' : formatNum(s.nextY, 6)}</td>
                        {showAdvancedExact && exactInput.trim() && (
                          <>
                            <td className="py-2 px-3 font-mono text-emerald-700 dark:text-emerald-400">
                              {s.yExact !== null && s.yExact !== undefined ? formatNum(s.yExact, 6) : '—'}
                            </td>
                            <td className="py-2 px-3 font-mono text-amber-700 dark:text-amber-400">
                              {s.absError !== null && s.absError !== undefined ? formatNum(s.absError, 6) : '—'}
                            </td>
                            <td className="py-2 px-3 font-mono text-amber-700 dark:text-amber-400">
                              {s.relErrorPercent !== null && s.relErrorPercent !== undefined
                                ? `${formatNum(s.relErrorPercent, 3)}%`
                                : '—'}
                            </td>
                          </>
                        )}
                      </tr>
                      {showAllStepsBreakdown && !isTerminal && (
                        <tr className="bg-slate-50/70 dark:bg-slate-800/30 text-xs">
                          <td colSpan={showAdvancedExact && exactInput.trim() ? 8 : 5} className="py-2 px-4">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-2 text-[11px]">Paso {s.n}:</span>
                            <MathInline math={s.stepFormulaLatex} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calculadora táctil móvil para ingreso de variables y funciones */}
      <MobileMathKeyboard
        isOpen={activeMobileKeypadField !== null}
        onClose={() => setActiveMobileKeypadField(null)}
        targetFieldTitle={
          activeMobileKeypadField === 'fn'
            ? "Función diferencial f(x, y) = y'"
            : 'Solución analítica exacta y(x)'
        }
        value={activeMobileKeypadField === 'fn' ? fnInput : exactInput}
        onChange={(val) => {
          if (activeMobileKeypadField === 'fn') {
            setFnInput(val);
          } else if (activeMobileKeypadField === 'exact') {
            setExactInput(val);
          }
        }}
        onCalculate={handleCalculate}
      />
    </section>
  );
};
