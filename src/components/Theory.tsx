import React, { useState } from 'react';
import { MathBlock, MathInline } from './MathView';
import { EulerStepDiagram } from './EulerStepDiagram';
import {
  BookOpen,
  Compass,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Footprints,
  Sparkles,
  ChevronDown,
  Scale,
  TrendingDown,
} from 'lucide-react';

interface TheoryProps {
  onGoToCalculator?: () => void;
  onGoToExample?: () => void;
}

export const Theory: React.FC<TheoryProps> = ({ onGoToCalculator, onGoToExample }) => {
  const [activeConceptTab, setActiveConceptTab] = useState<'analogia' | 'formula' | 'error'>('analogia');
  const [isErrorAccordionOpen, setIsErrorAccordionOpen] = useState<boolean>(true);

  return (
    <section id="teoria" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Marco Teórico · Fundamentación Numérica</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          El Método de Euler: De la Intuición a la Fórmula
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-base sm:text-lg leading-relaxed max-w-4xl font-normal">
          Fundamentación analítica de la aproximación tangencial de primer orden para la resolución numérica
          del Problema de Valor Inicial (P.V.I) en ecuaciones diferenciales ordinarias.
        </p>
      </div>

      {/* Storyline: 3 Acts with Academic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Acto 1 */}
        <div className="surface p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                El Problema (P.V.I)
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Definición y Punto Inicial
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Conocemos la tasa de variación instantánea (la derivada <MathInline math="y' = f(x, y)" />) y el anclaje exacto en el origen (<MathInline math="y(x_0) = y_0" />).
            </p>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
              <MathBlock math="y' = f(x, y) \quad \text{con} \quad y(x_0) = y_0" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Footprints className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Condición inicial conocida</span>
          </div>
        </div>

        {/* Acto 2 */}
        <div className="surface p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Aproximación Tangencial
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Proyección Lineal de Primer Orden
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Avanzamos sobre la recta tangente a la curva en el punto evaluado mediante un incremento finito uniforme <MathInline math="h" />.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
              <MathBlock math="x_{n+1} = x_n + h" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Incremento de malla h</span>
          </div>
        </div>

        {/* Acto 3 */}
        <div className="surface p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Esquema Iterativo
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
              Ordenada Proyectada
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              La nueva estimación <MathInline math="y_{n+1}" /> surge sumando el avance diferencial vertical: paso <MathInline math="h" /> por la pendiente evaluada.
            </p>
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center font-bold shadow-2xs">
              <MathBlock math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fórmula de recurrencia lista</span>
          </div>
        </div>
      </div>

      {/* Academic Formula Card */}
      <div className="surface p-6 sm:p-7 space-y-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Ecuación de Recurrencia Principal
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Anatomía de la Fórmula de Euler
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
              Interpretación geométrica rigurosa de cada componente del algoritmo:
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-wide py-2">
              <MathBlock math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-left sm:text-center text-xs">
              <div className="bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-400 text-sm block mb-1">
                  <MathInline math="y_{n+1}" />
                </span>
                <span className="text-slate-900 dark:text-white font-bold block">Próxima ordenada</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Aproximación en el nodo x_{'{n+1}'}</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="font-extrabold text-sky-700 dark:text-sky-400 text-sm block mb-1">
                  <MathInline math="y_n" />
                </span>
                <span className="text-slate-900 dark:text-white font-bold block">Ordenada actual</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Valor de partida del paso actual</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm block mb-1">
                  <MathInline math="h" />
                </span>
                <span className="text-slate-900 dark:text-white font-bold block">Paso de cálculo</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Amplitud horizontal (<MathInline math="\Delta x" />)</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm block mb-1">
                  <MathInline math="f(x_n, y_n)" />
                </span>
                <span className="text-slate-900 dark:text-white font-bold block">Pendiente local</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Dirección de la tangente en (x_n, y_n)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Esquema Didáctico: Diagrama del Paso h (El Triángulo Rectángulo) */}
      <EulerStepDiagram />

      {/* Sección Colapsable (Acordeón): Diferenciación Teórica del Error (Local vs Global) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setIsErrorAccordionOpen((prev) => !prev)}
          className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
          aria-expanded={isErrorAccordionOpen}
        >
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-sm shrink-0 mt-0.5 sm:mt-0">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Análisis Asintótico y Convergencia
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                  <MathInline math="\mathcal{O}(h^2) \text{ vs } \mathcal{O}(h)" />
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
                Diferenciación Teórica del Error: Local vs. Global
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Comprendé por qué el error de un solo paso es cuadrático pero el error final acumulado es lineal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
              {isErrorAccordionOpen ? 'Ocultar' : 'Expandir'}
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isErrorAccordionOpen ? 'rotate-180' : ''
                }`}
              />
            </span>
          </div>
        </button>

        {isErrorAccordionOpen && (
          <div className="p-5 sm:p-7 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in duration-200">
            {/* Grid 2 Columnas: Error Local vs Error Global */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Tarjeta 1: Error Local */}
              <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3.5">
                <div className="flex items-center justify-between gap-2 border-b border-amber-200 dark:border-amber-900/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h4 className="font-extrabold text-amber-900 dark:text-amber-200 text-sm sm:text-base">
                      1. Error de Truncamiento Local (ETL)
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-200/80 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200">
                    <MathInline math="\mathcal{O}(h^2)" />
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>¿Qué mide?</strong> El error introducido en un <strong>único paso aislado</strong> al avanzar de <MathInline math="x_n" /> a <MathInline math="x_{n+1} = x_n + h" />, bajo la hipótesis de que el valor previo <MathInline math="(x_n, y_n)" /> es exactamente correcto sobre la curva real.
                  </p>
                  
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-amber-800/50 text-center font-mono my-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mb-1">
                      Desarrollo exacto de Taylor (orden 2 con residuo de Lagrange):
                    </p>
                    <MathBlock math="y(x_n + h) = y(x_n) + h \cdot y'(x_n) + \frac{h^2}{2!} y''(\xi_n)" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-2 mb-1">
                      Sustituyendo <MathInline math="y'(x_n) = f(x_n, y_n)" /> y restando la aproximación de Euler <MathInline math="y_{n+1}" />:
                    </p>
                    <MathBlock math="E_{\text{local}} = y(x_n + h) - y_{n+1} = \frac{h^2}{2} y''(\xi_n) = \mathcal{O}(h^2)" />
                  </div>

                  <p className="flex items-start gap-1.5 text-amber-900 dark:text-amber-300 font-medium">
                    <span>💡</span>
                    <span>
                      <strong>Propiedad cuadrática:</strong> Si reducís el paso a la mitad (<MathInline math="h \to h/2" />), el error cometido en ese paso individual disminuye a una <strong>cuarta parte</strong> (<MathInline math="1/4" /> o <MathInline math="25\%" />).
                    </span>
                  </p>
                </div>
              </div>

              {/* Tarjeta 2: Error Global */}
              <div className="p-5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-3.5">
                <div className="flex items-center justify-between gap-2 border-b border-indigo-200 dark:border-indigo-900/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h4 className="font-extrabold text-indigo-900 dark:text-indigo-200 text-sm sm:text-base">
                      2. Error Global Acumulado (EG)
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-200/80 dark:bg-indigo-900/80 text-indigo-950 dark:text-indigo-200">
                    <MathInline math="\mathcal{O}(h)" />
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>¿Qué mide?</strong> La discrepancia total entre la solución exacta <MathInline math="y(x_f)" /> y la aproximación numérica final <MathInline math="y_N" /> tras recorrer todo el intervalo <MathInline math="[x_0, x_f]" />.
                  </p>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200/70 dark:border-indigo-800/50 text-center font-mono my-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mb-1">
                      Cantidad de pasos requeridos en el intervalo total <MathInline math="L = x_f - x_0" />:
                    </p>
                    <MathBlock math="N = \frac{x_f - x_0}{h} \propto \frac{1}{h}" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-2 mb-1">
                      Suma y propagación compuesta de los <MathInline math="N" /> errores locales:
                    </p>
                    <MathBlock math="E_{\text{global}} \approx \sum_{n=0}^{N-1} E_{\text{local}} \approx N \cdot \mathcal{O}(h^2) = \left(\frac{x_f - x_0}{h}\right) \cdot C h^2 = \mathcal{O}(h)" />
                  </div>

                  <p className="flex items-start gap-1.5 text-indigo-900 dark:text-indigo-300 font-medium">
                    <span>⚠️</span>
                    <span>
                      <strong>Pérdida de un orden:</strong> Al sumar <MathInline math="\sim 1/h" /> pasos con error cuadrático <MathInline math="h^2" />, el error global resultante decae linealmente como <MathInline math="\mathcal{O}(h)" />. Por ello, Euler es un <strong>método de orden 1</strong>.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla Comparativa de Resumen */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Cuadro Comparativo: Propiedades Asintóticas del Error en Euler</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4 font-bold">Criterio / Dimensión</th>
                      <th className="py-2.5 px-4 font-bold text-amber-700 dark:text-amber-400">Error Local de Truncamiento (ETL)</th>
                      <th className="py-2.5 px-4 font-bold text-indigo-700 dark:text-indigo-400">Error Global Acumulado (EG)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Orden Asintótico (Landau)</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                        <MathInline math="\mathcal{O}(h^2)" /> (Cuadrático)
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                        <MathInline math="\mathcal{O}(h)" /> (Lineal)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Alcance de Aplicación</td>
                      <td className="py-2.5 px-4">Un solo paso discreto (<MathInline math="x_n \to x_{n+1}" />)</td>
                      <td className="py-2.5 px-4">Intervalo continuo completo (<MathInline math="[x_0, x_f]" />)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Efecto al reducir paso a la mitad (<MathInline math="h/2" />)</td>
                      <td className="py-2.5 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                        Se reduce a <MathInline math="1/4" /> (<MathInline math="-75\%" />)
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-sky-700 dark:text-sky-400">
                        Se reduce a <MathInline math="1/2" /> (<MathInline math="-50\%" />)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Causa Matemática Primaria</td>
                      <td className="py-2.5 px-4">Omisión de términos de Taylor de orden <MathInline math="\ge 2" /></td>
                      <td className="py-2.5 px-4">Acumulación y amplificación de <MathInline math="N \approx L/h" /> errores locales</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Clasificación Numérica</td>
                      <td className="py-2.5 px-4">Método consistente de orden local 2</td>
                      <td className="py-2.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">Método convergente de Orden 1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deep Dive Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Profundización Conceptual
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
              Seleccione un fundamento analítico para examinar:
            </p>
          </div>

          <div className="flex rounded-md bg-gray-100 dark:bg-slate-800 p-1 text-xs font-semibold border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveConceptTab('analogia')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeConceptTab === 'analogia'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              Analogía del Conductor
            </button>
            <button
              onClick={() => setActiveConceptTab('formula')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeConceptTab === 'formula'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              Serie de Taylor
            </button>
            <button
              onClick={() => setActiveConceptTab('error')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeConceptTab === 'error'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              Análisis del Error
            </button>
          </div>
        </div>

        {/* Tab 1: Analogía del GPS */}
        {activeConceptTab === 'analogia' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start gap-3 bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-900/60">
              <Lightbulb className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-slate-300">
                <p className="font-extrabold text-gray-900 dark:text-white">
                  La Analogía del Conductor sin GPS:
                </p>
                <p>
                  Imaginá que estás conduciendo en una ruta sin mapa. Solo tenés dos datos en cada instante:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1 font-medium">
                  <li>Sabés exactamente en qué punto saliste: <strong>condición inicial <MathInline math="y(x_0) = y_0" /></strong>.</li>
                  <li>Mirás el velocímetro y la dirección en este instante: <strong>la derivada <MathInline math="y' = f(x, y)" /></strong>.</li>
                </ol>
                <p>
                  Para estimar dónde vas a estar tras un breve intervalo (<MathInline math="h" />), suponés que durante ese lapso avanzás en línea recta. Luego de ese paso, recalculás la nueva dirección con la EDO y repetís el proceso. <strong>Esa aproximación lineal por tramos es el método de Euler.</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Serie de Taylor */}
        {activeConceptTab === 'formula' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
              El método de Euler se deduce formalmente del desarrollo en <strong>Serie de Taylor</strong> truncado en el término de primer orden:
            </p>
            <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-md border border-gray-200 dark:border-slate-700 text-center">
              <MathBlock math="y(x_n + h) = y(x_n) + h \cdot y'(x_n) + \underbrace{\frac{h^2}{2!} y''(\xi)}_{\text{Término de Error descartado}}" />
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Al truncar el desarrollo y sustituir <MathInline math="y'(x_n) = f(x_n, y_n)" />, se obtiene directamente la fórmula de Euler. Los términos omitidos determinan el error local de truncamiento.
            </p>
          </div>
        )}

        {/* Tab 3: El Error */}
        {activeConceptTab === 'error' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200">
                <span className="font-extrabold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wide block mb-1">
                  1. Error Local de Truncamiento
                </span>
                <p className="text-xs text-gray-600 dark:text-slate-300 mb-2 font-medium">
                  Error introducido en un solo paso de avance. Es de orden cuadrático <MathInline math="\mathcal{O}(h^2)" />.
                </p>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-gray-200 dark:border-slate-700 text-center">
                  <MathInline math="E_{\text{local}} \approx \frac{h^2}{2} y''(\xi)" />
                </div>
              </div>

              <div className="p-4 rounded-md bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200">
                <span className="font-extrabold text-blue-700 dark:text-blue-400 text-xs uppercase tracking-wide block mb-1">
                  2. Error Global Acumulado
                </span>
                <p className="text-xs text-gray-600 dark:text-slate-300 mb-2 font-medium">
                  Al propagar el cálculo en <MathInline math="N = (x_f - x_0)/h" /> pasos, el error global acumulado es de orden lineal <MathInline math="\mathcal{O}(h)" />.
                </p>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-gray-200 dark:border-slate-700 text-center">
                  <MathInline math="E_{\text{global}} \propto h \implies \text{Método de Orden 1}" />
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-md border border-gray-200 dark:border-slate-700 font-medium">
              💡 <strong>Regla de convergencia:</strong> Al reducir el paso a la mitad (<MathInline math="h / 2" />), el error global se reduce aproximadamente a la <strong>mitad</strong>, duplicando el número de evaluaciones algebraicas.
            </div>
          </div>
        )}
      </div>

      {/* Guide Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 font-medium">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Siguiente sección: Demostración paso a paso con cálculo analítico completo.</span>
        </div>

        <div className="flex items-center gap-3">
          {onGoToExample && (
            <button
              onClick={onGoToExample}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Ver Ejemplo Resuelto</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

