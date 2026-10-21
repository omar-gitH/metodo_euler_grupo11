import React from 'react';
import { MathInline } from './MathView';
import { exprToLatex } from '../utils/euler';
import {
  X,
  Delete,
  RotateCcw,
  Check,
  Calculator,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';

interface MobileMathKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  targetFieldTitle: string;
  value: string;
  onChange: (newValue: string) => void;
  onCalculate?: () => void;
}

export const MobileMathKeyboard: React.FC<MobileMathKeyboardProps> = ({
  isOpen,
  onClose,
  targetFieldTitle,
  value,
  onChange,
  onCalculate,
}) => {
  if (!isOpen) return null;

  const insert = (token: string) => {
    onChange((value || '') + token);
  };

  const handleDelete = () => {
    if (!value) return;
    // Si termina con funciones de varias letras como "sin(", "cos(", "exp(", etc., borrar el bloque completo
    const functionPatterns = [
      /sin\($/,
      /cos\($/,
      /tan\($/,
      /log\($/,
      /exp\($/,
      /sqrt\($/,
      /x\^2$/,
      /y\^2$/,
      /\s\+\s$/,
      /\s-\s$/,
      /\s\*\s$/,
      /\s\/\s$/,
    ];

    for (const pattern of functionPatterns) {
      if (pattern.test(value)) {
        onChange(value.replace(pattern, ''));
        return;
      }
    }

    // Si no coincide con un patrón multicarácter, borrar el último carácter
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange('');
  };

  const handleDone = () => {
    onClose();
    if (onCalculate) {
      onCalculate();
    }
  };

  // Botón base para el teclado móvil
  const keyBtn =
    'flex items-center justify-center font-semibold rounded-xl text-sm transition-all active:scale-95 select-none shadow-2xs cursor-pointer py-2.5';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Calculadora matemática móvil para ingreso de variables"
    >
      <div
        className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl p-3.5 sm:p-4 space-y-2.5 pb-safe animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera y previsualización de la fórmula */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {targetFieldTitle}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Calculadora matemática táctil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Borrar todo"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Limpiar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Cerrar teclado matemático"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visor de visualización en tiempo real con KaTeX */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 min-h-[44px] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
            {value ? `${value}` : <span className="italic text-slate-400">Tocá los botones para escribir</span>}
          </div>
          {value.trim() && (
            <div className="shrink-0 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <MathInline math={exprToLatex(value)} />
            </div>
          )}
        </div>

        {/* 1. Fila de Funciones Trigonométricas y Trascendentes */}
        <div className="grid grid-cols-6 gap-1.5">
          {[
            { label: 'sen', token: 'sin(' },
            { label: 'cos', token: 'cos(' },
            { label: 'tan', token: 'tan(' },
            { label: 'ln', token: 'log(' },
            { label: 'eˣ', token: 'exp(' },
            { label: '√', token: 'sqrt(' },
          ].map((fn) => (
            <button
              key={fn.label}
              type="button"
              onClick={() => insert(fn.token)}
              className={`${keyBtn} bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-mono`}
            >
              {fn.label}
            </button>
          ))}
        </div>

        {/* 2. Fila de Variables, Potencias y Paréntesis */}
        <div className="grid grid-cols-7 gap-1.5">
          {[
            { label: 'x', token: 'x', isVar: true },
            { label: 'y', token: 'y', isVar: true },
            { label: 'x²', token: 'x^2', isVar: true },
            { label: 'y²', token: 'y^2', isVar: true },
            { label: '^', token: '^', isVar: false },
            { label: '(', token: '(', isVar: false },
            { label: ')', token: ')', isVar: false },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insert(item.token)}
              className={`${keyBtn} ${
                item.isVar
                  ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/60 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 3. Bloque Principal: Números y Operadores Aritméticos */}
        <div className="grid grid-cols-5 gap-1.5">
          {/* Fila 1 */}
          <button
            type="button"
            onClick={() => insert('7')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            7
          </button>
          <button
            type="button"
            onClick={() => insert('8')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            8
          </button>
          <button
            type="button"
            onClick={() => insert('9')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            9
          </button>
          <button
            type="button"
            onClick={() => insert(' / ')}
            className={`${keyBtn} bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono text-base`}
          >
            ÷
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={`${keyBtn} bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800`}
            aria-label="Borrar carácter"
          >
            <Delete className="w-4 h-4" />
          </button>

          {/* Fila 2 */}
          <button
            type="button"
            onClick={() => insert('4')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            4
          </button>
          <button
            type="button"
            onClick={() => insert('5')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            5
          </button>
          <button
            type="button"
            onClick={() => insert('6')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            6
          </button>
          <button
            type="button"
            onClick={() => insert(' * ')}
            className={`${keyBtn} bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono text-base`}
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => insert(' ')}
            className={`${keyBtn} bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs`}
            title="Espacio"
          >
            Espacio
          </button>

          {/* Fila 3 */}
          <button
            type="button"
            onClick={() => insert('1')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => insert('2')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => insert('3')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            3
          </button>
          <button
            type="button"
            onClick={() => insert(' - ')}
            className={`${keyBtn} bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono text-base`}
          >
            −
          </button>
          <button
            type="button"
            onClick={() => insert(' + ')}
            className={`${keyBtn} bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono text-base`}
          >
            +
          </button>

          {/* Fila 4 */}
          <button
            type="button"
            onClick={() => insert('0')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            0
          </button>
          <button
            type="button"
            onClick={() => insert('.')}
            className={`${keyBtn} bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-mono text-base`}
          >
            .
          </button>
          <button
            type="button"
            onClick={() => insert('pi')}
            className={`${keyBtn} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-sm`}
          >
            π
          </button>
          <button
            type="button"
            onClick={() => insert('e')}
            className={`${keyBtn} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-sm`}
          >
            e
          </button>
          <button
            type="button"
            onClick={handleDone}
            className={`${keyBtn} bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 text-xs`}
          >
            <Check className="w-4 h-4 mr-1" />
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

