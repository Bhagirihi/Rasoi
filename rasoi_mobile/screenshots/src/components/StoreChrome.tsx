import { button3dStyle } from '@/components/Effects3D';
import { rasoi } from '@/theme';

/** Star rating + social proof — used on hero & closing frame */
export function TrustRow({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isLight = variant === 'light';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 28, letterSpacing: 2, color: '#FFB800', textShadow: '0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(255,184,0,0.4)' }}>★★★★★</span>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: isLight ? 'rgba(26,26,46,0.55)' : 'rgba(255,255,255,0.75)',
          }}
        >
          Loved by home cooks
        </span>
      </div>
      <span
        style={{
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: isLight ? rasoi.green : '#7DFFB2',
          background: isLight ? 'rgba(0,168,107,0.1)' : 'rgba(0,168,107,0.22)',
          padding: '8px 16px',
          borderRadius: 999,
          boxShadow: '0 6px 16px rgba(0,168,107,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
          transform: 'translateZ(8px)',
        }}
      >
        FREE TO DOWNLOAD
      </span>
    </div>
  );
}

/** App Store–style install button mockup */
export function DownloadButton({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  const isLg = size === 'lg';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: isLg ? '22px 56px' : '16px 40px',
        borderRadius: 999,
        background: `linear-gradient(180deg, ${rasoi.saffron} 0%, ${rasoi.primary} 55%, #E85A20 100%)`,
        ...button3dStyle,
        border: '2px solid rgba(255,255,255,0.3)',
      }}
    >
      <span style={{ fontSize: isLg ? 32 : 24, fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>
        Download Free
      </span>
      <span style={{ fontSize: isLg ? 28 : 22 }}>→</span>
    </div>
  );
}

/** Section label on orange content screens */
export function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: '0.16em',
        marginBottom: 14,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}

/** Frosted stat pill on orange backgrounds */
export function StatChip({ children }: { children: string }) {
  return (
    <span
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
        background: 'rgba(255,255,255,0.14)',
        border: '1.5px solid rgba(255,255,255,0.28)',
        padding: '10px 20px',
        borderRadius: 999,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        transform: 'translateZ(6px)',
      }}
    >
      {children}
    </span>
  );
}
