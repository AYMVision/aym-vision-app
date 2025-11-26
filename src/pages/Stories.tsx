// src/pages/Stories.tsx
import Layout from '../components/Layout';
import coursesRaw from '../data/index';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProgress } from '../common/utils';
import type { Course } from '../common/types';
import surveyImage from '../assets/survey.png';

type CoursesByLang = Record<'de' | 'en', Course[]>;
const courses = coursesRaw as unknown as CoursesByLang;

const Stories = () => {
  const navigate = useNavigate();

  const { i18n, t: tCourses } = useTranslation('courses');
  const { t: tStories } = useTranslation('stories');

  const lang = (i18n.language || 'de').split('-')[0] as 'de' | 'en';

  const stories: Course[] =
    Array.isArray(courses[lang]) && courses[lang].length > 0
      ? courses[lang]
      : courses.de ?? [];

  const progressById = (stories ?? []).reduce<Record<string, number>>(
    (acc, story) => {
      const p = getProgress(story.id);
      if (!p) return acc;

      const totalChapters = Array.isArray((story as any).script)
        ? (story as any).script.length || 1
        : 1;

      const finishedPct = p.finished
        ? 100
        : Math.floor(((p.unlockedEpisode ?? 0) / totalChapters) * 100);

      acc[story.id] = Math.max(0, Math.min(100, finishedPct));
      return acc;
    },
    {}
  );

  return (
    <Layout backPath="/" hideFooter>
      <div className="w-full max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-anthracite-950">
          {tCourses('headline')}
        </h2>

        {/* HOW-TO Block */}
        <section
          aria-labelledby="howto-title"
          className="mb-10 rounded-2xl border border-black/5 bg-white shadow-sm"
        >
          <div className="p-5 sm:p-6">
            <h3
              id="howto-title"
              className="text-xl font-bold text-anthracite-950"
            >
              {tStories('howto.title')}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-anthracite-800">
              {tStories('howto.lead')}
            </p>

            <ol className="mt-4 grid gap-4 sm:grid-cols-3">
              <li className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold text-anthracite-900">
                  1. {tStories('howto.steps.1.title')}
                </div>
                <p className="mt-1 text-sm text-anthracite-700">
                  {tStories('howto.steps.1.text')}
                </p>
              </li>
              <li className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold text-anthracite-900">
                  2. {tStories('howto.steps.2.title')}
                </div>
                <p className="mt-1 text-sm text-anthracite-700">
                  {tStories('howto.steps.2.text')}
                </p>
              </li>
              <li className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm font-semibold text-anthracite-900">
                  3. {tStories('howto.steps.3.title')}
                </div>
                <p className="mt-1 text-sm text-anthracite-700">
                  {tStories('howto.steps.3.text')}
                </p>
              </li>
            </ol>

            <p className="mt-4 text-sm font-medium text-anthracite-900">
              {tStories('howto.cta')}
            </p>
          </div>
        </section>

        {/* Kartenraster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(stories ?? []).map((story) => (
            <CourseCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              progressPercent={progressById[story.id]}
              onClick={() => navigate(`/stories/${story.id}`)}
            />
          ))}

          {/* Umfrage-Karte immer zuletzt */}
          <CourseCard
            key="survey-card"
            image={surveyImage}
            title="📝 Umfrage: Deine Meinung zählt!"
            description="Sag uns, wie dir die Story gefallen hat – die UMFRAGE ist anonym und dauert nur wenige Minuten."
            progressPercent={0}
            onClick={() =>
              window.open(
                'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__tVBf5hUMUNFRjhWUzdDMTBBWVlJMVJIRE80M0sxTy4u',
                '_blank',
                'noopener,noreferrer'
              )
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Stories;
