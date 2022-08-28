import fs, { promises } from 'fs';
import { getLessons, convert, getCourses, sanitise } from './helpers';

export async function extractCourses(source: string) {
    console.log('[INFO] Start...');

    const output = fs.createWriteStream('./tmp/course-listings.json');
    output.on('error', (err) => console.log(err));
    console.log(1);
    
    let rawData: string[] = [];
    const stream = fs.createReadStream(source);
    stream.on('data', _buff => {
        const buff = _buff.toString()
        if (typeof buff !== 'string')
            return;
        rawData = [ ...rawData, ...convert(buff)];
    });
    stream.on('end', () => {
        const data = getCourses(sanitise(rawData));
        output.write(JSON.stringify(data));
        output.end();
        console.log('[INFO] End.');
        process.exit();
    });
}
export async function extractLessons(source: string, i: number) {
    console.log('[INFO] Start...');

    const output = fs.createWriteStream(`./tmp/${i}.json`);
    output.on('error', (err) => console.log(err));
    console.log(`'${i}.json' will be generated...`);
    
    let rawData: string[] = [];
    const stream = fs.createReadStream(`./tmp/${source}.html`);
    stream.on('data', _buff => {
        const buff = _buff.toString()
        if (typeof buff !== 'string')
            return;
        rawData = [ ...rawData, ...buff];
    });
    stream.on('end', () => {
        const data = getLessons(rawData);
        output.write(JSON.stringify(data));
        output.end();
        console.log('[INFO] End.');
    });
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