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
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8">
            <div className="surface relative overflow-hidden border-t-4 !border-t-indigo-800 dark:!border-t-indigo-400">
              {/* Banda institucional */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-9 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-slate-600 dark:text-slate-300">
                  <GraduationCap className="w-4 h-4 shrink-0 text-indigo-700 dark:text-indigo-300" />
                  <span>Universidad Tecnológica Nacional · FRLP</span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                  <span className="hidden sm:inline font-medium normal-case tracking-normal">Cátedra de Análisis Numérico</span>
                </div>
              </div>

              <div className="px-5 py-7 sm:px-9 sm:py-10 space-y-5 text-left">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-700 dark:text-indigo-300">
                  Trabajo práctico · Ecuaciones diferenciales
                </p>

                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] text-slate-900 dark:text-white max-w-4xl">
                  Método de Euler para{' '}
                  <span className="gradient-text">Ecuaciones Diferenciales Ordinarias</span>
                </h1>

                <div className="h-px w-full max-w-4xl bg-gradient-to-r from-indigo-800/60 via-slate-300 to-transparent dark:from-indigo-300/60 dark:via-slate-700" />

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  Documento técnico interactivo para el estudio y resolución de{' '}
                  <strong className="text-slate-800 dark:text-white">Problemas de Valor Inicial (P.V.I)</strong> mediante
                  aproximaciones de primer orden por recta tangente y análisis numérico de convergencia.
                </p>

                <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 border-l-4 !border-l-indigo-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-full overflow-x-auto no-scrollbar">
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Esquema iterativo</span>
                  <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n) \quad \text{con } y(x_0) = y_0" />
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

