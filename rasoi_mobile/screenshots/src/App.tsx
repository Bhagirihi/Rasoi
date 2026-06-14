import { PreviewGallery } from '@/PreviewGallery';
import { getScreen, getScreenIdFromQuery } from '@/screens';

const PAGE_BG = 'linear-gradient(180deg, #FF9933 0%, #FF6B35 100%)';

export default function App() {
  const id = getScreenIdFromQuery();
  if (id === 'gallery') return <PreviewGallery />;
  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {getScreen(id)}
    </div>
  );
}
