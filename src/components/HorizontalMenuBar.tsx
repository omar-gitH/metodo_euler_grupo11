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
    <div className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14">
          <nav
            className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
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
                  className={`inline-flex items-center gap-2 py-1.5 px-3.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer shrink-0 select-none ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
