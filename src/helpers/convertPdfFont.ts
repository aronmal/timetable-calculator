import { PagesType } from "../interfaces";

const toHex = (v: string) => v.charCodeAt(0).toString(16);
function pdfCharToChar (s: string) {
    const hex = toHex(s);
    const knownHex  = ['a', '20','dbf8','de01','ddff','de00','c'];
    const knownChars = ['\n',' ', 'f',   'l',   'f',   'i',   '~'];
        // 0xdbf8 is a 'f' font char with a follower char to be a double char like 'fl', 'ff' and 'fi'
        // The character U+000c is invisible. Replaced by '~' Being used to seperate pages.
    for (let i = 0; i < knownHex.length; i++) {
        if (hex === knownHex[i])
            return knownChars[i];
    }
    if (hex[0] + hex[1] !== 'e0') // yet unknown chars
        return '0x' + hex;  // display as hex value
    const digit = parseInt("0x" + hex[2] + hex[3]);
    const char = String.fromCharCode(digit+1);
    return char;
};
const convertPdfFont = (s: string) => s.split('').map(v => pdfCharToChar(v)).join('').split('~') as PagesType;
export default convertPdfFont;