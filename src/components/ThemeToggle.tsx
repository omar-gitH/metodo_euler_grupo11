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
 * Optimizado con aceleración por hardware (GPU transform translateX)
 * para evitar reflows y congelamiento durante la animación.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const isSm = size === 'sm';

  // Desplazamiento exacto con transform para rendimiento a 60/120 fps
  const translateX = isDark ? (isSm ? '34px' : '40px') : '0px';

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
        className={`group relative inline-flex items-center shrink-0 cursor-pointer rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 select-none border transition-colors duration-250 ${
          isSm ? 'w-[68px] h-[34px]' : 'w-[78px] h-[38px]'
        } ${
          isDark
            ? 'bg-slate-900 border-slate-750'
            : 'bg-slate-200/90 border-slate-300'
        }`}
      >
        {/* Thumb deslizante con aceleración por GPU (transform) y fundido cruzado bicapa suave */}
        <span
          aria-hidden="true"
          style={{
            transform: `translateX(${translateX})`,
            willChange: 'transform',
          }}
          className={`absolute top-1 left-1 rounded-full pointer-events-none transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-xs ${
            isSm ? 'w-6 h-6' : 'w-7 h-7'
          }`}
        >
          {/* Capa dorada modo claro */}
          <span
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 transition-opacity duration-250 ${
              isDark ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Capa índigo modo oscuro */}
          <span
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 transition-opacity duration-250 ${
              isDark ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </span>

        {/* Lado izquierdo: Ícono Sol */}
        <span
          className={`relative z-10 flex items-center justify-center transition-[color,transform] duration-250 ${
            isSm ? 'w-6 h-6' : 'w-7 h-7'
          } ${
            !isDark
              ? 'text-amber-950 scale-100 rotate-0'
              : 'text-slate-500 group-hover:text-slate-400 scale-90 rotate-45'
          }`}
        >
          <Sun
            className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              !isDark ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
        </span>

        {/* Lado derecho: Ícono Luna */}
        <span
          className={`relative z-10 flex items-center justify-center ml-auto transition-[color,transform] duration-250 ${
            isSm ? 'w-6 h-6' : 'w-7 h-7'
          } ${
            isDark
              ? 'text-white scale-100 rotate-0'
              : 'text-slate-400 group-hover:text-slate-600 scale-90 -rotate-12'
          }`}
        >
          <Moon
            className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              isDark ? 'stroke-[2.4] fill-indigo-100/30' : 'stroke-[1.8]'
            }`}
          />
        </span>
      </button>
    </div>
  );
};
