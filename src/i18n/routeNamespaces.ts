// src/i18n/routeNamespaces.ts
import type { I18nNamespace } from '../i18n';

export function namespacesForPath(pathname: string): I18nNamespace[] {
  const base: I18nNamespace[] = ['common', 'navigation', 'layout'];

  // Home
  if (pathname === '/') return [...base, 'welcome', 'stories'];

  // Stories
  if (pathname.startsWith('/stories')) return [...base, 'stories', 'amy', 'lexikon', 'bonus'];

  // Static pages
  if (pathname.startsWith('/about')) return [...base, 'about'];
  if (pathname.startsWith('/concept')) return [...base, 'concept'];
  if (pathname.startsWith('/privacy')) return [...base, 'about'];
  if (pathname.startsWith('/faq')) return [...base, 'about'];

  // Profile + Avatar
  if (pathname.startsWith('/profile')) return [...base, 'profile', 'themes', 'stories'];
  if (pathname.startsWith('/avatar')) return [...base, 'avatar'];

  // Album + Bonus-related
  if (pathname.startsWith('/album')) return [...base, 'album', 'bonus', 'themes', 'stories'];

  // Bonus routes
  if (pathname.startsWith('/cards')) return [...base, 'bonus'];
  if (pathname.startsWith('/diaries')) return [...base, 'bonus'];
  if (pathname.startsWith('/newspaper')) return [...base, 'bonus'];
  if (pathname.startsWith('/lexikon')) return [...base, 'lexikon'];

  // Adult + Parents/Kids
  if (pathname.startsWith('/adult-settings')) return [...base, 'adult', 'themes', 'stories'];
  if (pathname.startsWith('/parents')) return [...base, 'parents', 'adult', 'themes'];
  if (pathname.startsWith('/kids')) return [...base, 'welcome'];
  if (pathname.startsWith('/start')) return [...base, 'welcome', 'stories'];

  // Studio
  if (pathname.startsWith('/studio')) return [...base, 'studio', 'bonus'];

  // Beta
  if (pathname.startsWith('/beta')) return [...base, 'stories'];

  // Tests
  if (pathname.startsWith('/test/amy')) return [...base, 'adult'];

  // Fallback
  return [...base, 'notFound'];
}