import type { TFunction } from 'i18next';

export function tArray(t: TFunction, key: string): string[] {
  const v = t(key, { returnObjects: true }) as unknown;
  return Array.isArray(v) ? (v as string[]) : [];
}

export function tObj<T extends object>(t: TFunction, key: string): T {
  const v = t(key, { returnObjects: true }) as unknown;
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as T) : ({} as T);
}

export function tStr(t: TFunction, key: string, fallback = ''): string {
  const v = t(key) as unknown;
  return typeof v === 'string' ? v : fallback;
}
