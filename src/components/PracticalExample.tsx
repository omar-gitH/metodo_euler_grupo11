import React, { useState } from 'react';
import { MathBlock, MathInline } from './MathView';
import {
  PlayCircle,
  Calculator as CalcIcon,
  BookOpen,
  ExternalLink,
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

  const cur = iterationsData[activeStepTab];

  return (
    <section id="ejemplo-practico" className="space-y-6 scroll-mt-20">
      {/* Encabezado limpio */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <PlayCircle className="w-4 h-4" />
            <span>2. Ejemplo Resuelto</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cálculo Paso a Paso: <MathInline math="y' = x + y" />
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
            Desarrollo algebraico manual para estimar <MathInline math="y(0.5)" /> partiendo de <MathInline math="y(0) = 1" /> con paso <MathInline math="h = 0.1" />.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <a
            href="https://drive.google.com/drive/folders/1mLnL6RVAs0atcPeuId43_OjOfAfypyW5?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-sky-50/80 hover:bg-sky-100 text-sky-700 dark:bg-slate-900 dark:hover:bg-sky-950/40 dark:text-sky-300 border border-sky-200/90 dark:border-sky-800/80 shadow-xs transition-all cursor-pointer"
            title="Abrir la carpeta con la guía de la UTN en Google Drive"
          >
            <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Consultar Guía UTN</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <button
            onClick={handleLoad}
            className="btn-primary !text-xs !py-2.5 !px-4 cursor-pointer"
          >
            <CalcIcon className="w-4 h-4" />
            <span>Simular en la Calculadora</span>
          </button>
        </div>
      </div>

      {/* Superficie unificada del ejemplo */}
      <div className="surface p-6 sm:p-7 space-y-6">
        {/* Resumen compacto de datos del problema */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] block mb-1">
              EDO
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              <MathInline math="y' = x + y" />
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] block mb-1">
              Condición Inicial
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              <MathInline math="y(0) = 1" />
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] block mb-1">
              Paso y Rango
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              <MathInline math="h = 0.1 \;\; (x \in [0, 0.5])" />
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/50">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase text-[10px] block mb-1">
              Solución Exacta
            </span>
            <span className="font-bold text-indigo-950 dark:text-indigo-200 text-sm">
              <MathInline math="y(x) = 2e^x - x - 1" />
            </span>
          </div>
        </div>

        {/* Selector de pasos + Desglose del paso activo */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex flex-wrap gap-1.5">
              {iterationsData.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStepTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                    activeStepTab === idx
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Paso {item.n}</span>
                  <span className={`text-[10px] font-mono ${activeStepTab === idx ? 'text-indigo-100' : 'text-slate-400'}`}>
                    x={item.xn}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Punto actual: <MathInline math={`(${cur.xn}, ${cur.yn})`} />
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    1. Pendiente en <MathInline math={`x_${cur.n}`} />
                  </span>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <MathBlock math={`f(${cur.xn}, ${cur.yn}) = ${cur.slopeExpr}`} />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    2. Ordenada <MathInline math={`y_{${cur.n + 1}}`} /> en <MathInline math={`x = ${cur.nextX}`} />
                  </span>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <MathBlock math={`y_{${cur.n + 1}} = ${cur.yn} + 0.1 \\cdot (${cur.slopeExpr.split('=')[1]?.trim()}) = ${cur.nextY}`} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60 text-xs">
                <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Aproximación en <MathInline math={`x = ${cur.nextX}`} />:
                </span>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-200">
                  <MathInline math={`y(${cur.nextX}) \\approx ${cur.nextY}`} />
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500">
                Comparación con Valor Exacto
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Valor Euler:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{cur.nextY}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Valor Exacto:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{cur.exactVal}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Error absoluto:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{cur.absErr}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Error relativo:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{cur.relErr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla resumen compacta */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3 text-center font-bold">n</th>
                <th className="py-2.5 px-3 font-bold"><MathInline math="x_n" /></th>
                <th className="py-2.5 px-3 font-bold"><MathInline math="y_n" /> (Euler)</th>
                <th className="py-2.5 px-3 font-bold"><MathInline math="f(x_n, y_n)" /></th>
                <th className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400"><MathInline math="y(x_n)" /> (Exacta)</th>
                <th className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-400">Error Abs.</th>
                <th className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-400">Error %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {iterationsData.map((row) => (
                <tr
                  key={row.n}
                  onClick={() => setActiveStepTab(row.n)}
                  className={`cursor-pointer transition-colors ${
                    activeStepTab === row.n
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 font-semibold'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2 px-3 text-center font-mono text-slate-500">{row.n}</td>
                  <td className="py-2 px-3 font-mono">{row.xn}</td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-white">{row.yn}</td>
                  <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">{row.slopeExpr.split('=')[1]?.trim()}</td>
                  <td className="py-2 px-3 font-mono text-indigo-600 dark:text-indigo-400">{row.exactVal}</td>
                  <td className="py-2 px-3 font-mono text-amber-700 dark:text-amber-400">{row.absErr}</td>
                  <td className="py-2 px-3 font-mono text-amber-700 dark:text-amber-400">{row.relErr}</td>
                </tr>
              ))}
              <tr className="bg-emerald-50/40 dark:bg-emerald-950/20 font-bold">
                <td className="py-2.5 px-3 text-center font-mono text-emerald-700 dark:text-emerald-400">5</td>
                <td className="py-2.5 px-3 font-mono">0.5</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 dark:text-emerald-300">1.7210</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">—</td>
                <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-indigo-400">1.7974</td>
                <td className="py-2.5 px-3 font-mono text-amber-700 dark:text-amber-400">0.0764</td>
                <td className="py-2.5 px-3 font-mono text-amber-700 dark:text-amber-400">4.25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
