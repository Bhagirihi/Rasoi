import type { CSSProperties, ReactNode } from 'react';

import {
  Card3D,
  Float3D,
  Scene3D,
  ShadowPlane,
  Star3D,
  depth3d,
  headline3dStyle,
} from '@/components/Effects3D';
import { Headline } from '@/components/Typography';
import { CANVAS, rasoi, spacing } from '@/theme';

const SILK_BG_URL = '/silk-orange-bg.png';

export const SILK_BACKGROUND: CSSProperties = {
  backgroundImage: `url(${SILK_BG_URL})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const SILK_OVERLAY: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,180,80,0.2) 0%, transparent 60%),
    linear-gradient(180deg, rgba(255,120,40,0.1) 0%, rgba(160,60,15,0.28) 100%)
  `,
  pointerEvents: 'none',
};

export type DecorVariant =
  | 'hero'
  | 'dinner'
  | 'pantry'
  | 'recipes'
  | 'partners'
  | 'notifications'
  | 'final';

export function DecorLayer({ variant }: { variant: DecorVariant }) {
  const layouts: Record<DecorVariant, ReactNode> = {
    hero: (
      <>
        <Float3D src="/decor-leaves-3d.png" width={150} depth={70} style={{ top: 400, left: 10, transform: 'rotate(-14deg) translateZ(70px)' }} />
        <Float3D src="/decor-kadai-3d.png" width={120} depth={80} style={{ top: 360, right: 14, transform: 'rotate(10deg) translateZ(80px)' }} />
        <Float3D src="/decor-spices-3d.png" width={140} depth={55} style={{ bottom: 60, right: 8 }} />
        <Star3D style={{ bottom: 140, left: 24 }} />
        <Float3D src="/decor-leaves-3d.png" width={95} depth={45} style={{ bottom: 100, left: 20, transform: 'rotate(22deg) scaleX(-1) translateZ(45px)', opacity: 0.9 }} />
      </>
    ),
    dinner: (
      <>
        <Float3D src="/decor-leaves-3d.png" width={130} depth={65} style={{ top: 390, left: 8, transform: 'rotate(-20deg) translateZ(65px)' }} />
        <Float3D src="/decor-spices-3d.png" width={120} depth={50} style={{ top: 440, right: 12 }} />
        <Float3D src="/decor-kadai-3d.png" width={100} depth={60} style={{ bottom: 55, left: 20, transform: 'rotate(-8deg) translateZ(60px)' }} />
        <Star3D style={{ top: 420, right: 80, transform: 'scale(0.7) translateZ(40px)' }} />
      </>
    ),
    pantry: (
      <>
        <Float3D src="/decor-spices-3d.png" width={135} depth={58} style={{ top: 400, right: 10 }} />
        <Float3D src="/decor-kadai-3d.png" width={105} depth={72} style={{ top: 370, left: 14, transform: 'rotate(16deg) translateZ(72px)' }} />
        <Float3D src="/decor-leaves-3d.png" width={110} depth={48} style={{ bottom: 75, left: 12 }} />
      </>
    ),
    recipes: (
      <>
        <Float3D src="/decor-leaves-3d.png" width={140} depth={62} style={{ top: 385, right: 8, transform: 'rotate(18deg) translateZ(62px)' }} />
        <Float3D src="/decor-spices-3d.png" width={125} depth={52} style={{ bottom: 70, left: 10 }} />
        <Star3D style={{ top: 410, left: 70, transform: 'scale(0.75) translateZ(45px)' }} />
      </>
    ),
    partners: (
      <>
        <Float3D src="/decor-kadai-3d.png" width={115} depth={68} style={{ top: 390, right: 14, transform: 'rotate(-12deg) translateZ(68px)' }} />
        <Float3D src="/decor-spices-3d.png" width={130} depth={54} style={{ bottom: 60, right: 16 }} />
        <Star3D style={{ bottom: 130, left: 40 }} />
      </>
    ),
    notifications: (
      <>
        <Float3D src="/decor-leaves-3d.png" width={125} depth={60} style={{ top: 395, left: 10 }} />
        <Float3D src="/decor-spices-3d.png" width={110} depth={48} style={{ bottom: 80, right: 14 }} />
      </>
    ),
    final: (
      <>
        <Float3D src="/decor-leaves-3d.png" width={135} depth={64} style={{ top: 380, right: 12, transform: 'rotate(-10deg) translateZ(64px)' }} />
        <Float3D src="/decor-kadai-3d.png" width={108} depth={70} style={{ bottom: 65, right: 18, transform: 'rotate(12deg) translateZ(70px)' }} />
        <Float3D src="/decor-spices-3d.png" width={118} depth={50} style={{ bottom: 95, left: 14 }} />
        <Star3D style={{ top: 400, left: 60, transform: 'scale(0.8) translateZ(42px)' }} />
      </>
    ),
  };

  return <>{layouts[variant]}</>;
}

export function PremiumCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <Card3D variant="hero" lift style={{ height: '100%', overflow: 'hidden', ...style }}>
      {children}
    </Card3D>
  );
}

type PremiumFrameProps = {
  headline: ReactNode;
  tagline?: ReactNode;
  children: ReactNode;
  decor: DecorVariant;
};

export function PremiumFrame({ headline, tagline, children, decor }: PremiumFrameProps) {
  return (
    <div
      id="screenshot-canvas"
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...SILK_BACKGROUND,
      }}
    >
      <div style={SILK_OVERLAY} />

      <Scene3D style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        <DecorLayer variant={decor} />

        {/* Headline */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            padding: `118px ${spacing.screenX}px 0`,
            textAlign: 'center',
            transform: 'translateZ(30px)',
          }}
        >
          <Headline band style={headline3dStyle}>{headline}</Headline>
          {tagline ? (
            <p
              style={{
                margin: '12px auto 0',
                fontSize: 30,
                fontWeight: 600,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.97)',
                maxWidth: 820,
                textShadow: '0 2px 4px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.22)',
                transform: 'translateZ(20px)',
              }}
            >
              {tagline}
            </p>
          ) : null}
        </div>

        {/* Floating card zone */}
        <div
          style={{
            position: 'absolute',
            top: 410,
            left: 32,
            right: 32,
            bottom: 36,
            zIndex: 4,
            transformStyle: 'preserve-3d',
          }}
        >
          <ShadowPlane
            style={{
              left: '8%',
              right: '8%',
              height: 80,
              bottom: -20,
              transform: 'translateZ(-20px)',
            }}
          />
          <PremiumCard style={{ padding: '28px 32px 32px' }}>{children}</PremiumCard>
        </div>
      </Scene3D>
    </div>
  );
}

export function AccentPill({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.12em',
        color: rasoi.primary,
        background: 'linear-gradient(180deg, rgba(255,107,53,0.14) 0%, rgba(255,107,53,0.08) 100%)',
        padding: '7px 14px',
        borderRadius: 999,
        marginBottom: 12,
        boxShadow: depth3d.shadowSoft,
        transform: 'translateZ(6px)',
      }}
    >
      {children}
    </span>
  );
}

export { Float3D as Decor3DImage };
