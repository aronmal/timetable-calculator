import fs, { promises } from 'fs';
import { convert, kurse, sanitise } from './helpers';
import { KurseType } from './interfaces';

export async function extract(source: string) {
    console.log('[INFO] Start...');

    const output = fs.createWriteStream('./tmp/output.txt');
    output.on('error', (err) => console.log(err));
    console.log(1);
    
    let data: KurseType = [];
    let rawData: string[] = [];
    const stream = fs.createReadStream(source);
    stream.on('data', _buff => {
        const buff = _buff.toString()
        if (typeof buff !== 'string')
            return;
        rawData = [ ...rawData, ...convert(buff)];
    });
    stream.on('end', () => {
        console.log('[INFO] End.');
        data = kurse(sanitise(rawData));
        output.write(JSON.stringify(data));
        output.end();
        process.exit();
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