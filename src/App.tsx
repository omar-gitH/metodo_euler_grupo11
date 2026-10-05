import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HorizontalMenuBar } from './components/HorizontalMenuBar';
import { Theory } from './components/Theory';
import { PracticalExample } from './components/PracticalExample';
import { Calculator } from './components/Calculator';
import { ExercisesGuide } from './components/ExercisesGuide';
import { GuideExercise } from './data/exercises';
import { MathInline } from './components/MathView';
import {
  Terminal,
  Code2,
  GraduationCap,
} from 'lucide-react';

function AppContent() {
  const [activeSection, setActiveSection] = useState<string>('teoria');
  const [calculatorPreset, setCalculatorPreset] = useState<{
    fn: string;
    x0: number;
    y0: number;
    h: number;
    xf: number;
    exact?: string;
  } | undefined>(undefined);
  const [showTerminalGuide, setShowTerminalGuide] = useState<boolean>(false);
  const { isDark, toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-200">
      {/* Top Main Header */}
      <Navbar onNavigate={scrollTo} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-indigo-950 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="text-indigo-300">Cátedras de Modelos Numéricos y Cálculo Avanzado · UTN FRP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Método de Euler para EDOs
          </h1>

          <p className="text-slate-200 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            Plataforma didáctica para el estudio y resolución de <strong>Problemas de Valor Inicial (P.V.I)</strong>{' '}
            en Ecuaciones Diferenciales Ordinarias mediante aproximaciones por recta tangente.
          </p>

          {/* Quick formula banner */}
          <div className="pt-1">
            <div className="inline-block bg-white/10 dark:bg-slate-800/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 dark:border-slate-700 text-sm sm:text-base font-bold text-white shadow-inner">
              <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n) \quad \text{con } y(x_0) = y_0" className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Horizontal Menu Bar */}
      <HorizontalMenuBar activeSection={activeSection} onNavigate={scrollTo} />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
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

      {/* Terminal & Installation Modal */}
      {showTerminalGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-lg">
                <Terminal className="w-5 h-5" />
                <h3>Guía de Instalación y Ejecución Local</h3>
              </div>
              <button
                onClick={() => setShowTerminalGuide(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Para inicializar este proyecto en su máquina local con <strong>Vite + React + TypeScript + Tailwind CSS</strong>:
              </p>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  1. Instalación de librerías matemáticas y gráficas:
                </span>
                <div className="bg-slate-900 dark:bg-slate-950 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto select-all">
                  npm install katex @types/katex mathjs recharts lucide-react
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  2. Metodología de Integración de KaTeX en React:
                </span>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Importe la hoja de estilos en <code>src/main.tsx</code>:
                </p>
                <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  import &apos;katex/dist/katex.min.css&apos;;
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Renderice con <code>katex.renderToString(formula, &#123; throwOnError: false &#125;)</code> asegurando compatibilidad con modo claro y oscuro.
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  3. Iniciar el servidor local:
                </span>
                <div className="bg-slate-900 dark:bg-slate-950 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto select-all">
                  npm run dev
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowTerminalGuide(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-xs transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-sm">
              Método de Euler para Ecuaciones Diferenciales Ordinarias (EDO)
            </p>
            <p className="text-slate-400 mt-0.5">
              Cátedras de Modelos Numéricos y Cálculo Avanzado · UTN Facultad Regional La Plata
            </p>
          </div>

          <div className="flex items-center gap-3 text-slate-300 flex-wrap justify-center">
            <button
              onClick={toggleTheme}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              {isDark ? 'Tema Claro' : 'Tema Oscuro'}
            </button>
            <span>·</span>
            <button
              onClick={() => setShowTerminalGuide(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Comandos Terminal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
