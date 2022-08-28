function charToPdfChar(s: string) {
    const hex = '0xe0' + s.charCodeAt(0).toString(16);
    const digit = parseInt(hex.toString());
    const char = String.fromCharCode(digit-1);
    return char;
}
export default charToPdfChar;