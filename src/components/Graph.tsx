import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { EulerStep } from '../utils/euler';
import { MathInline } from './MathView';
import { TrendingUp, Layers, Check, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GraphProps {
  steps: EulerStep[];
  expressionLatex: string;
  exactExprLatex?: string;
  hasExact: boolean;
}

export const Graph: React.FC<GraphProps> = ({
  steps,
  expressionLatex,
  exactExprLatex,
  hasExact,
}) => {
  const [showExact, setShowExact] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'solution' | 'error'>('solution');
  const { isDark } = useTheme();

  // Prepare data for recharts
  const chartData = useMemo(() => {
    return steps.map((step) => {
      const item: Record<string, number | null | undefined> = {
        x: step.x,
        euler: Number(step.y.toFixed(6)),
        slope: Number(step.slope.toFixed(4)),
        n: step.n,
      };

      if (step.yExact !== undefined && step.yExact !== null && !isNaN(step.yExact)) {
        item.exact = Number(step.yExact.toFixed(6));
        item.absError = step.absError !== undefined && step.absError !== null ? Number(step.absError.toFixed(6)) : null;
      }

      return item;
    });
  }, [steps]);

  // Compute domain bounds with safety padding
  const yValues = useMemo(() => {
    const vals: number[] = [];
    chartData.forEach((d) => {
      if (typeof d.euler === 'number' && isFinite(d.euler)) vals.push(d.euler);
      if (showExact && typeof d.exact === 'number' && isFinite(d.exact)) vals.push(d.exact);
    });
    if (vals.length === 0) return [0, 1];
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    return [Number((min - span * 0.08).toFixed(3)), Number((max + span * 0.08).toFixed(3))];
  }, [chartData, showExact]);

  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const labelColor = isDark ? '#cbd5e1' : '#475569';
  const refLineColor = isDark ? '#475569' : '#cbd5e1';

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
        <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-2" />
        <p className="font-medium">No hay datos para graficar.</p>
        <p className="text-xs text-slate-400 mt-1">
          Ingrese los parámetros en la calculadora y presione &quot;Calcular Solución&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {activeTab === 'solution' ? 'Trayectoria Numérica en el Plano (x, y)' : 'Evolución del Error Absoluto |y_exact - y_euler|'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ecuación: <MathInline math={`y' = ${expressionLatex}`} />
            {hasExact && exactExprLatex && (
              <span className="ml-2">
                · Solución teórica: <MathInline math={exactExprLatex} />
              </span>
            )}
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {hasExact && (
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('solution')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'solution'
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Solución y(x)
              </button>
              <button
                onClick={() => setActiveTab('error')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'error'
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-amber-700 dark:text-amber-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Curva de Error
              </button>
            </div>
          )}

          {activeTab === 'solution' && hasExact && (
            <button
              onClick={() => setShowExact(!showExact)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showExact
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${showExact ? 'opacity-100' : 'opacity-0'}`} />
              <span>Curva Exacta</span>
            </button>
          )}

          <button
            onClick={() => setShowGrid(!showGrid)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showGrid ? 'Ocultar Grilla' : 'Mostrar Grilla'}</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-80 sm:h-96 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'solution' ? (
            <LineChart data={chartData} margin={{ top: 12, right: 24, left: 10, bottom: 20 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
              <XAxis
                dataKey="x"
                type="number"
                domain={['auto', 'auto']}
                stroke={axisColor}
                tick={{ fontSize: 11, fill: axisColor }}
                label={{ value: 'Variable x (independiente)', position: 'insideBottom', offset: -12, fontSize: 12, fill: labelColor }}
              />
              <YAxis
                domain={yValues}
                stroke={axisColor}
                tick={{ fontSize: 11, fill: axisColor }}
                label={{ value: 'Variable y (dependiente)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: labelColor }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xs text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-bold text-indigo-300 border-b border-slate-800 pb-1">
                          Iteración #{data.n} · x = {data.x}
                        </p>
                        <p className="text-white">
                          <span className="text-slate-400">Euler y(x):</span>{' '}
                          <span className="font-mono font-bold text-emerald-400">{data.euler}</span>
                        </p>
                        {data.slope !== undefined && (
                          <p className="text-white">
                            <span className="text-slate-400">Pendiente f(x,y):</span>{' '}
                            <span className="font-mono text-amber-300">{data.slope}</span>
                          </p>
                        )}
                        {data.exact !== undefined && data.exact !== null && (
                          <>
                            <p className="text-white">
                              <span className="text-slate-400">Solución exacta:</span>{' '}
                              <span className="font-mono font-bold text-sky-400">{data.exact}</span>
                            </p>
                            <p className="text-white">
                              <span className="text-slate-400">Error absoluto:</span>{' '}
                              <span className="font-mono text-rose-300">{data.absError}</span>
                            </p>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <ReferenceLine y={0} stroke={refLineColor} strokeWidth={1} />
              <Line
                name="Aproximación de Euler (Numérica)"
                type="linear"
                dataKey="euler"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 1.5, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#4f46e5' }}
              />
              {hasExact && showExact && (
                <Line
                  name="Solución Analítica Exacta"
                  type="monotone"
                  dataKey="exact"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 12, right: 24, left: 10, bottom: 20 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
              <XAxis
                dataKey="x"
                type="number"
                domain={['auto', 'auto']}
                stroke={axisColor}
                tick={{ fontSize: 11, fill: axisColor }}
                label={{ value: 'Variable x', position: 'insideBottom', offset: -12, fontSize: 12, fill: labelColor }}
              />
              <YAxis
                stroke={axisColor}
                tick={{ fontSize: 11, fill: axisColor }}
                label={{ value: 'Error Absoluto |y_exact - y_euler|', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: labelColor }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xs text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-bold text-amber-300">Iteración #{data.n} (x = {data.x})</p>
                        <p className="text-white">
                          <span className="text-slate-400">Error Absoluto:</span>{' '}
                          <span className="font-mono font-bold text-rose-400">{data.absError}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Line
                name="Error Absoluto Acumulado"
                type="monotone"
                dataKey="absError"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f43f5e', strokeWidth: 1, stroke: '#ffffff' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <Info className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>
          <strong>Interpretación visual para la defensa:</strong> Los segmentos rectos entre cada punto muestran cómo Euler camina a lo largo de la recta tangente. A medida que avanzamos, la separación entre la recta y la curva real evidencia el error acumulado <MathInline math="\mathcal{O}(h)" />.
        </span>
      </div>
    </div>
  );
};
