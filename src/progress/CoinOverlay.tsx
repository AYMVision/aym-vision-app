import React, { useEffect, useMemo, useState } from 'react';
import { useRewardFx } from './rewardFx';

export default function CoinOverlay() {
  const { activeRewards, removeReward } = useRewardFx();

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {activeRewards.map((r) => (
        <FlyingReward
          key={r.id}
          id={r.id}
          kind={r.kind}
          imgSrc={r.imgSrc}
          from={r.from}
          to={r.to}
          onDone={() => removeReward(r.id)}
        />
      ))}
    </div>
  );
}

function FlyingReward({
  id,
  kind,
  imgSrc,
  from,
  to,
  onDone,
}: {
  id: string;
  kind: 'coin' | 'sticker';
  imgSrc: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  onDone: () => void;
}) {
  const styleStart = useMemo(
    () => ({
      left: from.x,
      top: from.y,
      transform: 'translate(-50%, -50%) scale(1.8)',
      opacity: 1,
      filter: 'saturate(1.05)',
    }),
    [from]
  );

  const styleEnd = useMemo(
    () => ({
      left: to.x,
      top: to.y,
      transform: 'translate(-50%, -50%) scale(1.0)',
      opacity: 0.98,
    }),
    [to]
  );

  const [style, setStyle] = useState<any>(styleStart);

  useEffect(() => {
    const t1 = window.setTimeout(() => setStyle(styleEnd), 16);
    const t2 = window.setTimeout(() => onDone(), 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [styleEnd, onDone]);

  const sizeClass = kind === 'sticker' ? 'w-24 h-24' : 'w-12 h-12';
  const extraClass =
    kind === 'sticker'
      ? 'drop-shadow-lg rounded-2xl'
      : 'drop-shadow-md';

  return (
    <img
      src={imgSrc}
      alt=""
      className={`absolute ${sizeClass} ${extraClass}`}
      style={{
        ...style,
        transition: 'all 1400ms cubic-bezier(0.2, 1, 0.2, 1)',
      }}
    />
  );
}
