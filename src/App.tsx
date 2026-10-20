import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HorizontalMenuBar } from './components/HorizontalMenuBar';
import { Theory } from './components/Theory';
import { PracticalExample } from './components/PracticalExample';
import { Calculator } from './components/Calculator';
import { ExercisesGuide } from './components/ExercisesGuide';
import { GuideExercise } from './data/exercises';
import { MathInline } from './components/MathView';
import { GraduationCap } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('euler_theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [activeSection, setActiveSection] = useState<string>('teoria');
  const [calculatorPreset, setCalculatorPreset] = useState<{
    fn: string;
    x0: number;
    y0: number;
    h: number;
    xf: number;
    exact?: string;
  } | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('euler_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const sectionIds = ['teoria', 'ejemplo-practico', 'calculadora', 'ejercicios-guia'];
    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const updateActiveSection = () => {
      const readingLine = window.innerHeight * 0.28;
      const currentSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  // Smooth scroll
  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load exercise into calculator and scroll
  const handleSelectExercise = (ex: GuideExercise) => {
    setCalculatorPreset({
      fn: ex.fnString,
      x0: ex.x0,
      y0: ex.y0,
      h: ex.h,
      xf: ex.xf,
      exact: ex.exactFormula || '',
    });
    scrollTo('calculadora');
  };

  return (
    <ThemeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div
        className={`app-bg min-h-screen flex flex-col font-sans transition-colors duration-300 ${
          isDarkMode
            ? 'text-slate-100 selection:bg-indigo-500/40 selection:text-white'
            : 'text-slate-900 selection:bg-indigo-100 selection:text-indigo-900'
        }`}
      >
        {/* Cabecera principal */}
        <header className="relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-5 sm:pb-6">
            <div className="surface relative overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm">
              {/* Línea superior con gradiente institucional sutil */}
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-700 via-indigo-500 to-sky-500 dark:from-indigo-400 dark:via-indigo-500 dark:to-sky-400" />

              {/* Banda institucional */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-900/40">
                <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-slate-600 dark:text-slate-300">
                  <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span>Universidad Tecnológica Nacional · FRLP</span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                  <span className="hidden sm:inline font-medium normal-case tracking-normal text-slate-500 dark:text-slate-400">
                    Cátedra de Análisis Numérico
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Método Numérico de 1.º Orden</span>
                </div>
              </div>

              <div className="px-5 py-7 sm:px-8 sm:py-9 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] font-bold tracking-wider uppercase">
                  <span>Trabajo práctico · Ecuaciones Diferenciales Ordinarias (EDO)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.18] text-slate-900 dark:text-white max-w-4xl tracking-tight">
                  Método de Euler para{' '}
                  <span className="text-indigo-700 dark:text-indigo-300">
                    Ecuaciones Diferenciales
                  </span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  Plataforma técnica interactiva para el estudio, resolución y análisis de convergencia de{' '}
                  <strong className="text-slate-900 dark:text-white font-semibold">Problemas de Valor Inicial (P.V.I)</strong> mediante
                  aproximaciones de primer orden por recta tangente.
                </p>

                <div className="pt-2">
                  <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 border-l-4 !border-l-indigo-600 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-full overflow-x-auto no-scrollbar shadow-2xs">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Esquema Iterativo:
                    </span>
                    <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n) \quad \text{con } y(x_0) = y_0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navegación "Documento Técnico" - Pestañas Planas con Toggle de Visualización */}
        <HorizontalMenuBar
          activeSection={activeSection}
          onNavigate={scrollTo}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        />

        {/* Main Content Sections */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-10 space-y-14 sm:space-y-20">
          {/* 1. Marco Teórico */}
          <Theory
            onGoToCalculator={() => scrollTo('calculadora')}
            onGoToExample={() => scrollTo('ejemplo-practico')}
          />

          {/* 2. Marco Práctico */}
          <PracticalExample
            onLoadExampleIntoCalculator={(params) => {
              setCalculatorPreset(params);
              scrollTo('calculadora');
            }}
          />

          {/* 3. Calculadora Resolvedora y Gráfico */}
          <Calculator initialValues={calculatorPreset} />

          {/* 4. Ejercicios de la Guía Práctica UTN */}
          <ExercisesGuide onSelectExercise={handleSelectExercise} />
        </main>

        {/* Academic Footer */}
        <footer className="border-t border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-950/40 backdrop-blur-md text-slate-600 dark:text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-xs transition-colors">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                Método de Euler para Ecuaciones Diferenciales Ordinarias (EDO)
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Cátedra de Análisis Numérico | UTN FRLP
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

