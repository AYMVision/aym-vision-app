import Layout from '../components/Layout';
import { courses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="w-full max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-[#0084ff]">Unsere Kurse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              title={c.title}
              description={c.description}
              progressKey={c.id}
              onClick={() => navigate(`/courses/${c.id}`)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
