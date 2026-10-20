import React, { useRef } from 'react';
import {
  BookOpen,
  PlayCircle,
  Calculator as CalcIcon,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface HorizontalMenuBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const HorizontalMenuBar: React.FC<HorizontalMenuBarProps> = ({
  activeSection,
  onNavigate,
  isDarkMode: propIsDark,
  onToggleTheme: propOnToggle,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const themeContext = useTheme();

  const isDark = propIsDark !== undefined ? propIsDark : themeContext.isDark;
  const toggleTheme = propOnToggle !== undefined ? propOnToggle : themeContext.toggleTheme;

  const menuItems = [
    {
      id: 'teoria',
      label: '1. Teoría (Conceptos)',
      icon: BookOpen,
    },
    {
      id: 'ejemplo-practico',
      label: '2. Ejemplo en Vivo',
      icon: PlayCircle,
    },
    {
      id: 'calculadora',
      label: '3. Calculadora & Gráfico',
      icon: CalcIcon,
    },
    {
      id: 'ejercicios-guia',
      label: '4. Guía UTN FRP',
      icon: GraduationCap,
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35)] transition-all">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-2">
          {/* Navegación con pestañas estilo pill moderno */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* Left Arrow Scroll Button */}
            <button
              onClick={() => scroll('left')}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              aria-label="Desplazar menú a la izquierda"
              title="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Tabs en contenedor suave */}
            <nav
              ref={scrollRef}
              className="flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth flex items-center justify-start md:justify-center gap-1.5 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 whitespace-nowrap"
              aria-label="Secciones del documento"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group relative inline-flex items-center gap-2 py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer shrink-0 select-none ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm shadow-slate-900/5 font-bold border border-slate-200/80 dark:border-slate-700/80'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Arrow Scroll Button */}
            <button
              onClick={() => scroll('right')}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              aria-label="Desplazar menú a la derecha"
              title="Desplazar a la derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Apartado de tipo de visualización integrado */}
          <div className="flex items-center gap-2.5 shrink-0 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
            <span className="hidden xl:inline text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
              Visualización
            </span>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
