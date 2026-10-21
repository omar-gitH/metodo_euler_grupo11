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
  const [calculatorPreset, setCalculatorPreset] = useState<
    | {
        fn: string;
        x0: number;
        y0: number;
        h: number;
        xf: number;
        exact?: string;
      }
    | undefined
  >(undefined);

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

    let frameId: number | null = null;
    const updateActiveSection = () => {
      frameId = null;
      const readingLine = window.innerHeight * 0.28;
      const currentSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };
    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveSection);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        {/* Navegación superior fija minimalista */}
        <HorizontalMenuBar
          activeSection={activeSection}
          onNavigate={scrollTo}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        />

        {/* Cabecera principal limpia y aireada */}
        <header className="border-b border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-11">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>UTN FRLP · Análisis Numérico</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Método de Euler para{' '}
                  <span className="text-indigo-700 dark:text-indigo-400">
                    Ecuaciones Diferenciales
                  </span>
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  Resolución numérica e interpretación geométrica de Problemas de Valor Inicial (P.V.I) mediante aproximación tangencial de primer orden.
                </p>
              </div>

              <div className="shrink-0">
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 text-xs sm:text-sm">
                  <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                    Recurrencia
                  </span>
                  <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Secciones principales con espaciado generoso */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-24">
          {/* 1. Marco Teórico */}
          <Theory
            onGoToCalculator={() => scrollTo('calculadora')}
            onGoToExample={() => scrollTo('ejemplo-practico')}
          />

          {/* 2. Ejemplo Práctico */}
          <PracticalExample
            onLoadExampleIntoCalculator={(params) => {
              setCalculatorPreset(params);
              scrollTo('calculadora');
            }}
          />

          {/* 3. Calculadora y Gráfico */}
          <Calculator initialValues={calculatorPreset} />

          {/* 4. Guía de Ejercicios UTN */}
          <ExercisesGuide onSelectExercise={handleSelectExercise} />
        </main>

        {/* Pie de página sobrio */}
        <footer className="border-t border-slate-200/70 dark:border-slate-800/70 bg-white/40 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Método de Euler · Ecuaciones Diferenciales Ordinarias
            </p>
            <p>Cátedra de Análisis Numérico · UTN FRLP</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
