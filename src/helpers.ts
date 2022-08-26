import { KurseType, KursType, PagesType, StudentType } from "./interfaces";

export const toHex = (v: string) => v.charCodeAt(0).toString(16);
export function pdfCharToChar (s: string) {
    const hex = toHex(s);
    if (hex === 'a') {
        return '\n';    // new line
    } else if (hex === '20') {
        return ' ';     // just a space
    } else if (hex === 'dbf8') { // dig = 248 | char = ù
        return 'fl';    // special font double char
    } else if (hex === 'de01') { // dig = 1
        return '';      // always a follower of the double char 'fl'
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
        if (/^[\d\.]+$/.test(s) && parseInt(s) !== 1) {
            result.push(cache);
            cache = {...template};
            index = i;
        }
        if (i > arr.length-2)
            return;
        if (i - index === 0)
            cache.index = parseInt(s);
        if (i - index === 1)
            cache.name = s;
        if (i - index === 2)
            cache.school = s;
        if (i - index === 3)
            cache.name += s;
    })
    //     .filter((_,i) => !(i < 8 || i > arr.length-2));
    // filered.forEach((e, i) => {
    //     if ((i % 3) !== 0)
    //         return;
    //     result.push({index: parseInt(e), name: arr[i+9], school: arr[i+10]})
    // })
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