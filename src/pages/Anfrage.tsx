import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

type OrgType = 'school' | 'company' | 'library' | 'association' | 'other' | '';

export default function Anfrage() {
  const { t } = useTranslation('marketing');
  const navigate = useNavigate();

  const [orgType, setOrgType] = useState<OrgType>('');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const orgTypeKey: Record<Exclude<OrgType, ''>, string> = {
    school: t('inquiry.typeSchool'),
    company: t('inquiry.typeCompany'),
    library: t('inquiry.typeLibrary'),
    association: t('inquiry.typeAssociation'),
    other: t('inquiry.typeOther'),
  };

  const errors = {
    orgType: !orgType,
    orgName: !orgName.trim(),
    contactName: !contactName.trim(),
    email: !isValidEmail(email),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;

    const lines = [
      `${t('inquiry.orgTypeLabel')}: ${orgType ? orgTypeKey[orgType] : ''}`,
      `${t('inquiry.orgNameLabel')}: ${orgName}`,
      `${t('inquiry.contactNameLabel')}: ${contactName}`,
      `${t('inquiry.emailLabel')}: ${email}`,
      phone ? `${t('inquiry.phoneLabel')}: ${phone}` : null,
      quantity ? `${t('inquiry.quantityLabel')}: ${quantity}` : null,
      message ? `${t('inquiry.messageLabel')}: ${message}` : null,
    ].filter(Boolean).join('\n');

    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:hello@amysurfwing.de?subject=${encodeURIComponent('Anfrage Amy Surfwing')}&body=${encodeURIComponent(lines)}`;
    mailtoLink.click();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Layout>
        <div className="w-full max-w-lg px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
              {t('inquiry.successTitle')}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{t('inquiry.successText')}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{t('inquiry.successNote')}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-2 text-sm text-slate-500 hover:text-slate-700 underline"
            >
              {t('inquiry.backButton')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-lg px-4 sm:px-6 py-10 space-y-4">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 text-sm text-slate-400 hover:text-slate-700 transition-colors"
          >
            ← {t('inquiry.backButton')}
          </button>
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            {t('inquiry.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t('inquiry.sub')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">

            {/* Org type */}
            <div>
              <label htmlFor="org-type" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.orgTypeLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                id="org-type"
                value={orgType}
                onChange={e => setOrgType(e.target.value as OrgType)}
                className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                  touched && errors.orgType ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              >
                <option value="">{t('inquiry.typePlaceholder')}</option>
                <option value="school">{t('inquiry.typeSchool')}</option>
                <option value="company">{t('inquiry.typeCompany')}</option>
                <option value="library">{t('inquiry.typeLibrary')}</option>
                <option value="association">{t('inquiry.typeAssociation')}</option>
                <option value="other">{t('inquiry.typeOther')}</option>
              </select>
              {touched && errors.orgType && (
                <p className="mt-1 text-xs text-red-600">{t('inquiry.orgTypeError')}</p>
              )}
            </div>

            {/* Org name */}
            <div>
              <label htmlFor="org-name" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.orgNameLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                id="org-name"
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder={t('inquiry.orgNamePlaceholder')}
                className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                  touched && errors.orgName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {touched && errors.orgName && (
                <p className="mt-1 text-xs text-red-600">{t('inquiry.orgNameError')}</p>
              )}
            </div>

            {/* Contact name */}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.contactNameLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder={t('inquiry.contactNamePlaceholder')}
                className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                  touched && errors.contactName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {touched && errors.contactName && (
                <p className="mt-1 text-xs text-red-600">{t('inquiry.contactNameError')}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="inq-email" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.emailLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                id="inq-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('inquiry.emailPlaceholder')}
                className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                  touched && errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {touched && errors.email && (
                <p className="mt-1 text-xs text-red-600">{t('inquiry.emailError')}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="inq-phone" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.phoneLabel')}
              </label>
              <input
                id="inq-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t('inquiry.phonePlaceholder')}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="inq-quantity" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.quantityLabel')}
              </label>
              <input
                id="inq-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder={t('inquiry.quantityPlaceholder')}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="inq-message" className="block text-sm font-semibold text-slate-900">
                {t('inquiry.messageLabel')}
              </label>
              <textarea
                id="inq-message"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('inquiry.messagePlaceholder')}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[var(--color-teal-700)] text-white font-extrabold text-base hover:bg-[var(--color-teal-800)] transition-colors"
          >
            {t('inquiry.submitButton')}
          </button>

          <p className="text-center text-xs text-slate-400">
            {t('inquiry.successNote')}
          </p>
        </form>

      </div>
    </Layout>
  );
}
