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
    <div className="sticky top-0 z-40 w-full py-2.5 px-3 sm:px-6 lg:px-10 pointer-events-none">
      <div className="max-w-[1440px] mx-auto pointer-events-auto">
        <div className="surface !rounded-full flex items-center gap-1 px-2 py-1.5 shadow-lg mx-auto w-full md:w-fit">
          {/* Left Arrow Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Desplazar menú a la izquierda"
            title="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Tabs */}
          <nav
            ref={scrollRef}
            className="flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth flex items-center justify-start md:justify-center gap-1 whitespace-nowrap"
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
                  className={`group inline-flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md shadow-indigo-500/30'
                      : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-200 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500'
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
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Desplazar menú a la derecha"
            title="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

};

