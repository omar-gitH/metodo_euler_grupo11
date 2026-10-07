export interface GuideExercise {
  id: string;
  source: string;
  title: string;
  description: string;
  fnString: string;
  displayLatex: string;
  x0: number;
  y0: number;
  h: number;
  xf: number;
  exactFormula?: string;
  exactFormulaLatex?: string;
  notes?: string;
}

export const GUIDE_EXERCISES: GuideExercise[] = [
  {
    id: 'utn-2a',
    source: 'UTN FRP - Práctica EDO P.V.I (Ej. 2a)',
    title: 'Ejercicio 2a: EDO Lineal de 1er Orden',
    description: "Aproximar y' = -y + x + 1 en el intervalo [0, 1] con paso h = 0.1 y condición inicial y(0) = 1.",
    fnString: '-y + x + 1',
    displayLatex: "y' = -y + x + 1",
    x0: 0,
    y0: 1,
    h: 0.1,
    xf: 1.0,
    exactFormula: 'x + exp(-x)',
    exactFormulaLatex: 'y(x) = x + e^{-x}',
    notes: 'Permite contrastar la solución numérica con la analítica exacta para observar el crecimiento del error de truncamiento acumulado.',
  },
  {
    id: 'utn-2b',
    source: 'UTN FRP - Práctica EDO P.V.I (Ej. 2b - Apunte Resuelto)',
    title: 'Ejercicio 2b: Variable Temporal y Exponencial',
    description: "Aproximar y' = sen(t) + e^(-t) con paso h = 0.5, y(0) = 0 hasta t = 1.0 (resuelto en páginas 9 a 11 del apunte).",
    fnString: 'sin(x) + exp(-x)',
    displayLatex: "y' = \\sin(t) + e^{-t}",
    x0: 0,
    y0: 0,
    h: 0.5,
    xf: 1.0,
    exactFormula: '2 - cos(x) - exp(-x)',
    exactFormulaLatex: 'y(t) = 2 - \\cos(t) - e^{-t}',
    notes: 'Aparece detallado paso a paso en el apunte teórico-práctico de la cátedra con n=2 iteraciones: y₁ = 0.5 y y₂ = 1.04297.',
  },
  {
    id: 'utn-2c',
    source: 'UTN FRP - Práctica EDO P.V.I (Ej. 2c)',
    title: 'Ejercicio 2c: EDO No Lineal Cuadrática',
    description: "Aproximar y' = (x - y)^2 comenzando en x₀ = 2 con y(2) = 0.5, h = 0.25 hasta hallar y(2.75).",
    fnString: '(x - y)^2',
    displayLatex: "y' = (x - y)^2",
    x0: 2,
    y0: 0.5,
    h: 0.25,
    xf: 2.75,
    notes: 'Caso no lineal clásico donde no hay solución elemental trivial inmediata, ideal para demostrar la potencia del método numérico en 3 iteraciones.',
  },
  {
    id: 'utn-2e',
    source: 'UTN FRP - Práctica EDO P.V.I (Ej. 2e)',
    title: 'Ejercicio 2e: EDO con Disminución Exponencial',
    description: "Aproximar y' = 2x - 3y + 1 con condición y(1) = 5, h = 0.1 hasta hallar y(1.5).",
    fnString: '2*x - 3*y + 1',
    displayLatex: "y' = 2x - 3y + 1",
    x0: 1,
    y0: 5,
    h: 0.1,
    xf: 1.5,
    exactFormula: '(2/3)*x + 1/9 + (38/9)*exp(-3*(x - 1))',
    exactFormulaLatex: 'y(x) = \\frac{2}{3}x + \\frac{1}{9} + \\frac{38}{9}e^{-3(x-1)}',
    notes: 'Ecuación lineal con fuerte coeficiente disipativo (-3y), mostrando estabilidad y convergencia.',
  },
  {
    id: 'ejemplo-didactico',
    source: 'Ejemplo Clásico de Texto',
    title: 'Ejemplo Pedagógico: y\' = x + y',
    description: "Problema inicial con y' = x + y, condición y(0) = 1, h = 0.1 hasta x = 0.5.",
    fnString: 'x + y',
    displayLatex: "y' = x + y",
    x0: 0,
    y0: 1,
    h: 0.1,
    xf: 0.5,
    exactFormula: '2*exp(x) - x - 1',
    exactFormulaLatex: 'y(x) = 2e^x - x - 1',
    notes: 'El ejemplo paradigmático utilizado en la literatura para enseñar el paso a paso algebraico y geométrico.',
  },
];
