import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
// import amy from '../assets/amy_lg.png'; // entfernt: kein Logo/Amy-Bild mehr im Hero
import bannerHero from '../assets/banner-hero.png'; // dein Bannerbild
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import courseDe from '../data/shadowfox.de';
import courseEn from '../data/shadowfox.en';
import PhonePreview from '../components/PhonePreview';
import { useTranslation, Trans } from 'react-i18next';
import type { Message } from '../common/types';

const Welcome = () => {
  const { t, i18n } = useTranslation('welcome');
  const courseLanguage = (i18n.language || 'de').split('-')[0];
  const course = courseLanguage === 'de' ? courseDe : courseEn;

  const messages: Message[] = (course?.script?.[0]?.messages ??
    []) as Message[];

  return (
    <Layout>
      {/* --- FIXES BANNER-BILD unter der Navigation, ohne Zuschnitt --- */}
      <div className="relative w-full">
        <img
          src={bannerHero}
          alt="AYM Vision – Amy Surfwing: Entdecke die Chat-Story"
          className="block w-full h-auto object-contain select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Hero-Section (gleich geblieben, nur Headline/Subheadline jetzt weiß) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Textspalte */}
            <div className="lg:col-span-7">
              <div className="mt-0 flex items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                    {/* Titel in Weiß */}
                    <span className="block text-white">{t('title')}</span>
                  </h1>

                  {/* Subheadline in Weiß */}
                  <p className="mt-3 text-base sm:text-lg text-white font-semibold">
                    {t('welcome')}
                  </p>

                  {/* (MOBIL) Amy-Bild entfernt */}

                  {/* Intro (unverändert in deiner ursprünglichen Farbe) */}
                  <p className="mt-5 text-base sm:text-lg text-[#284242] leading-relaxed max-w-2xl">
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

                  {/* Social Follow */}
                  <div className="mt-6">
                    <p className="text-sm sm:text-base text-[#284242] font-medium">
                      <span className="mr-2">Bald als App!</span>
                      Werde schon jetzt Teil der Mission! Folge uns auf Facebook
                      &amp; LinkedIn und sei von Anfang an dabei.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <a
                        href="https://www.facebook.com/profile.php?id=61581575849501&sk=about"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Folge uns auf Facebook"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                                   bg-[var(--color-teal-900)] text-white hover:opacity-95 transition"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85h2.74l-.44 2.91h-2.3V22c4.78-.79 8.44-4.94 8.44-9.94z"
                          />
                        </svg>
                        Facebook
                      </a>

                      <a
                        href="https://www.linkedin.com/company/aymquest/?viewAsMember=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Folge uns auf LinkedIn"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                                   bg-[var(--color-teal-900)] text-white hover:opacity-95 transition"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H6a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3h13M8.34 18.34V9.75H6V18.3h2.34m-1.17-9.69c.76 0 1.38-.62 1.38-1.38 0-.76-.62-1.38-1.38-1.38-.76 0-1.38.62-1.38 1.38 0 .76.62 1.38 1.38 1.38M20 18.34v-4.67c0-2.5-1.33-3.66-3.11-3.66-1.43 0-2.06.79-2.41 1.35v-1.16H12v8.14h2.34v-4.52c0-1.19.23-2.34 1.7-2.34 1.45 0 1.47 1.35 1.47 2.41v4.45H20z"
                          />
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>

                {/* (DESKTOP) Amy-Bild entfernt */}
              </div>
            </div>

            {/* Phone Preview */}
            <div className="lg:col-span-5">
              <div className="mx-auto md:mx-0 flex justify-center lg:justify-end">
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

          {/* Footer-Tipp */}
          <div className="px-0 pb-6 sm:pb-8 mt-6">
            <p className="text-center text-sm text-[var(--color-teal-700,#205e5b)]/80">
              {courseLanguage === 'de'
                ? 'Tip: Switch language (top right) to view the English version.'
                : 'Tipp: Wechsle oben rechts die Sprache, um die deutsche Version zu sehen.'}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Welcome;
