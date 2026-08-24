import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { aymFetch } from '../identity/handshake';
import { isParentUnlocked, hasParentPasscode, verifyParentPasscode, setParentPasscode, setParentUnlockedForMinutes } from '../settings/parentLock';

const CONTENT_OPTIONS = [
  { id: 's1', label: 'Staffel 1 (s1) — alle 5 Episoden' },
  { id: 's1-full', label: 'Staffel 1 — Voll-Zugang (kein Tagesgate, Bonus frei, bis 31.10.2026)' },
];

type Voucher = { id: string; contentId: string; note?: string };
type ActiveVoucher = { id: string; contentId: string; createdAt: string; note?: string };
type RedeemedVoucher = { id: string; contentId: string; redeemedAt: string; note?: string };

export default function VoucherAdmin() {
  const [passcode, setPasscode] = useState('');
  const [passcodeRepeat, setPasscodeRepeat] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [, forceRender] = useState(0);

  const [contentId, setContentId] = useState('s1');
  const [count, setCount] = useState(5);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const [listBusy, setListBusy] = useState(false);
  const [listError, setListError] = useState('');
  const [activeVouchers, setActiveVouchers] = useState<ActiveVoucher[] | null>(null);
  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[] | null>(null);

  async function handleUnlock() {
    setPasscodeError('');
    setUnlockBusy(true);
    try {
      const needsSetup = !hasParentPasscode();
      if (needsSetup) {
        if (passcode.length < 6) {
          setPasscodeError('Mindestens 6 Zeichen.');
          return;
        }
        if (passcode !== passcodeRepeat) {
          setPasscodeError('Passcodes stimmen nicht überein.');
          return;
        }
        setParentPasscode(passcode);
        setParentUnlockedForMinutes(60);
        forceRender((v) => v + 1);
      } else {
        const ok = verifyParentPasscode(passcode);
        if (!ok) {
          setPasscodeError('Falscher Passcode.');
          return;
        }
        setParentUnlockedForMinutes(60);
        forceRender((v) => v + 1);
      }
      setPasscode('');
      setPasscodeRepeat('');
    } finally {
      setUnlockBusy(false);
    }
  }

  async function handleCreate() {
    setError('');
    setVouchers([]);
    setBusy(true);
    try {
      const body = JSON.stringify({ contentId, count, note: note.trim() || null });
      const res = await aymFetch('/api/v1/extension/aym-vision/voucher/create', {
        method: 'POST',
        body,
      });
      if (res.status === 403) {
        setError('Dieses Gerät ist nicht autorisiert (kein Master-Key).');
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError(`Fehler ${res.status}: ${text || 'Unbekannter Fehler'}`);
        return;
      }
      const data = await res.json() as { vouchers: Voucher[] };
      setVouchers(data.vouchers ?? []);
    } catch (e) {
      setError('Netzwerkfehler — läuft der Backend?');
    } finally {
      setBusy(false);
    }
  }

  function copyCode(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  }

  function copyAll() {
    const text = vouchers.map((v) => v.id).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  }

  async function loadList() {
    setListError('');
    setListBusy(true);
    try {
      const res = await aymFetch('/api/v1/extension/aym-vision/voucher/list');
      if (res.status === 403) { setListError('Dieses Gerät ist nicht autorisiert.'); return; }
      if (!res.ok) { setListError(`Fehler ${res.status}`); return; }
      const data = await res.json() as { active: ActiveVoucher[]; redeemed: RedeemedVoucher[] };
      setActiveVouchers(data.active ?? []);
      setRedeemedVouchers(data.redeemed ?? []);
    } catch {
      setListError('Netzwerkfehler');
    } finally {
      setListBusy(false);
    }
  }

  function formatDate(iso: string): string {
    try { return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return iso; }
  }

  if (!isParentUnlocked()) {
    const needsSetup = !hasParentPasscode();
    return (
      <Layout backPath="/adult-settings" hideFooter>
        <div className="mx-auto max-w-xl px-4 py-10">
          <h1 className="text-xl font-bold text-slate-900">
            {needsSetup ? 'Erwachsenenbereich einrichten' : 'Erwachsenenbereich'}
          </h1>
          <p className="mt-2 text-slate-600">
            {needsSetup
              ? 'Lege einen Passcode fest, um fortzufahren.'
              : 'Gib den Passcode ein, um fortzufahren.'}
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-slate-500">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleUnlock(); }}
                placeholder="mind. 6 Zeichen"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            {needsSetup && (
              <div>
                <label className="text-xs text-slate-500">Passcode wiederholen</label>
                <input
                  type="password"
                  value={passcodeRepeat}
                  onChange={(e) => setPasscodeRepeat(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') void handleUnlock(); }}
                  placeholder="nochmal eingeben"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            )}
            {passcodeError && (
              <p className="text-sm text-red-600">{passcodeError}</p>
            )}
            <button
              type="button"
              disabled={unlockBusy}
              onClick={() => void handleUnlock()}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {needsSetup ? 'Passcode festlegen' : 'Entsperren'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath="/adult-settings" hideFooter>
      <div className="mx-auto max-w-xl px-4 py-10 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gutschein-Codes erstellen</h1>
          <p className="mt-1 text-sm text-slate-500">
            Codes werden serverseitig gespeichert und können einmalig eingelöst werden.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Inhalt</label>
            <select
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white"
            >
              {CONTENT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Anzahl <span className="font-normal text-slate-400">(1–50)</span>
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Notiz <span className="font-normal text-slate-400">(optional — wofür sind diese Codes?)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="z.B. Pilotschule Muster, Testerin Anna …"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void handleCreate()}
            className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {busy ? 'Wird erstellt…' : `${count} Code${count !== 1 ? 's' : ''} erstellen`}
          </button>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {vouchers.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  {vouchers.length} Code{vouchers.length !== 1 ? 's' : ''} für {contentId}
                </h2>
                {vouchers[0]?.note && (
                  <p className="text-xs text-slate-400 italic mt-0.5">{vouchers[0].note}</p>
                )}
              </div>
              <button
                type="button"
                onClick={copyAll}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                {copied === 'all' ? 'Kopiert ✓' : 'Alle kopieren'}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {vouchers.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2">
                  <span className="font-mono text-xs text-slate-700 break-all pr-3">{v.id}</span>
                  <button
                    type="button"
                    onClick={() => copyCode(v.id)}
                    className="shrink-0 text-xs font-semibold text-teal-600 hover:text-teal-800"
                  >
                    {copied === v.id ? '✓' : 'Kopieren'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Übersicht */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Übersicht aller Codes</h2>
            <button
              type="button"
              disabled={listBusy}
              onClick={() => void loadList()}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 disabled:opacity-50"
            >
              {listBusy ? 'Wird geladen…' : activeVouchers !== null ? 'Aktualisieren' : 'Laden'}
            </button>
          </div>

          {listError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {listError}
            </div>
          )}

          {activeVouchers !== null && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Aktiv — {activeVouchers.length} Code{activeVouchers.length !== 1 ? 's' : ''}
                </div>
                {activeVouchers.length === 0 ? (
                  <p className="text-xs text-slate-400">Keine aktiven Codes.</p>
                ) : (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-3 px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-500">
                      <span>UUID</span><span>Wofür</span><span>Staffel</span><span>Erstellt</span><span />
                    </div>
                    {activeVouchers.map((v) => (
                      <div key={v.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-3 px-3 py-2 items-center">
                        <span className="font-mono text-xs text-slate-700 break-all">{v.id}</span>
                        <span className="text-xs text-slate-500 italic">{v.note || '—'}</span>
                        <span className="text-xs text-slate-600 whitespace-nowrap">{v.contentId}</span>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(v.createdAt)}</span>
                        <button
                          type="button"
                          onClick={() => copyCode(v.id)}
                          className="shrink-0 text-xs font-semibold text-teal-600 hover:text-teal-800"
                        >
                          {copied === v.id ? '✓' : 'Kopieren'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Eingelöst — {redeemedVouchers?.length ?? 0} Code{(redeemedVouchers?.length ?? 0) !== 1 ? 's' : ''}
                </div>
                {(redeemedVouchers?.length ?? 0) === 0 ? (
                  <p className="text-xs text-slate-400">Noch keine eingelösten Codes.</p>
                ) : (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-500">
                      <span>UUID</span><span>Wofür</span><span>Staffel</span><span>Eingelöst am</span>
                    </div>
                    {redeemedVouchers!.map((v) => (
                      <div key={v.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-3 py-2 items-center">
                        <span className="font-mono text-xs text-slate-400 break-all">{v.id}</span>
                        <span className="text-xs text-slate-500 italic">{v.note || '—'}</span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{v.contentId}</span>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(v.redeemedAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/adult-settings"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Zurück zu Einstellungen
          </Link>
        </div>
      </div>
    </Layout>
  );
}
