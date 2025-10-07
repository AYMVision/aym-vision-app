import type { Course } from '../common/types';
//import klassensprecherDe from './klassensprecher.de';
//import klassensprecherEn from './klassensprecher.en';
import shadowFoxDe from './shadowfox.de';
import shadowFoxEn from './shadowfox.en';

type Courses = {
  en: Course[];
  de: Course[];
};

const courses: Courses = {
  en: [shadowFoxEn],
  de: [shadowFoxDe],
};
export default courses;
