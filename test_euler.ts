import { computeEuler } from './src/utils/euler.ts';

// Ejercicio 2e:
// EDO: y' = 2*x - 3*y + 1
// y(1) = 5, h = 0.1, x_f = 1.5
// Solución exacta: y(x) = (2/3)*x + 1/9 + (38/9)*exp(-3*(x - 1))

const params = {
  expr: '2*x - 3*y + 1',
  x0: 1,
  y0: 5,
  h: 0.1,
  xf: 1.5,
  exactExpr: '(2/3)*x + 1/9 + (38/9)*exp(-3*(x - 1))',
};

console.log('='.repeat(80));
console.log('PROBANDO ALGORITMO DEL MÉTODO DE EULER (src/utils/euler.ts)');
console.log(`EDO: y' = ${params.expr}`);
console.log(`Condición inicial: y(${params.x0}) = ${params.y0}`);
console.log(`Paso h: ${params.h}, x final: ${params.xf}`);
console.log(`Solución analítica exacta: ${params.exactExpr}`);
console.log('='.repeat(80));

const result = computeEuler(params);

if (!result.success) {
  console.error('Error al ejecutar Euler:', result.error);
  process.exit(1);
}

const tableData = result.steps.map((step) => ({
  'n': step.n,
  'x_n': step.x.toFixed(4),
  'y_n (Euler)': step.y.toFixed(6),
  "f(x_n, y_n)": step.slope.toFixed(6),
  'y_exacta': step.yExact !== null && step.yExact !== undefined ? step.yExact.toFixed(6) : 'N/A',
  'Error Absoluto': step.absError !== null && step.absError !== undefined ? step.absError.toFixed(6) : 'N/A',
  'Error Rel (%)': step.relErrorPercent !== null && step.relErrorPercent !== undefined ? `${step.relErrorPercent.toFixed(4)}%` : 'N/A',
}));

console.table(tableData);

console.log('\nDetalle paso a paso:');
result.steps.forEach((step) => {
  console.log(`[Paso n=${step.n}] x = ${step.x.toFixed(2)}, y = ${step.y.toFixed(6)} -> Fórmula: ${step.stepFormulaLatex}`);
});

console.log('\n✓ Ejecución completada exitosamente.');
