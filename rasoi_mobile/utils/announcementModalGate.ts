type Listener = () => void;

let announcementModalActive = false;
const listeners = new Set<Listener>();

export function setAnnouncementModalActive(active: boolean): void {
  if (announcementModalActive === active) return;
  announcementModalActive = active;
  listeners.forEach((listener) => listener());
}

export function isAnnouncementModalActive(): boolean {
  return announcementModalActive;
}

export function subscribeAnnouncementModal(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
