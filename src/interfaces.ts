export interface StudentType {
    index: number,
    name: string,
    school: string
};
export interface CourseType {
    courseNumber: string,
    courseName: string,
    teacher: string,
    students: StudentType[]
};
export type CoursesType = CourseType[];
export type PagesType = string[];
export interface period {
    room: string,
    course: string,
    teacher: string,
    week: number
}
export type day = period[][];
export enum Week {
    odd = 1,
    even = 2,
    all = 3
};