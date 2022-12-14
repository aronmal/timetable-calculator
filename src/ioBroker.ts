import { courses, days } from "../tmp/sources";
import { CheckLesson, Course, day } from "./interfaces";

const sanitise = (s: string) => s.replaceAll('-', '');
const low = (s: string) => s.toLocaleLowerCase();
function lessonsFromDay(courses: Course[], day: day, week: number) {
    const uncheckedLessons: CheckLesson[] = [];
    let doSport = false;
    day.forEach((row, hour) => row.forEach(col => {
        if (col.course === 'SPORT' && !doSport) { // Sport for everyone! ;)
            doSport = true;
            uncheckedLessons.push({name: col.course.toLocaleUpperCase(), teacher: '', hour});
            return;
        }
        courses.forEach(course => {
            const checkForTeacher = sanitise(col.teacher.split(' ')[0]), cFT = low(checkForTeacher);
            const checkedTeacher = low(sanitise(course.teacher)).indexOf(cFT) >= 0, cT = checkedTeacher;
            const checkedTeacher2 = /\(\d+\)/.test(col.teacher) ? course.teacher.indexOf(col.teacher.slice(...[1,2].map(n => col.teacher.indexOf('(')+n))) >= 0 : true, cT2 = checkedTeacher2;
            const checkForName = sanitise(col.course.split(' ')[0]), cFN = low(checkForName);
            const checkedNameShort = low(sanitise(course.courseNumber)).indexOf(cFN) >= 0, cNL = checkedNameShort;
            const checkedNameLong = low(sanitise(course.courseName)).indexOf(cFN) >= 0, cNS = checkedNameLong;
            if (cT && cT2 && (cNS || cNL)) {
                if (col.week !== 3)
                    if (col.week !== week)
                        return;
                uncheckedLessons.push({name: col.course.toLocaleUpperCase(), teacher: course.teacher, hour});
            }
        })
    }))
    return uncheckedLessons;
};
function getDate() {
    const currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(),0,1);
    const numberOfDays = Math.floor((currentdate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    
    const weekResult = weekNumber % 2 === 0 ? 2 : 1;

    const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
    const dayNumber = currentdate.getDay();
    if (!(dayNumber > 0 && dayNumber < 6)) {
        console.log(false)
        return {weekResult, dayNames};
    }
    const day = days[dayNumber - 1];
    return {weekResult, dayNames, day};
}
function filterFor(name: string) {
    const coursesOfName = courses.filter(course => course.students.filter(student => student.name === name).length);

    const {weekResult, dayNames, day} = getDate();
    if (!day)
        return;

    const rawLessons = lessonsFromDay(coursesOfName, day, weekResult);
    const lessons = rawLessons.map(({hour, ...lesson}) => ({...lesson, hour: `${(hour+1)*2-1}. und ${(hour+1)*2}.`}));
    // console.log(lessons);

    dayNames.forEach((s, i) => {
        console.log(s + ':');
        const rawLessons = lessonsFromDay(coursesOfName, days[i], weekResult);
        const lessons = rawLessons.map(({hour, ...lesson}) => ({...lesson, hour: `${(hour+1)*2-1}. und ${(hour+1)*2}.`}));
        console.log(lessons);
    });
};
export default filterFor;