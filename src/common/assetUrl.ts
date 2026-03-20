// src/common/assetUrl.ts
// Baut korrekte URLs für Assets aus /public
// Funktioniert mit Vite base: './' lokal, auf GitHub Pages und in Subpfaden

export function assetUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
