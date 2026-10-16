import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Toggle pill de visualización (modo claro / modo oscuro)
 * Inspirado en diseño de pastilla con resplandor cálido (sol) y nocturno (luna).
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        onClick={onToggle}
        title={
          isDark
            ? 'Visualización actual: Modo Oscuro (clic para Modo Claro)'
            : 'Visualización actual: Modo Claro (clic para Modo Oscuro)'
        }
        className={`group relative inline-flex items-center shrink-0 cursor-pointer rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 select-none border ${
          isSm ? 'w-[68px] h-[34px]' : 'w-[78px] h-[38px]'
        } ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
            : 'bg-white border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)]'
        }`}
      >
        {/* Thumb circular deslizante con halo / resplandor */}
        <span
          aria-hidden="true"
          className={`absolute top-1 rounded-full transition-all duration-300 ease-out pointer-events-none ${
            isSm ? 'w-6 h-6' : 'w-7 h-7'
          } ${
            isDark
              ? `${isSm ? 'left-[36px]' : 'left-[42px]'} bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_0_14px_rgba(99,102,241,0.65)]`
              : 'left-1 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-[0_0_14px_rgba(251,191,36,0.7)]'
          }`}
        />

        {/* Lado izquierdo: Ícono Sol */}
        <span
          className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${
            isSm ? 'w-6 h-6' : 'w-7 h-7'
          } ${
            !isDark
              ? 'text-amber-950 font-bold'
              : 'text-slate-400 group-hover:text-slate-300'
          }`}
        >
          <Sun
            className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              !isDark ? 'stroke-[2.4]' : 'stroke-[1.8]'
            }`}
          />
        </span>

        {/* Lado derecho: Ícono Luna */}
        <span
          className={`relative z-10 flex items-center justify-center transition-colors duration-200 ml-auto ${
            isSm ? 'w-6 h-6' : 'w-7 h-7'
          } ${
            isDark
              ? 'text-white'
              : 'text-slate-500 group-hover:text-slate-700'
          }`}
        >
          <Moon
            className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              isDark ? 'stroke-[2.2] fill-indigo-100/20' : 'stroke-[1.8]'
            }`}
          />
        </span>
      </button>
    </div>
  );
};
