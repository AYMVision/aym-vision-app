// src/pages/StudioStoriesPage.tsx
// "Meine Stories" overview – lists all stories saved to localStorage

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { assetUrl } from '../common/assetUrl';
import { AMY_CHARACTER, characterAvatarUrl, getCharacterById } from '../studio/studioCharacters';
import { encodeStory, saveDraft } from '../studio/studioEncoding';
import { deleteSavedStory, getSavedStories } from '../studio/studioStorage';
import type { SavedStory } from '../studio/studioStorage';

// Topic icons – same as StudioPage
const TOPIC_ICONS: Record<string, string> = {
  infoCheck: '🕵️', teamTalk: '🤝', create: '🎨',
  safe: '🔒', solve: '💡', reflect: '🪞', fair: '⚖️', free: '🌈',
};

// ---- Relative date formatter (German) ----

function relativeDate(ts: number): string {
  const now = Date.now();
  const diffMs = now - ts;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'heute';
  if (diffDays === 1) return 'gestern';
  if (diffDays < 30) return `vor ${diffDays} Tagen`;

  const d = new Date(ts);
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return `${d.getDate()}. ${months[d.getMonth()]}`;
}

// ---- Story card ----

function StoryCard({
  savedStory,
  onDelete,
  onEdit,
}: {
  savedStory: SavedStory;
  onDelete: (id: string) => void;
  onEdit: (savedStory: SavedStory) => void;
}) {
  const { t, i18n } = useTranslation('studio');
  const { t: tBonus } = useTranslation('bonus');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { id, savedAt, story } = savedStory;

  const topicLabel =
    story.tag === 'free'
      ? t('step1.tagFree')
      : tBonus(`newspaper.topics.${story.tag}`);

  const allChars = story.characters
    .map((charId) => getCharacterById(charId))
    .filter(Boolean) as NonNullable<ReturnType<typeof getCharacterById>>[];

  // Use i18n language for relative date when needed (currently always German fallback)
  const dateLabel = relativeDate(savedAt);

  function confirmDelete(storyId: string) {
    onDelete(storyId);
    setDeletingId(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Top: topic + date */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600">
          {TOPIC_ICONS[story.tag]} {topicLabel}
        </span>
        <span className="text-xs text-slate-400">{dateLabel}</span>
      </div>

      {/* Title */}
      <div className="px-4 pb-2">
        <p className={`text-sm font-bold ${story.title ? 'text-slate-900' : 'text-slate-400 italic'}`}>
          {story.title || t('myStories.noTitle')}
        </p>
      </div>

      {/* Character avatars */}
      <div className="flex items-center px-4 pb-3 gap-0.5">
        {allChars.slice(0, 5).map((char, i) => (
          <div
            key={char.id}
            style={{ zIndex: 5 - i, marginLeft: i > 0 ? '-6px' : '0' }}
            className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-slate-100 flex-shrink-0"
          >
            <img
              src={characterAvatarUrl(char.avatarFile)}
              alt={char.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp');
              }}
            />
          </div>
        ))}
        {story.characters.length > 5 && (
          <span className="text-xs text-slate-400 ml-2">+{story.characters.length - 5}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-3 border-t border-slate-50 pt-2">
        <div className="flex items-center gap-3">
          <Link
            to={`/studio/view/${encodeStory(story)}`}
            className="text-sm font-semibold text-teal-600 hover:text-teal-800"
          >
            {t('myStories.open')}
          </Link>
          <button
            type="button"
            onClick={() => onEdit(savedStory)}
            className="text-sm font-semibold text-violet-500 hover:text-violet-700 transition-colors"
          >
            ✎ {t('myStories.edit', { defaultValue: 'Bearbeiten' })}
          </button>
        </div>

        {deletingId === id ? (
          <span className="flex items-center gap-2 text-xs">
            <span className="text-red-500">{t('myStories.deleteConfirm')}</span>
            <button onClick={() => confirmDelete(id)} className="text-red-500 font-bold">
              {t('myStories.deleteYes')}
            </button>
            <button onClick={() => setDeletingId(null)} className="text-slate-400">✕</button>
          </span>
        ) : (
          <button
            onClick={() => setDeletingId(id)}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Main page ----

export default function StudioStoriesPage() {
  const { t } = useTranslation('studio');
  const navigate = useNavigate();
  const [stories, setStories] = useState<SavedStory[]>(() => getSavedStories());

  function handleDelete(id: string) {
    deleteSavedStory(id);
    setStories(getSavedStories());
  }

  function handleEdit(savedStory: SavedStory) {
    saveDraft(savedStory.story);
    navigate('/studio', { state: { skipLanding: true } });
  }

  // Newest first
  const sorted = [...stories].reverse();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/studio"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm transition-colors"
          aria-label="Zurück zum Studio"
        >
          ←
        </Link>
      </div>

      <div className="max-w-sm mx-auto px-4 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-extrabold text-slate-900">{t('myStories.title')}</h1>
          <Link
            to="/studio"
            className="px-3 py-1.5 bg-[var(--color-teal-600,#0d9488)] text-white text-xs font-bold rounded-xl shadow-sm"
          >
            {t('myStories.newStoryBtn')}
          </Link>
        </div>

        {sorted.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <img
              src={characterAvatarUrl(AMY_CHARACTER.avatarFile)}
              alt="Amy"
              className="w-20 h-20 rounded-full object-cover border-4 border-teal-100 shadow-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp');
              }}
            />
            <div>
              <p className="text-sm font-semibold text-slate-700">{t('myStories.empty')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('myStories.emptyHint')}</p>
            </div>
            <Link
              to="/studio"
              className="px-5 py-2.5 bg-[var(--color-teal-600,#0d9488)] text-white text-sm font-bold rounded-2xl shadow-md"
            >
              {t('myStories.emptyCta')}
            </Link>
          </div>
        ) : (
          /* Story list */
          <div className="flex flex-col gap-3">
            {sorted.map((savedStory) => (
              <StoryCard
                key={savedStory.id}
                savedStory={savedStory}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
