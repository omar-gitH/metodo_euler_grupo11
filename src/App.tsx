import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HorizontalMenuBar } from './components/HorizontalMenuBar';
import { Theory } from './components/Theory';
import { PracticalExample } from './components/PracticalExample';
import { Calculator } from './components/Calculator';
import { ExercisesGuide } from './components/ExercisesGuide';
import { GuideExercise } from './data/exercises';
import { MathInline } from './components/MathView';
import { GraduationCap, Sun, Moon } from 'lucide-react';

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
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 pb-8 sm:pb-10">
            <div className="surface px-5 py-6 sm:px-9 sm:py-9 relative overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-400/25 to-sky-300/20 blur-3xl"
              />
              <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-4 text-left max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>Cátedra de Análisis Numérico | UTN FRLP</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                    Método de Euler para{' '}
                    <span className="gradient-text">Ecuaciones Diferenciales Ordinarias</span>
                  </h1>

                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                    Documento técnico interactivo para el estudio y resolución de{' '}
                    <strong className="text-slate-800 dark:text-white">Problemas de Valor Inicial (P.V.I)</strong> mediante
                    aproximaciones de primer orden por recta tangente y análisis numérico de convergencia.
                  </p>

                  <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-full overflow-x-auto no-scrollbar">
                    <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold text-xs">Esquema iterativo:</span>
                    <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n) \quad \text{con } y(x_0) = y_0" />
                  </div>
                </div>

                <div className="relative flex items-center self-start md:self-auto shrink-0">
                  <button
                    onClick={() => setIsDarkMode((prev) => !prev)}
                    type="button"
                    aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    className="btn-soft !px-4 !py-2.5 !text-xs"
                    title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>Modo claro</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-indigo-500" />
                        <span>Modo oscuro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navegación "Documento Técnico" - Pestañas Planas */}
        <HorizontalMenuBar activeSection={activeSection} onNavigate={scrollTo} />

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

            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 flex-wrap justify-center">
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="btn-soft"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{isDarkMode ? 'Tema claro' : 'Tema oscuro'}</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

