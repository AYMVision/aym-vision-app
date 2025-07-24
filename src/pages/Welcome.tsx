import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import amy from '../assets/amy_lg.png';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import courseDe from '../data/klassensprecher.de';
import courseEn from '../data/klassensprecher.en';
import PhonePreview from '../components/PhonePreview';
import { useTranslation, Trans } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation('welcome');

  const { i18n } = useTranslation();
  const courseLanguage = i18n.language.split('-')[0];

  const course = courseLanguage === 'de' ? courseDe : courseEn;

  return (
    <Layout>
      <section className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start p-4 mt-8 justify-center">
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-center justify-center">
            <div className="flex w-1/2 flex-col items-center lg:items-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold animate-fade-in-up">
                <span className="text-anthracite-950">{t('title')}</span>
                <br />
                <span className="bg-gradient-to-r from-white/80 to-white bg-clip-text text-transparent">
                  {t('subtitle')}
                </span>
              </h1>
            </div>
            <div className="flex w-1/4 lg:w-1/2 flex-col items-end">
              <img className="ms-4 w-full max-w-[280px]" src={amy} />
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-anthracite-800 font-medium mb-4">
            {t('welcome')}
          </p>

          <p className="text-base sm:text-lg text-anthracite-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            <Trans
              i18nKey="intro"
              ns="welcome"
              components={[
                <span key={1} className="font-semibold text-anthracite-800" />,
                <span key={2} className="font-semibold text-anthracite-800" />,
              ]}
            />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/stories"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-anthracite-950 font-semibold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-white"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {t('discover')}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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

            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-gold-950 font-semibold rounded-full border-2 border-anthracite-950 hover:border-gold-900 hover:text-gold-900 hover:bg-gold-100 transition-all duration-300"
            >
              {t('more')}
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-8 lg:mt-0 w-5/6 lg:w-1/3 p-8">
          <PhonePreview inputPlaceholder="Deine Antwort…">
            {course.script[0].messages.map((message, index) => {
              if (message.type === 'user') {
                return null;
              } else {
                return <ChatMessage key={index} message={message} />;
              }
            })}
            <TypingIndicator />
          </PhonePreview>
        </div>
      </section>
    </Layout>
  );
};

export default Welcome;
