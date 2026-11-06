import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { loadIdentity } from '../identity/storage';
import { paymentLinkFor, computeProfileHash } from '../shop/stripe';

type Status = 'loading' | 'ready' | 'error';
type BuyerType = 'private' | 'org' | null;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function CheckoutStaffel1() {
  const navigate = useNavigate();
  const { t } = useTranslation('marketing');
  const [buyerType, setBuyerType] = useState<BuyerType>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [stripeUrl, setStripeUrl] = useState('');

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const emailError = emailTouched && !isValidEmail(email);
  const canSubmit = status === 'ready' && isValidEmail(email);

  useEffect(() => {
    (async () => {
      try {
        const identity = loadIdentity();
        if (!identity) { setStatus('error'); return; }
        const { deriveBackendProfileId } = await import('../identity/keys');
        const backendProfileId = deriveBackendProfileId(identity.mnemonic);
        const hash = computeProfileHash(identity.publicKeyHex, backendProfileId);
        const link = paymentLinkFor('s1', hash);
        setStripeUrl(link);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    })();
  }, []);

  function handleSubmit() {
    if (!canSubmit) {
      setEmailTouched(true);
      return;
    }
    // TODO: Backend-Integration (wenn Backend bereit):
    // await fetch('/api/v1/extension/aym-vision/checkout/prepare', {
    //   method: 'POST',
    //   body: JSON.stringify({ email: email.trim(), newsletter }),
    // });
    // E-Mail wird nach Zahlungsabschluss über Stripe-Webhook + Backend versendet.
    sessionStorage.setItem('aym_checkout_email', email.trim());
    sessionStorage.setItem('aym_checkout_newsletter', String(newsletter));
    window.location.href = stripeUrl;
  }

  return (
    <Layout>
      <div className="w-full max-w-lg px-4 sm:px-6 py-8 space-y-4">

        {/* B2C/B2B Selector */}
        {buyerType === null && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              ← Zurück
            </button>
            <h1 className="text-xl font-extrabold text-[var(--color-teal-900)]">
              {t('checkout.buyerTypeTitle')}
            </h1>
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => setBuyerType('private')}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[var(--color-teal-400)] hover:bg-[var(--color-teal-50)] transition-all"
              >
                <p className="font-bold text-slate-900">{t('checkout.buyerTypePrivate')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('checkout.buyerTypePrivateSub')}</p>
              </button>
              <button
                type="button"
                onClick={() => setBuyerType('org')}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[var(--color-teal-400)] hover:bg-[var(--color-teal-50)] transition-all"
              >
                <p className="font-bold text-slate-900">{t('checkout.buyerTypeOrg')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('checkout.buyerTypeOrgSub')}</p>
              </button>
            </div>
          </div>
        )}

        {/* Org path */}
        {buyerType === 'org' && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4">
            <button
              type="button"
              onClick={() => setBuyerType(null)}
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              ← Zurück
            </button>
            <h1 className="text-xl font-extrabold text-[var(--color-teal-900)]">
              {t('checkout.buyerTypeOrg')}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{t('checkout.orgHint')}</p>
            <Link
              to="/anfrage"
              className="block w-full py-4 rounded-2xl bg-[var(--color-teal-700)] text-white font-extrabold text-base text-center hover:bg-[var(--color-teal-800)] transition-colors"
            >
              {t('checkout.orgCtaButton')}
            </Link>
            <button
              type="button"
              onClick={() => setBuyerType('private')}
              className="w-full text-sm text-slate-500 hover:text-slate-700"
            >
              {t('checkout.switchToPrivate')}
            </button>
          </div>
        )}

        {/* Private checkout */}
        {buyerType === 'private' && (<>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 text-sm text-slate-400 hover:text-slate-700 transition-colors"
          >
            ← Zurück
          </button>
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            Bestellübersicht
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bitte prüfe deine Bestellung vor dem Kauf.
          </p>
        </div>

        {/* Produkt */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal-700)]">
              Amy Surfwing
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Staffel 1
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Einmaliger Kauf · sofort verfügbar
            </p>
          </div>

          <ul className="space-y-1.5 text-sm text-slate-700">
            <li>✓ 5 Episoden · je ca. 5 Min.</li>
            <li>✓ 49 Spieltage mit neuem Inhalt täglich</li>
            <li>✓ Bonus-Welt: Tagebücher, Schülerzeitung, Lexikon</li>
            <li>✓ Einmaliger Kauf, kein Abo</li>
            <li>✓ Sicher auf dem Gerät gespeichert, kein Konto nötig</li>
          </ul>
        </section>

        {/* Preis */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Gesamtbetrag
          </p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">24,00 €</p>
          <p className="mt-0.5 text-xs text-slate-500">
            inkl. 19 % MwSt. (3,83 €) · einmalig
          </p>
        </section>

        {/* E-Mail & Newsletter */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div>
            <label htmlFor="checkout-email" className="block text-sm font-semibold text-slate-900">
              E-Mail-Adresse <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Für die Kaufbestätigung und Widerrufsbelehrung.
            </p>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="deine@email.de"
              className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                emailError
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-300'
              }`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-600">
                Bitte gib eine gültige E-Mail-Adresse ein.
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={e => setNewsletter(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-300"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Ja, ich möchte gelegentlich Neuigkeiten, Tipps und Updates von AYM Vision erhalten.{' '}
              <span className="text-slate-400">
                (optional · jederzeit widerrufbar · du erhältst zuerst eine Bestätigungsmail)
              </span>
            </span>
          </label>
        </section>

        {/* Rechtliche Hinweise */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-500 leading-relaxed space-y-2">
          <p>
            Mit dem Klick auf <strong className="text-slate-700">„Zahlungspflichtig bestellen"</strong> bestätigst du,
            dass du unsere{' '}
            <Link to="/agb" className="underline hover:text-slate-700">
              Allgemeinen Geschäftsbedingungen
            </Link>{' '}
            gelesen hast und akzeptierst.
          </p>
          <p>
            Ich stimme ausdrücklich zu, dass die Bereitstellung des digitalen Inhalts
            vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass mein{' '}
            <Link to="/widerruf" className="underline hover:text-slate-700">
              Widerrufsrecht
            </Link>{' '}
            mit Beginn der Bereitstellung erlischt.
          </p>
          <p>
            Die Zahlung erfolgt über den Zahlungsdienstleister Stripe.
            Nach dem Kauf erhältst du keinen separaten Account — dein Zugang ist
            an dieses Gerät und dein persönliches Sicherheitswort gebunden.
          </p>
        </section>

        {/* CTA */}
        {status === 'error' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut oder{' '}
            <a href="mailto:hello@amysurfwing.de" className="underline">
              kontaktiere uns
            </a>
            .
          </div>
        )}

        <button
          type="button"
          disabled={status === 'loading'}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-[var(--color-teal-700)] text-white font-extrabold text-base
                     hover:bg-[var(--color-teal-800)] transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Bitte warten …' : 'Zahlungspflichtig bestellen →'}
        </button>

        <p className="text-center text-xs text-slate-400">
          Du wirst zu unserem Zahlungsdienstleister Stripe weitergeleitet.
        </p>

        </>)}

      </div>
    </Layout>
  );
}
