import type { Course } from '../common/types';
import klassensprecherDe from './klassensprecher.de';
import klassensprecherEn from './klassensprecher.en';

type Courses = {
  en: Course[];
  de: Course[];
};

const courses: Courses = {
  en: [klassensprecherEn],
  de: [klassensprecherDe],
};
export default courses;
