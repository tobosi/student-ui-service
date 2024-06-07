import {StudentInterface} from "./student/student.interface";

export interface PageInterface {
  length: number;
  totalPages: number;
  content: StudentInterface[]
}
