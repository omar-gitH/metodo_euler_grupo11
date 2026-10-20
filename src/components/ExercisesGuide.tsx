import React from 'react';
import { GUIDE_EXERCISES, GuideExercise } from '../data/exercises';
import { MathBlock, MathInline } from './MathView';
import { GraduationCap, ArrowUpRight, BookMarked } from 'lucide-react';

interface ExercisesGuideProps {
  onSelectExercise: (ex: GuideExercise) => void;
}

export const ExercisesGuide: React.FC<ExercisesGuideProps> = ({ onSelectExercise }) => {
  return (
    <section id="ejercicios-guia" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Ejercicios Universitarios · Casos Reales de Examen</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          Ejercicios de la Guía Oficial (UTN FRP)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mt-2 text-base leading-relaxed max-w-4xl font-normal">
          Ejercicios extraídos de la práctica de{' '}
          <strong>Modelos Numéricos y Cálculo Avanzado (UTN Facultad Regional La Plata)</strong>.
          Listos para ser cargados y resueltos numéricamente con un solo clic.
        </p>
      </div>

      {/* Exercise Cards with High Contrast in Light Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDE_EXERCISES.map((ex, idx) => (
          <div
            key={ex.id}
            className="surface rounded-xl flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
          >
            <div className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-0.5 rounded-full border border-indigo-200/80 dark:border-indigo-800/80">
                  {ex.source}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  #{idx + 1}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {ex.title}
              </h3>

              <div className="my-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center overflow-x-auto no-scrollbar shadow-2xs">
                <MathBlock math={ex.displayLatex} />
              </div>

              <div className="space-y-2 text-xs text-slate-800 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Condición inicial:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    <MathInline math={`y(${ex.x0}) = ${ex.y0}`} />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Paso de cálculo (<MathInline math="h" />):</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{ex.h}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Punto final:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    <MathInline math={`y(${ex.xf})`} />
                  </span>
                </div>
                {ex.exactFormulaLatex && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Solución analítica:</span>
                    <span className="font-serif text-slate-900 dark:text-slate-200 font-semibold">
                      <MathInline math={ex.exactFormulaLatex} />
                    </span>
                  </div>
                )}
              </div>

              {ex.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed font-medium">
                  {ex.notes}
                </p>
              )}
            </div>

            <div className="p-4 pt-2 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => onSelectExercise(ex)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <span>Cargar ejercicio en la calculadora</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pedagogical Note */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 rounded-xl p-5 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-3.5 shadow-2xs">
        <div className="p-2 rounded-lg bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shrink-0">
          <BookMarked className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200 mb-1">
            Validación Académica con el Apunte del Ing. Amiconi Diego Federico
          </h4>
          <p className="leading-relaxed text-indigo-900/80 dark:text-indigo-300/90 font-medium">
            En la página 11 del apunte de la cátedra se detalla la iteración para <MathInline math="y' = \sin(t) + e^{-t}" />:
            en <MathInline math="t_1 = 0.5" /> da <MathInline math="y_1 = 0.5" />, y en <MathInline math="t_2 = 1.0" /> da{' '}
            <strong><MathInline math="y_2 = 1.04297" /></strong>. Esta aplicación replica los mismos resultados con rigor numérico absoluto.
          </p>
        </div>
      </div>
    </section>
  );
};
