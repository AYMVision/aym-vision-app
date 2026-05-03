import React from 'react';
import { cn } from '../common/utils';
import SectionTitle from './SectionTitle';
import Card from './Card';
import SmartImage from './SmartImage';
import { assetUrl } from '../common/assetUrl';

export type CardSectionItem = {
  title: string;
  text: string;
  imageAlt: string;
  image: {
    avif1024?: string;
    webp1024?: string;
    fallback: string;
    objectClass?: string; // z.B. "object-top" / "object-bottom"
    heightClassMobile?: string; // z.B. "h-32" / "h-70"
    heightClassDesktop?: string; // z.B. "h-32" / "h-90"
  };
};

type Props = {
  kicker: string;
  title: string;
  items: CardSectionItem[];
  // Breakpoints
  mobileOnlyClass?: string;  // default: "lg:hidden"
  desktopOnlyClass?: string; // default: "hidden lg:grid"
  desktopColsClass?: string; // e.g. "grid-cols-4" / "grid-cols-3"
  mobileMinWidthClass?: string; // e.g. "min-w-[60%]" / "min-w-[55%]"
  swipeHint?: string;
};

export default function CardSection({
  kicker,
  title,
  items,
  mobileOnlyClass = 'lg:hidden',
  desktopOnlyClass = 'hidden lg:grid',
  desktopColsClass = 'grid-cols-4',
  mobileMinWidthClass = 'min-w-[60%]',
  swipeHint,
}: Props) {
  return (
    <div className="mt-8">
      <SectionTitle kicker={kicker} title={title} />

      <div className="mt-4">
        {/* MOBILE: Swipe */}
        <div
          className={cn(
            mobileOnlyClass,
            'flex gap-4 overflow-x-auto pb-2 -mx-4 px-4',
            'snap-x snap-mandatory',
            '[&::-webkit-scrollbar]:hidden'
          )}
        >
          {items.map((it, idx) => (
            <div key={idx} className={cn(mobileMinWidthClass, 'snap-start')}>
              <Card title={it.title} text={it.text}>
                <div className="p-4 sm:p-5 bg-white">
                  <SmartImage
                    alt={it.imageAlt}
                    className={cn(
                      'w-full object-cover rounded-2xl',
                      it.image.heightClassMobile ?? 'h-32',
                      it.image.objectClass ?? 'object-cover'
                    )}
                    sizes="(max-width: 1024px) 78vw, 260px"
                    avif={it.image.avif1024 ? [{ src: assetUrl(it.image.avif1024), w: 768 }] : undefined}
                    webp={it.image.webp1024 ? [{ src: assetUrl(it.image.webp1024), w: 768 }] : undefined}
                    fallback={assetUrl(it.image.fallback)}
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* swipe hint */}
        {swipeHint ? (
          <div className={cn(mobileOnlyClass.replace('hidden', ''), 'mt-2 text-xs text-slate-500')}>
            ← {swipeHint} →
          </div>
        ) : null}

        {/* DESKTOP: Grid */}
        <div className={cn(desktopOnlyClass, desktopColsClass, 'gap-4 sm:gap-6')}>
          {items.map((it, idx) => (
            <Card key={idx} title={it.title} text={it.text}>
              <div className="p-4 sm:p-5 bg-white">
                <SmartImage
                  alt={it.imageAlt}
                  className={cn(
                    'w-full object-cover rounded-2xl',
                    it.image.heightClassDesktop ?? 'h-32',
                    it.image.objectClass ?? 'object-cover'
                  )}
                  sizes="(max-width: 1024px) 100vw, 260px"
                  avif={it.image.avif1024 ? [{ src: assetUrl(it.image.avif1024), w: 768 }] : undefined}
                  webp={it.image.webp1024 ? [{ src: assetUrl(it.image.webp1024), w: 768 }] : undefined}
                  fallback={assetUrl(it.image.fallback)}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}