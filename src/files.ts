import fs, { promises } from 'fs';
import convertPdfFont from './helpers/convertPdfFont';
import getCourses from './helpers/getCourses';
import getLessons from './helpers/getLessons';
import sanitise from './helpers/sanitise';
import { day, Student } from './interfaces';

export async function extractCourses(source: string) {
    console.log('[INFO] Start...');

    const output = fs.createWriteStream('./tmp/course-listings.json');
    output.on('error', (err) => console.log(err));
    console.log(`'course-listings.json' will be generated...`);
    const output2 = fs.createWriteStream('./tmp/student-listings.json');
    output2.on('error', (err) => console.log(err));
    console.log(`'student-listings.json' will be generated...`);
    
    let rawData: string[] = [];
    const stream = fs.createReadStream(source);
    stream.on('data', _buff => {
        const buff = _buff.toString()
        if (typeof buff !== 'string')
            return;
        rawData = [ ...rawData, ...convertPdfFont(buff)];
    });
    stream.on('end', () => {
        const data = getCourses(sanitise(rawData));
        output.write(JSON.stringify(data));
        output.end();
        let index = 0;
        output2.write(JSON.stringify(data.reduce((r1,c1) => {
            return [
                ...r1,
                ...c1.students.reduce((r2,c2) => {
                    const index1 = r1.findIndex(obj => obj.name === c2.name);
                    const index2 = r2.findIndex(obj => obj.name === c2.name);
                    if (index1 >= 0 || index2 >= 0)
                        return r2;
                    return [...r2, {...c2, index: ++index}];

                }, [] as Student[])
            ];
        }, [] as Student[])));
        output2.end();
        console.log('[INFO] End.');
        process.exit();
    });
}
export async function extractLessons() {
    const sources = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
    console.log('[INFO] Start...');

    const output = fs.createWriteStream(`./tmp/lesson-listings.json`);
    output.on('error', (err) => console.log(err));
    console.log(`'lesson-listings.json' will be generated...`);
    
    let days: day[] = [];
    sources.forEach(s => {
        let rawData: string[] = [];
        const stream = fs.createReadStream(`./tmp/${s}.html`);
        stream.on('data', _buff => {
            const buff = _buff.toString()
            if (typeof buff !== 'string')
                return;
            rawData = [ ...rawData, ...buff];
        });
        stream.on('end', () => {
            const data = getLessons(rawData);
            days.push(data);
            if (days.length >= 5) {
                output.write(JSON.stringify(days));
                output.end();
                console.log('[INFO] End.');
            }
        });
    })
}

// export async function readData() {
//     console.log('[INFO] Start...');

//     let data = '';
//     const stream = fs.createReadStream('./tmp/output.txt');
//     stream.on('data', _buff => {
//         const buff = _buff.toString()
//         if (typeof buff !== 'string')
//             return;

//         data += buff;
//     });
//     stream.on('end', () => {
//         console.log('[INFO] End.');
//     });
// }

// export async function readData2() {
//     return promises.readFile('config.json', 'utf8');
// }