import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HorizontalMenuBar } from './components/HorizontalMenuBar';
import { Theory } from './components/Theory';
import { PracticalExample } from './components/PracticalExample';
import { Calculator } from './components/Calculator';
import { ExercisesGuide } from './components/ExercisesGuide';
import { GuideExercise } from './data/exercises';
import { MathInline } from './components/MathView';
import { GraduationCap, Sparkles } from 'lucide-react';

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

  // Bandera para silenciar el scroll-spy durante navegación programática y evitar tirones
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const sectionIds = ['teoria', 'ejemplo-practico', 'calculadora', 'ejercicios-guia'];
    let ticking = false;

    const checkActiveSection = () => {
      if (isProgrammaticScrollRef.current) {
        ticking = false;
        return;
      }

      // Línea de referencia de lectura bajo la barra de navegación fija (~140px)
      const readingLine = Math.max(120, Math.min(220, window.innerHeight * 0.25));

      // Caso especial: si se alcanzó el fondo del documento, activar la última sección
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        ticking = false;
        return;
      }

      // Buscar qué sección contiene actualmente la línea de lectura en pantalla
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= readingLine && rect.bottom > readingLine) {
            setActiveSection(id);
            ticking = false;
            return;
          }
        }
      }

      // Si nos encontramos en la cabecera antes del primer elemento
      const firstEl = document.getElementById(sectionIds[0]);
      if (firstEl && firstEl.getBoundingClientRect().top > readingLine) {
        setActiveSection(sectionIds[0]);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    checkActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    isProgrammaticScrollRef.current = true;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }

    // Reactivar el observador de scroll una vez concluida la transición
    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 700);
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

  const toggleTheme = React.useCallback(() => {
    const nextMode = !isDarkMode;

    const applyTheme = () => {
      const root = document.documentElement;
      if (nextMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setIsDarkMode(nextMode);
      try {
        localStorage.setItem('euler_theme', nextMode ? 'dark' : 'light');
      } catch {
        // Ignorar si el almacenamiento local está restringido
      }
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        applyTheme();
      });
    } else {
      applyTheme();
    }
  }, [isDarkMode]);

  return (
    <ThemeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div
        className={`min-h-screen flex flex-col font-sans transition-colors duration-200 bg-slate-50 dark:bg-[#070d18] ${
          isDarkMode
            ? 'text-slate-100 selection:bg-blue-900 selection:text-white'
            : 'text-slate-900 selection:bg-blue-100 selection:text-blue-950'
        }`}
      >
        {/* Navegación superior fija con glassmorphism */}
        <HorizontalMenuBar
          activeSection={activeSection}
          onNavigate={scrollTo}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* Cabecera principal estilo reporte técnico / dashboard universitario */}
        <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                {/* Eyebrow académico */}
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>UTN FRLP · CÁTEDRA DE ANÁLISIS NUMÉRICO</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Método de Euler para Ecuaciones Diferenciales
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Resolución numérica e interpretación geométrica de Problemas de Valor Inicial (P.V.I) mediante aproximación tangencial paso a paso de primer orden.
                </p>
              </div>

              {/* Fila de fórmula de recurrencia destacada */}
              <div className="shrink-0 self-start lg:self-center">
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs text-xs sm:text-sm">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Recurrencia
                  </span>
                  <MathInline math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" />
                </div>
              </div>
            </div>

            {/* Fila de métricas y metadatos (KPI Badges estilo dashboard universitario) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Algoritmo
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  Paso Simple (Explícito)
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Error Local
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  <MathInline math="\mathcal{O}(h^2)" />
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Error Global
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  <MathInline math="\mathcal{O}(h)" />
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Tipo
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  EDO 1er Orden
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal con márgenes responsivos y transiciones fluidas */}
        <main
          className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-14 sm:space-y-20"
          style={{ overflowAnchor: 'none' }}
        >
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

        {/* Pie de página moderno */}
        <footer className="border-t border-slate-200/70 dark:border-slate-800/70 bg-white/40 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 py-8 px-3.5 sm:px-6 lg:px-8 mt-12 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-center sm:text-left">
              Método de Euler · Ecuaciones Diferenciales Ordinarias (EDO)
            </p>
            <p className="text-center sm:text-right">
              Ingeniería en Sistemas de Información · UTN FRLP
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
