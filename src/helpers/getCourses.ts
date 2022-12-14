import { Course, PagesType, Student } from "../interfaces";

function getStudents(arr: string[]) {
    let result: Student[] = [];
    for (let i = 8; i < arr.length-2; i += 3) {
        const cache: Student = {
            index: parseInt(arr[i]),
            name: arr[i+1],
            school: arr[i+2]
        };
        [0,1,2].forEach(n => {
            if (!/^\d+\./.test(arr[i+n])) // early return on NO date
                return;
            i ++; // else increment index and correct
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
function getCourses(pages: PagesType) {
    return pages
        .map(page => page
            .split('\n')
            .filter(v => v)
        )
        .map(e => {
            const course: Course = {
                courseNumber: e[3],
                courseName: e[5],
                teacher: e[7],
                students: getStudents(e)
            }
            return course;
        })
};
export default getCourses;