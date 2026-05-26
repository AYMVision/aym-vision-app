// src/components/AvatarLookCircle.tsx

import AvatarStage from './AvatarStage';
import type { Equipment } from '../profile/types';

type Props = {
  avatarBaseId: string;
  equipment?: Equipment;
  size?: number;
  className?: string;
  alt?: string;
};

/**
 * 🧠 Individuelle Feinjustierung pro Avatar
 * (kannst du später weiter tunen)
 */
const OFFSET_Y: Record<string, number> = {
  kid_01: 0.42,
  kid_02: 0.42,
  kid_03: 0.42,
  kid_04: 0.42,
  kid_05: 0.42,
  kid_06: 0.42,
  kid_07: 0.42,
  kid_08: 0.42,
  kid_09: 0.42,
  kid_10: 0.42,
  kid_11: 0.42,
  kid_12: 0.42,
  kid_13: 0.42,
  kid_14: 0.42,
  kid_15: 0.42,
};

export default function AvatarLookCircle({
  avatarBaseId,
  equipment,
  size = 96,
  className = '',
  alt = 'Avatar', // 👈 Default
}: Props) {
  const stageSize = size * 1.8;
  const offsetY = OFFSET_Y[avatarBaseId] ?? 0.35;

  return (
    <div
      className={`rounded-full overflow-hidden bg-white ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt}
    >
      <div
        style={{
          width: stageSize,
          height: stageSize,
          transform: `translate(${-size * 0.9}px, ${-size * offsetY}px) scale(1.55)`,
          transformOrigin: 'top left',
        }}
      >
        <AvatarStage
          avatarBaseId={avatarBaseId}
          equipment={equipment}
          width={stageSize}
          height={stageSize}
          withBackdrop={false}
        />
      </div>
    </div>
  );
}