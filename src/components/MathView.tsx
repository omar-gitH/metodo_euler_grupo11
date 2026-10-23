import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Component to safely render KaTeX mathematics with high contrast academic readability.
 * Uses katex.renderToString with error handling, supporting both dark and light modes.
 */
export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-rose-600 font-mono text-xs">[LaTeX error: ${escapeHtml(math)}]</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`math-block overflow-x-auto py-2 my-1 text-center font-serif text-gray-900 dark:text-slate-100 select-all tracking-normal ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle font-serif text-gray-900 dark:text-slate-100 select-all tracking-normal ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MathBlock: React.FC<{ math: string; className?: string }> = ({ math, className }) => (
  <MathView math={math} block={true} className={className} />
);

export const MathInline: React.FC<{ math: string; className?: string }> = ({ math, className }) => (
  <MathView math={math} block={false} className={className} />
);

/**
 * Renders mixed text with KaTeX formulas enclosed in $...$ (inline) or $$...$$ (block).
 * Preserves standard text, spaces, and punctuation surrounding the math formulas.
 */
export const MathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const elements = useMemo(() => {
    if (!text) return null;

    // Matches $$...$$ (block math) or $...$ (inline math)
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      if (!part) return null;

      if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
        const math = part.slice(2, -2).trim();
        return <MathBlock key={idx} math={math} />;
      }

      if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        const math = part.slice(1, -1).trim();
        return <MathInline key={idx} math={math} />;
      }

      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  }, [text]);

  return <span className={className}>{elements}</span>;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
