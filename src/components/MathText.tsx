import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

interface Segment {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
}

function splitMathSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: input.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({ type: 'display-math', content: token.slice(2, -2).trim() });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      segments.push({ type: 'inline-math', content: token.slice(1, -1).trim() });
    } else {
      segments.push({ type: 'text', content: token });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', content: input.slice(lastIndex) });
  }

  return segments;
}

function renderTextWithBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-green-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const segments = React.useMemo(() => splitMathSegments(text), [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{renderTextWithBold(seg.content)}</React.Fragment>;
        }
        const html = katex.renderToString(seg.content, {
          displayMode: seg.type === 'display-math',
          throwOnError: false,
          strict: false,
        });
        if (seg.type === 'display-math') {
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};

interface DisplayFormulaProps {
  latex: string;
  className?: string;
}

export const DisplayFormula: React.FC<DisplayFormulaProps> = ({ latex, className = '' }) => {
  const html = React.useMemo(
    () =>
      katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      }),
    [latex]
  );

  return (
    <div
      className={`overflow-x-auto py-1 text-green-950 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const InlineFormula: React.FC<DisplayFormulaProps> = ({ latex, className = '' }) => {
  const html = React.useMemo(
    () =>
      katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      }),
    [latex]
  );

  return (
    <span
      className={`inline-block align-baseline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
