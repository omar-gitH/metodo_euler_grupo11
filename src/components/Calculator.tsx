import React, { useState, useEffect, useId } from 'react';
import { computeEuler, EulerResult, exprToLatex, formatNum } from '../utils/euler';
import { GUIDE_EXERCISES, GuideExercise } from '../data/exercises';
import { MathBlock, MathInline } from './MathView';
import { Graph } from './Graph';
import {
  Calculator as CalcIcon,
  Play,
  Download,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  TrendingDown,
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
  // Input states
  const [fnInput, setFnInput] = useState<string>(initialValues?.fn || '-y + x + 1');
  const [x0Input, setX0Input] = useState<string>(String(initialValues?.x0 ?? 0));
  const [y0Input, setY0Input] = useState<string>(String(initialValues?.y0 ?? 1));
  const [hInput, setHInput] = useState<string>(String(initialValues?.h ?? 0.1));
  const [xfInput, setXfInput] = useState<string>(String(initialValues?.xf ?? 1.0));
  const [exactInput, setExactInput] = useState<string>(initialValues?.exact || 'x + exp(-x)');
  const [showAdvancedExact, setShowAdvancedExact] = useState<boolean>(true);

  // Calculation result state
  const [result, setResult] = useState<EulerResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string>('utn-2a');
  const [showAllStepsBreakdown, setShowAllStepsBreakdown] = useState<boolean>(false);
  const [visibleIterationsLimit, setVisibleIterationsLimit] = useState<number | null>(null);

  // Accessible IDs for inputs
  const fnInputId = useId();
  const x0InputId = useId();
  const y0InputId = useId();
  const hInputId = useId();
  const xfInputId = useId();
  const exactInputId = useId();

  // Run calculation
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

  // Run calculation initially or when initialValues prop updates
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

  // Prueba temporal: Evaluación Ejercicio 2e para depuración en DevTools de Chrome
  useEffect(() => {
    const testResult = computeEuler({
      expr: '2*x - 3*y + 1',
      x0: 1,
      y0: 5,
      h: 0.1,
      xf: 1.5,
      exactExpr: '(2/3)*x + 1/9 + (38/9)*exp(-3*(x - 1))',
    });

    console.log(
      '%c[Ejercicio 2e - Método de Euler UTN FRP - Verificación en DevTools]',
      'color: #4f46e5; font-weight: bold; font-size: 13px;'
    );
    console.table(
      testResult.steps.map((step) => ({
        'n': step.n,
        'x_n': step.x,
        'y_n (Euler)': Number(step.y.toFixed(6)),
        'f(x_n, y_n)': Number(step.slope.toFixed(6)),
        'y_exacta': step.yExact != null ? Number(step.yExact.toFixed(6)) : 'N/A',
        'Error Absoluto': step.absError != null ? Number(step.absError.toFixed(6)) : 'N/A',
        'Error Rel (%)': step.relErrorPercent != null ? `${step.relErrorPercent.toFixed(4)}%` : 'N/A',
      }))
    );
  }, []);

  // Load predefined exercise from UTN FRP guide
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

  // Halve step size to explore convergence
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

  // Export results to CSV
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

  // Copy table as TSV
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
    <section id="calculadora" className="euler-calculator space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase mb-1">
          <CalcIcon className="w-4 h-4" />
          <span>Calculadora Interactiva</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Calculadora Resolvedora y Gráfico 2D
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mt-2 text-base leading-relaxed max-w-4xl font-normal">
          Ingrese cualquier ecuación diferencial, modifique el paso <MathInline math="h" /> para analizar la convergencia
          y visualice la curva generada punto a punto en el gráfico 2D interactivo.
        </p>
      </div>

      {/* Quick Preload of Guide Exercises */}
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-5 sm:p-6 shadow-xs space-y-4 border border-gray-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Guía Práctica UTN Facultad Regional La Plata
            </span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              Cargar Ejercicios de la Cátedra con un Clic
            </h3>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">
            Preconfigurados para resolución inmediata:
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GUIDE_EXERCISES.slice(0, 3).map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleLoadExercise(ex)}
              className={`text-left p-3.5 rounded-md border transition-all cursor-pointer flex flex-col justify-between ${
                activeExerciseId === ex.id
                  ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600 shadow-2xs'
                  : 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{ex.title.split(':')[0]}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-mono font-bold border border-gray-200 dark:border-slate-600">
                    h = {ex.h}
                  </span>
                </div>
                <div className="my-2 bg-white dark:bg-slate-900 p-2 rounded-md border border-gray-200 dark:border-slate-700 text-center">
                  <MathInline math={ex.displayLatex} />
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 mt-1">
                  {ex.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>Cargar en calculadora</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Control Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Equation Inputs */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={fnInputId} className="block text-sm font-bold text-gray-900 dark:text-white">
                  Función diferencial <MathInline math="f(x, y) = y'" />
                </label>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                  Evaluable con mathjs
                </span>
              </div>
              <input
                id={fnInputId}
                type="text"
                value={fnInput}
                onChange={(e) => setFnInput(e.target.value)}
                placeholder="Ej: -y + x + 1  ó  sin(x) + exp(-x)"
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base text-gray-900 dark:text-white font-medium focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all shadow-2xs"
              />

              {/* Math helpers tokens */}
              <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 mr-1">Insertar símbolo:</span>
                {[
                  { label: 'e^(-x)', val: 'exp(-x)' },
                  { label: 'sen(x)', val: 'sin(x)' },
                  { label: 'cos(x)', val: 'cos(x)' },
                  { label: 'x^2', val: 'x^2' },
                  { label: 'y^2', val: 'y^2' },
                  { label: '2x', val: '2*x' },
                  { label: '√x', val: 'sqrt(x)' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => insertToken(item.val)}
                    className="px-2.5 py-1 rounded-md text-xs bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 font-mono font-medium transition-all cursor-pointer shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High-Contrast Formula Display Card */}
            <div className="bg-gray-50 dark:bg-slate-800/60 rounded-md p-3.5 border border-gray-200 dark:border-slate-700 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                  Fórmula a Resolver (Render KaTeX):
                </span>
              </div>
              <div className="font-bold text-gray-900 dark:text-white text-base bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-gray-200 dark:border-slate-700">
                <MathInline math={`y' = f(x, y) = ${exprToLatex(fnInput || '0')}`} />
              </div>
            </div>

            {/* Optional Exact Solution */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedExact(!showAdvancedExact)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {showAdvancedExact ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>
                  {showAdvancedExact ? 'Ocultar solución analítica exacta' : 'Añadir solución analítica exacta y(x) (opcional para comparar error)'}
                </span>
              </button>

              {showAdvancedExact && (
                <div className="mt-2.5 p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor={exactInputId} className="block text-xs font-bold text-gray-900 dark:text-slate-200">
                      Solución analítica exacta <MathInline math="y(x)" />:
                    </label>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      Permite computar error absoluto y relativo en cada paso
                    </span>
                  </div>
                  <input
                    id={exactInputId}
                    type="text"
                    value={exactInput}
                    onChange={(e) => setExactInput(e.target.value)}
                    placeholder="Ej: x + exp(-x)"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm text-gray-900 dark:text-white font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                  {exactInput.trim() && (
                    <div className="text-xs text-gray-800 dark:text-slate-300 pt-1 font-medium">
                      Vista previa analítica: <MathInline math={`y(x) = ${exprToLatex(exactInput)}`} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Initial Conditions & Discretization */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-800/60 rounded-md p-5 border border-gray-200 dark:border-slate-700 space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm border-b border-gray-200 dark:border-slate-700 pb-2">
              Condición Inicial y Dominio de Trabajo
            </h4>

            {/* x0 and y0 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={x0InputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Punto inicial <MathInline math="x_0" />
                </label>
                <input
                  id={x0InputId}
                  type="number"
                  step="any"
                  value={x0Input}
                  onChange={(e) => setX0Input(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm text-gray-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor={y0InputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Valor inicial <MathInline math="y_0 = y(x_0)" />
                </label>
                <input
                  id={y0InputId}
                  type="number"
                  step="any"
                  value={y0Input}
                  onChange={(e) => setY0Input(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm text-gray-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* h and xf */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={hInputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                    Paso <MathInline math="h" />
                  </label>
                  <button
                    type="button"
                    onClick={handleHalveStep}
                    title="Dividir paso a la mitad (h/2)"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700"
                  >
                    <TrendingDown className="w-3 h-3" />
                    <span>h/2</span>
                  </button>
                </div>
                <input
                  id={hInputId}
                  type="number"
                  step="any"
                  value={hInput}
                  onChange={(e) => setHInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm text-gray-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor={xfInputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Destino final <MathInline math="x_f" />
                </label>
                <input
                  id={xfInputId}
                  type="number"
                  step="any"
                  value={xfInput}
                  onChange={(e) => setXfInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm text-gray-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCalculate}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Calcular Solución (Método de Euler)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {result && !result.success && result.error && (
          <div className="p-4 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Error en los parámetros:</p>
              <p className="text-xs mt-0.5">{result.error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && result.success && result.steps.length > 0 && (
        <div className="space-y-6">
          <Graph
            steps={result.steps}
            expressionLatex={result.expressionLatex}
            exactExprLatex={exactInput.trim() ? `y(x) = ${exprToLatex(exactInput)}` : undefined}
            hasExact={showAdvancedExact && !!exactInput.trim()}
          />

          {/* Dynamic Table */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">
                    Tabla Dinámica de Iteraciones
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Mostrando los <MathInline math={`N = ${result.steps.length - 1}`} /> pasos evaluados desde{' '}
                  <MathInline math={`x_0 = ${result.x0}`} /> hasta <MathInline math={`x_f = ${result.xf}`} /> con paso{' '}
                  <MathInline math={`h = ${result.h}`} />.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setShowAllStepsBreakdown(!showAllStepsBreakdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showAllStepsBreakdown ? 'Ocultar Desglose' : 'Ver Fórmulas Paso a Paso'}</span>
                </button>
                <button
                  onClick={handleCopyTable}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Control Slider de Iteraciones Visibles */}
            {result.steps.length > 2 && (
              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-md border border-gray-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100 block">
                      Slider de Iteraciones
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-slate-400">
                      Arrastra para acotar la visualización sin extender la página
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-slate-400">0</span>
                  <input
                    type="range"
                    min={1}
                    max={maxStepIndex}
                    value={currentStepLimit}
                    onChange={(e) => setVisibleIterationsLimit(Number(e.target.value))}
                    className="w-full sm:w-48 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    title={`Mostrando hasta el paso n = ${currentStepLimit}`}
                    aria-label="Deslizador de iteraciones visibles"
                  />
                  <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-slate-400">{maxStepIndex}</span>

                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                    Paso 0..{currentStepLimit}
                  </span>

                  {currentStepLimit < maxStepIndex ? (
                    <button
                      type="button"
                      onClick={() => setVisibleIterationsLimit(maxStepIndex)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shrink-0 shadow-2xs"
                    >
                      Ver todas ({result.steps.length})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVisibleIterationsLimit(Math.min(5, maxStepIndex))}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 cursor-pointer transition-colors shrink-0"
                    >
                      Primeras 5
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Table layout with independent vertical scroll slider (max-height) and horizontal scroll */}
            <div className="overflow-x-auto overflow-y-auto max-h-[440px] rounded-md border border-gray-200 dark:border-slate-800 custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b-2 border-gray-900 dark:border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center border-b-2 border-gray-900 dark:border-slate-200 font-bold text-gray-900 dark:text-slate-100 uppercase text-[11px] tracking-wider">n</th>
                    <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-gray-900 dark:text-slate-100 text-xs"><MathInline math="x_n" /></th>
                    <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-gray-900 dark:text-slate-100 text-xs"><MathInline math="y_n" /> <span className="font-normal text-[11px] text-gray-500 dark:text-slate-400">(Euler)</span></th>
                    <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-gray-900 dark:text-slate-100 text-xs"><MathInline math="f(x_n, y_n)" /> <span className="font-normal text-[11px] text-gray-500 dark:text-slate-400">(Pendiente)</span></th>
                    <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-gray-900 dark:text-slate-100 text-xs"><MathInline math="y_{n+1}" /> <span className="font-normal text-[11px] text-gray-500 dark:text-slate-400">(Siguiente)</span></th>
                    {showAdvancedExact && exactInput.trim() && (
                      <>
                        <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-blue-700 dark:text-blue-400 text-xs"><MathInline math="y_{\text{exact}}(x_n)" /></th>
                        <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-amber-700 dark:text-amber-400 text-xs">Error Abs.</th>
                        <th className="py-3 px-3 border-b-2 border-gray-900 dark:border-slate-200 font-bold text-amber-700 dark:text-amber-400 text-xs">Error Rel. %</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
                  {stepsToRender.map((s) => {
                    const isTerminal = s.n === result.steps[result.steps.length - 1].n;
                    return (
                      <React.Fragment key={s.n}>
                        <tr className={`hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors ${isTerminal ? 'bg-blue-50/30 dark:bg-blue-950/20 font-bold' : ''}`}>
                          <td className="py-2.5 px-3 text-center font-mono font-medium text-gray-700 dark:text-slate-300">
                            {s.n}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-gray-900 dark:text-slate-100">
                            {formatNum(s.x, 4)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-300">
                            {formatNum(s.y, 6)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-gray-700 dark:text-slate-300">
                            {isTerminal ? '—' : formatNum(s.slope, 6)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                            {isTerminal ? '—' : formatNum(s.nextY, 6)}
                          </td>
                          {showAdvancedExact && exactInput.trim() && (
                            <>
                              <td className="py-2.5 px-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                                {s.yExact !== null && s.yExact !== undefined ? formatNum(s.yExact, 6) : '—'}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-amber-700 dark:text-amber-400 font-semibold">
                                {s.absError !== null && s.absError !== undefined ? formatNum(s.absError, 6) : '—'}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-amber-700 dark:text-amber-400 font-semibold">
                                {s.relErrorPercent !== null && s.relErrorPercent !== undefined
                                  ? `${formatNum(s.relErrorPercent, 3)}%`
                                  : '—'}
                              </td>
                            </>
                          )}
                        </tr>
                        {showAllStepsBreakdown && !isTerminal && (
                          <tr className="bg-gray-50/80 dark:bg-slate-800/40 border-l-2 border-blue-600 dark:border-blue-400 text-xs text-gray-800 dark:text-slate-200">
                            <td colSpan={showAdvancedExact && exactInput.trim() ? 8 : 5} className="py-2 px-4 font-serif">
                              <span className="text-blue-700 dark:text-blue-400 font-sans font-bold mr-2 text-[11px] uppercase tracking-wider">Fórmula paso {s.n}:</span>
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

            <div className="p-3.5 rounded-md bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-gray-900 dark:text-slate-200">Resultado final aproximado:</span>
                <span className="ml-2 font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
                  y({result.steps[result.steps.length - 1].x}) ≈ {formatNum(result.steps[result.steps.length - 1].y, 6)}
                </span>
              </div>
              <div className="text-gray-500 dark:text-slate-400 font-medium flex items-center gap-2">
                <span>
                  Iteraciones en vista: <strong className="text-gray-900 dark:text-white font-mono">{stepsToRender.length}</strong> de <strong className="text-gray-900 dark:text-white font-mono">{result.steps.length}</strong>
                </span>
                {currentStepLimit < maxStepIndex && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                    (desliza para ver más)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
