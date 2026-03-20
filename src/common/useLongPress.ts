// src/common/useLongPress.ts
import { useEffect, useRef } from 'react';

type LongPressHandlers = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
};

export function useLongPress(onLongPress: () => void, ms = 1200): LongPressHandlers {
  const tRef = useRef<number | null>(null);

  const clear = () => {
    if (tRef.current) {
      window.clearTimeout(tRef.current);
      tRef.current = null;
    }
  };

  const start = () => {
    if (tRef.current) return;
    tRef.current = window.setTimeout(() => {
      tRef.current = null;
      onLongPress();
    }, ms);
  };

  // Safety: wenn Komponente unmountet (Route change), Timer stoppen
  useEffect(() => clear, []);

  return {
    onPointerDown: (e) => {
      // Nur primärer Pointer (verhindert Multitouch-Quatsch)
      if (e.isPrimary === false) return;

      // iOS/Android: pointer capture -> wir bekommen sicher UP/CANCEL
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      start();
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    onContextMenu: (e) => {
      // verhindert iOS long-press menu / selection
      e.preventDefault();
      e.stopPropagation();
    },
  };
}
