import { courses, days } from "../tmp/sources";
import { CheckLesson, Course, day } from "./interfaces";

function lessonsFromDay(courses: Course[], day: day, week: number) {
    const uncheckedLessons: CheckLesson[] = [];
    let doSport = false;
    day.forEach((row, hour) => row.forEach(col => {
        if (col.course === 'SPORT' && !doSport) { // Sport for everyone! ;)
            doSport = true;
            uncheckedLessons.push({name: col.course.toLocaleUpperCase(), teacher: '', hour, check: 100});
            return;
        }
        courses.forEach(course => {
            const checkForTeacher = col.teacher.split(' ')[0].split(''), cFT = checkForTeacher;
            const checkedTeacher = checkForTeacher.map(s => course.teacher.toLocaleLowerCase().indexOf(s.toLocaleLowerCase())), cT = checkedTeacher.filter(b => b >= 0);
            const checkForName = col.course.split(' ')[0].split(''), cFN = checkForName;
            const checkedNameShort = checkForName.map(s => course.courseNumber.toLocaleLowerCase().indexOf(s.toLocaleLowerCase())), cNS = checkedNameShort.filter(b => b >= 0);
            const checkedNameLong = checkForName.map(s => course.courseName.toLocaleLowerCase().indexOf(s.toLocaleLowerCase())), cNL = checkedNameLong.filter(b => b >= 0);
            const check = checkedTeacher.reduce((r,c) => r + c, 0)
                + checkedNameShort.reduce((r,c) => r + c, 0)
                + checkedNameLong.reduce((r,c) => r + c, 0);
            if (cT.length === cFT.length && (cNS.length === cFN.length || cNL.length === cFN.length)) {
                if (col.week !== 3)
                    if (col.week !== week)
                        return;
                uncheckedLessons.push({name: col.course.toLocaleUpperCase(), teacher: course.teacher, hour, check});
            }
        })
    }))
    return uncheckedLessons;
};
function checkLessons(uncheckedLessons: CheckLesson[]) {
    const checkedLessons: CheckLesson[] = [];
    uncheckedLessons.sort((a, b) => a.hour - b.hour).forEach(lesson => {
        const index = checkedLessons.findIndex(obj => obj.hour === lesson.hour);
        if (index >= 0) {
            if (checkedLessons[index].check > lesson.check)
                checkedLessons[index] = lesson;
        } else checkedLessons.push(lesson);
    })
    return checkedLessons;
};
function filterFor(name: string) {
    const coursesOfName = courses.filter(course => course.students.filter(student => student.name === name).length);
    // const lessons: {name: string, count: number}[] = [];
    // days.forEach(day => day.forEach(row => row.forEach(col => {
    //     const index = lessons.findIndex(obj => obj.name === col.course);
    //     index >= 0 ? lessons[index].count++ : lessons.push({name: col.course, count: 1});
    // })))
    // console.log(lessons.sort((a, b) => a.count - b.count));

    // console.log(...coursesName.map(course => `"${course.courseName}"`));

    const currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(),0,1);
    const numberOfDays = Math.floor((currentdate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    
    const weekResult = weekNumber % 2 === 0 ? 2 : 1;

    const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
    const dayNumber = currentdate.getDay();
    if (!(dayNumber > 0 && dayNumber < 6)) {
        console.log(false)
        return;
    }
    const day = days[dayNumber - 1];

    const uncheckedLessons = lessonsFromDay(coursesOfName, day, weekResult);
    const checkedLessons = checkLessons(uncheckedLessons);
    const lessons = checkedLessons.map(({check, hour, ...lesson}) => ({...lesson, hour: `${(hour+1)*2-1}. und ${(hour+1)*2}.`}));
    // console.log(lessons);

    dayNames.forEach((s, i) => {
        console.log(s + ':');
        const uncheckedLessons = lessonsFromDay(coursesOfName, days[i], weekResult);
        const checkedLessons = checkLessons(uncheckedLessons);
        const lessons = checkedLessons.map(({check, hour, ...lesson}) => ({...lesson, hour: `${(hour+1)*2-1}. und ${(hour+1)*2}.`}));
        console.log(lessons);
    });
};
export default filterFor;