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
    }
    const digit = parseInt("0x" + hex[2] + hex[3]);
    const char = String.fromCharCode(digit+1);
    return char;
};
export function schueler(arr: string[]) {
    const filered: string[] = arr
        .filter((_,i) => !(i < 8 || i > arr.length-2));
    const result: StudentType[] = [];
    filered.forEach((e, i) => {
        if ((i % 3) !== 0)
            return;
        result.push({index: parseInt(e), name: arr[i+9], school: arr[i+10]})
    })
    return result;
};

export function kurse(pages: string[]) {
    return pages
        .map(page => page
            .split('\n')
            .filter(v => v)
        )
        .map(e => { 
            const kurs: KurseType = {
                kursnummer: e[3],
                kurs: e[5],
                lehrkraft: e[7],
                schueler: schueler(e)
            }
            return kurs;
        })
}
export const convert = (s: string) => s.split('').map(v => pdfCharToChar(v)).join('').split('~');