export interface StudentInterface {
  studentNo?: string;
  name: string;
  surname: string;
  email: string;
  countryCode?: number
  mobile: string;
  dateOfBirth: Date | string;
  currentScore: number;
  average?: number
}
