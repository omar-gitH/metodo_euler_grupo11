import React, { useState } from 'react';
import { MathBlock, MathInline } from './MathView';
import {
  PlayCircle,
  Calculator as CalcIcon,
  Lightbulb,
} from 'lucide-react';

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

export const PracticalExample: React.FC<PracticalExampleProps> = ({ onLoadExampleIntoCalculator }) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const iterationsData = [
    {
      n: 0,
      xn: '0.0',
      yn: '1.0000',
      slopeExpr: '0 + 1 = 1.0000',
      calcExpr: '1.0000 + 0.1 \\cdot 1.0000 = 1.1000',
      nextX: '0.1',
      nextY: '1.1000',
      exactVal: '1.1103',
      absErr: '0.0103',
      relErr: '0.93%',
    },
    {
      n: 1,
      xn: '0.1',
      yn: '1.1000',
      slopeExpr: '0.1 + 1.1000 = 1.2000',
      calcExpr: '1.1000 + 0.1 \\cdot 1.2000 = 1.2200',
      nextX: '0.2',
      nextY: '1.2200',
      exactVal: '1.2428',
      absErr: '0.0228',
      relErr: '1.83%',
    },
    {
      n: 2,
      xn: '0.2',
      yn: '1.2200',
      slopeExpr: '0.2 + 1.2200 = 1.4200',
      calcExpr: '1.2200 + 0.1 \\cdot 1.4200 = 1.3620',
      nextX: '0.3',
      nextY: '1.3620',
      exactVal: '1.3997',
      absErr: '0.0377',
      relErr: '2.69%',
    },
    {
      n: 3,
      xn: '0.3',
      yn: '1.3620',
      slopeExpr: '0.3 + 1.3620 = 1.6620',
      calcExpr: '1.3620 + 0.1 \\cdot 1.6620 = 1.5282',
      nextX: '0.4',
      nextY: '1.5282',
      exactVal: '1.5836',
      absErr: '0.0554',
      relErr: '3.50%',
    },
    {
      n: 4,
      xn: '0.4',
      yn: '1.5282',
      slopeExpr: '0.4 + 1.5282 = 1.9282',
      calcExpr: '1.5282 + 0.1 \\cdot 1.9282 = 1.7210',
      nextX: '0.5',
      nextY: '1.7210',
      exactVal: '1.7974',
      absErr: '0.0764',
      relErr: '4.25%',
    },
  ];

  const handleLoad = () => {
    onLoadExampleIntoCalculator({
      fn: 'x + y',
      x0: 0,
      y0: 1,
      h: 0.1,
      xf: 0.5,
      exact: '2*exp(x) - x - 1',
    });
  };

  return (
    <section id="ejemplo-practico" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase mb-1">
          <PlayCircle className="w-4 h-4" />
          <span>Marco Práctico · Ejemplo Resuelto</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          Ejemplo Resuelto Paso a Paso: <MathInline math="y' = x + y" />
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mt-2 text-base leading-relaxed max-w-4xl font-normal">
          El ejemplo paradigmático de la bibliografía de cálculo numérico. Mostramos cómo calcular cada iteración a mano
          para comprender en detalle cómo se aplican las fórmulas algebraicas en cada nodo del intervalo.
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-indigo-700 dark:text-indigo-400">
              Datos del Problema
            </span>
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mt-0.5">
              Calcular <MathInline math="y(0.5)" /> para <MathInline math="y' = x + y" /> con <MathInline math="y(0) = 1" /> y <MathInline math="h = 0.1" />
            </h3>
          </div>
          <button
            onClick={handleLoad}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start lg:self-auto shrink-0"
          >
            <CalcIcon className="w-4 h-4" />
            <span>Cargar en la Calculadora Interactiva</span>
          </button>
        </div>

        {/* 4 Cards with key parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-300 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">1. EDO a Resolver</span>
            <div className="mt-1 font-bold text-slate-950 dark:text-white">
              <MathBlock math="y' = f(x, y) = x + y" />
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-300 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">2. Punto de Inicio</span>
            <div className="mt-1 font-bold text-slate-950 dark:text-white">
              <MathBlock math="x_0 = 0, \quad y_0 = 1" />
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-300 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">3. Paso y Destino</span>
            <div className="mt-1 font-bold text-slate-950 dark:text-white">
              <MathBlock math="h = 0.1 \implies 5 \text{ pasos}" />
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-xl p-3.5 border-2 border-indigo-200 dark:border-indigo-800">
            <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 block">4. Solución Exacta Real</span>
            <div className="mt-1 font-bold text-indigo-950 dark:text-indigo-200">
              <MathBlock math="y(x) = 2e^x - x - 1" />
            </div>
          </div>
        </div>

        {/* The Recurrence Formula for this problem */}
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Fórmula de la Ordenada Genérica para este ejercicio:</span>
          </div>
          <div className="text-white text-base sm:text-lg">
            <MathBlock
              math="y_{n+1} = y_n + 0.1 \cdot (x_n + y_n)"
              className="text-white"
            />
          </div>
          <p className="text-slate-300 text-xs mt-2 font-medium">
            Cada nuevo valor es el anterior más <MathInline math="0.1" /> veces la suma de <MathInline math="x_n + y_n" />.
          </p>
        </div>
      </div>

      {/* Step by Step Explorer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
            Explorador de Iteraciones (Paso 0 a Paso 4)
          </h3>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Haga clic en cada paso para ver la cuenta exacta:
          </span>
        </div>

        {/* Stepper Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {iterationsData.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepTab(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStepTab === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
              }`}
            >
              <span>Paso {item.n}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeStepTab === idx ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-400 font-bold'}`}>
                x={item.xn}
              </span>
            </button>
          ))}
        </div>

        {/* Active step details */}
        {(() => {
          const cur = iterationsData[activeStepTab];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left calculations */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-300 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <span className="font-extrabold text-slate-950 dark:text-white text-sm sm:text-base flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                        {cur.n + 1}
                      </span>
                      Iteración <MathInline math={`n = ${cur.n}`} />: Hallar <MathInline math={`y_{${cur.n + 1}}`} /> en <MathInline math={`x = ${cur.nextX}`} />
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Punto actual: <MathInline math={`(${cur.xn}, ${cur.yn})`} />
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-300 block mb-1">
                      1. Calculamos la pendiente:
                    </span>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-2xs">
                      <MathBlock math={`y'_{${cur.n}} = f(${cur.xn}, ${cur.yn}) = ${cur.slopeExpr}`} />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-300 block mb-1">
                      2. Aplicamos la fórmula de Euler:
                    </span>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-2xs">
                      <MathBlock math={`y_{${cur.n + 1}} = ${cur.yn} + 0.1 \\cdot (${cur.slopeExpr.split('=')[1]?.trim()}) = ${cur.nextY}`} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                    <span className="font-extrabold block mb-0.5 text-emerald-900 dark:text-emerald-300">Resultado de esta iteración:</span>
                    <MathInline math={`y(${cur.nextX}) \\approx ${cur.nextY}`} />
                  </div>
                </div>
              </div>

              {/* Right column: Accuracy and Error comparison */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-300 dark:border-slate-700 space-y-4">
                <h4 className="font-extrabold text-slate-950 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                  Precisión y Error del Paso
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xs">
                    <span className="text-slate-700 dark:text-slate-400 font-bold">Aproximado Euler:</span>
                    <span className="font-mono font-extrabold text-slate-950 dark:text-white">{cur.nextY}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xs">
                    <span className="text-slate-700 dark:text-slate-400 font-bold">Solución exacta:</span>
                    <span className="font-mono font-extrabold text-indigo-700 dark:text-indigo-400">{cur.exactVal}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xs">
                    <span className="text-slate-700 dark:text-slate-400 font-bold">Error absoluto:</span>
                    <span className="font-mono font-extrabold text-amber-800 dark:text-amber-400">{cur.absErr}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xs">
                    <span className="text-slate-700 dark:text-slate-400 font-bold">Error porcentual:</span>
                    <span className="font-mono font-extrabold text-amber-900 dark:text-amber-300">{cur.relErr}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Complete summary table */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="font-extrabold text-slate-950 dark:text-white text-base mb-3">
            Tabla Comparativa Completa
          </h4>
          <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-300 font-extrabold border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 text-center">n</th>
                  <th className="py-2.5 px-3"><MathInline math="x_n" /></th>
                  <th className="py-2.5 px-3"><MathInline math="y_n" /> (Euler)</th>
                  <th className="py-2.5 px-3"><MathInline math="f(x_n, y_n)" /></th>
                  <th className="py-2.5 px-3 text-indigo-900 dark:text-indigo-400"><MathInline math="y(x_n)" /> (Exacta)</th>
                  <th className="py-2.5 px-3 text-amber-900 dark:text-amber-400">Error Absoluto</th>
                  <th className="py-2.5 px-3 text-amber-900 dark:text-amber-400">Error %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="py-2 px-3 text-center font-extrabold font-mono text-slate-900 dark:text-white">0</td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-950 dark:text-slate-100">0.0</td>
                  <td className="py-2 px-3 font-mono font-extrabold text-slate-950 dark:text-white">1.0000</td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-300">1.0000</td>
                  <td className="py-2 px-3 font-mono font-bold text-indigo-800 dark:text-indigo-400">1.0000</td>
                  <td className="py-2 px-3 font-mono text-slate-500">0.0000</td>
                  <td className="py-2 px-3 font-mono text-slate-500">0.00%</td>
                </tr>
                {iterationsData.map((item) => (
                  <tr key={item.n} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-2 px-3 text-center font-extrabold font-mono text-slate-900 dark:text-white">{item.n + 1}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-950 dark:text-slate-100">{item.nextX}</td>
                    <td className="py-2 px-3 font-mono font-extrabold text-slate-950 dark:text-white">{item.nextY}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-300">{item.n < iterationsData.length - 1 ? iterationsData[item.n + 1].slopeExpr.split('=')[1]?.trim() : '-'}</td>
                    <td className="py-2 px-3 font-mono font-bold text-indigo-800 dark:text-indigo-400">{item.exactVal}</td>
                    <td className="py-2 px-3 font-mono font-bold text-amber-800 dark:text-amber-400">{item.absErr}</td>
                    <td className="py-2 px-3 font-mono font-bold text-amber-900 dark:text-amber-400">{item.relErr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
