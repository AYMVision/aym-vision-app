import React from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "../profile/useProfile";
import { getEpisodeMeta } from "../content/contentIndex";

type HeaderProgressChipProps = { compact?: boolean };

export default function HeaderProgressChip({ compact = false }: HeaderProgressChipProps) {
  // ✅ Hooks IMMER zuerst (nie nach return / nie in if)
  const { profile } = useProfile();
  const { t } = useTranslation("stories");

  const cur = profile.progress?.current;

  // ✅ ab hier darfst du returnen
  if (!cur) return null;

  const ep = getEpisodeMeta(cur.episodeId);
  const total = ep?.chapterCount ?? cur.chapterIndex;
  const x = Math.min(cur.chapterIndex, total);

  const done = `${x}/${total}`;

  return (
    <div
      className={
        compact
          ? "px-2 py-1 rounded-xl bg-white/70 border border-slate-200 text-[11px] font-semibold text-slate-700"
          : "px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow"
      }
      aria-label={t("progress.label", { defaultValue: "Fortschritt" })}
    >
      {done}
    </div>
  );
}