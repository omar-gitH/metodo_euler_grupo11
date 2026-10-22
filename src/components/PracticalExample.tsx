import React, { useState } from 'react';
import { MathBlock, MathInline } from './MathView';
import {
  PlayCircle,
  Calculator as CalcIcon,
  BookOpen,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Info,
} from 'lucide-react';

interface IterationStep {
  stepNum: number;
  targetVarName: string; // 'x' o 't'
  targetVarVal: string;
  isFinal: boolean;
  explanation: string;
  currentPoint: {
    varName: string;
    varVal: string;
    yVal: string;
  };
  slope: {
    formulaLatex: string;
    substLatex: string;
    resultVal: string;
  };
  advance: {
    formulaLatex: string;
    substLatex: string;
    resultVal: string;
  };
}

interface TableRowData {
  n: number;
  xn: string;
  yn: string;
  slope: string;
  nextY: string;
  isFinal?: boolean;
  note?: string;
}

interface StepByStepExercise {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  contextSentence: string;
  varName: string; // 'x' o 't'
  edoLatex: string;
  edoFormulaRight: string;
  conditionLatex: string;
  targetLatex: string;
  hVal: number;
  hDisplay: string;
  x0Val: number;
  y0Val: number;
  xfVal: number;
  numIterations: number;
  iterationsFormulaLatex: string;
  slopeActionDescription: string;
  iterations: IterationStep[];
  tableRows: TableRowData[];
  finalResultText: string;
  comparisonText: string;
  pedagogicalNote?: string;
  calcPreset: {
    fn: string;
    x0: number;
    y0: number;
    h: number;
    xf: number;
    exact: string;
  };
}

