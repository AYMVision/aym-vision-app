// src/pages/StudioPage.tsx
// Amic Creator – Workshop Studio (4-step wizard: Tag/Title → Characters → Write → Share)
// Styled to match Amy Surfwing onboarding + real chat style

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';

import { assetUrl } from '../common/assetUrl';
import {
  AMY_CHARACTER,
  CHARACTER_BG,
  STUDIO_EXTRA_CHARACTERS,
  STUDIO_MAIN_CHARACTERS,
  characterAvatarUrl,
  getCharacterById,
} from '../studio/studioCharacters';
import {
  clearDraft,
  encodeStory,
  loadDraft,
  saveDraft,
} from '../studio/studioEncoding';
import { getSavedStories, saveStoryToList } from '../studio/studioStorage';
import type { StudioMessage, StudioStory, StudioTopicId } from '../studio/studioTypes';
import {
  STUDIO_TOPICS,
  TOPIC_ICONS,
  buildCustomWorkshopUrl,
  copyToClipboard,
} from '../studio/studioTopics';

// --------------- Constants ---------------

const IMPULSES: Partial<Record<StudioTopicId, string[]>> = {
  infoCheck: [
    'Habt ihr das gesehen? Das soll wirklich passiert sein! 😱',
    'Ist dieses Foto echt oder fake? Ich bin mir nicht sicher...',
  ],
  teamTalk: [
    'Ich hab alles alleine gemacht. Wo wart ihr alle?',
    'Wer macht welchen Teil? Ich check das nicht...',
  ],
  safe: [
    'Hey, ich kenne dich aus der Schule – oder? Lass uns schreiben!',
    'Jemand hat ein Foto von mir gepostet ohne zu fragen. Was soll ich tun?',
  ],
  solve: [
    'Ich verstehe das einfach nicht. Könnt ihr mir helfen?',
    'Da läuft gerade was schief in der Klasse... habt ihr das auch mitgekriegt?',
  ],
  reflect: [
    'Ich weiß nicht... Hab ich das vorhin richtig gemacht?',
    'Manchmal denk ich, ich hätte das anders sagen sollen.',
  ],
  fair: [
    'Das ist total ungerecht! Warum darf ich das nicht?',
    'Ich wurde nicht eingeladen. Die anderen schon.',
  ],
  create: [
    'Ich will einen YouTube-Kanal starten! Wer macht mit?',
    'Für die Schülerzeitung brauchen wir einen coolen Namen. Ideen?',
  ],
  free: [
    'Hey, was ist bei euch heute so los?',
    'Ich muss euch was erzählen...',
  ],
};

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function buildShareUrl(encoded: string): string {
  return `${window.location.origin}${window.location.pathname}#/studio/view/${encoded}`;
}

// --------------- ProgressDots (onboarding style) ---------------

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-2 pb-6 pt-2">
      {[1, 2, 3, 4].map(s => (
        <div
          key={s}
          className={`h-2 rounded-full transition-all duration-300 ${
            s === step ? 'bg-teal-500 w-5' : s < step ? 'bg-teal-300 w-2' : 'bg-slate-200 w-2'
          }`}
        />
      ))}
    </div>
  );
}

// --------------- Amy speech bubble (onboarding style) ---------------

function AmySpeechBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <img
        src={characterAvatarUrl(AMY_CHARACTER.avatarFile)}
        alt="Amy"
        className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-teal-100 shadow-sm"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
      />
      <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-2.5 text-sm font-semibold text-teal-800 leading-snug">
        {text}
      </div>
    </div>
  );
}

// --------------- Step 1: Tag & Title ---------------

type Step1Props = {
  tag: StudioTopicId | '';
  title: string;
  lockedTag?: StudioTopicId | null;  // pre-set via ?tag= URL
  customLabel?: string | null;        // pre-set via ?label= URL
  onTagChange: (tag: StudioTopicId) => void;
  onTitleChange: (title: string) => void;
  onNext: () => void;
  error: string;
};

