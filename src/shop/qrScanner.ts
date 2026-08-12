const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export function parseVoucherInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = trimmed.match(UUID_RE);
  if (!match) return null;

  return match[0].toLowerCase();
}

export type ScanResult = { voucherId: string } | { error: string };

type BarcodeFormat = 'qr_code' | 'aztec' | 'data_matrix' | 'pdf417';

interface BarcodeDetectorLike {
  detect(source: HTMLVideoElement | HTMLCanvasElement | ImageData): Promise<Array<{ rawValue: string }>>;
}

declare const BarcodeDetector: {
  new(options: { formats: BarcodeFormat[] }): BarcodeDetectorLike;
  getSupportedFormats?(): Promise<string[]>;
};

export async function scanFromVideo(video: HTMLVideoElement): Promise<ScanResult> {
  try {
    if (typeof BarcodeDetector !== 'undefined') {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const codes = await detector.detect(video);
      for (const code of codes) {
        const id = parseVoucherInput(code.rawValue);
        if (id) return { voucherId: id };
      }
      return { error: 'Kein QR-Code erkannt' };
    }

    const { BrowserQRCodeReader } = await import('@zxing/browser');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { error: 'Canvas nicht verfügbar' };
    ctx.drawImage(video, 0, 0);
    const reader = new BrowserQRCodeReader();
    const result = await reader.decodeFromCanvas(canvas);
    const id = parseVoucherInput(result.getText());
    if (id) return { voucherId: id };
    return { error: 'Kein gültiger Gutschein-Code' };
  } catch {
    return { error: 'QR-Scan fehlgeschlagen' };
  }
}
