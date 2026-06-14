import { NeumoFrame, NeumoSectionLabel } from '@/components/NeumoFrame';
import { BestMatchBar, PantryCheckerGrid } from '@/illustrations/StoreLayouts';
import { FOOD_IMAGES } from '@/theme';

export function PantryMatchScreen() {
  return (
    <NeumoFrame headline={'Cook From\nYour Pantry'} tagline="Turn your pantry into delicious meals" float="star-bottom">
      <NeumoSectionLabel>Pantry checker</NeumoSectionLabel>
      <PantryCheckerGrid
        items={[
          { name: 'Tamatar', have: true },
          { name: 'Pyaaz', have: true },
          { name: 'Paneer', have: true },
          { name: 'Masala', have: true },
        ]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        {[
          { name: 'Dahi', have: false },
          { name: 'Cream', have: false },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              padding: '16px',
              borderRadius: 22,
              border: '2px solid rgba(229,57,53,0.35)',
              textAlign: 'center',
              background: 'linear-gradient(180deg, #fff 0%, #FFFCFA 100%)',
              boxShadow: '0 8px 24px rgba(40,15,0,0.08)',
              opacity: 0.85,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 800, color: '#1A1A2E' }}>{item.name}</div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: '#E53935' }}>Need</div>
          </div>
        ))}
      </div>
      <BestMatchBar image={FOOD_IMAGES.paneer} title="Paneer Butter Masala" matchPercent={92} />
    </NeumoFrame>
  );
}