function Step1({ tag, title, lockedTag, customLabel, onTagChange, onTitleChange, onNext, error }: Step1Props) {
  const { t } = useTranslation('studio');
  const { t: tBonus } = useTranslation('bonus');

  const lockedLabel = lockedTag
    ? (lockedTag === 'free' ? t('step1.tagFree') : tBonus(`newspaper.topics.${lockedTag}`))
    : null;

  return (
    <div className="px-5 pt-6 pb-4 flex flex-col gap-4">
      <AmySpeechBubble text={t('step1.amyIntro')} />

      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">{t('step1.tagLabel')}</p>

        {/* Locked topic badge (set by pedagogue) */}
        {(lockedTag || customLabel) ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-teal-400 bg-teal-50 shadow-sm">
            <span className="text-xl leading-none">
              {lockedTag ? (TOPIC_ICONS[lockedTag] ?? '📖') : '✏️'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-teal-700 leading-tight">
                {lockedLabel ?? customLabel}
              </p>
              <p className="text-xs text-teal-500 mt-0.5">
                {t('step1.tagLocked', { defaultValue: 'Thema vom Pädagogen vorgegeben' })}
              </p>
            </div>
            <span className="text-teal-400 text-lg">🔒</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {STUDIO_TOPICS.map((topicId) => {
              const label = topicId === 'free'
                ? t('step1.tagFree')
                : tBonus(`newspaper.topics.${topicId}`);
              return (
                <button
                  key={topicId}
                  type="button"
                  onClick={() => onTagChange(topicId)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all text-left ${
                    tag === topicId
                      ? 'border-teal-400 bg-teal-50 text-teal-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200'
                  }`}
                >
                  <span className="text-lg leading-none">{TOPIC_ICONS[topicId]}</span>
                  <span className="leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          {t('step1.titleLabel')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t('step1.titlePlaceholder')}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          maxLength={80}
        />
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all"
      >
        {t('step1.cta')}
      </button>
    </div>
  );
}

// --------------- Step 2: Characters ---------------

type Step2Props = {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  error: string;
};

function CharacterChip({
  char,
  selected,
  fixed,
  onToggle,
}: {
  char: { id: string; name: string; avatarFile: string };
  selected: boolean;
  fixed?: boolean;
  onToggle: () => void;
}) {
  const bg = CHARACTER_BG[char.id] ?? 'bg-slate-100 border-slate-200';
  return (
    <button
      type="button"
      onClick={fixed ? undefined : onToggle}
      disabled={fixed}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
        fixed
          ? `${bg} opacity-70 cursor-default`
          : selected
          ? `${bg} shadow-md scale-105`
          : 'bg-white border-slate-200 hover:border-teal-200 opacity-70 hover:opacity-100'
      }`}
    >
      <img
        src={characterAvatarUrl(char.avatarFile)}
        alt={char.name}
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
      />
      <span className="text-xs font-medium text-slate-700 truncate max-w-[56px]">{char.name}</span>
      {fixed && <span className="text-[10px] text-teal-500">★</span>}
      {!fixed && selected && <span className="text-[10px] text-teal-500">✓</span>}
    </button>
  );
}

function Step2({ selected, onToggle, onNext, onBack, error }: Step2Props) {
  const { t } = useTranslation('studio');
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="px-5 pt-6 pb-4 flex flex-col gap-4">
      <AmySpeechBubble text={t('step2.amyIntro')} />

      {/* Amy – always fixed */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-teal-50 border border-teal-100">
        <img
          src={characterAvatarUrl(AMY_CHARACTER.avatarFile)}
          alt={AMY_CHARACTER.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
        />
        <div>
          <p className="text-sm font-semibold text-teal-700">{AMY_CHARACTER.name}</p>
          <p className="text-xs text-teal-500">{t('step2.amyFixed')}</p>
        </div>
        <span className="ml-auto text-teal-400">★</span>
      </div>

      <p className="text-sm text-slate-500">{t('step2.hint')}</p>
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Main characters */}
      <div className="grid grid-cols-4 gap-2">
        {STUDIO_MAIN_CHARACTERS.map((char) => (
          <CharacterChip
            key={char.id}
            char={char}
            selected={selected.includes(char.id)}
            onToggle={() => onToggle(char.id)}
          />
        ))}
      </div>

      {/* Extra characters toggle */}
      <button
        type="button"
        onClick={() => setShowExtra((v) => !v)}
        className="text-sm text-teal-600 font-medium underline underline-offset-2 self-start"
      >
        {showExtra ? t('step2.less') : t('step2.more')}
      </button>

      {showExtra && (
        <div className="grid grid-cols-4 gap-2">
          {STUDIO_EXTRA_CHARACTERS.map((char) => (
            <CharacterChip
              key={char.id}
              char={char}
              selected={selected.includes(char.id)}
              onToggle={() => onToggle(char.id)}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold rounded-2xl py-3 text-base border border-slate-200 transition-all"
        >
          {t('step2.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl py-3 text-base shadow-md transition-all"
        >
          {t('step2.cta')}
        </button>
      </div>
    </div>
  );
}

// --------------- Step 3: Write ---------------

type Step3Props = {
  tag: StudioTopicId | '';
  characters: string[];
  messages: StudioMessage[];
  amyQuestion: string;
  amyTip: string;
  onAddMessage: (msg: StudioMessage) => void;
  onDeleteMessage: (id: string) => void;
  onUpdateMessage: (id: string, text: string) => void;
  onMoveMessage: (id: string, direction: 'up' | 'down') => void;
  onAmyQuestionChange: (v: string) => void;
  onAmyTipChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
};

function MessageBubble({
  message,
  isFirst,
  isLast,
  onDelete,
  onUpdate,
  onMove,
}: {
  message: StudioMessage;
  isFirst: boolean;
  isLast: boolean;
  onDelete: () => void;
  onUpdate: (text: string) => void;
  onMove: (direction: 'up' | 'down') => void;
}) {
  const { t } = useTranslation('studio');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const char = getCharacterById(message.characterId);
  const bg = CHARACTER_BG[message.characterId] ?? 'bg-slate-100 border-slate-200';

  function handleSave() {
    if (editText.trim()) {
      onUpdate(editText.trim());
    }
    setEditing(false);
  }

  function handleCancel() {
    setEditText(message.text);
    setEditing(false);
  }

  return (
    <div className="flex items-end gap-2 justify-start my-2">
      <img
        src={characterAvatarUrl(char?.avatarFile ?? 'default-96.webp')}
        alt={char?.name ?? ''}
        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
      />
      <div className="flex flex-col min-w-0 max-w-[78%]">
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{char?.name ?? message.characterId}</p>
        {editing ? (
          <div className="flex flex-col gap-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full px-2 py-1.5 border border-teal-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              maxLength={200}
              autoFocus
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleSave}
                className="px-2 py-1 bg-teal-500 text-white text-xs font-semibold rounded-lg"
              >
                {t('step3.editSave')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
              >
                {t('step3.editCancel')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`relative max-w-full rounded-2xl rounded-bl-md px-3 py-2 shadow-sm border text-sm leading-relaxed break-words ${bg}`}>
              {message.text}
            </div>
            <div className="flex gap-1 mt-1 opacity-60">
              <button
                type="button"
                onClick={() => onMove('up')}
                disabled={isFirst}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-500 text-xs disabled:opacity-30 hover:bg-slate-50"
                aria-label="Nach oben"
              >↑</button>
              <button
                type="button"
                onClick={() => onMove('down')}
                disabled={isLast}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-500 text-xs disabled:opacity-30 hover:bg-slate-50"
                aria-label="Nach unten"
              >↓</button>
              <button
                type="button"
                onClick={() => { setEditText(message.text); setEditing(true); }}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-500 text-xs hover:bg-slate-50"
                aria-label="Bearbeiten"
              >✎</button>
              <button
                type="button"
                onClick={onDelete}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-red-100 text-red-400 text-xs hover:bg-red-50"
                aria-label="Löschen"
              >✕</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Step3({
  tag,
  characters,
  messages,
  amyQuestion,
  amyTip,
  onAddMessage,
  onDeleteMessage,
  onUpdateMessage,
  onMoveMessage,
  onAmyQuestionChange,
  onAmyTipChange,
  onNext,
  onBack,
  errors,
}: Step3Props) {
  const { t } = useTranslation('studio');
  const [selChar, setSelChar] = useState<string>(characters[0] ?? '');
  const [msgText, setMsgText] = useState('');

  const allChars = characters.map((id) => getCharacterById(id)).filter(Boolean);
  const selectedChar = getCharacterById(selChar);

  const impulses = tag ? (IMPULSES[tag as StudioTopicId] ?? []) : [];

  function handleAdd() {
    if (!selChar || !msgText.trim()) return;
    onAddMessage({
      id: genId(),
      characterId: selChar,
      text: msgText.trim(),
    });
    setMsgText('');
  }

  function handleAddImpulse(text: string) {
    const speakerId = characters[0] ?? 'amy';
    onAddMessage({ id: genId(), characterId: speakerId, text });
  }

  return (
    <div className="flex flex-col">
      {/* Message list */}
      <div className="overflow-y-auto max-h-72 min-h-[80px] px-4 pt-4">
        {messages.length === 0 && impulses.length > 0 && (
          <div className="px-0 pt-3 pb-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Startimpuls wählen (optional)
            </p>
            <div className="flex flex-col gap-1.5">
              {impulses.map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddImpulse(text)}
                  className="text-left px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50 text-xs text-slate-700 leading-snug transition-all active:scale-[0.98]"
                >
                  💬 {text}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.length === 0 && impulses.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-4">{t('step3.emptyHint')}</p>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isFirst={idx === 0}
              isLast={idx === messages.length - 1}
              onDelete={() => onDeleteMessage(msg.id)}
              onUpdate={(text) => onUpdateMessage(msg.id, text)}
              onMove={(dir) => onMoveMessage(msg.id, dir)}
            />
          ))
        ) : null}
        {errors.messages && <p className="text-xs text-red-500 px-1 pb-2">{errors.messages}</p>}
      </div>

      {/* New message form */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t('step3.addLabel')}</p>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-2">
          {allChars.map((char) => {
            if (!char) return null;
            const bg = CHARACTER_BG[char.id] ?? 'bg-slate-100 border-slate-200';
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelChar(char.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium transition-all flex-shrink-0 ${
                  selChar === char.id ? `${bg} shadow-sm` : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <img
                  src={characterAvatarUrl(char.avatarFile)}
                  alt={char.name}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
                />
                {char.name}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            placeholder={selectedChar ? t('step3.msgPlaceholder', { name: selectedChar.name }) : t('step3.charPlaceholder')}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            maxLength={200}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selChar || !msgText.trim()}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t('step3.addCta')}
          </button>
        </div>
      </div>

      {/* Amy closing section */}
      <div className="border-t border-violet-100 bg-violet-50/30 px-4 pt-3 pb-2">
        <p className="text-sm font-bold text-violet-700 mb-3">{t('step3.amySection')}</p>

        <div className="flex items-start gap-2 mb-1">
          <img
            src={characterAvatarUrl(AMY_CHARACTER.avatarFile)}
            alt="Amy"
            className="w-9 h-9 rounded-full object-cover border-2 border-violet-200"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-violet-600 mb-1">{t('step3.amyQuestionLabel')}</label>
            <textarea
              value={amyQuestion}
              onChange={(e) => onAmyQuestionChange(e.target.value)}
              placeholder={t('step3.amyQuestionPlaceholder')}
              rows={2}
              className="w-full px-3 py-2 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
              maxLength={300}
            />
            {errors.amyQuestion && <p className="text-xs text-red-500 mt-0.5">{errors.amyQuestion}</p>}
          </div>
        </div>

        <div className="flex items-start gap-2 mt-2">
          <img
            src={characterAvatarUrl(AMY_CHARACTER.avatarFile)}
            alt="Amy"
            className="w-9 h-9 rounded-full object-cover border-2 border-teal-200"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-teal-600 mb-1">{t('step3.amyTipLabel')}</label>
            <textarea
              value={amyTip}
              onChange={(e) => onAmyTipChange(e.target.value)}
              placeholder={t('step3.amyTipPlaceholder')}
              rows={2}
              className="w-full px-3 py-2 border border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              maxLength={300}
            />
            {errors.amyTip && <p className="text-xs text-red-500 mt-0.5">{errors.amyTip}</p>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-4 pt-2 flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold rounded-2xl py-3 text-base border border-slate-200 transition-all"
        >
          {t('step3.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl py-3 text-base shadow-md transition-all"
        >
          {t('step3.cta')}
        </button>
      </div>
    </div>
  );
}

// --------------- Step 4: Share ---------------

type Step4Props = {
  story: StudioStory;
  onBack: () => void;
  onNewStory: () => void;
};

function Step4({ story, onBack, onNewStory }: Step4Props) {
  const { t } = useTranslation('studio');
  const { t: tBonus } = useTranslation('bonus');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [workshopCopied, setWorkshopCopied] = useState(false);

  const encoded = encodeStory(story);
  const shareUrl = buildShareUrl(encoded);
  const workshopUrl = buildWorkshopUrl(story.tag);
  const topicLabel = story.tag === 'free'
    ? t('step1.tagFree')
    : tBonus(`newspaper.topics.${story.tag}`);

  useEffect(() => {
    QRCode.toDataURL(shareUrl, { width: 200, margin: 1 })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [shareUrl]);

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleWorkshopCopy() {
    navigator.clipboard.writeText(workshopUrl).then(() => {
      setWorkshopCopied(true);
      setTimeout(() => setWorkshopCopied(false), 2000);
    });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: story.title ?? t('title'), url: shareUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  return (
    <div className="px-5 pt-6 pb-4 flex flex-col gap-5">
      <h2 className="text-lg font-bold text-slate-800">{t('step4.heading')}</h2>

      {/* Story preview card */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{TOPIC_ICONS[story.tag] ?? '📖'}</span>
          <div className="flex-1 min-w-0">
            {story.title && <p className="text-sm font-bold text-slate-800 truncate">{story.title}</p>}
            <p className="text-xs text-violet-600">{topicLabel}</p>
          </div>
          <Link
            to={`/studio/view/${encoded}`}
            className="text-xs text-teal-600 font-semibold whitespace-nowrap hover:text-teal-700"
          >
            Vorschau →
          </Link>
        </div>
      </div>

      {/* QR code */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-slate-600">{t('step4.qrHint')}</p>
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 rounded-xl shadow-sm" />
        ) : (
          <div className="w-40 h-40 bg-slate-100 rounded-xl animate-pulse" />
        )}
        <p className="text-xs text-slate-400">{t('step4.qrScanHint')}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {copied ? t('step4.copied') : `🔗 ${t('step4.copyLink')}`}
        </button>

        {'share' in navigator && (
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white text-sm font-bold rounded-2xl shadow-md transition-all"
          >
            📤 {t('view.share')}
          </button>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full py-3 border border-teal-200 text-teal-700 rounded-2xl text-sm font-semibold hover:bg-teal-50 active:scale-[0.98] transition-all print:hidden"
        >
          🖨️ {t('step4.print')}
        </button>
      </div>

      {/* Workshop link */}
      <div className="border border-amber-200 bg-amber-50 rounded-2xl p-3 flex flex-col gap-1">
        <p className="text-sm font-bold text-amber-800">{t('step4.workshopHeading')}</p>
        <p className="text-xs text-amber-700">{t('step4.workshopHint')}</p>
        <button
          type="button"
          onClick={handleWorkshopCopy}
          className="mt-1 text-xs text-amber-800 underline font-medium self-start"
        >
          {workshopCopied ? '✓ Kopiert!' : t('step4.workshopCopy')}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold rounded-2xl py-3 text-base border border-slate-200 transition-all"
        >
          {t('step4.back')}
        </button>
        <button
          type="button"
          onClick={onNewStory}
          className="flex-1 bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl py-3 text-base shadow-md transition-all"
        >
          {t('step4.newStory')}
        </button>
      </div>
      <Link to="/studio/stories" className="block text-center mt-1 text-xs text-slate-400 hover:text-violet-600 transition-colors">
        {t('myStories.title')} ansehen →
      </Link>
    </div>
  );
}

// --------------- Studio Landing (always shown first on /studio) ---------------

function StudioLanding({
  hasDraft,
  storyCount,
  onNewStory,
  onContinueDraft,
}: {
  hasDraft: boolean;
  storyCount: number;
  onNewStory: () => void;
  onContinueDraft: () => void;
}) {
  const { t } = useTranslation('studio');

  return (
    <div className="flex flex-col px-5 pt-6 pb-5 gap-4">
      {/* Amy speech bubble */}
      <div className="flex items-center gap-3">
        <img
          src={assetUrl('media/story/characters/amy-256.webp')}
          alt="Amy"
          className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-teal-100 shadow-sm"
        />
        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-2.5 text-sm font-semibold text-teal-800 leading-snug">
          {t('landing.amyIntro')}
        </div>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={onNewStory}
        className="w-full bg-[var(--color-teal-600)] hover:bg-[var(--color-teal-700)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all"
      >
        {t('landing.cta')}
      </button>

      {/* Continue draft */}
      {hasDraft && (
        <button
          type="button"
          onClick={onContinueDraft}
          className="w-full bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-amber-800 font-semibold rounded-2xl py-3 text-sm border border-amber-200 transition-all"
        >
          ✏️ {t('landing.draftCta')}
        </button>
      )}

      {/* My stories link */}
      <Link
        to="/studio/stories"
        className="text-center text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors py-0.5"
      >
        {storyCount > 0
          ? t('landing.storiesCtaCount', { count: storyCount })
          : t('landing.storiesCta')}
      </Link>

      {/* Educator link */}
      <div className="border-t border-slate-100 pt-4 mt-1 text-center">
        <Link
          to="/studio/educators"
          className="text-sm text-slate-400 hover:text-violet-600 transition-colors font-medium"
        >
          🏫 {t('landing.educatorsCta')}
        </Link>
      </div>
    </div>
  );
}

// --------------- Workshop Intro (shown before wizard when ?tag= is in URL) ---------------

function WorkshopIntro({ tag, customLabel, onStart }: { tag: StudioTopicId | null; customLabel?: string; onStart: () => void }) {
  const { t } = useTranslation('studio');
  const { t: tBonus } = useTranslation('bonus');

  const topicLabel = customLabel
    ? customLabel
    : tag === 'free' ? t('step1.tagFree') : tBonus(`newspaper.topics.${tag ?? 'free'}`);
  const topicIcon = (tag && TOPIC_ICONS[tag]) ? TOPIC_ICONS[tag] : customLabel ? '✏️' : '📖';

  return (
    <div className="flex flex-col px-5 pt-8 pb-6 items-center text-center gap-4">
      {/* Amy avatar */}
      <img
        src={assetUrl('media/story/characters/amy-256.webp')}
        alt="Amy"
        className="w-16 h-16 rounded-full object-cover object-top border-2 border-teal-100 shadow-sm"
      />

      {/* Topic badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full">
        <span className="text-xl">{topicIcon}</span>
        <span className="text-sm font-bold text-violet-700">{topicLabel}</span>
      </div>

      {/* Headline */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 leading-snug mb-1">
          {t('workshop.heading', { defaultValue: 'Heute schreibt ihr eine eigene Amic-Story!' })}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {t('workshop.hint', { defaultValue: 'Ihr wählt Charaktere, schreibt einen Chat – und Amy stellt am Ende eine Frage.' })}
        </p>
      </div>

      {/* Steps preview */}
      <div className="w-full flex flex-col gap-2 text-left">
        {[
          { icon: '👥', text: t('workshop.step1hint', { defaultValue: 'Charaktere auswählen' }) },
          { icon: '💬', text: t('workshop.step2hint', { defaultValue: 'Chat-Story schreiben' }) },
          { icon: '📤', text: t('workshop.step3hint', { defaultValue: 'Teilen & drucken' }) },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-slate-700 font-medium">{text}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all mt-1"
      >
        {t('workshop.cta', { defaultValue: "Los geht's →" })}
      </button>
    </div>
  );
}

// --------------- Main StudioPage ---------------

export default function StudioPage() {
  const { t } = useTranslation('studio');
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const urlTag = searchParams.get('tag') as StudioTopicId | null;
  const urlLabel = searchParams.get('label') ? decodeURIComponent(searchParams.get('label')!) : null;
  const isWorkshopMode = !!(urlTag || urlLabel);
  const skipLanding = !!(location.state as { skipLanding?: boolean } | null)?.skipLanding;

  // Landing: always shown unless coming via ?tag=/?label= (workshop) or explicit skipLanding (edit flow)
  const [showLanding, setShowLanding] = useState(() => !isWorkshopMode && !skipLanding);

  // Workshop intro: shown when ?tag= or ?label= is set
  const [showWorkshopIntro, setShowWorkshopIntro] = useState(isWorkshopMode);

  // Draft check on landing (synchronous)
  const [draftForLanding] = useState<StudioStory | null>(() => {
    if (isWorkshopMode || skipLanding) return null;
    const draft = loadDraft();
    if (!draft) return null;
    const nonAmyChars = draft.characters.filter((id) => id !== 'amy');
    const hasContent = draft.messages.length > 0 || !!draft.amyQuestion || !!draft.amyTip || nonAmyChars.length > 0 || !!draft.tag;
    return hasContent ? draft : null;
  });

  const [storyCount] = useState(() => getSavedStories().length);

  // Draft handling (for edit flow where skipLanding=true)
  const [draftRestored, setDraftRestored] = useState(false);

  // Wizard state
  const [step, setStep] = useState(1);
  const [tag, setTag] = useState<StudioTopicId | ''>(urlTag ?? (urlLabel ? 'free' : ''));
  const [title, setTitle] = useState('');
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [messages, setMessages] = useState<StudioMessage[]>([]);
  const [amyQuestion, setAmyQuestion] = useState('');
  const [amyTip, setAmyTip] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-restore draft only in edit flow (skipLanding=true)
  useEffect(() => {
    if (!skipLanding) return;
    const draft = loadDraft();
    if (!draft) return;
    const nonAmyChars = draft.characters.filter((id) => id !== 'amy');
    const hasContent = draft.messages.length > 0 || !!draft.amyQuestion || !!draft.amyTip || nonAmyChars.length > 0 || !!draft.tag;
    if (!hasContent) return;
    setTag(draft.tag);
    setTitle(draft.title ?? '');
    setSelectedChars(nonAmyChars);
    setMessages(draft.messages);
    setAmyQuestion(draft.amyQuestion);
    setAmyTip(draft.amyTip);
    setDraftRestored(true);
    if (draft.messages.length > 0 || draft.amyQuestion || draft.amyTip) setStep(3);
    else if (nonAmyChars.length > 0) setStep(2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNewStoryFromLanding() {
    clearDraft();
    setStep(1);
    setTag('');
    setTitle('');
    setSelectedChars([]);
    setMessages([]);
    setAmyQuestion('');
    setAmyTip('');
    setErrors({});
    setDraftRestored(false);
    setShowLanding(false);
  }

  function handleContinueDraft() {
    if (!draftForLanding) return;
    const nonAmy = draftForLanding.characters.filter((id) => id !== 'amy');
    setTag(draftForLanding.tag);
    setTitle(draftForLanding.title ?? '');
    setSelectedChars(nonAmy);
    setMessages(draftForLanding.messages);
    setAmyQuestion(draftForLanding.amyQuestion);
    setAmyTip(draftForLanding.amyTip);
    setDraftRestored(true);
    if (draftForLanding.messages.length > 0 || draftForLanding.amyQuestion || draftForLanding.amyTip) setStep(3);
    else if (nonAmy.length > 0) setStep(2);
    setShowLanding(false);
  }

  function startFresh() {
    clearDraft();
    setStep(1);
    setTag(urlTag ?? (urlLabel ? 'free' : ''));
    setTitle('');
    setSelectedChars([]);
    setMessages([]);
    setAmyQuestion('');
    setAmyTip('');
    setErrors({});
    setDraftRestored(false);
  }

  // Auto-save draft on any meaningful change
  const buildStory = useCallback((): StudioStory => ({
    v: 1,
    title: title || undefined,
    tag: (tag || 'free') as StudioTopicId,
    characters: ['amy', ...selectedChars],
    messages,
    amyQuestion,
    amyTip,
    createdAt: Date.now(),
  }), [title, tag, selectedChars, messages, amyQuestion, amyTip]);

  useEffect(() => {
    const hasContent = !!(tag || title || selectedChars.length > 0 || messages.length > 0 || amyQuestion || amyTip);
    if (step < 4 && hasContent) {
      saveDraft(buildStory());
    }
  }, [step, tag, title, selectedChars, messages, amyQuestion, amyTip, buildStory]);

  // Step 1 validation
  function handleStep1Next() {
    if (!tag) {
      setErrors({ tag: t('errors.noTag') });
      return;
    }
    setErrors({});
    setStep(2);
  }

  // Step 2 validation
  function handleStep2Next() {
    if (selectedChars.length < 2) {
      setErrors({ characters: t('errors.noCharacters') });
      return;
    }
    setErrors({});
    setStep(3);
  }

  // Step 3 validation
  function handleStep3Next() {
    const errs: Record<string, string> = {};
    if (messages.length === 0) errs.messages = t('errors.noMessages');
    if (!amyQuestion.trim()) errs.amyQuestion = t('errors.noAmyQuestion');
    if (!amyTip.trim()) errs.amyTip = t('errors.noAmyTip');
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    clearDraft();
    saveStoryToList(buildStory());
    setStep(4);
  }

  function handleToggleChar(id: string) {
    setSelectedChars((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 6) return prev; // max 6
      return [...prev, id];
    });
  }

  function handleAddMessage(msg: StudioMessage) {
    setMessages((prev) => [...prev, msg]);
  }

  function handleDeleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function handleUpdateMessage(id: string, text: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, text } : m));
  }

  function handleMoveMessage(id: string, direction: 'up' | 'down') {
    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const arr = [...prev];
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  }

  function handleNewStory() {
    clearDraft();
    setStep(1);
    setTag('');
    setTitle('');
    setSelectedChars([]);
    setMessages([]);
    setAmyQuestion('');
    setAmyTip('');
    setErrors({});
    setDraftRestored(false);
    setShowLanding(true);
  }

  const story = buildStory();

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center relative">
      {/* Back button – visible in wizard (step 1 → landing, step 2+ → prev step) */}
      {!showLanding && !showWorkshopIntro && (
        <button
          type="button"
          onClick={() => {
            if (step > 1) setStep(s => s - 1);
            else setShowLanding(true);
          }}
          className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm transition-colors"
          aria-label="Zurück"
        >
          ←
        </button>
      )}

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl mt-8 mb-8 mx-4 overflow-hidden">
        {showLanding ? (
          <StudioLanding
            hasDraft={!!draftForLanding}
            storyCount={storyCount}
            onNewStory={handleNewStoryFromLanding}
            onContinueDraft={handleContinueDraft}
          />
        ) : showWorkshopIntro ? (
          <WorkshopIntro
            tag={urlTag}
            customLabel={urlLabel ?? undefined}
            onStart={() => setShowWorkshopIntro(false)}
          />
        ) : (
          <>
            {/* Draft restored banner */}
            {draftRestored && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 border-b border-amber-100">
                <span className="text-xs text-amber-700 font-medium">✏️ {t('draft.restored', { defaultValue: 'Story wiederhergestellt' })}</span>
                <button
                  type="button"
                  onClick={startFresh}
                  className="text-xs text-amber-600 font-semibold hover:text-amber-900 transition-colors"
                >
                  {t('draft.discard')} ✕
                </button>
              </div>
            )}

            <ProgressDots step={step} />

            {step === 1 && (
              <Step1
                tag={tag}
                title={title}
                lockedTag={urlTag}
                customLabel={urlLabel}
                onTagChange={(v) => { setTag(v); setErrors({}); }}
                onTitleChange={setTitle}
                onNext={handleStep1Next}
                error={errors.tag ?? ''}
              />
            )}

            {step === 2 && (
              <Step2
                selected={selectedChars}
                onToggle={handleToggleChar}
                onNext={handleStep2Next}
                onBack={() => setStep(1)}
                error={errors.characters ?? ''}
              />
            )}

            {step === 3 && (
              <Step3
                tag={tag}
                characters={selectedChars}
                messages={messages}
                amyQuestion={amyQuestion}
                amyTip={amyTip}
                onAddMessage={handleAddMessage}
                onDeleteMessage={handleDeleteMessage}
                onUpdateMessage={handleUpdateMessage}
                onMoveMessage={handleMoveMessage}
                onAmyQuestionChange={setAmyQuestion}
                onAmyTipChange={setAmyTip}
                onNext={handleStep3Next}
                onBack={() => setStep(2)}
                errors={errors}
              />
            )}

            {step === 4 && (
              <Step4
                story={story}
                onBack={() => setStep(3)}
                onNewStory={handleNewStory}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
