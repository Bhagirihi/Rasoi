export type PantryNudgeWindow = 'morning' | 'afternoon' | 'evening';

/** Local device hour windows (inclusive start, exclusive end). */
export const PANTRY_NUDGE_WINDOWS: Array<{
  id: PantryNudgeWindow;
  label: string;
  startHour: number;
  endHour: number;
}> = [
  { id: 'morning', label: 'Morning', startHour: 6, endHour: 10 },
  { id: 'afternoon', label: 'Afternoon', startHour: 14, endHour: 17 },
  { id: 'evening', label: 'Evening', startHour: 20, endHour: 22 },
];

export function getActivePantryNudgeWindow(
  hour: number = new Date().getHours(),
): PantryNudgeWindow | null {
  for (const window of PANTRY_NUDGE_WINDOWS) {
    if (hour >= window.startHour && hour < window.endHour) {
      return window.id;
    }
  }
  return null;
}

export function formatDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
