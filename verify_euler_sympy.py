import math
import sympy as sp

def run_euler_simulation():
    print("=" * 80)
    print("1 & 2. EVALUACIÓN NUMÉRICA (MÉTODO DE EULER) Y COMPARACIÓN CON SOLUCIÓN ANALÍTICA")
    print("EDO: y' = 2*x - 3*y + 1 | y(1) = 5 | h = 0.1 | x_final = 1.5")
    print("Solución Analítica: y(x) = (2/3)*x + 1/9 + (38/9)*exp(-3*(x - 1))")
    print("=" * 80)
    
    def f(x, y):
        return 2 * x - 3 * y + 1

    def y_exact(x):
        return (2.0 / 3.0) * x + (1.0 / 9.0) + (38.0 / 9.0) * math.exp(-3.0 * (x - 1.0))

    x0 = 1.0
    y0 = 5.0
    h = 0.1
    xf = 1.5

    x = x0
    y = y0
    n = 0

    header = f"{'n':^3} | {'x_n':^7} | {'y_n (Euler)':^12} | {'f(x_n, y_n)':^12} | {'y_exacta':^12} | {'Error Abs':^12} | {'Error Rel (%)':^12}"
    print(header)
    print("-" * len(header))

    while x <= xf + 1e-9:
        exact = y_exact(x)
        err_abs = abs(exact - y)
        err_rel = (err_abs / abs(exact)) * 100.0 if abs(exact) > 1e-12 else 0.0
        slope = f(x, y)
        
        print(f"{n:^3} | {x:^7.4f} | {y:^12.6f} | {slope:^12.6f} | {exact:^12.6f} | {err_abs:^12.6f} | {err_rel:^11.4f}%")
        
        y = y + h * slope
        x = round(x + h, 4)
        n += 1

def run_sympy_symbolic_resolution():
    print("\n" + "=" * 80)
    print("3. VERIFICACIÓN SIMBÓLICA CON SYMPY (PIPELINE DE RAZONAMIENTO PROFUNDO)")
    print("=" * 80)
    
    x = sp.Symbol('x', real=True)
    y = sp.Function('y')
    
    # EDO: y'(x) = 2*x - 3*y(x) + 1  =>  Eq(y'(x), 2*x - 3*y(x) + 1)
    ode = sp.Eq(y(x).diff(x), 2*x - 3*y(x) + 1)
    print(f"Ecuación diferencial: {ode}")
    
    # Resolver con condición inicial y(1) = 5
    sol = sp.dsolve(ode, y(x), ics={y(1): 5})
    print(f"Solución simbólica obtenida por SymPy:\n  {sol}")
    
    # Expresión teórica a comparar: y(x) = (2/3)*x + 1/9 + (38/9)*exp(-3*(x - 1))
    target_expr = sp.Rational(2, 3)*x + sp.Rational(1, 9) + sp.Rational(38, 9)*sp.exp(-3*(x - 1))
    print(f"\nExpresión objetivo propuesta:\n  y(x) = {target_expr}")
    
    # Comprobar equivalencia matemática rigurosa
    diff = sp.simplify(sol.rhs - target_expr)
    print(f"\nDiferencia simplificada: {diff}")
    is_equivalent = (diff == 0)
    print(f"¿Equivale exactamente la solución de SymPy a la expresión analítica?: {is_equivalent}")

if __name__ == '__main__':
    run_euler_simulation()
    run_sympy_symbolic_resolution()
