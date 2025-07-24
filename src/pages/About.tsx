/*  src/pages/About.tsx  */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import vision from '../assets/about/vision.png';
import sample from '../assets/about/sample.png';
import teamPic from '../assets/about/team.jpg';
import beat from '../assets/about/beat.png';
import motivation from '../assets/about/motivation.jpg';
import amy from '../assets/about/amy.png';
import digital from '../assets/about/digital.png';
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
  imgStyle?: string;
}

function SplitSection({
  id,
  title,
  copy,
  imgSrc,
  imgAlt,
  invert = false,
  bg = '',
  imgStyle = 'w-full h-full object-cover',
}: SplitSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${bg} py-12 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid gap-10 lg:grid-cols-2 lg:items-center ${
            invert ? 'lg:direction-rtl' : ''
          }`}
        >
          <div className="space-y-6 lg:direction-ltr">
            <h2 className="text-3xl font-bold text-anthracite-950">{title}</h2>

            {Array.isArray(copy) ? (
              <ul className="list-disc pl-5 space-y-1 text-base leading-relaxed text-anthracite-600">
                {copy.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-base leading-relaxed text-anthracite-600">
                {copy}
              </p>
            )}
          </div>

          <div className="mx-auto w-92 h-92 rounded-full overflow-hidden">
            <img src={imgSrc} alt={imgAlt} className={imgStyle} />
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
      <main>
        <SplitSection
          id="our-vision"
          title={t('ourVision.title')}
          copy={t('ourVision.copy')}
          imgSrc={vision}
          imgAlt="Our vision sketch-style illustration"
        />

        <SplitSection
          id="our-motivation"
          title={t('ourMotivation.title')}
          copy={t('ourMotivation.copy')}
          imgSrc={motivation}
          imgAlt="Motivation for our project showing the two sisters in a garden with a child"
          invert
          bg="bg-white"
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
          imgStyle=""
          imgAlt="A picture of a heartbeat showing the rhythm of learning"
        />

        <SplitSection
          id="our-method"
          title={t('ourMethod.title')}
          copy={t('ourMethod.copy')}
          imgSrc={sample}
          imgStyle="rounded-lg shadow-lg w-[50%] w-full h-full object-cover"
          imgAlt="A sample of our application showing a chat interface"
          invert
          bg="bg-white"
        />

        <section id="our-team" className="py-16 bg-white scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-anthracite-950">
              {t('ourTeam.title')}
            </h2>

            <img
              className="mx-auto mb-14 w-full max-w-lg rounded-xl shadow-lg"
              src={teamPic}
              alt="Selbst gezeichnete Illustration von Melina und Ann-Sofie"
            />

            <div className="grid gap-12 sm:grid-cols-2">
              {t('ourTeam.members', { returnObjects: true }).map(
                (member: any) => (
                  <div key={member.name} className="text-center">
                    <h3 className="text-2xl font-semibold text-anthracite-950">
                      {member.name}
                    </h3>
                    <p className="mb-2 text-sm italic text-anthracite-600">
                      {member.role}
                    </p>
                    <p className="text-anthracite-600">{member.bio}</p>
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
          imgStyle=""
          imgAlt="Amplify Your Mind logo showing a heartbeat"
        />

        <SplitSection
          id="why-amy"
          title={t('whyAmy.title')}
          copy={t('whyAmy.copy')}
          imgSrc={amy}
          imgStyle=""
          imgAlt="Why Amy"
          invert
          bg="bg-white"
        />

        <section
          id="call-for-action"
          className="relative isolate overflow-hidden bg-white py-20"
        >
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-anthracite-950">
              {t('callForAction.title')}
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-anthracite-600">
              {t('callForAction.copy')}
            </p>

            <img
              src={digital}
              alt="An illustration of digital brain"
              className="mx-auto mb-10 w-full max-w-xs"
            />

            <div>
              <Link
                to="/contact"
                className="relative inline-flex items-center gap-2 rounded-full bg-anthracite-950 px-8 py-4 text-white shadow-lg ring-1 ring-anthracite-700/40 transition hover:bg-anthracite-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
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
          </div>
        </section>
      </main>
    </Layout>
  );
}
