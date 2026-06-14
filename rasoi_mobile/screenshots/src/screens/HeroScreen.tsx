import { DownloadButton, TrustRow } from '@/components/StoreChrome';
import { NeumoFrame } from '@/components/NeumoFrame';
import { APP_ICON_SRC } from '@/components/RasoiLogo';
import { rasoi } from '@/theme';

export function HeroScreen() {
  return (
    <NeumoFrame headline={'Aaj Kya\nBanaye?'} tagline="Never struggle with deciding your next meal" float="pot">
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <img
          src={APP_ICON_SRC}
          alt="Rasoi"
          width={180}
          height={180}
          style={{
            borderRadius: 42,
            boxShadow: '0 24px 56px rgba(255,107,53,0.28), 0 0 0 6px rgba(255,255,255,0.2)',
          }}
        />

        <div style={{ marginTop: 28, fontSize: 68, fontWeight: 800, letterSpacing: '0.1em', color: rasoi.charcoal }}>RASOI</div>
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', color: rasoi.primary }}>INDIAN COOKING MADE EASY</div>

        <div style={{ marginTop: 22 }}><TrustRow variant="light" /></div>

        <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['1,200+ recipes', '15 cuisines', 'Pantry match'].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: rasoi.charcoal,
                background: '#fff',
                border: '1.5px solid rgba(255,107,53,0.18)',
                padding: '8px 14px',
                borderRadius: 999,
                boxShadow: '0 4px 12px rgba(255,107,53,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 32 }}><DownloadButton /></div>
      </div>
    </NeumoFrame>
  );
}
