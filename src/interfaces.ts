export interface StudentType {
    index: number,
    name: string,
    school: string
};
export interface KursType {
    kursnummer: string,
    kursname: string,
    lehrkraft: string,
    schueler: StudentType[]
};
export type KurseType = KursType[];
export type PagesType = string[];