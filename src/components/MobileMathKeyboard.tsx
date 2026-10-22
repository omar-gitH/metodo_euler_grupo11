import React, { useState, useEffect, useRef } from 'react';
import { MathInline } from './MathView';
import { exprToLatex } from '../utils/euler';
import {
  X,
  Delete,
  RotateCcw,
  Check,
  Calculator,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  TextCursor,
} from 'lucide-react';

interface MobileMathKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  targetFieldTitle: string;
  value: string;
  onChange: (newValue: string) => void;
  onCalculate?: () => void;
  initialCursor?: number;
}

export const MobileMathKeyboard: React.FC<MobileMathKeyboardProps> = ({
  isOpen,
  onClose,
  targetFieldTitle,
  value,
  onChange,
  onCalculate,
  initialCursor,
}) => {
  const [cursorPos, setCursorPos] = useState<number>(() => {
    if (initialCursor !== undefined) {
      return Math.max(0, Math.min((value || '').length, initialCursor));
    }
    return (value || '').length;
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Mantener el cursor dentro de límites válidos si cambia value externamente
  useEffect(() => {
    setCursorPos((prev) => Math.max(0, Math.min((value || '').length, prev)));
  }, [value]);

  // Sincronizar selección del input nativo con la posición del cursor de la barra dinámica
  useEffect(() => {
    if (inputRef.current) {
      try {
        inputRef.current.setSelectionRange(cursorPos, cursorPos);
      } catch {
        // En algunos navegadores móviles con inputMode="none" puede ignorar silenciosamente
      }
    }
  }, [cursorPos]);

  // Al abrir el teclado, posicionar el cursor según el prop initialCursor
  useEffect(() => {
    if (isOpen) {
      if (initialCursor !== undefined) {
        setCursorPos(Math.max(0, Math.min((value || '').length, initialCursor)));
      } else {
        setCursorPos((value || '').length);
      }
    }
  }, [isOpen, initialCursor]);

  if (!isOpen) return null;

  const insert = (token: string) => {
    const curVal = value || '';
    const safePos = Math.max(0, Math.min(curVal.length, cursorPos));
    const before = curVal.slice(0, safePos);
    const after = curVal.slice(safePos);
    const nextVal = before + token + after;
    onChange(nextVal);
    const nextPos = safePos + token.length;
    setCursorPos(nextPos);
  };

  const handleDelete = () => {
    const curVal = value || '';
    if (cursorPos <= 0 || !curVal) return;

    const before = curVal.slice(0, cursorPos);
    const after = curVal.slice(cursorPos);

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
      const match = before.match(pattern);
      if (match) {
        const deleteLen = match[0].length;
        const newBefore = before.slice(0, before.length - deleteLen);
        onChange(newBefore + after);
        setCursorPos(Math.max(0, cursorPos - deleteLen));
        return;
      }
    }

    // Si no coincide con un patrón multicarácter, borrar el carácter anterior
    const newBefore = before.slice(0, -1);
    onChange(newBefore + after);
    setCursorPos(Math.max(0, cursorPos - 1));
  };

  const handleDeleteForward = () => {
    const curVal = value || '';
    if (cursorPos >= curVal.length || !curVal) return;
    const before = curVal.slice(0, cursorPos);
    const after = curVal.slice(cursorPos);
    onChange(before + after.slice(1));
  };

  const handleClear = () => {
    onChange('');
    setCursorPos(0);
  };

  const moveCursorLeft = () => setCursorPos((p) => Math.max(0, p - 1));
  const moveCursorRight = () => setCursorPos((p) => Math.min((value || '').length, p + 1));
  const moveCursorToStart = () => setCursorPos(0);
  const moveCursorToEnd = () => setCursorPos((value || '').length);

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
        className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl p-3.5 sm:p-4 space-y-2.5 pb-safe animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto custom-scrollbar"
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
                Calculadora táctil con editor dinámico de cursor
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

        {/* Visor de visualización en tiempo real con KaTeX y campo interactivo con cursor */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                inputMode="none"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  setCursorPos(e.target.selectionStart ?? e.target.value.length);
                }}
                onSelect={(e) => {
                  setCursorPos(e.currentTarget.selectionStart ?? value.length);
                }}
                onClick={(e) => {
                  setCursorPos(e.currentTarget.selectionStart ?? value.length);
                }}
                onPointerUp={(e) => {
                  setCursorPos(e.currentTarget.selectionStart ?? value.length);
                }}
                onTouchEnd={() => {
                  setTimeout(() => {
                    if (inputRef.current) {
                      setCursorPos(inputRef.current.selectionStart ?? value.length);
                    }
                  }, 40);
                }}
                onKeyUp={(e) => {
                  setCursorPos(e.currentTarget.selectionStart ?? value.length);
                }}
                placeholder="Tocá en cualquier espacio..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>

            {value.trim() && (
              <div className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 max-w-[130px] sm:max-w-[180px] overflow-x-auto no-scrollbar shadow-2xs">
                <MathInline math={exprToLatex(value)} />
              </div>
            )}
          </div>

          {/* Barra dinámica de edición de fórmula: posicionamiento milimétrico del cursor en cualquier espacio */}
          <div className="p-2 rounded-xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-200/70 dark:border-indigo-900/60 space-y-2">
            {/* Cabecera de la barra: indicador de posición activa y previsualización de inserción */}
            <div className="flex items-center justify-between gap-2 px-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-200">
                <TextCursor className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Posición de edición:</span>
                <span className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                  {cursorPos} / {value.length}
                </span>
              </div>

              {/* Contexto del cursor: qué hay a la izquierda y derecha */}
              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[170px] sm:max-w-[210px] text-right">
                {value.length === 0 ? (
                  <span className="italic text-slate-400">Inicio de fórmula</span>
                ) : (
                  <span>
                    <span className="text-slate-400">{value.slice(Math.max(0, cursorPos - 4), cursorPos)}</span>
                    <span className="inline-block w-1.5 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-xs mx-0.5 animate-pulse align-middle" />
                    <span className="text-slate-800 dark:text-slate-200">{value.slice(cursorPos, cursorPos + 4)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Deslizador continuo del cursor: deslizar con el dedo para llegar a cualquier punto */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
                Deslizar
              </span>
              <input
                type="range"
                min={0}
                max={Math.max(1, value.length)}
                value={cursorPos}
                onChange={(e) => setCursorPos(Number(e.target.value))}
                disabled={value.length === 0}
                aria-label="Deslizador de cursor para navegar dentro de la fórmula"
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Controles de paso y borrado preciso */}
            <div className="grid grid-cols-6 gap-1">
              <button
                type="button"
                onClick={moveCursorToStart}
                disabled={cursorPos === 0}
                className="flex items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-bold disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Mover al inicio"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
                <span className="text-[10px]">Inicio</span>
              </button>

              <button
                type="button"
                onClick={moveCursorLeft}
                disabled={cursorPos === 0}
                className="flex items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-bold disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Paso a la izquierda"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[10px]">Atrás</span>
              </button>

              <button
                type="button"
                onClick={moveCursorRight}
                disabled={cursorPos >= value.length}
                className="flex items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-bold disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Paso a la derecha"
              >
                <span className="text-[10px]">Adelante</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={moveCursorToEnd}
                disabled={cursorPos >= value.length}
                className="flex items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-bold disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Mover al final"
              >
                <span className="text-[10px]">Fin</span>
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleDeleteForward}
                disabled={cursorPos >= value.length}
                className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-bold disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Suprimir carácter posterior"
              >
                <span>Supr ⌦</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={cursorPos === 0}
                className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[10px] font-bold disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Borrar carácter o bloque anterior"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>⌫</span>
              </button>
            </div>
          </div>
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

