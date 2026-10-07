import React, { useState } from 'react';
import { MathBlock, MathInline } from './MathView';
import {
  BookOpen,
  Compass,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Footprints,
  Sparkles,
} from 'lucide-react';

interface TheoryProps {
  onGoToCalculator?: () => void;
  onGoToExample?: () => void;
}

export const Theory: React.FC<TheoryProps> = ({ onGoToCalculator, onGoToExample }) => {
  const [activeConceptTab, setActiveConceptTab] = useState<'analogia' | 'formula' | 'error'>('analogia');

  return (
    <section id="teoria" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="border-b border-gray-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Marco Teórico · Fundamentación Numérica</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          El Método de Euler: De la Intuición a la Fórmula
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mt-2 text-base sm:text-lg leading-relaxed max-w-4xl font-normal">
          Fundamentación analítica de la aproximación tangencial de primer orden para la resolución numérica
          del Problema de Valor Inicial (P.V.I) en ecuaciones diferenciales ordinarias.
        </p>
      </div>

      {/* Storyline: 3 Acts with Academic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Acto 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                El Problema (P.V.I)
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">
              Definición y Punto Inicial
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed mb-3">
              Conocemos la tasa de variación instantánea (la derivada <MathInline math="y' = f(x, y)" />) y el anclaje exacto en el origen (<MathInline math="y(x_0) = y_0" />).
            </p>
            <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-md border border-gray-200 dark:border-slate-700 text-center">
              <MathBlock math="y' = f(x, y) \quad \text{con} \quad y(x_0) = y_0" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Footprints className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Condición inicial conocida</span>
          </div>
        </div>

        {/* Acto 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Aproximación Tangencial
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">
              Proyección Lineal de Primer Orden
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed mb-3">
              Avanzamos sobre la recta tangente a la curva en el punto evaluado mediante un incremento finito uniforme <MathInline math="h" />.
            </p>
            <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-md border border-gray-200 dark:border-slate-700 text-center">
              <MathBlock math="x_{n+1} = x_n + h" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Incremento de malla h</span>
          </div>
        </div>

        {/* Acto 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Esquema Iterativo
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">
              Ordenada Proyectada
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed mb-3">
              La nueva estimación <MathInline math="y_{n+1}" /> surge sumando el avance diferencial vertical: paso <MathInline math="h" /> por la pendiente evaluada.
            </p>
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-md border border-emerald-200 dark:border-emerald-800 text-center font-bold">
              <MathBlock math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fórmula de recurrencia lista</span>
          </div>
        </div>
      </div>

      {/* Academic Formula Card (Eliminated heavy background gradient) */}
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg p-6 sm:p-7 border border-gray-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Ecuación de Recurrencia Principal
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Anatomía de la Fórmula de Euler
            </h3>
            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
              Interpretación geométrica rigurosa de cada componente del algoritmo:
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-6 border border-gray-200 dark:border-slate-700 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-wide py-2">
              <MathBlock math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-slate-700 text-left sm:text-center text-xs">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-gray-200 dark:border-slate-700">
                <span className="font-extrabold text-blue-700 dark:text-blue-400 text-sm block mb-1">
                  <MathInline math="y_{n+1}" />
                </span>
                <span className="text-gray-900 dark:text-white font-bold block">Próxima ordenada</span>
                <span className="text-gray-500 dark:text-slate-400 text-[11px]">Aproximación en el nodo x_{'{n+1}'}</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-gray-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-700 dark:text-sky-400 text-sm block mb-1">
                  <MathInline math="y_n" />
                </span>
                <span className="text-gray-900 dark:text-white font-bold block">Ordenada actual</span>
                <span className="text-gray-500 dark:text-slate-400 text-[11px]">Valor de partida del paso actual</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-gray-200 dark:border-slate-700">
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm block mb-1">
                  <MathInline math="h" />
                </span>
                <span className="text-gray-900 dark:text-white font-bold block">Paso de cálculo</span>
                <span className="text-gray-500 dark:text-slate-400 text-[11px]">Amplitud horizontal (<MathInline math="\Delta x" />)</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-gray-200 dark:border-slate-700">
                <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm block mb-1">
                  <MathInline math="f(x_n, y_n)" />
                </span>
                <span className="text-gray-900 dark:text-white font-bold block">Pendiente local</span>
                <span className="text-gray-500 dark:text-slate-400 text-[11px]">Dirección de la tangente en (x_n, y_n)</span>
              </div>
            </div>
          </div>
        </div>
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

