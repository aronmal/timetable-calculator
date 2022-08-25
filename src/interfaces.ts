interface StudentType {
    index: number,
    name: string,
    school: string
}
interface KurseType {
    kursnummer: string,
    kurs: string,
    lehrkraft: string,
    schueler: StudentType[]
}