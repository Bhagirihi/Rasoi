import type { CSSProperties, ReactNode } from 'react';

import { Card3D, Scene3D, ShadowPlane, Star3D, headline3dStyle } from '@/components/Effects3D';
import { Headline } from '@/components/Typography';
import { APP_ICON_SRC } from '@/components/RasoiLogo';
import { CANVAS, rasoi, spacing } from '@/theme';

export const ORANGE_BG: CSSProperties = {
  background: 'linear-gradient(180deg, #FF9933 0%, #FF7D42 42%, #FF6B35 100%)',
};

const CARD_TOP = 400;

/** Small 3D orange cube floater — reference style */
export function FloatCube({
  icon = 'pot',
  size = 64,
  style,
}: {
  icon?: 'pot' | 'star';
  size?: number;
  style?: CSSProperties;
}) {
  if (icon === 'star') {
    return <Star3D style={{ position: 'absolute', zIndex: 8, ...style }} />;
  }
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 8,
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: 'linear-gradient(145deg, #FFAA44 0%, #FF6B35 55%, #E85A20 100%)',
        boxShadow: `
          0 14px 32px rgba(80,30,0,0.35),
          0 4px 8px rgba(0,0,0,0.15),
          inset 0 2px 0 rgba(255,255,255,0.35),
          inset 0 -3px 6px rgba(0,0,0,0.12)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateZ(70px) rotate(-8deg)',
        ...style,
      }}
    >
      <img src={APP_ICON_SRC} alt="" width={size * 0.55} height={size * 0.55} style={{ borderRadius: size * 0.12, opacity: 0.95 }} />
    </div>
  );
}

type NeumoFrameProps = {
  headline: ReactNode;
  tagline?: ReactNode;
  children: ReactNode;
  float?: 'pot' | 'star' | 'star-bottom';
};

/** Reference neumorphic frame — clean orange + cream card */
export function NeumoFrame({ headline, tagline, children, float = 'pot' }: NeumoFrameProps) {
  const floatEl =
    float === 'pot' ? (
      <FloatCube icon="pot" size={68} style={{ top: CARD_TOP - 20, right: 28 }} />
    ) : float === 'star' ? (
      <Star3D style={{ top: CARD_TOP - 10, right: 40, transform: 'scale(0.85) translateZ(60px)' }} />
    ) : (
      <Star3D style={{ bottom: 48, left: '50%', marginLeft: -28, transform: 'scale(0.75) translateZ(50px)' }} />
    );

  return (
    <div
      id="screenshot-canvas"
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...ORANGE_BG,
      }}
    >
      <Scene3D style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'relative', zIndex: 3, padding: `124px ${spacing.screenX}px 0`, textAlign: 'center', transform: 'translateZ(28px)' }}>
          <Headline band style={headline3dStyle}>{headline}</Headline>
          {tagline ? (
            <p style={{ margin: '10px auto 0', fontSize: 30, fontWeight: 500, lineHeight: 1.35, color: 'rgba(255,255,255,0.96)', maxWidth: 800, textShadow: '0 2px 12px rgba(0,0,0,0.18)', transform: 'translateZ(18px)' }}>
              {tagline}
            </p>
          ) : null}
        </div>

        {floatEl}

        <div style={{ position: 'absolute', top: CARD_TOP, left: 40, right: 40, bottom: 44, zIndex: 4, transformStyle: 'preserve-3d' }}>
          <ShadowPlane style={{ left: '6%', right: '6%', height: 72, bottom: -16, transform: 'translateZ(-18px)' }} />
          <Card3D
            variant="hero"
            lift
            style={{
              height: '100%',
              borderRadius: 40,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F4 50%, #FFF5EE 100%)',
              padding: '32px 36px 36px',
              overflow: 'hidden',
            }}
          >
            {children}
          </Card3D>
        </div>
      </Scene3D>
    </div>
  );
}

export function NeumoSectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 800, color: rasoi.primary, letterSpacing: '0.14em', marginBottom: 14, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}
