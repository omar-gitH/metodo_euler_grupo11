import React from 'react';
import { GUIDE_EXERCISES, GuideExercise } from '../data/exercises';
import { MathBlock, MathInline } from './MathView';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

interface ExercisesGuideProps {
  onSelectExercise: (ex: GuideExercise) => void;
}

export const ExercisesGuide: React.FC<ExercisesGuideProps> = ({ onSelectExercise }) => {
  return (
    <section id="ejercicios-guia" className="space-y-6 scroll-mt-20">
      {/* Encabezado de sección con eyebrow académico */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>4. CATÁLOGO DE EJERCICIOS DE LA GUÍA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Ejercicios de la Guía Oficial (UTN FRLP)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-3xl">
          Seleccioná cualquier problema de la guía de trabajos prácticos para cargarlo automáticamente en la calculadora y analizar su curva.
        </p>
      </div>

      {/* Grilla limpia de ejercicios en cards tipo reporte técnico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {GUIDE_EXERCISES.map((ex, idx) => (
          <div
            key={ex.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col justify-between gap-4 hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                  {ex.source}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  #{idx + 1}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {ex.title}
              </h3>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center overflow-x-auto no-scrollbar">
                <MathBlock math={ex.displayLatex} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 block">Inicio</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    ({ex.x0}, {ex.y0})
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 block">Paso h</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {ex.h}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 block">Destino</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    x = {ex.xf}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectExercise(ex)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 hover:text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <span>Resolver en calculadora</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
