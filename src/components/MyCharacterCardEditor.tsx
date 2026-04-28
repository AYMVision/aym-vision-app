import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useProfile } from '../profile/useProfile';
import AvatarLookCircle from '../components/AvatarLookCircle';
import AvatarFullImage from '../components/AvatarFullImage';

type MyCardData = {
  mostly: string;
  hobbies: string[];
  othersLike: string[];
  annoys: string[];
  colors: string;
  happy: string;
  netRule: string;
  funFact: string;
};

const EMPTY_MY_CARD: MyCardData = {
  mostly: '',
  hobbies: [],
  othersLike: [],
  annoys: [],
  colors: '',
  happy: '',
  netRule: '',
  funFact: '',
};

// ── Sub-components ──────────────────────────────────────────────

function SectionCard({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
        <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** Inline text input styled as a borderless field inside a card */
function InlineInput({
  value,
  onChange,
  placeholder,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls =
    'w-full bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] placeholder:text-slate-400 resize-none';

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cls}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
    />
  );
}

/** Tag list: existing items as chips with ✕, plus an add-input */
function TagListField({
  items,
  onChange,
  itemEmoji,
  placeholder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  itemEmoji: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
    inputRef.current?.focus();
  }

  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div>
      {items.length > 0 && (
        <ul className="space-y-2 mb-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-lg leading-none shrink-0" aria-hidden>
                {itemEmoji}
              </span>
              <span className="flex-1 text-sm text-slate-900 leading-relaxed">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Entfernen"
                className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={addItem}
          aria-label="Hinzufügen"
          className="shrink-0 w-10 h-10 rounded-2xl bg-[var(--color-teal-600)] text-white flex items-center justify-center text-lg font-bold hover:bg-[var(--color-teal-700)] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

/** Inline-editable QuickFact row inside the grid */
function QuickFactField({
  emoji,
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  emoji: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl shrink-0" aria-hidden>
          {emoji}
        </span>
        <div className="text-[12px] font-extrabold text-slate-700">{label}</div>
      </div>
      <InlineInput value={value} onChange={onChange} placeholder={placeholder} multiline={multiline} />
    </div>
  );
}

/** Fun-fact as a reveal-style card with an editable textarea inside */
function RevealEditCard({
  icon,
  title,
  value,
  onChange,
  open,
  setOpen,
  placeholder,
}: {
  icon: string;
  title: string;
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  placeholder?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden>
            {icon}
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
            <div className="text-[11px] font-semibold text-slate-500">
              {open ? 'sichtbar' : value.trim() ? '• • • • •' : 'tippen zum Eintragen'}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-lg font-extrabold text-slate-800" aria-hidden>
          {open ? '−' : '+'}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] placeholder:text-slate-400 resize-none"
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────

export default function MyCharacterCardEditor() {
  const { t } = useTranslation('bonus');
  const { profile, updateProfile } = useProfile();

  const [funOpen, setFunOpen] = useState(false);

  const card: MyCardData = profile.myCard ?? EMPTY_MY_CARD;

function setField<K extends keyof MyCardData>(field: K, value: MyCardData[K]) {
  updateProfile((prev) => ({
    ...prev,
    myCard: {
      ...(prev.myCard ?? EMPTY_MY_CARD),
      [field]: value,
    },
    progress: {
      ...prev.progress,
      friendbook: {
        ...(prev.progress?.friendbook ?? { hasOwnEntry: false }),
        hasOwnEntry: true,
      },
    },
    updatedAt: Date.now(),
  }));
}

  function setChatName(value: string) {
    updateProfile((prev) => ({
      ...prev,
      chatName: value,
      updatedAt: Date.now(),
    }));
  }

  const ui = (k: string, fallback = '') => t(`charactersUi.${k}`, { defaultValue: fallback });

  const chatName = profile.chatName ?? '';
  const displayName =
    chatName.trim() || t('charactersUi.myCard.defaultName', { defaultValue: 'Ich' });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* ── HEADER ── */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50">

        {/* Name row */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-extrabold text-slate-500 shrink-0">
            {ui('labels.myName', 'Mein Name')}:
          </span>
          <input
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder={t('charactersUi.myCard.placeholders.name', {
              defaultValue: 'Dein Name',
            })}
            className="flex-1 bg-transparent border-b-2 border-slate-200 focus:border-[var(--color-teal-500)] outline-none text-2xl font-extrabold text-slate-900 placeholder:text-slate-300 py-1 transition-colors"
          />
        </div>

        {/* Mostly + Avatar */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4 items-start">
          {/* LEFT: mostly */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>💬</span>
              <div className="text-[13px] font-extrabold text-slate-900">
                {ui('sections.mostly', 'So bin ich meistens')}
              </div>
            </div>
            <div className="mt-3">
              <InlineInput
                value={card.mostly}
                onChange={(v) => setField('mostly', v)}
                multiline
                placeholder={t('charactersUi.myCard.placeholders.mostly', {
                  defaultValue: 'z.B. ruhig, kreativ, neugierig ...',
                })}
              />
            </div>
          </div>

{/* RIGHT: avatar */}
<div className="flex justify-center items-center">
  <div className="w-[148px] h-[148px] rounded-full overflow-hidden border-2 border-slate-200 shadow-sm shrink-0">
    <AvatarLookCircle
      avatarBaseId={profile.avatarBaseId}
      equipment={profile.equipment}
      size={148}
    />
  </div>
</div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* othersLike */}
        <SectionCard emoji="🌟" title={ui('sections.othersLike', 'Das mögen andere an mir')}>
          <TagListField
            items={card.othersLike}
            onChange={(v) => setField('othersLike', v)}
            itemEmoji="✅"
            placeholder={t('charactersUi.myCard.placeholders.addItem', {
              defaultValue: 'Eigenschaft hinzufügen …',
            })}
          />
        </SectionCard>

        {/* annoys */}
        <SectionCard emoji="😤" title={ui('sections.annoys', 'Das nervt manchmal an mir')}>
          <TagListField
            items={card.annoys}
            onChange={(v) => setField('annoys', v)}
            itemEmoji="⚠️"
            placeholder={t('charactersUi.myCard.placeholders.addItem', {
              defaultValue: 'Eigenschaft hinzufügen …',
            })}
          />
        </SectionCard>

        {/* QuickFacts grid: colors, happy, netRule, hobbies */}
        <div className="md:col-span-2">
          <SectionCard emoji="📌" title={ui('sections.quickFacts', 'Kurz & wichtig')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <QuickFactField
                emoji="🎨"
                label={ui('sections.colors', 'Meine Lieblingsfarbe')}
                value={card.colors}
                onChange={(v) => setField('colors', v)}
                placeholder={t('charactersUi.myCard.placeholders.colors', {
                  defaultValue: 'z.B. Türkis',
                })}
              />

              <QuickFactField
                emoji="😄"
                label={ui('sections.happy', 'Was mich richtig freut')}
                value={card.happy}
                onChange={(v) => setField('happy', v)}
                placeholder={t('charactersUi.myCard.placeholders.happy', {
                  defaultValue: 'Was macht dir gute Laune?',
                })}
              />

              <QuickFactField
                emoji="🛡️"
                label={ui('sections.netRule', 'Meine Regel im Netz')}
                value={card.netRule}
                onChange={(v) => setField('netRule', v)}
                placeholder={t('charactersUi.myCard.placeholders.netRule', {
                  defaultValue: 'z.B. Erst denken, dann posten.',
                })}
              />

              {/* Hobbys as tag-list inside QuickFact tile */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl shrink-0" aria-hidden>🎯</span>
                  <div className="text-[12px] font-extrabold text-slate-700">
                    {ui('sections.hobbies', 'Meine Hobbys')}
                  </div>
                </div>
                <TagListField
                  items={card.hobbies}
                  onChange={(v) => setField('hobbies', v)}
                  itemEmoji="🎯"
                  placeholder={t('charactersUi.myCard.placeholders.addItem', {
                    defaultValue: 'Hobby hinzufügen …',
                  })}
                />
              </div>

            </div>
          </SectionCard>
        </div>

        {/* Fun-Fact as reveal-edit card */}
        <div className="md:col-span-2">
          <RevealEditCard
            icon="✍️"
            title={ui('sections.funFact', 'Fun-Fact über mich')}
            value={card.funFact}
            onChange={(v) => setField('funFact', v)}
            open={funOpen}
            setOpen={setFunOpen}
            placeholder={t('charactersUi.myCard.placeholders.funFact', {
              defaultValue: 'Etwas Lustiges oder Besonderes über dich',
            })}
          />
        </div>

        {/* Full-body avatar photo — like character card portraits */}
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden>📸</span>
              <div className="text-[13px] font-extrabold text-slate-900">
                {ui('sections.photo', 'Dein Foto')}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-[200px]">
                {/* Tape strips */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: 44,
                    height: 14,
                    background: 'linear-gradient(180deg, rgba(255,252,200,0.90) 0%, rgba(255,242,140,0.80) 100%)',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                    zIndex: 10,
                    top: -4,
                    left: -4,
                    transform: 'rotate(-45deg)',
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: 44,
                    height: 14,
                    background: 'linear-gradient(180deg, rgba(255,252,200,0.90) 0%, rgba(255,242,140,0.80) 100%)',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                    zIndex: 10,
                    top: -4,
                    right: -4,
                    transform: 'rotate(45deg)',
                  }}
                />

                <div className="w-full aspect-square bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-end justify-center overflow-hidden p-3 rounded-sm border border-slate-200">
                  <AvatarFullImage
                    id={profile.avatarBaseId}
                    width={180}
                    className="w-full h-full object-contain object-bottom"
                    alt={displayName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
