// src/components/ProfileSwitcherModal.tsx
// Bottom-Sheet Modal für Profilwechsel innerhalb der App.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarLookCircle from './AvatarLookCircle';
import {
  loadProfilesIndex,
  switchToProfile,
  verifyProfilePin,
  createProfile,
  setProfilePin,
  type ProfileMeta,
} from '../profile/profileIndex';

type Phase =
  | 'list'
  | 'pin'
  | 'newProfile'
  | 'newProfilePinAsk'
  | 'newProfilePinEnter'
  | 'newProfilePinConfirm';

type Props = {
  onClose: () => void;
  onSwitched: () => void;
};

export default function ProfileSwitcherModal({ onClose, onSwitched }: Props) {
  const navigate = useNavigate();
  const profiles = loadProfilesIndex();
  const [phase, setPhase] = useState<Phase>('list');
  const [selectedProfile, setSelectedProfile] = useState<ProfileMeta | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCreatedId, setNewCreatedId] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinFirst, setNewPinFirst] = useState('');
  const [pinMismatch, setPinMismatch] = useState(false);

  // ── existing profile login ────────────────────────────────────────────────

  function handleSelect(p: ProfileMeta) {
    if (p.pinHash) {
      setSelectedProfile(p);
      setPin('');
      setPinError(false);
      setPhase('pin');
    } else {
      switchToProfile(p.id);
      onSwitched();
      window.location.reload();
    }
  }

  function handlePinDigit(digit: string) {
    if (!selectedProfile || pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setPinError(false);
    if (next.length === 4) {
      setTimeout(async () => {
        const ok = await verifyProfilePin(selectedProfile.id, next);
        if (ok) {
          switchToProfile(selectedProfile.id);
          onSwitched();
          window.location.reload();
        } else {
          setPinError(true);
          setPin('');
        }
      }, 100);
    }
  }

  // ── new profile creation ──────────────────────────────────────────────────

  function handleConfirmName() {
    const name = newName.trim();
    if (!name) return;
    const meta = createProfile(name);
    switchToProfile(meta.id);
    setNewCreatedId(meta.id);
    setNewPin('');
    setNewPinFirst('');
    setPinMismatch(false);
    setPhase('newProfilePinAsk');
  }

  function handleSkipPin() {
    onSwitched();
    navigate('/');
  }

  function handleNewPinDigit(digit: string) {
    if (newPin.length >= 4) return;
    const next = newPin + digit;
    setNewPin(next);
    setPinMismatch(false);
    if (next.length === 4) {
      if (phase === 'newProfilePinEnter') {
        setTimeout(() => {
          setNewPinFirst(next);
          setNewPin('');
          setPhase('newProfilePinConfirm');
        }, 150);
      } else if (phase === 'newProfilePinConfirm') {
        setTimeout(async () => {
          if (next === newPinFirst) {
            await setProfilePin(newCreatedId, next);
            onSwitched();
            navigate('/');
          } else {
            setPinMismatch(true);
            setNewPin('');
            setPhase('newProfilePinEnter');
            setNewPinFirst('');
          }
        }, 150);
      }
    }
  }

  // ── shared sub-components ─────────────────────────────────────────────────

  function PinDots({ value, error }: { value: string; error?: boolean }) {
    return (
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              value.length > i
                ? error ? 'bg-red-400 border-red-400' : 'bg-violet-500 border-violet-500'
                : 'border-slate-300 bg-white'
            }`}
          />
        ))}
      </div>
    );
  }

  function Numpad({ onDigit, onBack }: { onDigit: (d: string) => void; onBack: () => void }) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onDigit(String(n))}
            className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-lg font-semibold text-slate-800 hover:bg-slate-100 active:scale-95 transition-transform"
          >
            {n}
          </button>
        ))}
        <div />
        <button
          type="button"
          onClick={() => onDigit('0')}
          className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-lg font-semibold text-slate-800 hover:bg-slate-100 active:scale-95 transition-transform"
        >
          0
        </button>
        <button
          type="button"
          onClick={onBack}
          className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 active:scale-95 transition-transform"
        >
          ⌫
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-10 shadow-2xl">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        {/* ── list ── */}
        {phase === 'list' && (
          <>
            <h2 className="text-base font-bold text-slate-900 mb-4">Profil wechseln</h2>
            <div className="space-y-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect(p)}
                  className="w-full flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-violet-50 hover:border-violet-200 active:scale-[0.98] transition-all text-left"
                >
                  <AvatarLookCircle avatarBaseId={p.avatarBaseId} size={40} alt={p.displayName} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{p.displayName}</div>
                    {p.pinHash && <div className="text-xs text-slate-400">🔒 PIN</div>}
                  </div>
                  <span className="text-slate-300">›</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => { setNewName(''); setPhase('newProfile'); }}
                className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 hover:border-violet-300 hover:text-violet-600 transition-colors"
              >
                + Neues Profil
              </button>
            </div>
          </>
        )}

        {/* ── existing PIN ── */}
        {phase === 'pin' && selectedProfile && (
          <div className="text-center space-y-5">
            <div className="mx-auto border-2 border-slate-100 rounded-full" style={{ width: 64, height: 64 }}>
              <AvatarLookCircle avatarBaseId={selectedProfile.avatarBaseId} size={64} alt={selectedProfile.displayName} />
            </div>
            <div>
              <div className="font-bold text-slate-900">{selectedProfile.displayName}</div>
              <div className="text-sm text-slate-500">PIN eingeben</div>
            </div>

            <PinDots value={pin} error={pinError} />
            {pinError && <div className="text-sm text-red-500">Falscher PIN</div>}

            <Numpad
              onDigit={handlePinDigit}
              onBack={() => { setPin((p) => p.slice(0, -1)); setPinError(false); }}
            />

            <button
              type="button"
              onClick={() => { setPhase('list'); setPin(''); setPinError(false); }}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              ← Zurück
            </button>
          </div>
        )}

        {/* ── new profile: name ── */}
        {phase === 'newProfile' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Neues Profil</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
              placeholder="Dein Name"
              maxLength={20}
              autoFocus
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="button"
              onClick={handleConfirmName}
              disabled={!newName.trim()}
              className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
            >
              Weiter →
            </button>
            <button
              type="button"
              onClick={() => setPhase('list')}
              className="w-full text-sm text-slate-400 hover:text-slate-600 text-center"
            >
              ← Zurück
            </button>
          </div>
        )}

        {/* ── new profile: PIN ask ── */}
        {phase === 'newProfilePinAsk' && (
          <div className="text-center space-y-4">
            <div className="text-4xl">🔑</div>
            <div>
              <div className="font-bold text-slate-900">Möchtest du einen PIN?</div>
              <div className="text-sm text-slate-500 mt-1">Damit kommt niemand anderes in dein Profil.</div>
              <div className="text-xs text-slate-400 mt-1">Deine Eltern können deinen PIN jederzeit einsehen und anpassen.</div>
            </div>
            <button
              type="button"
              onClick={() => { setNewPin(''); setPhase('newProfilePinEnter'); }}
              className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              PIN setzen
            </button>
            <button
              type="button"
              onClick={handleSkipPin}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Jetzt nicht
            </button>
          </div>
        )}

        {/* ── new profile: PIN enter & confirm ── */}
        {(phase === 'newProfilePinEnter' || phase === 'newProfilePinConfirm') && (
          <div className="text-center space-y-5">
            <div>
              <div className="font-bold text-slate-900">
                {phase === 'newProfilePinConfirm' ? 'PIN bestätigen' : 'Wähle deinen PIN'}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {phase === 'newProfilePinConfirm' ? 'Noch einmal eingeben' : '4 Ziffern eingeben'}
              </div>
            </div>

            <PinDots value={newPin} error={pinMismatch} />
            {pinMismatch && <div className="text-sm text-red-500">Die PINs stimmen nicht überein. Nochmal versuchen.</div>}

            <Numpad
              onDigit={handleNewPinDigit}
              onBack={() => { setNewPin((p) => p.slice(0, -1)); setPinMismatch(false); }}
            />

            <button
              type="button"
              onClick={() => {
                setNewPin('');
                setNewPinFirst('');
                setPinMismatch(false);
                setPhase('newProfilePinAsk');
              }}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              ← Zurück
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
