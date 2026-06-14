import type { ReactNode } from 'react';

import { Card3D } from '@/components/Effects3D';
import { DownloadButton } from '@/components/StoreChrome';
import { APP_ICON_SRC } from '@/components/RasoiLogo';
import { FOOD_IMAGES, partners, rasoi, storeDesign } from '@/theme';

export function StoreContent({ children }: { children: ReactNode }) {
  return <div style={{ width: '100%' }}>{children}</div>;
}

/* ─── Screen 02 · Reference dinner pick ─── */

export function DinnerFeaturedCard({
  image,
  title,
  meta,
}: {
  image: string;
  title: string;
  meta: string;
}) {
  return (
    <Card3D variant="inner" style={{ overflow: 'hidden', padding: 0, borderRadius: 28 }}>
      <img src={image} alt="" style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '24px 28px 28px' }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: rasoi.charcoal, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 18, color: rasoi.charcoal, opacity: 0.48, marginTop: 10 }}>{meta}</div>
      </div>
    </Card3D>
  );
}

export function DinnerAlternateRow({
  items,
}: {
  items: Array<{ image: string; title: string; meta: string }>;
}) {
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 22 }}>
      {items.map((item) => (
        <Card3D key={item.title} variant="inner" style={{ flex: 1, display: 'flex', gap: 14, padding: 14, alignItems: 'center', borderRadius: 22 }}>
          <img src={item.image} alt="" style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: rasoi.charcoal }}>{item.title}</div>
            <div style={{ fontSize: 14, color: rasoi.charcoal, opacity: 0.45, marginTop: 4 }}>{item.meta}</div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}

/* ─── Screen 02 legacy ─── */

export function TonightPickHero({
  image,
  title,
  meta,
  matchPercent,
}: {
  image: string;
  title: string;
  meta: string;
  matchPercent?: number;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <Card3D variant="inner" style={{ borderRadius: 24, overflow: 'hidden', border: `2px solid rgba(255,107,53,0.25)` }}>
        <div style={{ position: 'relative' }}>
          <img src={image} alt="" style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
          {matchPercent ? (
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                fontSize: 16,
                fontWeight: 800,
                color: '#fff',
                background: rasoi.green,
                padding: '10px 18px',
                borderRadius: 999,
                boxShadow: '0 8px 24px rgba(0,168,107,0.35)',
              }}
            >
              {matchPercent}% pantry match
            </div>
          ) : null}
        </div>
        <div style={{ padding: '26px 28px 30px' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: rasoi.primary,
              background: 'rgba(255,107,53,0.1)',
              padding: '7px 14px',
              borderRadius: 999,
              marginBottom: 12,
            }}
          >
            TONIGHT'S PICK · 7:00 PM
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: rasoi.charcoal, lineHeight: 1.08 }}>{title}</div>
          <div style={{ fontSize: 18, color: rasoi.charcoal, opacity: 0.5, marginTop: 10 }}>{meta}</div>
        </div>
      </Card3D>

      <Card3D
        variant="chip"
        style={{
          position: 'absolute',
          top: 24,
          right: -8,
          width: 390,
          padding: '16px 20px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <img src={APP_ICON_SRC} alt="" width={30} height={30} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: rasoi.primary }}>Rasoi</span>
          <span style={{ fontSize: 12, color: rasoi.charcoal, opacity: 0.35, marginLeft: 'auto' }}>now</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: rasoi.charcoal }}>Tonight: {title} 🍲</div>
      </Card3D>
    </div>
  );
}

export function AlternatePicks({
  items,
}: {
  items: Array<{ image: string; title: string; meta: string }>;
}) {
  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
      {items.map((item) => (
        <Card3D key={item.title} variant="inner" style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
          <img src={item.image} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: rasoi.charcoal }}>{item.title}</div>
            <div style={{ fontSize: 13, color: rasoi.charcoal, opacity: 0.45, marginTop: 4 }}>{item.meta}</div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}

/* ─── Screen 03 · Reference pantry ─── */

export function PantryCheckerGrid({ items }: { items: Array<{ name: string; have: boolean }> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 28 }}>
      {items.map((item) => (
        <Card3D
          key={item.name}
          variant="chip"
          style={{
            padding: '20px 16px',
            border: `2px solid ${item.have ? rasoi.green : 'rgba(229,57,53,0.35)'}`,
            textAlign: 'center',
            borderRadius: 22,
            opacity: item.have ? 1 : 0.85,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: rasoi.charcoal }}>{item.name}</div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800, color: item.have ? rasoi.green : rasoi.danger }}>
            {item.have ? '✓ Have' : 'Need'}
          </div>
        </Card3D>
      ))}
    </div>
  );
}

