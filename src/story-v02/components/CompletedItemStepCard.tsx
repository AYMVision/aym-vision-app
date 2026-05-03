// src/story-v02/components/CompletedItemStepCard.tsx

import React from 'react';

type Props = {
  selectedText: string;
};

export default function CompletedItemStepCard({ selectedText }: Props) {
  return (
    <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">
        Auswahl
      </div>
      <div className="text-sm text-emerald-950">
        {selectedText}
      </div>
    </div>
  );
}