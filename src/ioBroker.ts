import { courses, days } from "../tmp/sources";
import { CheckLesson, Course, day } from "./interfaces";

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
            const checkForTeacher = col.teacher.split(' ')[0].replaceAll(/\W/g, ''), cFT = checkForTeacher.toLocaleLowerCase();
            const checkedTeacher = course.teacher.replaceAll(/\W/g, '').toLocaleLowerCase().indexOf(cFT) >= 0, cT = checkedTeacher;
            const checkForName = col.course.split(' ')[0].replaceAll(/\W/g, ''), cFN = checkForName.toLocaleLowerCase();
            const checkedNameShort = course.courseNumber.replaceAll(/\W/g, '').toLocaleLowerCase().indexOf(cFN) >= 0, cNL = checkedNameShort;
            const checkedNameLong = course.courseName.replaceAll(/\W/g, '').toLocaleLowerCase().indexOf(cFN) >= 0, cNS = checkedNameLong;
            // if (col.course === 'NL')
            // if (col.course === 'DE' && course.teacher === 'Ostendorf')
            // if (col.teacher === 'Bräu' && course.teacher === 'Bräutigam')
            //     console.log(course.courseNumber, course.teacher, cFT, col.teacher.split(' ')[0], cT, cFN, cNS , cNL, checkForName);
            if (cT && (cNS || cNL)) {
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
    // const lessons: {name: string, count: number}[] = [];
    // days.forEach(day => day.forEach(row => row.forEach(col => {
    //     const index = lessons.findIndex(obj => obj.name === col.course);
    //     index >= 0 ? lessons[index].count++ : lessons.push({name: col.course, count: 1});
    // })))
    // console.log(lessons.sort((a, b) => a.count - b.count));

    // console.log(...coursesName.map(course => `"${course.courseName}"`));

    const {weekResult, dayNames, day} = getDate();
    if (!day)
        return;

    const rawLessons = lessonsFromDay(coursesOfName, day, weekResult);
    const lessons = rawLessons.map(({hour, ...lesson}) => ({...lesson, hour: `${(hour+1)*2-1}. und ${(hour+1)*2}.`}));
    // console.log(lessons);

    dayNames.forEach((s, i) => {
        console.log(s + ':');
        const rawLessons = lessonsFromDay(coursesOfName, day, weekResult);
        const lessons = rawLessons.map(({hour, ...lesson}) => ({...lesson, hour: `${(hour+1)*2-1}. und ${(hour+1)*2}.`}));
        console.log(lessons);
    });
};
export default filterFor;