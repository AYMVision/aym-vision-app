import Layout from '../components/Layout';
import courses from '../data/index';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Stories = () => {
  const navigate = useNavigate();

  const { i18n } = useTranslation('courses');
  const courseLanguage = i18n.language.split('-')[0];

  const stories = courses[courseLanguage as 'de' | 'en'];

  return (
    <Layout backPath="/">
      <div className="w-full max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-anthracite-950">
          {i18n.t('headline')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <CourseCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              progressKey={story.id}
              onClick={() => navigate(`/stories/${story.id}`)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Stories;
