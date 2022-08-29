export interface Student {
    index: number,
    name: string,
    school: string
};
export interface Course {
    courseNumber: string,
    courseName: string,
    teacher: string,
    students: Student[]
};
export type CoursesType = Course[];
export type PagesType = string[];
export interface ExportLesson {
    room: string,
    course: string,
    teacher: string,
    week: number
}
export type day = ExportLesson[][];
export enum WeekEnum {
    odd = 1,
    even = 2,
    all = 3
};
export interface CheckLesson {
    name: string;
    teacher: string;
    hour: number;
};