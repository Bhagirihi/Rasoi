import { TrustRow } from '@/components/StoreChrome';
import { Scene3D, ShadowPlane, headline3dStyle, Star3D } from '@/components/Effects3D';
import { Decor3DImage } from '@/components/PremiumDecor';
import { APP_ICON_SRC } from '@/components/RasoiLogo';
import { FuelKitchenSpread } from '@/illustrations/StoreLayouts';
import { BAND_GRADIENT, CANVAS } from '@/theme';

export function PersonalizationScreen() {
  return (
    <div
      id="screenshot-canvas"
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(180deg, #0A0A0A 0%, #121212 50%, #1A1A1A 100%)',
      }}
    >
      <div style={{ position: 'absolute', top: 60, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.22) 0%, transparent 70%)' }} />

      <Scene3D style={{ position: 'absolute', inset: 0 }}>
        <Decor3DImage src="/decor-leaves-3d.png" width={120} depth={55} style={{ top: 380, left: 16, opacity: 0.75 }} />
        <Decor3DImage src="/decor-spices-3d.png" width={110} depth={48} style={{ bottom: 90, right: 20, opacity: 0.85 }} />
        <Star3D style={{ top: 400, right: 70, transform: 'scale(0.8) translateZ(45px)' }} />

        <div style={{ padding: '118px 56px 0', textAlign: 'center', height: 900, position: 'relative', zIndex: 3, transform: 'translateZ(25px)' }}>
          <h1 style={{ margin: 0, fontSize: 96, fontWeight: 800, lineHeight: 1.04, color: '#fff', letterSpacing: '-2px', ...headline3dStyle }}>
            <span style={{ display: 'block' }}>FUEL YOUR</span>
            <span style={{ display: 'block' }}>KITCHEN</span>
          </h1>

          <div style={{ display: 'inline-block', marginTop: 36, padding: '14px 40px', background: BAND_GRADIENT, borderRadius: 10, transform: 'rotate(-1.5deg) translateZ(20px)', boxShadow: '0 20px 56px rgba(255,107,53,0.55), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={APP_ICON_SRC} alt="" width={50} height={50} style={{ borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }} />
              <span style={{ fontSize: 46, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>RASOI</span>
            </div>
          </div>

          <p style={{ margin: '24px auto 0', fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,0.88)', maxWidth: 760, lineHeight: 1.35, transform: 'translateZ(15px)' }}>
            Recipes that match your taste — made for your kitchen
          </p>
          <div style={{ marginTop: 20, transform: 'translateZ(12px)' }}><TrustRow variant="dark" /></div>
        </div>

        <div style={{ position: 'absolute', left: 32, right: 32, top: 840, bottom: 32, zIndex: 2, transformStyle: 'preserve-3d' }}>
          <ShadowPlane style={{ left: '10%', right: '10%', height: 60, bottom: -10, transform: 'translateZ(-15px)' }} />
          <div style={{ height: '100%', transform: 'rotateX(2deg) translateZ(18px)', transformStyle: 'preserve-3d' }}>
            <FuelKitchenSpread />
          </div>
        </div>
      </Scene3D>
    </div>
  );
}
