/*  src/pages/About.tsx  */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import vision from '../assets/about/vision.png';
import sample from '../assets/about/sample.png';
import teamPic from '../assets/about/team.png';
import beat from '../assets/about/beat.png';
import motivation from '../assets/about/motivation.png';
import amy from '../assets/amy.png';
import logo from '../assets/about/logo.png';

type Copy = string | string[];
interface SplitSectionProps {
  id: string;
  title: string;
  copy: Copy;
  imgSrc: string;
  imgAlt: string;
  invert?: boolean;
  bg?: string;
}

function SplitSection({
  id,
  title,
  copy,
  imgSrc,
  imgAlt,
  invert = false,
  bg = 'bg-white',
}: SplitSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${bg} py-16 md:py-24`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`flex flex-col gap-12 lg:gap-16 ${
            invert ? 'lg:flex-row-reverse' : 'lg:flex-row'
          } items-center`}
        >
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              {title}
            </h2>

            {Array.isArray(copy) ? (
              <ul className="space-y-4 text-lg leading-relaxed text-gray-700">
                {copy.map((line, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg leading-relaxed text-gray-700">{copy}</p>
            )}
          </div>

          {/* Bildbereich – verkleinert und ohne weißen Hintergrund */}
          <div className="flex-1 w-full flex justify-center">
            <div className="relative group">
              <div className="absolute rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity blur-sm"></div>
              <div className="relative bg-transparent rounded-2xl overflow-hidden">
                <img
                  src={imgSrc}
                  alt={imgAlt}
                  className="w-3/4 md:w-2/3 h-auto object-contain rounded-xl shadow-none bg-transparent mx-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const { t } = useTranslation('about');

  return (
    <Layout>
      <main className="bg-white">
        <SplitSection
          id="our-vision"
          title={t('ourVision.title')}
          copy={t('ourVision.copy')}
          imgSrc={vision}
          imgAlt="Our vision sketch-style illustration"
          bg="bg-white"
        />

        <SplitSection
          id="our-motivation"
          title={t('ourMotivation.title')}
          copy={t('ourMotivation.copy')}
          imgSrc={motivation}
          imgAlt="Motivation for our project showing the two sisters in a garden with a child"
          invert
          bg="bg-teal-50"
        />

        <SplitSection
          id="our-educational-approach"
          title={t('ourEducationalApproach.title')}
          copy={[
            t('ourEducationalApproach.copy1'),
            t('ourEducationalApproach.copy2'),
            t('ourEducationalApproach.copy3'),
          ]}
          imgSrc={beat}
          imgAlt="A picture of a heartbeat showing the rhythm of learning"
          bg="bg-white"
        />

        <SplitSection
          id="our-method"
          title={t('ourMethod.title')}
          copy={t('ourMethod.copy')}
          imgSrc={sample}
          imgAlt="A sample of our application showing a chat interface"
          invert
          bg="bg-teal-50"
        />

        {/* Team Section */}
        <section id="our-team" className="py-20 md:py-32 bg-white scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                {t('ourTeam.title')}
              </h2>
              <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
            </div>

            <div className="mb-16">
              <div className="relative group max-w-3xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity blur-sm"></div>
                <div className="relative bg-transparent rounded-3xl">
                  <img
                    className="rounded-3xl shadow-none w-3/4 md:w-2/3 mx-auto object-contain bg-transparent"
                    src={teamPic}
                    alt="Selbst gezeichnete Illustration von Melina und Ann-Sofie"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
              {t('ourTeam.members', { returnObjects: true }).map(
                (member: any) => (
                  <div
                    key={member.name}
                    className="bg-teal-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {member.name}
                    </h3>
                    <p className="text-teal-600 font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <SplitSection
          id="amplify-your-mind"
          title={t('amplifyYourMind.title')}
          copy={t('amplifyYourMind.copy')}
          imgSrc={logo}
          imgAlt="Amplify Your Mind logo showing a heartbeat"
          bg="bg-teal-50"
        />

        <SplitSection
          id="why-amy"
          title={t('whyAmy.title')}
          copy={t('whyAmy.copy')}
          imgSrc={amy}
          imgAlt="Why Amy"
          invert
          bg="bg-white"
        />

        {/* Call to Action */}
        <section
          id="call-for-action"
          className="relative bg-teal-50 py-20 md:py-32"
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-teal-900 mb-6">
              {t('callForAction.title')}
            </h2>

            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-500">
              {t('callForAction.copy')}
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-teal-300 px-10 py-5 text-lg font-semibold text-white shadow-xl hover:bg-teal-400 hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {t('callForAction.button')}
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
