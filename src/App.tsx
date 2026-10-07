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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
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
        className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
          isDarkMode
            ? 'bg-slate-950 text-slate-100 selection:bg-indigo-900 selection:text-indigo-200'
            : 'bg-[#F8F9FA] text-gray-900 selection:bg-blue-100 selection:text-blue-900'
        }`}
      >
        {/* Cabecera Principal - Documento Técnico Riguroso */}
        <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Jerarquía de Documento Alineada a la Izquierda */}
              <div className="space-y-3 text-left max-w-4xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  <GraduationCap className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>Cátedras de Modelos Numéricos y Cálculo Avanzado · UTN FRP</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Método de Euler para Ecuaciones Diferenciales Ordinarias (EDO)
                </h1>

                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Documento técnico interactivo para el estudio y resolución de <strong>Problemas de Valor Inicial (P.V.I)</strong> mediante aproximaciones de primer orden por recta tangente y análisis numérico de convergencia.
                </p>

                {/* Fórmula compacta de documento */}
                <div className="pt-1">
                  <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-lg bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-xs sm:text-sm text-gray-800 dark:text-slate-200">
                    <span className="font-mono text-gray-500 dark:text-slate-400 font-semibold text-xs">Esquema iterativo:</span>
                    <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n) \quad \text{con } y(x_0) = y_0" />
                  </div>
                </div>
              </div>

              {/* Botón Toggle Limpio y Minimalista en la esquina superior derecha */}
              <div className="flex items-center self-start md:self-auto shrink-0 pt-1">
                <button
                  onClick={() => setIsDarkMode((prev) => !prev)}
                  type="button"
                  aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 shadow-xs"
                  title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Modo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-gray-600" />
                      <span>Modo Oscuro</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navegación "Documento Técnico" - Pestañas Planas */}
        <HorizontalMenuBar activeSection={activeSection} onNavigate={scrollTo} />

        {/* Main Content Sections */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-16">
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
        <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-600 dark:text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-xs transition-colors">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-900 dark:text-white font-bold text-sm">
                Método de Euler para Ecuaciones Diferenciales Ordinarias (EDO)
              </p>
              <p className="text-gray-500 dark:text-slate-400 mt-0.5">
                Cátedras de Modelos Numéricos y Cálculo Avanzado · UTN Facultad Regional La Plata
              </p>
            </div>

            <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400 flex-wrap justify-center">
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-gray-600" />}
                <span>{isDarkMode ? 'Tema Claro' : 'Tema Oscuro'}</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