export function BestMatchBar({
  image,
  title,
  matchPercent,
}: {
  image: string;
  title: string;
  matchPercent: number;
}) {
  return (
    <Card3D variant="inner" style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 18, borderRadius: 24 }}>
      <img src={image} alt="" style={{ width: 88, height: 88, borderRadius: 20, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: rasoi.primary, letterSpacing: '0.12em', marginBottom: 6 }}>BEST MATCHES</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: rasoi.charcoal }}>{title}</div>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#fff',
          background: rasoi.green,
          padding: '10px 16px',
          borderRadius: 999,
          boxShadow: '0 8px 20px rgba(0,168,107,0.3)',
          flexShrink: 0,
        }}
      >
        {matchPercent}% match
      </div>
    </Card3D>
  );
}

/* ─── Screen 03 legacy ─── */

export function PantryHaveGrid({ items }: { items: Array<{ name: string; have: boolean }> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
      {items.map((item) => (
        <Card3D
          key={item.name}
          variant="chip"
          style={{
            padding: '16px 10px',
            border: `2px solid ${item.have ? rasoi.green : 'rgba(26,26,46,0.1)'}`,
            fontSize: 16,
            fontWeight: 700,
            color: item.have ? rasoi.charcoal : 'rgba(26,26,46,0.35)',
            textAlign: 'center',
            opacity: item.have ? 1 : 0.7,
          }}
        >
          {item.name}
          <div style={{ color: item.have ? rasoi.green : rasoi.danger, marginTop: 6, fontSize: 14, fontWeight: 800 }}>
            {item.have ? '✓ Have' : 'Need'}
          </div>
        </Card3D>
      ))}
    </div>
  );
}

export function MatchRecipeCard({
  image,
  title,
  matchPercent,
  meta,
  featured,
}: {
  image: string;
  title: string;
  matchPercent: number;
  meta: string;
  featured?: boolean;
}) {
  const isHigh = matchPercent >= 80;
  return (
    <Card3D
      variant="inner"
      style={{
        display: 'flex',
        gap: featured ? 22 : 14,
        padding: featured ? 22 : 16,
        border: featured ? `3px solid ${rasoi.green}` : undefined,
        opacity: featured ? 1 : 0.82,
      }}
    >
      <img
        src={image}
        alt=""
        style={{
          width: featured ? 130 : 80,
          height: featured ? 130 : 80,
          borderRadius: featured ? 20 : 16,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: featured ? 14 : 12,
            fontWeight: 800,
            color: isHigh ? rasoi.green : rasoi.primary,
            background: isHigh ? 'rgba(0,168,107,0.1)' : 'rgba(255,107,53,0.1)',
            padding: '5px 12px',
            borderRadius: 999,
            marginBottom: 8,
          }}
        >
          {matchPercent}% match
        </div>
        <div style={{ fontSize: featured ? 26 : 18, fontWeight: 800, color: rasoi.charcoal }}>{title}</div>
        <div style={{ fontSize: featured ? 15 : 13, color: rasoi.charcoal, opacity: 0.5, marginTop: 4 }}>{meta}</div>
      </div>
    </Card3D>
  );
}

/* ─── Screen 04 · Swiggy number + food grid ─── */

