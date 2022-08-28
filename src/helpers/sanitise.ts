function sanitise(data: string[]) {
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
export default sanitise;