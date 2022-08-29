import { extractLessons, extractCourses } from "./files";
import filterFor from "./ioBroker";

const source = './tmp/2022_23 Jg_12 Kurslisten.txt';

// extractCourses(source);

// extractLessons();

// const name = 'Malcher, Aron';
// const name = 'Adana, Kerem';
// const name = 'Doyran, Ethem';
const name = 'Lucas, Eric';

filterFor(name);