import React from 'react';
import {
  BookOpen,
  PlayCircle,
  Calculator as CalcIcon,
  GraduationCap,
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
  const themeContext = useTheme();

  const isDark = propIsDark !== undefined ? propIsDark : themeContext.isDark;
  const toggleTheme = propOnToggle !== undefined ? propOnToggle : themeContext.toggleTheme;

  const menuItems = [
    { id: 'teoria', label: 'Teoría', icon: BookOpen },
    { id: 'ejemplo-practico', label: 'Ejemplo Paso a Paso', icon: PlayCircle },
    { id: 'calculadora', label: 'Calculadora y Gráfico', icon: CalcIcon },
    { id: 'ejercicios-guia', label: 'Guía UTN', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xs">
      <div aria-hidden="true" className="h-[3px] w-full bg-gradient-to-r from-indigo-800 via-indigo-600 to-sky-500 dark:from-indigo-500 dark:via-indigo-400 dark:to-sky-400" />
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-14">
          {/* Navegación por pestañas de secciones */}
          <nav
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1"
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
                  className={`inline-flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer shrink-0 select-none ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs dark:bg-indigo-600 dark:text-white shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Toggle de tema luminoso optimizado */}
          <div className="flex items-center shrink-0 pl-1 sm:pl-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
