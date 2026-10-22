import React, { useState } from 'react';
import { MathBlock, MathInline } from './MathView';
import { EulerStepDiagram } from './EulerStepDiagram';
import {
  BookOpen,
  ArrowRight,
  ChevronDown,
  Scissors,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface TheoryProps {
  onGoToCalculator?: () => void;
  onGoToExample?: () => void;
}

export const Theory: React.FC<TheoryProps> = ({ onGoToExample }) => {
  const [isErrorAccordionOpen, setIsErrorAccordionOpen] = useState<boolean>(true);

  return (
    <section id="teoria" className="space-y-8 scroll-mt-20">
      {/* Encabezado de sección con eyebrow académico */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          <span>1. MARCO TEÓRICO Y FORMULACIÓN</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Fundamento del Método de Euler
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-3xl">
          Un método de paso simple que aproxima la solución de una ecuación diferencial avanzando paso a paso a través de rectas tangentes, ya que muchas ecuaciones de ingeniería no pueden resolverse de forma analítica exacta.
        </p>
      </div>

      {/* Tarjeta 1: Los 4 ingredientes del P.V.I + Ordenada Genérica */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Los 4 ingredientes del Problema de Valor Inicial (P.V.I)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ingrediente 1 */}
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Ecuación Diferencial (<MathInline math="y' = f(x,y)" />)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nos da la pendiente (inclinación) de la curva en cualquier punto.
              </p>
            </div>

            {/* Ingrediente 2 */}
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Condición Inicial (<MathInline math="y(x_0) = y_0" />)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El punto de partida exacto desde donde arrancamos a iterar.
              </p>
            </div>

            {/* Ingrediente 3 */}
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Dominio de Trabajo (<MathInline math="x_0 \le x \le x_f" />)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El intervalo sobre el eje <MathInline math="x" /> que queremos recorrer.
              </p>
            </div>

            {/* Ingrediente 4 */}
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Paso de avance (<MathInline math="h" />)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El salto fijo horizontal entre punto y punto (<MathInline math="x_{n+1} = x_n + h" />).
              </p>
            </div>
          </div>
        </div>

        {/* Sección de la fórmula: Ordenada Genérica */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="lg:w-5/12 space-y-2 text-center lg:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                ORDENADA GENÉRICA (Algoritmo de Paso Simple)
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 py-1">
                <div className="text-xl sm:text-2xl">
                  <MathBlock math="y_{n+1} = y_n + h \cdot y'_n" />
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  donde <MathInline math="y'_n = f(x_n, y_n)" />
                </span>
              </div>
            </div>

            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 block text-sm">
                  <MathInline math="y_{n+1}" />: Ordenada siguiente
                </span>
                <span className="text-slate-600 dark:text-slate-400 block text-[11px] leading-snug">
                  El valor aproximado que buscamos.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="font-bold text-sky-700 dark:text-sky-400 block text-sm">
                  <MathInline math="y_n" />: Ordenada actual
                </span>
                <span className="text-slate-600 dark:text-slate-400 block text-[11px] leading-snug">
                  Donde estamos parados hoy.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-sm">
                  <MathInline math="h" />: Paso horizontal
                </span>
                <span className="text-slate-600 dark:text-slate-400 block text-[11px] leading-snug">
                  Qué tan largo es el salto en <MathInline math="x" />.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-400 block text-sm">
                  <MathInline math="y'_n = f(x_n, y_n)" />: Pendiente actual
                </span>
                <span className="text-slate-600 dark:text-slate-400 block text-[11px] leading-snug">
                  Dirección en la que avanzamos.
                </span>
              </div>
            </div>
          </div>

          {/* Nota al pie explicando qué significa Paso Simple */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-300">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>¿Qué significa Paso Simple?</strong> Se llama algoritmo de un solo paso porque para calcular <MathInline math="y_{n+1}" /> solo necesitamos los datos del punto inmediatamente anterior <MathInline math="(x_n, y_n)" />.
            </span>
          </div>
        </div>
      </div>

      {/* Diagrama Interactivo del Triángulo de Paso h */}
      <EulerStepDiagram />

      {/* Análisis del Error y Origen por Serie de Taylor */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsErrorAccordionOpen((prev) => !prev)}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          aria-expanded={isErrorAccordionOpen}
        >
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/70 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Análisis del Error y Origen por Serie de Taylor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                De dónde sale la fórmula de Euler y por qué nos desviamos cuando la curva real se dobla.
              </p>
            </div>
          </div>

          <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isErrorAccordionOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        {isErrorAccordionOpen && (
          <div className="p-5 sm:p-6 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bloque 1: ¿De dónde sale la fórmula? (Recorte de Taylor) */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    ¿De dónde sale la fórmula? (Recorte de Taylor)
                  </h4>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Si desarrollamos la solución exacta mediante la <strong>Serie de Taylor de grado 2</strong> alrededor del punto actual:
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-center overflow-x-auto">
                  <MathBlock math="y_{n+1} = \underbrace{y_n + h \cdot y'_n}_{\text{Euler se queda con esto}} + \underbrace{\frac{h^2}{2!} y''_n + \dots}_{\text{Se recorta (trunca)}}" />
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  El método de Euler simplemente <strong>recorta (trunca) la serie</strong> quedándose solo con el término lineal (<MathInline math="y_n + h \cdot y'_n" />) para no tener que calcular derivadas segundas (<MathInline math="y''_n" />) ni de orden superior.
                </p>
              </div>

              {/* Bloque 2: El costo de simplificar (Error Local vs. Acumulado) */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    El costo de simplificar (Error Local vs. Acumulado)
                  </h4>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ese término <MathInline math="\frac{h^2}{2!} y''_n" /> que descartamos al recortar la serie es el <strong>Error Local</strong> de cada paso. Como la curva real se dobla (<MathInline math="y''_n \neq 0" />) y nosotros avanzamos en línea recta sobre la tangente, en cada paso nos desviamos un poquito.
                </p>

                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Compromiso práctico del paso <MathInline math="h" />:</strong> Si achicamos el paso <MathInline math="h" /> (hacemos pasos más cortitos), nos mantenemos mucho más pegados a la curva real y achicamos el error acumulado, pero a cambio tenemos que hacer <strong>más iteraciones</strong> para llegar hasta <MathInline math="x_f" />.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {onGoToExample && (
        <div className="flex justify-end">
          <button
            onClick={onGoToExample}
            className="btn-soft !text-xs font-semibold cursor-pointer"
          >
            <span>Continuar al ejemplo paso a paso</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
