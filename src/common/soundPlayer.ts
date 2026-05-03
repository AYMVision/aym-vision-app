// src/common/soundPlayer.ts
// Reward-Sounds – mit iOS-kompatiblem Unlock-Mechanismus
//
// iOS (und Chrome Android) blockieren Audio außerhalb einer User-Geste.
// Lösung: beim ersten pointerdown/touchstart einmalig play+pause aufrufen
// → entsperrt das HTMLAudioElement für alle nachfolgenden .play()-Aufrufe,
//   auch aus Timern oder IntersectionObserver heraus.

import { assetUrl } from './assetUrl';

// Separates Audio-Objekt pro Sound — damit sie sich nicht gegenseitig unterbrechen
let _coinAudio: HTMLAudioElement | null = null;
let _stickerAudio: HTMLAudioElement | null = null;
let _episodeAudio: HTMLAudioElement | null = null;

let _unlocked = false;
let _initDone = false;

function getCoinAudio(): HTMLAudioElement {
  if (!_coinAudio) {
    _coinAudio = new Audio(assetUrl('media/ui/Sound/coin-reward.mp3'));
    _coinAudio.volume = 0.5;
    _coinAudio.preload = 'auto';
  }
  return _coinAudio;
}

function getStickerAudio(): HTMLAudioElement {
  if (!_stickerAudio) {
    _stickerAudio = new Audio(assetUrl('media/ui/Sound/sticker-reward.mp3'));
    _stickerAudio.volume = 0.55;
    _stickerAudio.preload = 'auto';
  }
  return _stickerAudio;
}

function getEpisodeAudio(): HTMLAudioElement {
  if (!_episodeAudio) {
    _episodeAudio = new Audio(assetUrl('media/ui/Sound/episoden-sound.mp3'));
    _episodeAudio.volume = 0.6;
    _episodeAudio.preload = 'auto';
  }
  return _episodeAudio;
}

/** Einmalig beim App-Start aufrufen.
 *  Registriert einen selbst-löschenden Unlock-Listener für den ersten Touch/Klick. */
export function initSoundPlayer(): void {
  if (_initDone) return;
  _initDone = true;

  const unlock = () => {
    // Coin-Audio als Stellvertreter entsperren – alle Audio-Objekte teilen dieselbe
    // Autoplay-Freigabe des Browsers, sobald eines entsperrt wurde.
    const audio = getCoinAudio();
    const promise = audio.play();
    if (promise) {
      promise
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          _unlocked = true;
        })
        .catch(() => {
          // Autoplay auch hier blockiert (z.B. Stummschaltung) – kein Problem
        });
    }
  };

  document.addEventListener('pointerdown', unlock, { once: true, passive: true });
  document.addEventListener('touchstart', unlock, { once: true, passive: true });
}

function play(audio: HTMLAudioElement, enabled: boolean): void {
  if (!enabled || !_unlocked) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => { /* ignore */ });
  } catch {
    // ignore
  }
}

/** Coin-Sound abspielen. */
export function playCoinSound(enabled: boolean): void {
  play(getCoinAudio(), enabled);
}

/** Sticker-Sound abspielen. */
export function playStickerSound(enabled: boolean): void {
  play(getStickerAudio(), enabled);
}

/** Episoden-Abschluss-Sound abspielen. */
export function playEpisodeSound(enabled: boolean): void {
  play(getEpisodeAudio(), enabled);
}
