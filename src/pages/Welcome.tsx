import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import amy from '../assets/amy_lg.png';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import courseDe from '../data/shadowfox.de';
import courseEn from '../data/shadowfox.en';
import PhonePreview from '../components/PhonePreview';
import { useTranslation, Trans } from 'react-i18next';

const Welcome = () => {
  const { t, i18n } = useTranslation('welcome');
  const courseLanguage = (i18n.language || 'de').split('-')[0];
  const course = courseLanguage === 'de' ? courseDe : courseEn;

  const messages = Array.isArray(course?.script?.[0]?.messages)
    ? course!.script[0].messages
    : [];

  return (
    <Layout>
      {/* Hero (ohne Glass/ohne Rahmen) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Textspalte */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs sm:text-sm text-[var(--color-teal-700,#205e5b)] shadow-sm">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: 'var(--color-teal-400,#4fd1c5)' }}
                />
                {t('welcome')}
              </div>

              {/* Headline */}
              <div className="mt-6 flex items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                    <span className="block text-[var(--color-teal-900)]">
                      {t('title')}
                    </span>
                    {/* Optional zweite Zeile:
                    <span className="block bg-gradient-to-r from-[var(--color-teal-900)] via-[var(--color-teal-800)] to-[var(--color-teal-500)] bg-clip-text text-transparent">
                      {t('subtitle')}
                    </span>
                    */}
                  </h1>

                  <p className="mt-5 text-base sm:text-lg text-[var(--color-teal-600,#317b78)] leading-relaxed max-w-2xl">
                    <Trans
                      i18nKey="intro"
                      ns="welcome"
                      components={[
                        <span
                          key={1}
                          className="font-semibold text-[var(--color-teal-900)]"
                        />,
                        <span
                          key={2}
                          className="font-semibold text-[var(--color-teal-900)]"
                        />,
                      ]}
                    />
                  </p>

                  {/* Primär-CTA */}
                  <div className="mt-8">
                    <Link
                      to="/stories"
                      className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full overflow-hidden transition-all duration-300
                                 text-[var(--color-teal-900)] ring-1 ring-black/5 bg-white hover:shadow-lg hover:ring-black/10
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal-500)]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-100" />
                      <span className="relative z-[1] flex items-center gap-2">
                        {t('discover')}
                        <svg
                          className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Amy-Bild (optional) */}
                <div className="hidden lg:block shrink-0">
                  <img
                    src={amy}
                    alt="Amy – deine freundliche Begleitung"
                    className="w-48 h-auto drop-shadow-lg select-none"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            {/* Phone Preview — kompakt wie auf aymvision.org (kein Glass, kein Rahmen) */}
            <div className="lg:col-span-5">
              <div className="mx-auto md:mx-0 flex justify-center lg:justify-end">
                {/* Feste, angenehme Breiten je Breakpoint */}
                <div className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] xl:w-[360px]">
                  <PhonePreview inputPlaceholder="Deine Antwort…">
                    {messages
                      .filter((m: any) => m?.type !== 'user')
                      .map((message: any, index: number) => (
                        <ChatMessage key={index} message={message} />
                      ))}
                    <TypingIndicator />
                  </PhonePreview>
                </div>
              </div>
            </div>
          </div>

          {/* kleiner Fußnoten-Hinweis */}
          <div className="px-0 pb-6 sm:pb-8 mt-6">
            <p className="text-center text-sm text-[var(--color-teal-700,#205e5b)]/80">
              {courseLanguage === 'de'
                ? 'Tipp: Wechsle oben rechts die Sprache, um die englische Version zu sehen.'
                : 'Tip: Switch language (top right) to view the German version.'}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Welcome;
