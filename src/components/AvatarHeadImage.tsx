import SmartImage from './SmartImage';
import { assetUrl } from '../common/assetUrl';

export default function AvatarHeadImage({
  id,
  size = 40,
  alt = 'Avatar',
  className = '',
  fit = 'cover', // ✅ neu
}: {
  id?: string;
  size?: number;
  alt?: string;
  className?: string;
  fit?: 'cover' | 'contain';
}) {
  const safe = (id?.trim() || 'default').toLowerCase();

  return (
    <div
      className={['rounded-full overflow-hidden flex-shrink-0', className].join(' ')}
      style={{ width: size, height: size }}
    >
      <SmartImage
        alt={alt}
        className={['w-full h-full', fit === 'contain' ? 'object-contain' : 'object-cover'].join(' ')}
        sizes={`${size}px`}
        width={size}
        height={size}
        avif={[
          { src: assetUrl(`media/avatars/base/${safe}-256.avif`), w: 256 },
          { src: assetUrl(`media/avatars/base/${safe}-512.avif`), w: 512 },
        ]}
        webp={[
          { src: assetUrl(`media/avatars/base/${safe}-256.webp`), w: 256 },
          { src: assetUrl(`media/avatars/base/${safe}-512.webp`), w: 512 },
        ]}
        fallback={assetUrl(`media/avatars/base/${safe}-256.webp`)}
        onErrorFallback={assetUrl(`media/avatars/base/default-256.webp`)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
