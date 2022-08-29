import { extractLessons, extractCourses } from "./files";
import filterFor from "./ioBroker";

const source = './tmp/2022_23 Jg_12 Kurslisten.txt';

// extractCourses(source);

const source2 = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

// source2.forEach((s,i) => extractLessons(s, i));

const name = 'Malcher, Aron';
// const name = 'Adana, Kerem';

filterFor(name);