import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-5 first:pt-0">
      <h2 className="text-base font-semibold text-[var(--color-teal-900)]">{question}</h2>
      <div className="mt-2 text-sm leading-relaxed text-slate-700 space-y-2">{children}</div>
    </div>
  );
}

function Section({ label, title, children }: { label: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
      <div className="text-xs font-semibold text-[var(--color-teal-600)] mb-1">{label}</div>
      {title && <h1 className="text-xl font-extrabold text-[var(--color-teal-900)] mb-5">{title}</h1>}
      {children}
    </section>
  );
}

export default function FAQ() {
  const { t } = useTranslation('about');

  return (
    <Layout backPath="/parents">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Allgemein */}
        <Section label={t('faq.general.label')} title={t('faq.title')}>

          <FaqItem question={t('faq.general.age.question')}>
            <p>{t('faq.general.age.answer')}</p>
            <p>
              <Link to="/parents" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.general.age.link')}
              </Link>
            </p>
          </FaqItem>

          <FaqItem question={t('faq.general.topics.question')}>
            <p>{t('faq.general.topics.answer')}</p>
            <p>
              <Link to="/parents" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.general.topics.link')}
              </Link>
            </p>
          </FaqItem>

          <FaqItem question={t('faq.general.social.question')}>
            <p>{t('faq.general.social.answer')}</p>
          </FaqItem>

          <FaqItem question={t('faq.general.costs.question')}>
            <p>{t('faq.general.costs.answer')}</p>
          </FaqItem>

        </Section>

        {/* Elternbereich */}
        <Section label={t('faq.parents.label')}>

          <FaqItem question={t('faq.parents.code.question')}>
            <p>
              {t('faq.parents.code.answer1')}{' '}
              <Link to="/adult-settings" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.parents.code.answer2')}
              </Link>{' '}
              {t('faq.parents.code.answer3')}{' '}
              <strong>{t('faq.parents.code.answer4')}</strong>{' '}
              {t('faq.parents.code.answer5')}
            </p>
          </FaqItem>

          <FaqItem question={t('faq.parents.changePasscode.question')}>
            <p>
              {t('faq.parents.changePasscode.answer1')}{' '}
              <Link to="/adult-settings" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.parents.changePasscode.answer2')}
              </Link>{' '}
              {t('faq.parents.changePasscode.answer3')}{' '}
              <strong>{t('faq.parents.changePasscode.answer4')}</strong>
              {t('faq.parents.changePasscode.answer5')}
            </p>
          </FaqItem>

          <FaqItem question={t('faq.parents.duration.question')}>
            <p>
              {t('faq.parents.duration.answer1')}{' '}
              <Link to="/adult-settings" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.parents.duration.answer2')}
              </Link>{' '}
              {t('faq.parents.duration.answer3')}{' '}
              <strong>{t('faq.parents.duration.answer4')}</strong>{' '}
              {t('faq.parents.duration.answer5')}
            </p>
          </FaqItem>

          <FaqItem question={t('faq.parents.forgot.question')}>
            <p>
              {t('faq.parents.forgot.answer1')}{' '}
              <a href="mailto:hello@amysurfwing.de" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                hello@amysurfwing.de
              </a>{' '}
              {t('faq.parents.forgot.answer2')}{' '}
              <Link to="/adult-settings" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.parents.forgot.answer3')}
              </Link>{' '}
              {t('faq.parents.forgot.answer4')}{' '}
              <strong>{t('faq.parents.forgot.answer5')}</strong>{' '}
              {t('faq.parents.forgot.answer6')}
            </p>
          </FaqItem>

        </Section>

        {/* Daten & Datenschutz */}
        <Section label={t('faq.data.label')}>

          <FaqItem question={t('faq.data.storage.question')}>
            <p>{t('faq.data.storage.answer')}</p>
          </FaqItem>

          <FaqItem question={t('faq.data.deviceSwitch.question')}>
            <p>
              {t('faq.data.deviceSwitch.answer1')}{' '}
              <Link to="/adult-settings" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                {t('faq.data.deviceSwitch.answer2')}
              </Link>
              {t('faq.data.deviceSwitch.answer3')}
            </p>
          </FaqItem>

        </Section>

      </div>
    </Layout>
  );
}
