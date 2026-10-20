import React from 'react';
import { MathInline } from './MathView';
import { Triangle, Info, Sparkles, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EulerStepDiagramProps {
  className?: string;
  showExactCurve?: boolean;
}

/**
 * Componente didáctico que ilustra geométricamente un paso del Método de Euler
 * mediante el triángulo rectángulo formado entre (x_n, y_n) y (x_{n+1}, y_{n+1}):
 * - Base: paso h = Delta x
 * - Altura (cateto opuesto): Delta y = h * f(x_n, y_n)
 * - Hipotenusa: segmento de recta tangente con pendiente m = f(x_n, y_n)
 */
export const EulerStepDiagram: React.FC<EulerStepDiagramProps> = ({
  className = '',
  showExactCurve = true,
}) => {
  const { isDarkMode, isDark } = useTheme();
  const dark = isDarkMode !== undefined ? isDarkMode : isDark;

  // Coordenadas fijas en el lienzo SVG (viewBox 0 0 740 430)
  // Punto A: (x_n, y_n)
  const Ax = 180;
  const Ay = 260;

  // Punto C: (x_{n+1}, y_n) - Vértice del ángulo recto
  const Cx = 490;
  const Cy = 260;

  // Punto B: (x_{n+1}, y_{n+1}) - Estimación numérica de Euler
  const Bx = 490;
  const By = 120;

  // Punto E: (x_{n+1}, y(x_{n+1})) - Punto exacto sobre la curva analítica
  const Ey = 70;

  // Extensión de la recta tangente para ilustrar la proyección
  const tangentStartX = 110;
  const tangentStartY = Ay + ((Ay - By) / (Cx - Ax)) * (Ax - tangentStartX);
  const tangentEndX = 560;
  const tangentEndY = By - ((Ay - By) / (Cx - Ax)) * (tangentEndX - Bx);

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
              Descomposición trigonométrica del avance diferencial de primer orden
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

      {/* Lienzo SVG Didáctico Plano */}
      <div className="p-3 sm:p-6 bg-gradient-to-b from-slate-50/40 to-white dark:from-slate-950/50 dark:to-slate-900/40">
        <div className="w-full max-w-3xl mx-auto">
          <svg
            viewBox="0 0 740 430"
            className="w-full h-auto select-none font-sans"
            role="img"
            aria-label="Diagrama del paso h del método de Euler con triángulo rectángulo"
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
              <line x1="50" y1="360" x2="690" y2="360" markerEnd="url(#axis-arrow)" />
              {/* Eje Y */}
              <line x1="80" y1="380" x2="80" y2="40" markerEnd="url(#axis-arrow)" />
            </g>

            {/* Etiquetas de los ejes */}
            <text
              x="695"
              y="364"
              fill={dark ? '#cbd5e1' : '#334155'}
              fontSize="14"
              fontWeight="bold"
              dominantBaseline="middle"
            >
              x
            </text>
            <text
              x="80"
              y="26"
              fill={dark ? '#cbd5e1' : '#334155'}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              y
            </text>

            {/* Líneas guía punteadas proyectadas a los ejes */}
            <g stroke={dark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.35)'} strokeDasharray="4 4" strokeWidth="1.2">
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
            <g fill={dark ? '#94a3b8' : '#64748b'} fontSize="12" fontWeight="600" textAnchor="middle">
              <text x={Ax} y="380">x_n</text>
              <text x={Cx} y="380">x_{'{n+1}'} = x_n + h</text>
            </g>
            <g fill={dark ? '#94a3b8' : '#64748b'} fontSize="12" fontWeight="600" textAnchor="end" dominantBaseline="middle">
              <text x="70" y={Ay}>y_n</text>
              <text x="70" y={By} fill={dark ? '#818cf8' : '#4f46e5'}>y_{'{n+1}'}</text>
              {showExactCurve && (
                <text x="70" y={Ey} fill={dark ? '#34d399' : '#059669'}>y(x_{'{n+1}'})</text>
              )}
            </g>

            {/* Triángulo Rectángulo (Área sombreada) */}
            <polygon
              points={`${Ax},${Ay} ${Cx},${Cy} ${Bx},${By}`}
              fill="url(#triangle-fill)"
              stroke="none"
            />

            {/* Indicador de Ángulo Recto en (x_{n+1}, y_n) */}
            <g stroke={dark ? '#94a3b8' : '#64748b'} strokeWidth="1.5" fill="none">
              <path d={`M ${Cx - 16} ${Cy} L ${Cx - 16} ${Cy - 16} L ${Cx} ${Cy - 16}`} />
              <circle cx={Cx - 8} cy={Cy - 8} r="1.5" fill={dark ? '#94a3b8' : '#64748b'} />
            </g>

            {/* Arco del ángulo alfa (pendiente en A) */}
            <g>
              <path
                d={`M ${Ax + 45} ${Ay} A 45 45 0 0 0 ${Ax + 42} ${Ay - 18}`}
                fill="none"
                stroke={dark ? '#f59e0b' : '#d97706'}
                strokeWidth="1.8"
              />
              <text
                x={Ax + 54}
                y={Ay - 9}
                fill={dark ? '#f59e0b' : '#d97706'}
                fontSize="12"
                fontWeight="bold"
                dominantBaseline="middle"
              >
                α
              </text>
            </g>

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
                d={`M ${Ax} ${Ay + 16} L ${Ax} ${Ay + 24} M ${Ax} ${Ay + 20} L ${Cx} ${Cy + 20} M ${Cx} ${Cy + 16} L ${Cx} ${Cy + 24}`}
                stroke={dark ? '#38bdf8' : '#0284c7'}
                strokeWidth="1.5"
              />
              <rect
                x={(Ax + Cx) / 2 - 46}
                y={Ay + 10}
                width="92"
                height="20"
                rx="6"
                fill={dark ? '#0f172a' : '#ffffff'}
                stroke={dark ? '#38bdf8' : '#0284c7'}
                strokeWidth="1"
              />
              <text
                x={(Ax + Cx) / 2}
                y={Ay + 24}
                fill={dark ? '#38bdf8' : '#0284c7'}
                fontSize="12"
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
              stroke={dark ? '#f59e0b' : '#d97706'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Cota lateral de la altura */}
            <g>
              <path
                d={`M ${Cx + 16} ${Cy} L ${Cx + 24} ${Cy} M ${Cx + 20} ${Cy} L ${Cx + 20} ${By} M ${Cx + 16} ${By} L ${Cx + 24} ${By}`}
                stroke={dark ? '#f59e0b' : '#d97706'}
                strokeWidth="1.5"
              />
              <rect
                x={Cx + 28}
                y={(Cy + By) / 2 - 13}
                width="150"
                height="26"
                rx="6"
                fill={dark ? '#0f172a' : '#ffffff'}
                stroke={dark ? '#f59e0b' : '#d97706'}
                strokeWidth="1"
              />
              <text
                x={Cx + 35}
                y={(Cy + By) / 2 + 4}
                fill={dark ? '#f59e0b' : '#d97706'}
                fontSize="12"
                fontWeight="bold"
              >
                Altura: h · f(x_n, y_n)
              </text>
            </g>

            {/* 3. Recta Tangente Extendida (Hipotenusa) */}
            {/* Línea extendida tenue */}
            <line
              x1={tangentStartX}
              y1={tangentStartY}
              x2={tangentEndX}
              y2={tangentEndY}
              stroke={dark ? '#fbbf24' : '#d97706'}
              strokeWidth="1.6"
              strokeDasharray="6 4"
              strokeOpacity="0.65"
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
            {/* Etiqueta flotante de la hipotenusa */}
            <g transform={`translate(${(Ax + Bx) / 2 - 60}, ${(Ay + By) / 2 - 24})`}>
              <rect
                x="-10"
                y="-14"
                width="200"
                height="26"
                rx="6"
                fill={dark ? '#0f172a' : '#ffffff'}
                stroke={dark ? '#818cf8' : '#4f46e5'}
                strokeWidth="1.2"
                className="shadow-sm"
              />
              <text
                x="90"
                y="3"
                fill={dark ? '#818cf8' : '#4f46e5'}
                fontSize="11"
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
                  d={`M 110 ${Ay + 35} Q ${Ax} ${Ay} 270 215 T ${Bx} ${Ey} T 560 40`}
                  fill="none"
                  stroke={dark ? '#34d399' : '#10b981'}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Llave o cota del Error Local de Truncamiento */}
                <line
                  x1={Bx + 4}
                  y1={By}
                  x2={Bx + 4}
                  y2={Ey}
                  stroke={dark ? '#fb7185' : '#e11d48'}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                <circle cx={Bx} cy={Ey} r="4" fill={dark ? '#34d399' : '#10b981'} />
                {/* Cartel de Error Local */}
                <rect
                  x={Bx + 12}
                  y={(By + Ey) / 2 - 12}
                  width="118"
                  height="22"
                  rx="5"
                  fill={dark ? '#881337' : '#ffe4e6'}
                  stroke={dark ? '#f43f5e' : '#e11d48'}
                  strokeWidth="1"
                />
                <text
                  x={Bx + 18}
                  y={(By + Ey) / 2 + 3}
                  fill={dark ? '#fecdd3' : '#9f1239'}
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  Error Local O(h²)
                </text>
              </g>
            )}

            {/* Nodos / Vértices Principales */}
            {/* Punto de inicio: (x_n, y_n) */}
            <g>
              <circle cx={Ax} cy={Ay} r="10" fill="#6366f1" fillOpacity="0.25" />
              <circle cx={Ax} cy={Ay} r="5.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
              <rect
                x={Ax - 75}
                y={Ay - 34}
                width="84"
                height="22"
                rx="6"
                fill={dark ? '#1e1b4b' : '#eef2ff'}
                stroke="#6366f1"
                strokeWidth="1"
              />
              <text
                x={Ax - 33}
                y={Ay - 20}
                fill={dark ? '#c7d2fe' : '#3730a3'}
                fontSize="11.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                (x_n, y_n)
              </text>
            </g>

            {/* Nuevo punto de Euler: (x_{n+1}, y_{n+1}) */}
            <g>
              <circle cx={Bx} cy={By} r="11" fill="#f59e0b" fillOpacity="0.25" />
              <circle cx={Bx} cy={By} r="6" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
              <rect
                x={Bx - 110}
                y={By - 34}
                width="104"
                height="22"
                rx="6"
                fill={dark ? '#451a03' : '#fef3c7'}
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text
                x={Bx - 58}
                y={By - 20}
                fill={dark ? '#fde68a' : '#92400e'}
                fontSize="11.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                (x_{'{n+1}'}, y_{'{n+1}'})
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Tarjetas didácticas explicativas de los 3 lados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
        {/* Cateto Adyacente: Base */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-sky-700 dark:text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>1. Cateto Base (<MathInline math="h" />)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Es el incremento horizontal discreto de la variable independiente:
            <br />
            <strong className="font-mono text-slate-800 dark:text-slate-100">
              Δx = x_{'{n+1}'} − x_n = h
            </strong>.
          </p>
        </div>

        {/* Cateto Opuesto: Altura */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>2. Cateto Altura (<MathInline math="\Delta y" />)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Multiplica la pendiente de la recta tangente por la longitud de la base:
            <br />
            <strong className="font-mono text-slate-800 dark:text-slate-100">
              Δy = h · f(x_n, y_n)
            </strong>.
          </p>
        </div>

        {/* Hipotenusa: Recta Tangente */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>3. Hipotenusa (Tangente)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Une el punto conocido con el nuevo punto aproximado sobre la tangente:
            <br />
            <strong className="font-mono text-slate-800 dark:text-slate-100">
              y_{'{n+1}'} = y_n + Δy
            </strong>.
          </p>
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
