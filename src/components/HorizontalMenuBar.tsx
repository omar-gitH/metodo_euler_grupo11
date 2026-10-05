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
    <div className="sticky top-16 z-30 w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-y border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between relative">
        {/* Left Arrow Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/90 text-white hover:bg-slate-700 transition-colors z-10 shrink-0 border border-slate-700 shadow-xs cursor-pointer mr-1"
          aria-label="Desplazar menú a la izquierda"
          title="Desplazar a la izquierda"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        {/* Scrollable Navigation Pills */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto no-scrollbar scroll-smooth py-2.5 px-1 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 whitespace-nowrap text-white"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                    : 'bg-slate-800/80 text-white hover:bg-slate-700/90 border border-slate-700/80 hover:border-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 text-white ${isActive ? 'scale-110' : ''}`} />
                <span className="text-white font-bold tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/90 text-white hover:bg-slate-700 transition-colors z-10 shrink-0 border border-slate-700 shadow-xs cursor-pointer ml-1"
          aria-label="Desplazar menú a la derecha"
          title="Desplazar a la derecha"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
