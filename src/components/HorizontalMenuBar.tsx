import React, { useRef } from 'react';
import {
  BookOpen,
  PlayCircle,
  Calculator as CalcIcon,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface HorizontalMenuBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const HorizontalMenuBar: React.FC<HorizontalMenuBarProps> = ({
  activeSection,
  onNavigate,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between relative">
        {/* Left Arrow Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0 mr-1 cursor-pointer"
          aria-label="Desplazar menú a la izquierda"
          title="Desplazar a la izquierda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Flat Tabs Navigation */}
        <nav
          ref={scrollRef}
          className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center justify-start md:justify-center gap-2 sm:gap-6 whitespace-nowrap"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group inline-flex items-center gap-2 py-3.5 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer shrink-0 -mb-[1px] ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Arrow Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0 ml-1 cursor-pointer"
          aria-label="Desplazar menú a la derecha"
          title="Desplazar a la derecha"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

