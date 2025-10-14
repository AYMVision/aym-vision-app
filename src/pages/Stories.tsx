// src/pages/Stories.tsx
import Layout from '../components/Layout';
import courses from '../data/index';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProgress } from '../common/utils';

const Stories = () => {
  const navigate = useNavigate();

  const { i18n } = useTranslation('courses');
  const courseLanguage = i18n.language.split('-')[0];

  const { t } = useTranslation('courses');
  const stories = courses[courseLanguage as 'de' | 'en'];

  const progressById = stories.reduce<Record<string, number>>((acc, story) => {
    const p = getProgress(story.id);
    if (!p) return acc;

    const totalChapters = story.script.length || 1;
    const finishedPct = p.finished
      ? 100
      : Math.floor((p.unlockedEpisode / totalChapters) * 100);
    acc[story.id] = Math.max(0, Math.min(100, finishedPct));
    return acc;
  }, {});

  return (
    <Layout backPath="/">
      <div className="w-full max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-anthracite-950">
          {t('headline')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <CourseCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              progressPercent={progressById[story.id]}
              onClick={() => navigate(`/stories/${story.id}`)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Stories;
