import Layout from '../components/Layout';
import courses from '../data/index';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const Stories = () => {
  const navigate = useNavigate();
  return (
    <Layout backPath="/">
      <div className="w-full max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-anthracite-950">
          Unsere Kurse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              image={course.image}
              title={course.title}
              description={course.description}
              progressKey={course.id}
              onClick={() => navigate(`/stories/${course.id}`)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Stories;
