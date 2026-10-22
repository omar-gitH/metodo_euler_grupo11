/**
 * Límite máximo de iteraciones N que admite la interfaz gráfica
 * (calculadora, slider de densidad y tabla de iteraciones).
 * No modifica el algoritmo de Euler: solo se pasa como tope a computeEuler.
 */
export const MAX_ITERATIONS = 1000;

/** Devuelve la cantidad de pasos que generaría h sobre [x0, xf]. */
export const estimateIterations = (x0: number, xf: number, h: number): number =>
  h > 0 && xf > x0 ? Math.ceil((xf - x0) / h - 1e-9) : 0;
