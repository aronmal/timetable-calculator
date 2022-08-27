import { KursType, PagesType, StudentType } from "./interfaces";

export const toHex = (v: string) => v.charCodeAt(0).toString(16);
export function pdfCharToChar (s: string) {
    const hex = toHex(s);
    if (hex === 'a') {
        return '\n';    // new line
    } else if (hex === '20') {
        return ' ';     // just a space
    } else if (hex === 'dbf8') { // dig = 248 | char = ù
        return 'f';    // special double char font
    } else if (hex === 'de01') {
        return 'l';      // a follower of the double char 'fl'
    } else if (hex === 'ddff') {
        return 'f';      // a follower of the double char 'ff'
    } else if (hex === 'de00') {
        return 'i';      // a follower of the double char 'ff'
    } else if (hex === 'c') { // The character U+000c is invisible.
        return '~';     // being used to seperate pages
    } else if (hex[0] + hex[1] !== 'e0') { // yet unknown chars
        return '0x' + hex;  // display as hex value
    }
    const digit = parseInt("0x" + hex[2] + hex[3]);
    const char = String.fromCharCode(digit+1);
    return char;
};
export function charToPdfChar(s: string) {
    const hex = '0xe0' + s.charCodeAt(0).toString(16);
    // const hex = '0x' + s.charCodeAt(0).toString(16);
    const digit = parseInt(hex.toString());
    // const hex2 = '0x' + (digit-1).toString(16);
    const char = String.fromCharCode(digit-1);
    
    return char;
}
export function getStudents(arr: string[]) {
    let index = 8;
    const template: StudentType = {
        index: 0,
        name: '',
        school: ''
    };
    let cache = {...template};
    let result: StudentType[] = [];
    arr.forEach((s, i) => {
        if (i < 8)
            return;
        if (/^[\d]+$/.test(s) && s !== '1') { // save cache and continue
            result.push(cache);
            cache = {...template};
            index = i;
        }
        if (/^\d+\./.test(s)) { // early return on date
            index ++;
            return;
        }
        if (i - index === 0)
            cache.index = parseInt(s);
        if (i - index === 1)
            cache.name = s;
        if (i - index === 2)
            cache.school = s;
        if (i - index === 3)
            cache.name += s;
    })
    result.push(cache);
    return result;
};
export function kurse(pages: PagesType) {
    return pages
        .map(page => page
            .split('\n')
            .filter(v => v)
        )
        .map(e => {
            const kurs: KursType = {
                kursnummer: e[3],
                kursname: e[5],
                lehrkraft: e[7],
                schueler: getStudents(e)
            }
            return kurs;
        })
}
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