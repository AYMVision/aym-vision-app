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
  kid_01: 0.05,
  kid_02: 0.05,
  kid_03: 0.05,
  kid_04: 0.05,
  kid_05: 0.05,
  kid_06: 0.05,
  kid_07: 0.05,
  kid_08: 0.05,
  kid_09: 0.05,
  kid_10: 0.05,
  kid_11: 0.05,
  kid_12: 0.05,
  kid_13: 0.05,
  kid_14: 0.05,
  kid_15: 0.05,
  kid_16: 0.05,
  kid_17: 0.05,
  kid_18: 0.10,
  kid_19: 0.10,
  kid_20: 0.05,
  kid_21: 0.05,
  kid_22: 0.10,
  kid_23: 0.10,
  kid_24: 0.10,
  kid_25: 0.10,
  kid_26: 0.05,
  kid_27: 0.05,
  kid_28: 0.05,
  kid_29: 0.05,
};

export default function AvatarLookCircle({
  avatarBaseId,
  equipment,
  size = 96,
  className = '',
  alt = 'Avatar', // 👈 Default
}: Props) {
  const stageSize = size * 1.8;
  const offsetY = OFFSET_Y[avatarBaseId] ?? 0.10;

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