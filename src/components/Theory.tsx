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
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Marco Teórico · Fundamentación Numérica</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          El Método de Euler: De la Intuición a la Fórmula
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mt-2 text-base sm:text-lg leading-relaxed max-w-4xl font-normal">
          Explicación clara, directa y sin tecnicismos innecesarios. Comprenda el hilo conductor desde la necesidad física
          del Problema de Valor Inicial (P.V.I) hasta la fórmula iterativa final.
        </p>
      </div>

      {/* Storyline: 3 Acts with High Contrast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Acto 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-extrabold text-xs flex items-center justify-center border border-indigo-300 dark:border-indigo-800">
                1
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                El Problema (P.V.I)
              </span>
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white text-base mb-2">
              ¿Qué tenemos y qué buscamos?
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              Conocemos cómo varía la función (su derivada o pendiente <MathInline math="y' = f(x, y)" />) y sabemos de qué punto arrancamos exactamente (<MathInline math="y(x_0) = y_0" />).
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-center shadow-2xs">
              <MathBlock math="y' = f(x, y) \quad \text{con} \quad y(x_0) = y_0" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Footprints className="w-3.5 h-3.5 text-indigo-600" />
            <span>Punto de partida conocido</span>
          </div>
        </div>

        {/* Acto 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-extrabold text-xs flex items-center justify-center border border-indigo-300 dark:border-indigo-800">
                2
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                La Idea de Euler
              </span>
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white text-base mb-2">
              El atajo de la recta tangente
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              Como no conocemos toda la curva, trazamos la recta tangente en el punto actual y caminamos sobre ella una distancia horizontal corta <MathInline math="h" />.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-center shadow-2xs">
              <MathBlock math="x_{n+1} = x_n + h" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Avanzamos un pasito &quot;h&quot;</span>
          </div>
        </div>

        {/* Acto 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                3
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                La Fórmula
              </span>
            </div>
            <h3 className="font-bold text-slate-950 dark:text-white text-base mb-2">
              La Ordenada Genérica
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              El nuevo valor de <MathInline math="y" /> es simplemente el anterior más el avance vertical: paso multiplicado por la pendiente calculada.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 text-center font-bold shadow-2xs">
              <MathBlock math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>¡Fórmula lista para iterar!</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Formula Box */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-indigo-900/50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Fórmula Principal del Método
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              Anatomía de la Fórmula de Euler
            </h3>
            <p className="text-slate-200 text-sm max-w-2xl mx-auto">
              Cada término tiene una interpretación geométrica y física directa:
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center shadow-inner">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
              <MathBlock math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" className="text-white" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15 text-left sm:text-center text-xs">
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="font-extrabold text-indigo-300 text-sm block mb-1">
                  <MathInline math="y_{n+1}" />
                </span>
                <span className="text-white font-bold block">Próxima altura</span>
                <span className="text-slate-300 text-[11px]">Dónde voy a estar en el próximo paso</span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="font-extrabold text-sky-300 text-sm block mb-1">
                  <MathInline math="y_n" />
                </span>
                <span className="text-white font-bold block">Altura actual</span>
                <span className="text-slate-300 text-[11px]">Donde estoy parado ahora mismo</span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="font-extrabold text-emerald-300 text-sm block mb-1">
                  <MathInline math="h" />
                </span>
                <span className="text-white font-bold block">Tamaño del paso</span>
                <span className="text-slate-300 text-[11px]">Cuánto avanzo horizontalmente (<MathInline math="\Delta x" />)</span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="font-extrabold text-amber-300 text-sm block mb-1">
                  <MathInline math="f(x_n, y_n)" />
                </span>
                <span className="text-white font-bold block">Inclinación (Pendiente)</span>
                <span className="text-slate-300 text-[11px]">Hacia dónde apunta la recta tangente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
              Profundización Conceptual
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Seleccione un concepto para explorar su detalle:
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveConceptTab('analogia')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeConceptTab === 'analogia'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-400'
              }`}
            >
              Analogía del GPS
            </button>
            <button
              onClick={() => setActiveConceptTab('formula')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeConceptTab === 'formula'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-400'
              }`}
            >
              Serie de Taylor
            </button>
            <button
              onClick={() => setActiveConceptTab('error')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeConceptTab === 'error'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-extrabold'
                  : 'text-slate-700 dark:text-slate-400'
              }`}
            >
              ¿Por qué hay Error?
            </button>
          </div>
        </div>

        {/* Tab 1: Analogía del GPS */}
        {activeConceptTab === 'analogia' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start gap-3 bg-indigo-50/80 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900">
              <Lightbulb className="w-5 h-5 text-indigo-700 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-300">
                <p className="font-extrabold text-slate-950 dark:text-white">
                  La Analogía del Conductor sin GPS:
                </p>
                <p>
                  Imaginá que estás manejando en una ruta sin mapa. Solo tenés dos datos:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1 font-medium">
                  <li>Sabés en qué kilómetro saliste: <strong>condición inicial <MathInline math="y(x_0) = y_0" /></strong>.</li>
                  <li>Mirás el volante y el velocímetro en este instante: <strong>la derivada <MathInline math="y' = f(x, y)" /></strong>.</li>
                </ol>
                <p>
                  ¿Cómo estimás dónde vas a estar dentro de 1 minuto (<MathInline math="h" />)? Suponés que durante ese minuto vas a seguir derecho sin doblar. Avanzás ese minuto en línea recta, volvés a mirar el velocímetro y corregís el rumbo. <strong>Eso es exactamente lo que hace el algoritmo iteración tras iteración.</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Serie de Taylor */}
        {activeConceptTab === 'formula' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
              Euler proviene del desarrollo formal en <strong>Serie de Taylor</strong> truncada en el término de primer orden:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-300 dark:border-slate-700 text-center shadow-2xs">
              <MathBlock math="y(x_n + h) = y(x_n) + h \cdot y'(x_n) + \underbrace{\frac{h^2}{2!} y''(\xi)}_{\text{Término de Error descartado}}" />
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-400">
              Al quedarnos únicamente con los dos primeros términos y reemplazar <MathInline math="y'(x_n) = f(x_n, y_n)" />, obtenemos la fórmula de Euler. Los términos descartados representan el error numérico.
            </p>
          </div>
        )}

        {/* Tab 3: El Error */}
        {activeConceptTab === 'error' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-900 text-slate-900 dark:text-slate-200">
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-xs uppercase tracking-wide block mb-1">
                  1. Error Local de Truncamiento
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-300 mb-2 font-medium">
                  Es el error que se comete en <strong>un solo pasito</strong>. Es de orden <MathInline math="\mathcal{O}(h^2)" />.
                </p>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-amber-300 dark:border-amber-900 text-center shadow-2xs">
                  <MathInline math="E_{\text{local}} \approx \frac{h^2}{2} y''(\xi)" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-900 text-slate-900 dark:text-slate-200">
                <span className="font-extrabold text-indigo-900 dark:text-indigo-200 text-xs uppercase tracking-wide block mb-1">
                  2. Error Global Acumulado
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-300 mb-2 font-medium">
                  Al sumar todos los pasitos para recorrer el intervalo, el error total acumulado es de orden <MathInline math="\mathcal{O}(h)" />.
                </p>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-indigo-300 dark:border-indigo-900 text-center shadow-2xs">
                  <MathInline math="E_{\text{global}} \propto h \implies \text{Método de Orden 1}" />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium">
              💡 <strong>Regla práctica:</strong> Si reducimos el paso a la mitad (<MathInline math="h / 2" />), el error final se reduce aproximadamente a la <strong>mitad</strong>, duplicando el número de cálculos.
            </div>
          </div>
        )}
      </div>

      {/* Guide Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Siguiente sección: Demostración con un ejemplo numérico resuelto paso a paso.</span>
        </div>

        <div className="flex items-center gap-3">
          {onGoToExample && (
            <button
              onClick={onGoToExample}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
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
