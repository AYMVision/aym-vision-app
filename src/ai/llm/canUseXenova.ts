// src/ai/llm/canUseXenova.ts
export function canUseXenovaAuto(): boolean {
  try {
    const dm = (navigator as any).deviceMemory as number | undefined;
    const saveData = (navigator as any).connection?.saveData;

    console.log('[canUseXenovaAuto]',
      { deviceMemory: dm, saveData, ua: navigator.userAgent }
    );

    // TEMP: erzwingen, damit du Xenova wirklich siehst
    return true;
  } catch (e) {
    console.log('[canUseXenovaAuto] error', e);
    return true; // TEMP: auch bei Fehler true
  }
}



// src/ai/llm/canUseXenova.ts
// export function canUseXenovaAuto(): boolean {
//   try {
//     const dm = (navigator as any).deviceMemory as number | undefined;
//     if (typeof dm === 'number' && dm > 0 && dm < 4) return false;
// 
//     const saveData = (navigator as any).connection?.saveData;
//     if (saveData === true) return false;
// 
//     return true;
//   } catch {
//     return false;
//   }
// }