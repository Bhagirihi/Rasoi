import { SCREENS } from '@/screens';
import { CANVAS, SCREEN_META } from '@/theme';

const PREVIEW_SCALE = 0.3;
const PREVIEW_W = CANVAS.width * PREVIEW_SCALE;
const PREVIEW_H = CANVAS.height * PREVIEW_SCALE;

function ScreenPreview({ id }: { id: keyof typeof SCREENS }) {
  const meta = SCREEN_META.find((s) => s.id === id)!;
  const Screen = SCREENS[id];

  return (
    <a
      href={`?screen=${id}`}
      style={{
        display: 'block',
        color: '#fff',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          width: PREVIEW_W,
          height: PREVIEW_H,
          overflow: 'hidden',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
        }}
      >
        <div
          style={{
            width: CANVAS.width,
            height: CANVAS.height,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <Screen />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, opacity: 0.65, fontWeight: 600 }}>{meta.title}</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, whiteSpace: 'pre-line' }}>{meta.headline}</div>
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>{meta.competitor}</div>
      </div>
    </a>
  );
}

export function PreviewGallery() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FF9933 0%, #FF6B35 100%)',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '40px 32px 64px',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <img src="/rasoi-app-icon.png" alt="" width={80} height={80} style={{ display: 'block', borderRadius: 18 }} />
        <h1 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>Rasoi App Store — 3D Premium</h1>
        <p style={{ opacity: 0.85, lineHeight: 1.6, marginTop: 8 }}>
          Silk texture · neumorphic cards · 3D decor · Perspective depth
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 32,
            marginTop: 40,
            justifyItems: 'center',
          }}
        >
          {SCREEN_META.map((screen) => (
            <ScreenPreview key={screen.id} id={screen.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
