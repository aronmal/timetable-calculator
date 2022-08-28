import { CourseType, day, PagesType, period, StudentType, Week } from "./interfaces";

const toHex = (v: string) => v.charCodeAt(0).toString(16);
function pdfCharToChar (s: string) {
    const hex = toHex(s);
    const knownHex  = ['a', '20','dbf8','de01','ddff','de00','c'];
    const knownChars = ['\n',' ', 'f',   'l',   'f',   'i',   '~'];
        // 0xdbf8 is a 'f' font char with a follower char to be a double char like 'fl', 'ff' and 'fi'
        // The character U+000c is invisible. Replaced by '~' Being used to seperate pages.
    for (let i = 0; i < knownHex.length; i++) {
        if (hex === knownHex[i])
            return knownChars[i];
    }
    if (hex[0] + hex[1] !== 'e0') // yet unknown chars
        return '0x' + hex;  // display as hex value
    const digit = parseInt("0x" + hex[2] + hex[3]);
    const char = String.fromCharCode(digit+1);
    return char;
};
export const convert = (s: string) => s.split('').map(v => pdfCharToChar(v)).join('').split('~') as PagesType;
export function sanitise(data: string[]) {
    let result: string[] = [];
    data.forEach(s => {
        if (/Kurswahl Berufliches Gymnasium/.test(s)) {
            result.push(s);
        } else {
            result[result.length-1] += s;
        }
    });
    return result;
};
export function charToPdfChar(s: string) {
    const hex = '0xe0' + s.charCodeAt(0).toString(16);
    const digit = parseInt(hex.toString());
    const char = String.fromCharCode(digit-1);
    return char;
}

function getStudents(arr: string[]) {
    let result: StudentType[] = [];
    for (let i = 8; i < arr.length-2; i += 3) {
        const cache: StudentType = {
            index: parseInt(arr[i]),
            name: arr[i+1],
            school: arr[i+2]
        };
        [0,1,2].forEach(n => {
            if (!/^\d+\./.test(arr[i+n])) // early return on NO date
                return;
            i ++; // else increment index and correct
            console.log(n, arr[i+n-2], arr[i+n-1], arr[i+n], arr[i+n-1])
            cache.school = arr[i+2];
            if (n < 2)
                cache.name = arr[i+1];
            if (n < 1)
                cache.index = parseInt(arr[i]);
        })
        if (arr[i+3] && !/^[\d\.]+$/.test(arr[i+3])) { // add to name if 4th string is not a numer or date
            cache.name += arr[i+3]
            i++;
        }
        result.push(cache);
    }
    return result;
};
export function getCourses(pages: PagesType) {
    return pages
        .map(page => page
            .split('\n')
            .filter(v => v)
        )
        .map(e => {
            const course: CourseType = {
                courseNumber: e[3],
                courseName: e[5],
                teacher: e[7],
                students: getStudents(e)
            }
            return course;
        })
};

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
    for (let x = 0; x < data.length/4; x++) {
        sorted.push([]);
        for (let y = 1; y < data[x*4].length; y++) {
            const course = data[x*4+2][y]
            const teachers = data[x*4+3][y].split(' ');
            const cache: period[] = [{
                room: data[x*4][y],
                course,
                teacher: teachers[0],
                week: getWeek(course)
            }, {
                room: data[x*4+1][y],
                course,
                teacher: teachers[1],
                week: getWeek(course)
            }].filter(e => e.room || e.teacher);
            sorted[x].push(...cache);
        }
    }
    return sorted;
}
export const getLessons = (arr: string[]) => sortLessons(JSON.parse(replaceHTMLTableTags(arr)));