export function CuisineStatRow() {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
      {['15 cuisines', 'All veg options', 'Regional flavours'].map((t) => (
        <span
          key={t}
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: rasoi.charcoal,
            background: 'rgba(255,107,53,0.08)',
            border: '1.5px solid rgba(255,107,53,0.18)',
            padding: '10px 18px',
            borderRadius: 999,
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function RegionRecipeGrid({
  items,
}: {
  items: Array<{ image: string; title: string; region: string }>;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {items.map((item, i) => (
        <Card3D
          key={item.title}
          variant="inner"
          style={{ overflow: 'hidden', padding: 0, gridColumn: i === 0 ? '1 / -1' : undefined }}
        >
          <img src={item.image} alt="" style={{ width: '100%', height: i === 0 ? 200 : 148, objectFit: 'cover' }} />
          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: rasoi.green, letterSpacing: '0.1em' }}>VEG</div>
            <div style={{ fontSize: i === 0 ? 24 : 18, fontWeight: 800, color: rasoi.charcoal, marginTop: 3 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: rasoi.charcoal, opacity: 0.45, marginTop: 3 }}>{item.region}</div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}

/* ─── Screen 05 · Plat partners + Zepto minimal ─── */

export function PartnerShowcase() {
  const all = [
    partners.blinkit,
    partners.zepto,
    partners.instamart,
    partners.zomato,
    partners.swiggy,
  ];

  return (
    <div>
      <Card3D variant="inner" style={{ textAlign: 'center', padding: '20px 24px', border: `2px solid rgba(255,107,53,0.15)`, fontSize: 22, fontWeight: 700, color: rasoi.charcoal, marginBottom: 22, lineHeight: 1.35 }}>
        Missing an ingredient?{' '}
        <span style={{ color: rasoi.primary }}>Order in 2 taps</span>
      </Card3D>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
        {all.slice(0, 3).map((p) => (
          <PartnerTile key={p.name} partner={p} subtitle="⚡ 10 min" />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {all.slice(3).map((p) => (
          <PartnerTile key={p.name} partner={p} subtitle="Food delivery" wide />
        ))}
      </div>
    </div>
  );
}

function PartnerTile({
  partner,
  subtitle,
  wide,
}: {
  partner: { name: string; bg: string; color: string };
  subtitle: string;
  wide?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          padding: wide ? '28px 16px' : '26px 10px 22px',
          borderRadius: storeDesign.cardRadiusSm,
          background: partner.bg,
          color: partner.color,
          fontSize: wide ? 26 : 22,
          fontWeight: 800,
          boxShadow: '0 16px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
          border: '3px solid rgba(255,255,255,0.55)',
          transform: 'translateZ(10px)',
        }}
      >
        {partner.name}
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, fontWeight: 700, color: 'rgba(26,26,46,0.45)' }}>
        {subtitle}
      </div>
    </div>
  );
}

/* ─── Screen 06 · Jamvanu notification timeline ─── */

export function NotificationShowcase() {
  const notifications = [
    { time: '8 AM', meal: 'Breakfast', recipe: 'Masala Dosa', meta: '18 min', image: FOOD_IMAGES.dosa },
    { time: '12:30 PM', meal: 'Lunch', recipe: 'Dal Tadka', meta: '25 min', image: FOOD_IMAGES.dal },
    { time: '4 PM', meal: 'Snack', recipe: 'Dhokla', meta: '15 min', image: FOOD_IMAGES.thali },
    { time: '7 PM', meal: 'Dinner', recipe: 'Paneer Butter Masala', meta: '92% match', image: FOOD_IMAGES.paneer, featured: true },
    { time: '10 PM', meal: 'Late-night', recipe: 'Maggi Masala', meta: '10 min', image: FOOD_IMAGES.pavBhaji },
  ];

  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 20,
          bottom: 20,
          width: 3,
          background: `linear-gradient(180deg, ${rasoi.primary} 0%, rgba(255,107,53,0.2) 100%)`,
          borderRadius: 999,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.map((n) => (
          <div key={n.meal} style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: -20,
                top: 22,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: n.featured ? rasoi.primary : '#fff',
                border: `3px solid ${n.featured ? rasoi.primary : 'rgba(255,107,53,0.35)'}`,
                boxShadow: n.featured ? '0 0 0 4px rgba(255,107,53,0.2)' : 'none',
              }}
            />
            <Card3D
              variant="chip"
              style={{
                padding: 12,
                border: n.featured ? `2px solid ${rasoi.primary}` : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <img src={APP_ICON_SRC} alt="" width={22} height={22} style={{ borderRadius: 6 }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: rasoi.primary }}>Rasoi</span>
                <span style={{ fontSize: 11, color: rasoi.charcoal, opacity: 0.35, marginLeft: 'auto' }}>{n.time}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src={n.image} alt="" style={{ width: 58, height: 58, borderRadius: 14, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: rasoi.charcoal, opacity: 0.4 }}>{n.meal}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: rasoi.charcoal }}>{n.recipe}</div>
                  <div style={{ fontSize: 12, color: rasoi.charcoal, opacity: 0.45 }}>{n.meta}</div>
                </div>
              </div>
            </Card3D>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Screen 07 · Zomato food spread ─── */

export function FuelKitchenSpread() {
  const plates: Array<{ image: string; x: number; y: number; w: number; h: number; rotate?: number }> = [
    { image: FOOD_IMAGES.dosa, x: 50, y: 90, w: 230, h: 168 },
    { image: FOOD_IMAGES.dal, x: 290, y: 50, w: 210, h: 155, rotate: -3 },
    { image: FOOD_IMAGES.paneer, x: 510, y: 110, w: 250, h: 175 },
    { image: FOOD_IMAGES.pavBhaji, x: 790, y: 70, w: 220, h: 160, rotate: 4 },
    { image: FOOD_IMAGES.biryani, x: 80, y: 390, w: 240, h: 170 },
    { image: FOOD_IMAGES.thali, x: 360, y: 350, w: 230, h: 165 },
    { image: FOOD_IMAGES.vadaPav, x: 620, y: 410, w: 210, h: 155 },
    { image: FOOD_IMAGES.dal, x: 860, y: 370, w: 200, h: 150, rotate: -5 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 1620,
        background: 'linear-gradient(180deg, #F8F0E4 0%, #E8D4B8 100%)',
        borderRadius: '44px 44px 0 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          width: 290,
          height: 370,
          background: 'linear-gradient(180deg, #E8C9A0 0%, #C9A06E 100%)',
          borderRadius: '12px 12px 28px 28px',
          boxShadow: '0 36px 88px rgba(0,0,0,0.25)',
          zIndex: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', height: 52, background: BAND_GRADIENT, borderRadius: '12px 12px 0 0' }} />
        <img src={APP_ICON_SRC} alt="" width={120} height={120} style={{ borderRadius: 28, marginTop: 44 }} />
        <div style={{ fontSize: 30, fontWeight: 800, color: '#3D2914', marginTop: 18, letterSpacing: '0.12em' }}>RASOI</div>
      </div>

      {plates.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.w,
            height: p.h,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 18px 44px rgba(0,0,0,0.18)',
            transform: p.rotate ? `rotate(${p.rotate}deg)` : undefined,
            border: '7px solid #fff',
            background: '#fff',
            zIndex: i % 2 === 0 ? 2 : 3,
          }}
        >
          <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
}

const BAND_GRADIENT = 'linear-gradient(180deg, #FF9933 0%, #FF6B35 100%)';

/* ─── Screen 08 · Final CTA grid ─── */

export function RecipesGridShowcase() {
  const recipes = [
    { image: FOOD_IMAGES.paneer, title: 'Paneer Butter Masala', steps: '8 steps · 30 min' },
    { image: FOOD_IMAGES.dosa, title: 'Masala Dosa', steps: '6 steps · 25 min' },
    { image: FOOD_IMAGES.dal, title: 'Dal Tadka', steps: '5 steps · 20 min' },
    { image: FOOD_IMAGES.pavBhaji, title: 'Pav Bhaji', steps: '7 steps · 35 min' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
        {recipes.map((r) => (
          <Card3D key={r.title} variant="inner" style={{ overflow: 'hidden', padding: 0 }}>
            <img src={r.image} alt="" style={{ width: '100%', height: 155, objectFit: 'cover' }} />
            <div style={{ padding: '12px 14px 16px' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: rasoi.charcoal }}>{r.title}</div>
              <div style={{ fontSize: 13, color: rasoi.charcoal, opacity: 0.45, marginTop: 3 }}>{r.steps}</div>
            </div>
          </Card3D>
        ))}
      </div>

      <Card3D variant="inner" style={{ textAlign: 'center', padding: '28px 24px', border: `2px solid rgba(255,107,53,0.15)` }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: rasoi.charcoal }}>Your everyday Indian kitchen companion</div>
        <div style={{ fontSize: 17, color: rasoi.charcoal, opacity: 0.5, marginTop: 10 }}>
          1,200+ recipes · Pantry match · Partner checkout
        </div>
        <div style={{ marginTop: 24, transform: 'translateZ(12px)' }}>
          <DownloadButton />
        </div>
      </Card3D>
    </div>
  );
}