const STEP_BY_STEP_EXERCISES: StepByStepExercise[] = [
  {
    id: 'ejercicio-1',
    tabLabel: 'Ejercicio 1 (Práctica 2d)',
    badge: 'UTN FRLP · EDO Racional',
    title: "Ejercicio 1: y' = x y² - y/x",
    contextSentence:
      'Problema con término no lineal cuadrático y cociente racional y/x con condición inicial y(1) = 1.',
    varName: 'x',
    edoLatex: "y' = x y^2 - \\frac{y}{x}",
    edoFormulaRight: 'x y^2 - \\frac{y}{x}',
    conditionLatex: 'y(1) = 1',
    targetLatex: 'y(1.5)',
    hVal: 0.1,
    hDisplay: '0.1',
    x0Val: 1.0,
    y0Val: 1.0,
    xfVal: 1.5,
    numIterations: 5,
    iterationsFormulaLatex: 'n = \\frac{1.5 - 1.0}{0.1} = 5 \\text{ iteraciones}',
    slopeActionDescription: 'multiplicando x por y² y restando el cociente y/x',
    iterations: [
      {
        stepNum: 1,
        targetVarName: 'x',
        targetVarVal: '1.1',
        isFinal: false,
        explanation:
          'Partimos de la condición inicial (1, 1). Evaluamos la derivada: 1.0 · (1.0)² - (1.0 / 1.0) = 1 - 1 = 0.0000. La tangente inicial es horizontal y avanzamos h = 0.1.',
        currentPoint: { varName: 'x', varVal: '1.0', yVal: '1.0000' },
        slope: {
          formulaLatex: 'f(x_0, y_0) = x_0 y_0^2 - \\frac{y_0}{x_0}',
          substLatex: '1.0(1.0000^2) - \\frac{1.0000}{1.0}',
          resultVal: '0.0000',
        },
        advance: {
          formulaLatex: 'y_1 = y_0 + h \\cdot f',
          substLatex: '1.0000 + 0.1 \\cdot 0.0000',
          resultVal: '1.0000',
        },
      },
      {
        stepNum: 2,
        targetVarName: 'x',
        targetVarVal: '1.2',
        isFinal: false,
        explanation:
          'El nuevo punto base es (1.1, 1.0000). Calculamos la pendiente: 1.1 · (1.0)² - (1.0 / 1.1) = 1.1 - 0.9091 = 0.1909. Avanzamos el segundo paso.',
        currentPoint: { varName: 'x', varVal: '1.1', yVal: '1.0000' },
        slope: {
          formulaLatex: 'f(x_1, y_1) = x_1 y_1^2 - \\frac{y_1}{x_1}',
          substLatex: '1.1(1.0000^2) - \\frac{1.0000}{1.1}',
          resultVal: '0.1909',
        },
        advance: {
          formulaLatex: 'y_2 = y_1 + h \\cdot f',
          substLatex: '1.0000 + 0.1 \\cdot 0.1909',
          resultVal: '1.0191',
        },
      },
      {
        stepNum: 3,
        targetVarName: 'x',
        targetVarVal: '1.3',
        isFinal: false,
        explanation:
          'Punto base: (1.2, 1.0191). Calculamos la pendiente: 1.2 · (1.0191)² - (1.0191 / 1.2) = 1.2463 - 0.8492 = 0.3970. Sumamos el avance vertical.',
        currentPoint: { varName: 'x', varVal: '1.2', yVal: '1.0191' },
        slope: {
          formulaLatex: 'f(x_2, y_2) = x_2 y_2^2 - \\frac{y_2}{x_2}',
          substLatex: '1.2(1.0191^2) - \\frac{1.0191}{1.2}',
          resultVal: '0.3970',
        },
        advance: {
          formulaLatex: 'y_3 = y_2 + h \\cdot f',
          substLatex: '1.0191 + 0.1 \\cdot 0.3970',
          resultVal: '1.0588',
        },
      },
      {
        stepNum: 4,
        targetVarName: 'x',
        targetVarVal: '1.4',
        isFinal: false,
        explanation:
          'Punto base: (1.3, 1.0588). Evaluamos la pendiente: 1.3 · (1.0588)² - (1.0588 / 1.3) = 1.4574 - 0.8145 = 0.6429. Avanzamos a x = 1.4.',
        currentPoint: { varName: 'x', varVal: '1.3', yVal: '1.0588' },
        slope: {
          formulaLatex: 'f(x_3, y_3) = x_3 y_3^2 - \\frac{y_3}{x_3}',
          substLatex: '1.3(1.0588^2) - \\frac{1.0588}{1.3}',
          resultVal: '0.6429',
        },
        advance: {
          formulaLatex: 'y_4 = y_3 + h \\cdot f',
          substLatex: '1.0588 + 0.1 \\cdot 0.6429',
          resultVal: '1.1231',
        },
      },
      {
        stepNum: 5,
        targetVarName: 'x',
        targetVarVal: '1.5',
        isFinal: true,
        explanation:
          'Último paso hasta x = 1.5. Evaluamos la pendiente final: 1.4 · (1.1231)² - (1.1231 / 1.4) = 1.7658 - 0.8022 = 0.9636. Obtenemos el resultado aproximado pedido.',
        currentPoint: { varName: 'x', varVal: '1.4', yVal: '1.1231' },
        slope: {
          formulaLatex: 'f(x_4, y_4) = x_4 y_4^2 - \\frac{y_4}{x_4}',
          substLatex: '1.4(1.1231^2) - \\frac{1.1231}{1.4}',
          resultVal: '0.9636',
        },
        advance: {
          formulaLatex: 'y_5 = y_4 + h \\cdot f',
          substLatex: '1.1231 + 0.1 \\cdot 0.9636',
          resultVal: '1.2194',
        },
      },
    ],
    tableRows: [
      { n: 0, xn: '1.0', yn: '1.0000', slope: '0.0000', nextY: '1.0000' },
      { n: 1, xn: '1.1', yn: '1.0000', slope: '0.1909', nextY: '1.0191' },
      { n: 2, xn: '1.2', yn: '1.0191', slope: '0.3970', nextY: '1.0588' },
      { n: 3, xn: '1.3', yn: '1.0588', slope: '0.6429', nextY: '1.1231' },
      { n: 4, xn: '1.4', yn: '1.1231', slope: '0.9636', nextY: 'y(1.5) ≈ 1.2194', isFinal: true },
      { n: 5, xn: '1.5', yn: '1.2194', slope: '—', nextY: 'Destino final alcanzado', isFinal: true, note: 'Respuesta' },
    ],
    finalResultText: 'y(1.5) \\approx 1.2194',
    comparisonText:
      'la solución exacta por ecuación de Bernoulli es y(x) = \\frac{1}{2x - x^2}, que en x = 1.5 da y(1.5) = \\frac{4}{3} \\approx 1.33333. El error absoluto es 0.11388 (error relativo 8.54%). También se puede resolver con h = 0.05 para hallar y(1.25), reduciendo a la mitad el error de truncamiento.',
    pedagogicalNote:
      'Ejercicio clásico de examen UTN (Práctica EDO 2d): al despejar por Bernoulli se aprecia cómo Euler aproxima una función racional con denominador cuadrático que posee una asíntota vertical en x = 2.',
    calcPreset: {
      fn: 'x*y^2 - y/x',
      x0: 1,
      y0: 1,
      h: 0.1,
      xf: 1.5,
      exact: '1/(2*x - x^2)',
    },
  },
  {
    id: 'ejercicio-2',
    tabLabel: 'Ejercicio 2 (Práctica 2b)',
    badge: 'UTN FRLP · Apunte Oficial',
    title: 'Ejercicio 2: Práctica 2b (Guía Oficial UTN)',
    contextSentence:
      'Problema resuelto en páginas 9 a 11 del apunte de la cátedra con variable temporal t y función trascendente trigonométrica y exponencial.',
    varName: 't',
    edoLatex: "y' = \\operatorname{sen}(t) + e^{-t}",
    edoFormulaRight: '\\operatorname{sen}(t) + e^{-t}',
    conditionLatex: 'y(0) = 0',
    targetLatex: 'y(1.0)',
    hVal: 0.5,
    hDisplay: '0.5',
    x0Val: 0,
    y0Val: 0,
    xfVal: 1.0,
    numIterations: 2,
    iterationsFormulaLatex: 'n = \\frac{1.0 - 0}{0.5} = 2 \\text{ iteraciones}',
    slopeActionDescription: 'sumando el seno y la exponencial decreciente de t',
    iterations: [
      {
        stepNum: 1,
        targetVarName: 't',
        targetVarVal: '0.5',
        isFinal: false,
        explanation:
          'Partimos de la condición inicial (t=0, y=0). Con la EDO calculamos la pendiente inicial: sen(0)=0 y e⁰=1, con lo cual la pendiente es 1.0000. Avanzamos un paso grande h = 0.5.',
        currentPoint: { varName: 't', varVal: '0.0', yVal: '0.0000' },
        slope: {
          formulaLatex: 'f(t_0, y_0) = \\operatorname{sen}(t_0) + e^{-t_0}',
          substLatex: '\\operatorname{sen}(0) + e^{-0} = 0 + 1',
          resultVal: '1.0000',
        },
        advance: {
          formulaLatex: 'y_1 = y_0 + h \\cdot f',
          substLatex: '0.0000 + 0.5 \\cdot 1.0000',
          resultVal: '0.5000',
        },
      },
      {
        stepNum: 2,
        targetVarName: 't',
        targetVarVal: '1.0',
        isFinal: true,
        explanation:
          'El punto de partida ahora es (0.5, 0.5000). Calculamos la nueva pendiente evaluando sen(0.5) ≈ 0.4794 y e⁻⁰·⁵ ≈ 0.6065. Con su suma avanzamos el último salto de h = 0.5 hasta t = 1.0.',
        currentPoint: { varName: 't', varVal: '0.5', yVal: '0.5000' },
        slope: {
          formulaLatex: 'f(t_1, y_1) = \\operatorname{sen}(t_1) + e^{-t_1}',
          substLatex: '\\operatorname{sen}(0.5) + e^{-0.5} = 0.4794 + 0.6065',
          resultVal: '1.0860',
        },
        advance: {
          formulaLatex: 'y_2 = y_1 + h \\cdot f',
          substLatex: '0.5000 + 0.5 \\cdot 1.0860',
          resultVal: '1.0430',
        },
      },
    ],
    tableRows: [
      { n: 0, xn: '0.0', yn: '0.0000', slope: '1.0000', nextY: '0.5000' },
      { n: 1, xn: '0.5', yn: '0.5000', slope: '1.0860', nextY: 'y(1.0) ≈ 1.0430', isFinal: true },
      { n: 2, xn: '1.0', yn: '1.0430', slope: '—', nextY: 'Destino final alcanzado', isFinal: true, note: 'Respuesta' },
    ],
    finalResultText: 'y(1.0) \\approx 1.0430',
    comparisonText:
      'la solución exacta de este PVI es y(t) = 2 - \\cos(t) - e^{-t}, que da y(1.0) = 1.09182. El error absoluto es 0.04882 (error relativo del 4.47%), sumamente bueno para haber usado apenas 2 pasos grandes de h = 0.5.',
    pedagogicalNote:
      'En el apunte de cátedra original (pág. 11), el resultado de y₂ figura transcripto como 1.4297 por un error aritmético manual de tipeo al sumar 0.5 + 0.5 * 1.0860. La resolución algebraica rigurosa arroja exactamente 1.0430.',
    calcPreset: {
      fn: 'sin(x) + exp(-x)',
      x0: 0,
      y0: 0,
      h: 0.5,
      xf: 1.0,
      exact: '2 - cos(x) - exp(-x)',
    },
  },
  {
    id: 'ejercicio-3',
    tabLabel: 'Ejercicio 3 (Práctica 2c)',
    badge: 'UTN FRLP · EDO No Lineal',
    title: 'Ejercicio 3: Práctica 2c (Guía Oficial UTN)',
    contextSentence:
      'Problema no lineal con término cuadrático (x - y)², donde la recta tangente aproxima la solución sin requerir integrales analíticas complejas.',
    varName: 'x',
    edoLatex: "y' = (x - y)^2",
    edoFormulaRight: '(x - y)^2',
    conditionLatex: 'y(2) = 0.5',
    targetLatex: 'y(2.75)',
    hVal: 0.25,
    hDisplay: '0.25',
    x0Val: 2.0,
    y0Val: 0.5,
    xfVal: 2.75,
    numIterations: 3,
    iterationsFormulaLatex: 'n = \\frac{2.75 - 2.0}{0.25} = 3 \\text{ iteraciones}',
    slopeActionDescription: 'evaluando la resta (x - y) elevada al cuadrado',
    iterations: [
      {
        stepNum: 1,
        targetVarName: 'x',
        targetVarVal: '2.25',
        isFinal: false,
        explanation:
          'Partimos de la condición inicial (x=2, y=0.5). Evaluamos la resta al cuadrado en la derivada: (2 - 0.5)² = 1.5² = 2.2500. Multiplicamos por h = 0.25 para obtener el avance vertical.',
        currentPoint: { varName: 'x', varVal: '2.00', yVal: '0.5000' },
        slope: {
          formulaLatex: 'f(x_0, y_0) = (x_0 - y_0)^2',
          substLatex: '(2.0 - 0.5000)^2 = (1.5000)^2',
          resultVal: '2.2500',
        },
        advance: {
          formulaLatex: 'y_1 = y_0 + h \\cdot f',
          substLatex: '0.5000 + 0.25 \\cdot 2.2500',
          resultVal: '1.0625',
        },
      },
      {
        stepNum: 2,
        targetVarName: 'x',
        targetVarVal: '2.50',
        isFinal: false,
        explanation:
          'Nuevo punto base: (2.25, 1.0625). La nueva pendiente es (2.25 - 1.0625)² = 1.1875² ≈ 1.4102. Avanzamos el segundo cuarto de paso.',
        currentPoint: { varName: 'x', varVal: '2.25', yVal: '1.0625' },
        slope: {
          formulaLatex: 'f(x_1, y_1) = (x_1 - y_1)^2',
          substLatex: '(2.25 - 1.0625)^2 = (1.1875)^2',
          resultVal: '1.4102',
        },
        advance: {
          formulaLatex: 'y_2 = y_1 + h \\cdot f',
          substLatex: '1.0625 + 0.25 \\cdot 1.4102',
          resultVal: '1.4151',
        },
      },
      {
        stepNum: 3,
        targetVarName: 'x',
        targetVarVal: '2.75',
        isFinal: true,
        explanation:
          'Último paso hasta x = 2.75. Calculamos la pendiente final con el punto anterior: (2.50 - 1.4151)² = 1.0849² ≈ 1.1770 y calculamos la aproximación pedida.',
        currentPoint: { varName: 'x', varVal: '2.50', yVal: '1.4151' },
        slope: {
          formulaLatex: 'f(x_2, y_2) = (x_2 - y_2)^2',
          substLatex: '(2.50 - 1.4151)^2 = (1.0849)^2',
          resultVal: '1.1770',
        },
        advance: {
          formulaLatex: 'y_3 = y_2 + h \\cdot f',
          substLatex: '1.4151 + 0.25 \\cdot 1.1770',
          resultVal: '1.7094',
        },
      },
    ],
    tableRows: [
      { n: 0, xn: '2.00', yn: '0.5000', slope: '2.2500', nextY: '1.0625' },
      { n: 1, xn: '2.25', yn: '1.0625', slope: '1.4102', nextY: '1.4151' },
      { n: 2, xn: '2.50', yn: '1.4151', slope: '1.1770', nextY: 'y(2.75) ≈ 1.7094', isFinal: true },
      { n: 3, xn: '2.75', yn: '1.7094', slope: '—', nextY: 'Destino final alcanzado', isFinal: true, note: 'Respuesta' },
    ],
    finalResultText: 'y(2.75) \\approx 1.7094',
    comparisonText:
      'en este ejercicio no lineal, la solución analítica presenta una asíntota cercana donde los métodos tradicionales fallan o se complican; el método de Euler permite calcular el avance paso a paso con total simplicidad aritmética.',
    pedagogicalNote:
      'Ideal para parciales y exámenes finales: demuestra que el método de Euler funciona exactamente igual sin importar si la ecuación diferencial es lineal o no lineal.',
    calcPreset: {
      fn: '(x - y)^2',
      x0: 2,
      y0: 0.5,
      h: 0.25,
      xf: 2.75,
      exact: '',
    },
  },
];

