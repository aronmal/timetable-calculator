import { day, period, Week } from "../interfaces";

const replaceHTMLTableTags = (arr: string[]) => arr
    .join('')
    .replaceAll(/<(tr|table)>/g, '[')
    .replaceAll(/<\/(tr|table)>/g, ']')
    .replaceAll('<td>', '"')
    .replaceAll('</td>', '"')
    .replaceAll(/]\n\s*\[/g, '],[')
    .replaceAll(/"\n\s*"/g, '","');
const getWeek = (course: string) => /\((UW|GW)\)/.test(course) ? (/\(UW\)/.test(course) ? Week.odd : Week.even) : Week.all;
function sortLessons(data: string[][]) {
    let sorted: day = [];
    for (let x = 0; x < data.length / 4; x++) {
        sorted.push([]);
        for (let y = 1; y < data[x * 4].length; y++) {
            const course = data[x * 4 + 2][y]
            const teachers = data[x * 4 + 3][y].split(' ');
            const cache: period[] = [{
                room: data[x * 4][y],
                course,
                teacher: teachers[0],
                week: getWeek(course)
            }, {
                room: data[x * 4 + 1][y],
                course,
                teacher: teachers[1],
                week: getWeek(course)
            }].filter(e => e.room || e.teacher);
            sorted[x].push(...cache);
        }
    }
    return sorted;
};
const getLessons = (arr: string[]) => sortLessons(JSON.parse(replaceHTMLTableTags(arr)));
export default getLessons;