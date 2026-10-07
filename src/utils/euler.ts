import { compile } from 'mathjs';

export interface EulerStep {
  n: number;
  x: number;
  y: number;
  slope: number;
  nextY: number;
  yExact?: number | null;
  absError?: number | null;
  relErrorPercent?: number | null;
  stepFormulaLatex: string;
}

export interface SlopeFieldPoint {
  x: number;
  y: number;
  slope: number;
  dx: number;
  dy: number;
  angleDeg: number;
}

export interface EulerResult {
  steps: EulerStep[];
  success: boolean;
  error?: string;
  expressionSanitized: string;
  expressionLatex: string;
  totalIterations: number;
  h: number;
  x0: number;
  y0: number;
  xf: number;
}

/**
 * Normalizes math string to ensure mathjs compatibility:
 * - Replace Spanish 'sen(' with 'sin('
 * - Replace 'e^(-...)' or 'e^' with exp if needed or mathjs evaluates e^x with e as Euler constant
 * - Ensure variables 't' are accepted alongside 'x'
 */
export function sanitizeMathExpression(raw: string): string {
  let cleaned = raw.trim();
  // Replace sen( with sin(
  cleaned = cleaned.replace(/\bsen\s*\(/gi, 'sin(');
  return cleaned;
}

/**
 * Evaluates function f(x, y) with mathjs compiled expression
 */
export function createEvaluator(rawExpression: string): {
  evalFn: (xVal: number, yVal: number) => number;
  sanitized: string;
} {
  const sanitized = sanitizeMathExpression(rawExpression);
  const compiled = compile(sanitized);

  const evalFn = (xVal: number, yVal: number): number => {
    // Provide both x and t so expressions with variable t work seamlessly
    const scope = {
      x: xVal,
      t: xVal,
      y: yVal,
      e: Math.E,
      pi: Math.PI,
    };
    const res = compiled.evaluate(scope);
    if (typeof res !== 'number' || !isFinite(res)) {
      throw new Error(`El resultado de la función evaluada en (${xVal}, ${yVal}) no es un número real válido: ${res}`);
    }
    return res;
  };

  return { evalFn, sanitized };
}

/**
 * Evaluates optional analytical exact solution y(x)
 */
export function createExactEvaluator(rawExact: string): ((xVal: number) => number) | null {
  if (!rawExact || rawExact.trim() === '') return null;
  try {
    const sanitized = sanitizeMathExpression(rawExact);
    const compiled = compile(sanitized);
    return (xVal: number): number => {
      const scope = {
        x: xVal,
        t: xVal,
        e: Math.E,
        pi: Math.PI,
      };
      const res = compiled.evaluate(scope);
      return typeof res === 'number' && isFinite(res) ? res : NaN;
    };
  } catch (err) {
    console.warn('Error compiling exact solution:', err);
    return null;
  }
}

/**
 * Formats a number to a fixed decimal or exponential representation for clear display
 */
export function formatNum(val: number, precision: number = 4): string {
  if (val === 0) return '0';
  if (Math.abs(val) < 0.0001 && val !== 0) {
    return val.toExponential(precision);
  }
  // Remove unnecessary trailing zeros
  const fixed = val.toFixed(precision);
  return parseFloat(fixed).toString() === fixed ? fixed : fixed.replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Generates LaTeX string representation for f(x, y)
 */
export function exprToLatex(raw: string): string {
  let s = raw.trim();
  s = s.replace(/\*/g, ' \\cdot ');
  s = s.replace(/sen\(/g, '\\sin(');
  s = s.replace(/sin\(/g, '\\sin(');
  s = s.replace(/cos\(/g, '\\cos(');
  s = s.replace(/tan\(/g, '\\tan(');
  s = s.replace(/exp\(([^)]+)\)/g, 'e^{$1}');
  s = s.replace(/e\^([a-zA-Z0-9_-]+)/g, 'e^{$1}');
  s = s.replace(/e\^\(([^)]+)\)/g, 'e^{$1}');
  return s;
}

/**
 * Computes Euler's numerical solution
 */
export function computeEuler(params: {
  expr: string;
  x0: number;
  y0: number;
  h: number;
  xf: number;
  exactExpr?: string;
  maxIterations?: number;
}): EulerResult {
  const { expr, x0, y0, h, xf, exactExpr = '', maxIterations = 500 } = params;

  if (h <= 0) {
    return {
      steps: [],
      success: false,
      error: 'El paso h debe ser estrictamente mayor a 0.',
      expressionSanitized: expr,
      expressionLatex: exprToLatex(expr),
      totalIterations: 0,
      h,
      x0,
      y0,
      xf,
    };
  }

  if (xf <= x0) {
    return {
      steps: [],
      success: false,
      error: 'El valor final x_f debe ser mayor que el valor inicial x_0.',
      expressionSanitized: expr,
      expressionLatex: exprToLatex(expr),
      totalIterations: 0,
      h,
      x0,
      y0,
      xf,
    };
  }

  let evalFn: (xVal: number, yVal: number) => number;
  let sanitized = '';
  try {
    const res = createEvaluator(expr);
    evalFn = res.evalFn;
    sanitized = res.sanitized;
    // Test evaluation at initial point
    evalFn(x0, y0);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      steps: [],
      success: false,
      error: `Error de sintaxis en f(x,y): ${errorMsg}`,
      expressionSanitized: expr,
      expressionLatex: exprToLatex(expr),
      totalIterations: 0,
      h,
      x0,
      y0,
      xf,
    };
  }

  const exactFn = createExactEvaluator(exactExpr);
  const steps: EulerStep[] = [];

  let currentX = x0;
  let currentY = y0;
  let n = 0;

  // Use a shorter final step when h does not divide the interval exactly.
  while (currentX < xf && n < maxIterations) {
    const stepH = Math.min(h, xf - currentX);
    let slope: number;
    try {
      slope = evalFn(currentX, currentY);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        steps,
        success: false,
        error: `Error al evaluar en iteración n=${n} (x=${currentX}, y=${currentY}): ${msg}`,
        expressionSanitized: sanitized,
        expressionLatex: exprToLatex(expr),
        totalIterations: n,
        h,
        x0,
        y0,
        xf,
      };
    }

    const nextY = currentY + stepH * slope;
    const yExactVal = exactFn ? exactFn(currentX) : null;
    const absError = yExactVal !== null && !isNaN(yExactVal) ? Math.abs(yExactVal - currentY) : null;
    const relError =
      yExactVal !== null && !isNaN(yExactVal) && Math.abs(yExactVal) > 1e-12
        ? (absError! / Math.abs(yExactVal)) * 100
        : null;

    // Build clear step formula LaTeX string
    const formulaLatex = `y_{${n + 1}} = y_{${n}} + ${formatNum(stepH)} \\cdot f(x_{${n}}, y_{${n}}) = ${formatNum(
      currentY
    )} + ${formatNum(stepH)} \\cdot (${formatNum(slope)}) = ${formatNum(nextY)}`;

    steps.push({
      n,
      x: Number(currentX.toFixed(8)),
      y: currentY,
      slope,
      nextY,
      yExact: yExactVal,
      absError,
      relErrorPercent: relError,
      stepFormulaLatex: formulaLatex,
    });

    currentX = Number((currentX + stepH).toFixed(8));
    currentY = nextY;
    n++;
  }

  if (currentX < xf && n >= maxIterations) {
    return {
      steps,
      success: false,
      error: `Se alcanzó el máximo de ${maxIterations} iteraciones antes de llegar a x_f.`,
      expressionSanitized: sanitized,
      expressionLatex: exprToLatex(expr),
      totalIterations: n,
      h,
      x0,
      y0,
      xf,
    };
  }

  // Final point at xf (where slope and next step can be evaluated or finalized)
  let finalSlope = 0;
  try {
    finalSlope = evalFn(currentX, currentY);
  } catch {
    finalSlope = 0;
  }
  const finalExact = exactFn ? exactFn(currentX) : null;
  const finalAbsError = finalExact !== null && !isNaN(finalExact) ? Math.abs(finalExact - currentY) : null;
  const finalRelError =
    finalExact !== null && !isNaN(finalExact) && Math.abs(finalExact) > 1e-12
      ? (finalAbsError! / Math.abs(finalExact)) * 100
      : null;

  steps.push({
    n,
    x: Number(currentX.toFixed(8)),
    y: currentY,
    slope: finalSlope,
    nextY: currentY, // terminal reached
    yExact: finalExact,
    absError: finalAbsError,
    relErrorPercent: finalRelError,
    stepFormulaLatex: `y(${formatNum(currentX)}) \\approx ${formatNum(currentY)} \\text{ (punto final alcanzado)}`,
  });

  return {
    steps,
    success: true,
    expressionSanitized: sanitized,
    expressionLatex: exprToLatex(expr),
    totalIterations: steps.length - 1,
    h,
    x0,
    y0,
    xf,
  };
}

/**
 * Computes slope field grid vectors for the graphical visualization
 */
export function generateSlopeField(
  expr: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  gridCount: number = 10
): SlopeFieldPoint[] {
  try {
    const { evalFn } = createEvaluator(expr);
    const points: SlopeFieldPoint[] = [];

    const dxStep = (xMax - xMin) / (gridCount - 1 || 1);
    const dyStep = (yMax - yMin) / (gridCount - 1 || 1);

    for (let i = 0; i < gridCount; i++) {
      const gx = xMin + i * dxStep;
      for (let j = 0; j < gridCount; j++) {
        const gy = yMin + j * dyStep;
        try {
          const slope = evalFn(gx, gy);
          if (isFinite(slope)) {
            // Unit vector representing the slope
            const angle = Math.atan(slope);
            const length = 0.4;
            const dx = length * Math.cos(angle);
            const dy = length * Math.sin(angle);
            points.push({
              x: Number(gx.toFixed(4)),
              y: Number(gy.toFixed(4)),
              slope,
              dx,
              dy,
              angleDeg: (angle * 180) / Math.PI,
            });
          }
        } catch {
          // ignore singularities
        }
      }
    }
    return points;
  } catch {
    return [];
  }
}
