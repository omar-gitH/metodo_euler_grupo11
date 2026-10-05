# Método de Euler - Grupo 11

Aplicación web educativa para visualizar y comprender el **método de Euler**, un procedimiento numérico para aproximar soluciones de ecuaciones diferenciales ordinarias (EDO) de primer orden.

El proyecto fue desarrollado por el grupo 11 para la asignatura de Análisis Numérico. Permite explorar la teoría, resolver ejercicios y observar gráficamente cómo se construye la aproximación numérica paso a paso.

## Funcionalidades

- Calculadora interactiva del método de Euler.
- Visualización de la solución aproximada y de la solución exacta cuando está disponible.
- Gráficas para analizar el error y el comportamiento de la aproximación.
- Guía teórica y ejercicios prácticos.
- Interfaz adaptable con modo claro y oscuro.

## Tecnologías

- React y TypeScript
- Vite
- Tailwind CSS
- Recharts
- Math.js y KaTeX

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y uso

```bash
npm install
npm run dev
```

Luego abre la dirección indicada por Vite en el navegador.

Para generar una versión de producción:

```bash
npm run build
npm run preview
```

Para comprobar los tipos de TypeScript:

```bash
npm run lint
```

## Estructura principal

- `src/components/`: componentes de la interfaz y visualizaciones.
- `src/utils/euler.ts`: lógica del método de Euler.
- `src/data/exercises.ts`: ejercicios de práctica.
- `src/App.tsx`: composición principal de la aplicación.

## Integrantes

Grupo 11 - Análisis Numérico.