export function canUseXenovaAuto(): boolean {
  try {
    const dm = (navigator as any).deviceMemory as number | undefined;
    if (typeof dm === 'number' && dm > 0 && dm < 4) return false;

    const saveData = (navigator as any).connection?.saveData;
    if (saveData === true) return false;

    return true;
  } catch {
    return false;
  }
}