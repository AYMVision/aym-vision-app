import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useProfile } from '../profile/useProfile';
import AvatarHeadImage from './AvatarHeadImage';

type MyCardData = {
  name: string;
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
  name: '',
  mostly: '',
  hobbies: [],
  othersLike: [],
  annoys: [],
  colors: '',
  happy: '',
  netRule: '',
  funFact: '',
};

function splitList(v: string): string[] {
  return v
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-extrabold text-slate-900 shadow-sm">
      {children}
    </span>
  );
}

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

function Field({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-slate-800">{label}</div>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
        />
      )}
    </label>
  );
}

function ListField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field
      label={label}
      value={value.join(', ')}
      onChange={(v) => onChange(splitList(v))}
      placeholder={placeholder}
    />
  );
}

function RevealPreviewCard({
  icon,
  title,
  value,
  open,
  setOpen,
}: {
  icon: string;
  title: string;
  value: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="text-left w-full rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden>
            {icon}
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-extrabold text-slate-900">{title}</div>
            <div className="text-[11px] font-semibold text-slate-500">{open ? 'sichtbar' : 'tippen zum Anzeigen'}</div>
          </div>
        </div>

        <div className="shrink-0 text-lg font-extrabold text-slate-800" aria-hidden>
          {open ? '−' : '+'}
        </div>
      </div>

      {open ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-sm text-slate-900 leading-relaxed">
            {value.trim() || '...'}
          </div>
        </div>
      ) : null}
    </button>
  );
}

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
      updatedAt: Date.now(),
    }));
  }

  const ui = (k: string, fallback = '') =>
    t(`charactersUi.${k}`, { defaultValue: fallback });

  const name = card.name.trim() || t('charactersUi.myCard.defaultName', { defaultValue: 'Ich' });

  const quickFacts = useMemo(() => {
    const rows: { emoji: string; label: string; value: string }[] = [];

    if (card.colors.trim()) {
      rows.push({
        emoji: '🎨',
        label: ui('sections.colors', 'Meine Lieblingsfarbe'),
        value: card.colors,
      });
    }

    if (card.happy.trim()) {
      rows.push({
        emoji: '😄',
        label: ui('sections.happy', 'Was mich richtig freut'),
        value: card.happy,
      });
    }

    if (card.netRule.trim()) {
      rows.push({
        emoji: '🛡️',
        label: ui('sections.netRule', 'Meine Regel im Netz'),
        value: card.netRule,
      });
    }

    if (card.hobbies.length) {
      rows.push({
        emoji: '🎯',
        label: ui('sections.hobbiesInline', 'Meine Hobbys'),
        value: card.hobbies.join(', '),
      });
    }

    return rows;
  }, [card, t]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-2xl font-extrabold text-slate-900">
          {ui('labels.myName', 'Mein Name')}: {name}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Chip>🪪 {t('charactersUi.myCard.title', { defaultValue: 'Meine Karte' })}</Chip>
          <Chip>✨ {t('charactersUi.myCard.chip1', { defaultValue: 'Selbst gestalten' })}</Chip>
          <Chip>🎨 {t('charactersUi.myCard.chip2', { defaultValue: 'Ganz persönlich' })}</Chip>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 items-start">
          {/* LEFT */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                💬
              </span>
              <div className="text-[13px] font-extrabold text-slate-900">
                {ui('sections.mostly', 'So bin ich meistens')}
              </div>
            </div>

            <div className="mt-3">
              <Field
                label={ui('sections.mostly', 'So bin ich meistens')}
                value={card.mostly}
                onChange={(v) => setField('mostly', v)}
                multiline
                placeholder={t('charactersUi.myCard.placeholders.mostly', {
                  defaultValue: 'Zum Beispiel: ruhig, kreativ, neugierig ...',
                })}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="w-full h-[160px] flex items-center justify-center bg-gradient-to-br from-[var(--color-teal-50)] via-white to-amber-50">
              <AvatarHeadImage
                id={profile.avatarBaseId}
                size={120}
                alt={name}
                className="rounded-2xl border border-white/70 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard emoji="📝" title={ui('labels.myName', 'Mein Name')}>
          <Field
            label={ui('labels.myName', 'Mein Name')}
            value={card.name}
            onChange={(v) => setField('name', v)}
            placeholder={t('charactersUi.myCard.placeholders.name', {
              defaultValue: 'Wie soll deine Karte heißen?',
            })}
          />
        </SectionCard>

        <SectionCard emoji="🌟" title={ui('sections.othersLike', 'Das mögen andere an mir')}>
          <ListField
            label={ui('sections.othersLike', 'Das mögen andere an mir')}
            value={card.othersLike}
            onChange={(v) => setField('othersLike', v)}
            placeholder={t('charactersUi.myCard.placeholders.list', {
              defaultValue: 'Mit Komma trennen',
            })}
          />
        </SectionCard>

        <SectionCard emoji="😤" title={ui('sections.annoys', 'Das nervt manchmal an mir')}>
          <ListField
            label={ui('sections.annoys', 'Das nervt manchmal an mir')}
            value={card.annoys}
            onChange={(v) => setField('annoys', v)}
            placeholder={t('charactersUi.myCard.placeholders.list', {
              defaultValue: 'Mit Komma trennen',
            })}
          />
        </SectionCard>

        <SectionCard emoji="🎯" title={ui('sections.hobbies', 'Meine Hobbys')}>
          <ListField
            label={ui('sections.hobbies', 'Meine Hobbys')}
            value={card.hobbies}
            onChange={(v) => setField('hobbies', v)}
            placeholder={t('charactersUi.myCard.placeholders.list', {
              defaultValue: 'Mit Komma trennen',
            })}
          />
        </SectionCard>

        {quickFacts.length ? (
          <div className="md:col-span-2">
            <SectionCard emoji="📌" title={ui('sections.quickFacts', 'Kurz & wichtig')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickFacts.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden>
                        {r.emoji}
                      </span>
                      <div className="text-[12px] font-extrabold text-slate-700">{r.label}</div>
                    </div>
                    <div className="mt-1 text-sm text-slate-900 leading-relaxed">{r.value}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        <SectionCard emoji="🎨" title={ui('sections.colors', 'Meine Lieblingsfarbe')}>
          <Field
            label={ui('sections.colors', 'Meine Lieblingsfarbe')}
            value={card.colors}
            onChange={(v) => setField('colors', v)}
            placeholder={t('charactersUi.myCard.placeholders.colors', {
              defaultValue: 'Zum Beispiel: Türkis',
            })}
          />
        </SectionCard>

        <SectionCard emoji="😄" title={ui('sections.happy', 'Was mich richtig freut')}>
          <Field
            label={ui('sections.happy', 'Was mich richtig freut')}
            value={card.happy}
            onChange={(v) => setField('happy', v)}
            multiline
            placeholder={t('charactersUi.myCard.placeholders.happy', {
              defaultValue: 'Was macht dir gute Laune?',
            })}
          />
        </SectionCard>

        <div className="md:col-span-2">
          <SectionCard emoji="🛡️" title={ui('sections.netRule', 'Meine Regel im Netz')}>
            <Field
              label={ui('sections.netRule', 'Meine Regel im Netz')}
              value={card.netRule}
              onChange={(v) => setField('netRule', v)}
              multiline
              placeholder={t('charactersUi.myCard.placeholders.netRule', {
                defaultValue: 'Zum Beispiel: Erst denken, dann posten.',
              })}
            />
          </SectionCard>
        </div>

        <div className="md:col-span-2">
          <RevealPreviewCard
            icon="🎉"
            title={ui('sections.funFact', 'Fun-Fact')}
            value={card.funFact}
            open={funOpen}
            setOpen={setFunOpen}
          />
        </div>

        <div className="md:col-span-2">
          <SectionCard emoji="✍️" title={ui('sections.funFact', 'Fun-Fact')}>
            <Field
              label={ui('sections.funFact', 'Fun-Fact')}
              value={card.funFact}
              onChange={(v) => setField('funFact', v)}
              multiline
              placeholder={t('charactersUi.myCard.placeholders.funFact', {
                defaultValue: 'Etwas Lustiges oder Besonderes über dich',
              })}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}