interface PracticalExampleProps {
  onLoadExampleIntoCalculator: (params: {
    fn: string;
    x0: number;
    y0: number;
    h: number;
    xf: number;
    exact: string;
  }) => void;
}

export const PracticalExample: React.FC<PracticalExampleProps> = ({
  onLoadExampleIntoCalculator,
}) => {
  const [activeExIndex, setActiveExIndex] = useState<number>(0);

  const curEx = STEP_BY_STEP_EXERCISES[activeExIndex];

  const handlePrevEx = () => {
    setActiveExIndex((prev) => (prev > 0 ? prev - 1 : STEP_BY_STEP_EXERCISES.length - 1));
  };

  const handleNextEx = () => {
    setActiveExIndex((prev) => (prev < STEP_BY_STEP_EXERCISES.length - 1 ? prev + 1 : 0));
  };

  const handleLoad = () => {
    onLoadExampleIntoCalculator(curEx.calcPreset);
  };

  return (
    <section id="ejemplo-practico" className="space-y-6 scroll-mt-20">
      {/* Contenedor Principal tipo Card de Reporte Técnico / Dashboard Universitario */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-7">
        {/* Cabecera de la Sección con Eyebrow y Enlaces */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4" />
              <span>2. PRÁCTICA Y RESOLUCIÓN ALGEBRAICA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ejercicios resueltos paso a paso
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Reporte de cálculo con desglose detallado de punto base, pendiente tangente y proyección lineal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://drive.google.com/drive/folders/1mLnL6RVAs0atcPeuId43_OjOfAfypyW5?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
              title="Abrir la carpeta con la guía de la UTN en Google Drive"
            >
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Consultar Guía UTN</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={handleLoad}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all cursor-pointer"
              title="Cargar este ejercicio en la calculadora interactiva"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Simular en la Calculadora</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Selección de Ejercicio (Estilo Segmented Dashboard) */}
        <div className="flex flex-wrap items-center gap-2">
          {STEP_BY_STEP_EXERCISES.map((ex, idx) => {
            const isSelected = idx === activeExIndex;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900'
                }`}
              >
                {ex.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Contenido Dinámico del Ejercicio Activo */}
        <div key={curEx.id} className="space-y-6 view-fade-enter">
          {/* Título del ejercicio */}
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {curEx.title}
            </h3>
          </div>

          {/* Banner Principal del Enunciado (Estilo Reporte Técnico) */}
          <div className="dark-banner p-5 sm:p-6 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm space-y-2 border border-slate-800 [&_.katex]:!text-white [&_.katex-html]:!text-white [&_.katex_*]:!text-white">
            <div className="text-center sm:text-left text-lg sm:text-xl font-bold">
              <MathBlock math={`${curEx.edoLatex}, \\quad ${curEx.conditionLatex}`} />
            </div>
            <div className="text-center sm:text-left text-sm sm:text-base text-blue-200 font-semibold pt-1">
              <MathBlock
                math={`\\text{Hallar } ${curEx.targetLatex} \\text{ con } h = ${curEx.hDisplay} \\quad \\Rightarrow \\quad ${curEx.iterationsFormulaLatex}`}
              />
            </div>
          </div>

          {/* Frase introductoria */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
            {curEx.contextSentence}
          </p>

          {/* Nota pedagógica */}
          {curEx.pedagogicalNote && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Nota de cátedra:</strong> {curEx.pedagogicalNote}
              </span>
            </div>
          )}

          {/* Plan de Resolución (Lista estructurada con tipografía limpia) */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Plan de resolución
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
              <li>
                <strong>Identificar los datos:</strong>{' '}
                <MathInline math={`f(${curEx.varName}, y) = ${curEx.edoFormulaRight}`} />
                {', '}
                <MathInline math={`${curEx.varName}_0 = ${curEx.x0Val}`} />
                {', '}
                <MathInline math={`y_0 = ${curEx.y0Val}`} />
                {', '}
                <MathInline math={`h = ${curEx.hDisplay}`} />
                {' y '}
                <MathInline math={`${curEx.varName}_f = ${curEx.xfVal}`} />.
              </li>
              <li>
                <strong>Calcular las iteraciones:</strong>{' '}
                <MathInline
                  math={`n = \\frac{${curEx.xfVal} - ${curEx.x0Val}}{${curEx.hDisplay}} = ${curEx.numIterations}`}
                />
                {', o sea que se llega a '}
                <MathInline math={`${curEx.varName} = ${curEx.xfVal}`} />
                {` en ${curEx.numIterations} pasos.`}
              </li>
              <li>
                <strong>Repetir en cada iteración tres cosas:</strong>{' '}
                (a) tomar el punto actual <MathInline math={`(${curEx.varName}_n, y_n)`} />,{' '}
                (b) calcular la pendiente con <MathInline math="f" /> ({curEx.slopeActionDescription}),{' '}
                (c) avanzar con <MathInline math="y_{n+1} = y_n + h \\cdot f" />.
              </li>
              <li>
                <strong>Leer el resultado:</strong> el valor de <MathInline math="y" /> obtenido en la última iteración es la aproximación numérica buscada de <MathInline math={curEx.targetLatex} />.
              </li>
            </ol>
          </div>

          {/* Sección Desarrollo: Grilla de los 3 subpasos en cada iteración */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Desarrollo de cálculo
            </h4>

            <div className="space-y-4">
              {curEx.iterations.map((it) => (
                <div
                  key={it.stepNum}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-3"
                >
                  {/* Encabezado del paso */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Iteración {it.stepNum}: calcular{' '}
                      <MathInline math={`y_${it.stepNum}`} /> en{' '}
                      <MathInline math={`${it.targetVarName}_${it.stepNum} = ${it.targetVarVal}`} />
                      {it.isFinal && (
                        <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                          (respuesta final)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Explicación en texto */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {it.explanation}
                  </p>

                  {/* Grilla responsiva de 3 cajas: (a) Punto actual, (b) Pendiente, (c) Avance */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {/* Caja (a) Punto actual */}
                    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        (a) Punto actual
                      </span>
                      <div className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                        <MathInline
                          math={`${it.currentPoint.varName}_{${it.stepNum - 1}} = ${it.currentPoint.varVal}, \\; y_{${it.stepNum - 1}} = ${it.currentPoint.yVal}`}
                        />
                      </div>
                    </div>

                    {/* Caja (b) Pendiente */}
                    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        (b) Pendiente
                      </span>
                      <div className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                        <MathInline
                          math={`f = ${it.slope.substLatex} = ${it.slope.resultVal}`}
                        />
                      </div>
                    </div>

                    {/* Caja (c) Avance */}
                    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        (c) Avance
                      </span>
                      <div className="font-mono text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-200">
                        <MathInline
                          math={`y_${it.stepNum} = ${it.advance.substLatex} = ${it.advance.resultVal}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de Iteraciones Estilo Dashboard (Sin bordes verticales, líneas sutiles horizontales, celdas alineadas a la derecha) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Tabla de iteraciones
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Recorrido completo paso a paso en el intervalo [{curEx.x0Val}, {curEx.xfVal}]
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 text-center w-12 font-bold">n</th>
                    <th className="py-2.5 px-4 font-bold">
                      <MathInline math={`${curEx.varName}_n`} />
                    </th>
                    <th className="py-2.5 px-4 font-bold">
                      <MathInline math="y_n" />
                    </th>
                    <th className="py-2.5 px-4 font-bold">
                      <MathInline math={`f(${curEx.varName}_n, y_n)`} />
                    </th>
                    <th className="py-2.5 px-4 font-bold">
                      <MathInline math="y_{n+1} = y_n + h \\cdot f" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {curEx.tableRows.map((row) => (
                    <tr
                      key={row.n}
                      className={`transition-colors ${
                        row.isFinal
                          ? 'bg-blue-50/50 dark:bg-blue-950/40 font-semibold text-blue-900 dark:text-blue-200'
                          : 'hover:bg-slate-50/75 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500 dark:text-slate-400">
                        {row.n}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {row.xn}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {row.yn}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {row.slope}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold">
                        {row.nextY}
                        {row.note && (
                          <span className="ml-2 text-[10px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {row.note}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tarjeta de Resultado y Comparación con Solución Exacta */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
            <p>
              <strong className="text-slate-900 dark:text-white">Resultado numérico:</strong>{' '}
              <MathInline math={curEx.finalResultText} />.{' '}
              <strong className="text-slate-900 dark:text-white">Comparación analítica:</strong>{' '}
              {curEx.comparisonText}
            </p>
          </div>

          {/* Navegación entre Ejercicios (Anterior / Siguiente) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrevEx}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-slate-400 font-mono font-semibold">
              Ejercicio {activeExIndex + 1} de {STEP_BY_STEP_EXERCISES.length}
            </span>

            <button
              type="button"
              onClick={handleNextEx}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
