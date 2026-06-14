import type { CSSProperties, ReactNode } from 'react';

type HeadlineProps = {
  children: ReactNode;
  band?: boolean;
  style?: CSSProperties;
};

export function Headline({ children, band, style }: HeadlineProps) {
  const lines = String(children).split('\n');
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: band ? 92 : 96,
        fontWeight: 800,
        lineHeight: 1.04,
        letterSpacing: '-2px',
        color: '#FFFFFF',
        textShadow: band ? '0 4px 32px rgba(0,0,0,0.14)' : undefined,
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block' }}>
          {line}
        </span>
      ))}
    </h1>
  );
}
