import type { CSSProperties, ReactNode } from 'react';

/** Shared 3D depth tokens */
export const depth3d = {
  perspective: 1400,
  cardLift: 'rotateX(3deg) translateZ(24px)',
  cardFlat: 'translateZ(12px)',
  floatDecor: 'translateZ(60px)',
  shadowDeep: '0 60px 140px rgba(60,20,0,0.4), 0 28px 60px rgba(60,20,0,0.25), 0 10px 24px rgba(0,0,0,0.15)',
  shadowMid: '0 20px 50px rgba(40,15,0,0.18), 0 8px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.95)',
  shadowSoft: '0 12px 32px rgba(40,15,0,0.14), 0 4px 12px rgba(0,0,0,0.08)',
  neumorphHighlight: 'inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(0,0,0,0.04)',
} as const;

/** Ground shadow beneath floating elements */
export function ShadowPlane({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(40,15,0,0.45) 0%, rgba(40,15,0,0.15) 45%, transparent 72%)',
        filter: 'blur(12px)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

/** 3D scene wrapper — enables perspective for children */
export function Scene3D({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        perspective: depth3d.perspective,
        perspectiveOrigin: '50% 40%',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type Card3DProps = {
  children: ReactNode;
  style?: CSSProperties;
  /** main floating card vs nested inner card */
  variant?: 'hero' | 'inner' | 'chip';
  lift?: boolean;
};

/** Neumorphic 3D card with optional tilt */
export function Card3D({ children, style, variant = 'inner', lift = false }: Card3DProps) {
  const variants: Record<string, CSSProperties> = {
    hero: {
      background: 'linear-gradient(165deg, #FFFFFF 0%, #FFF8F2 40%, #FFF0E6 100%)',
      borderRadius: 44,
      boxShadow: `${depth3d.neumorphHighlight}, ${depth3d.shadowDeep}`,
      border: '2px solid rgba(255,255,255,0.9)',
      transform: lift ? depth3d.cardLift : depth3d.cardFlat,
      transformStyle: 'preserve-3d',
    },
    inner: {
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFCFA 100%)',
      borderRadius: 24,
      boxShadow: `${depth3d.neumorphHighlight}, ${depth3d.shadowMid}`,
      border: '1.5px solid rgba(255,255,255,0.8)',
      transform: 'translateZ(8px)',
    },
    chip: {
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 100%)',
      borderRadius: 18,
      boxShadow: depth3d.shadowSoft,
      border: '1px solid rgba(255,255,255,0.7)',
      transform: 'translateZ(4px)',
    },
  };

  return <div style={{ ...variants[variant], position: 'relative', ...style }}>{children}</div>;
}

/** 3D floating decor image */
export function Float3D({
  src,
  width,
  style,
  depth = 60,
}: {
  src: string;
  width: number;
  style?: CSSProperties;
  depth?: number;
}) {
  return (
    <img
      src={src}
      alt=""
      width={width}
      style={{
        position: 'absolute',
        zIndex: 6,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4)) drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    />
  );
}

/** 3D extruded headline text effect */
export const headline3dStyle: CSSProperties = {
  textShadow: `
    0 1px 0 rgba(255,255,255,0.3),
    0 2px 0 rgba(0,0,0,0.05),
    0 4px 8px rgba(0,0,0,0.2),
    0 8px 24px rgba(0,0,0,0.25),
    0 16px 48px rgba(60,20,0,0.2)
  `,
};

/** 3D raised button */
export const button3dStyle: CSSProperties = {
  boxShadow: `
    0 1px 0 rgba(255,255,255,0.4) inset,
    0 -2px 0 rgba(0,0,0,0.08) inset,
    0 20px 48px rgba(255,107,53,0.5),
    0 8px 20px rgba(200,60,20,0.3)
  `,
  transform: 'translateZ(16px)',
};

/** 3D app icon pedestal */
export function IconPedestal3D({ children, size = 220 }: { children: ReactNode; size?: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', transformStyle: 'preserve-3d' }}>
      <ShadowPlane
        style={{
          width: size * 0.9,
          height: size * 0.2,
          bottom: -size * 0.08,
          left: '50%',
          transform: 'translateX(-50%) translateZ(-10px)',
        }}
      />
      <div style={{ transform: 'translateZ(32px)', position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}

/** Star burst 3D SVG */
export function Star3D({ style }: { style?: CSSProperties }) {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      style={{
        position: 'absolute',
        zIndex: 6,
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))',
        transform: 'translateZ(50px)',
        ...style,
      }}
    >
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFB800" />
        </linearGradient>
      </defs>
      <polygon
        points="36,4 42,26 64,26 46,38 52,60 36,48 20,60 26,38 8,26 30,26"
        fill="url(#starGrad)"
        stroke="#E6A800"
        strokeWidth="1.5"
      />
    </svg>
  );
}
