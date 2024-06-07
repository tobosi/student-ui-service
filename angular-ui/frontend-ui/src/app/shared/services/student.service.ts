import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {Observable} from "rxjs";
import {StudentInterface} from "../model/student/student.interface";
import {SearchCriteria} from "../model/search/search-criteria.enum";
import {Router} from "@angular/router";
import {AppRoutes} from "../model/AppRoutes";
import {PageInterface} from "../model/Page.interface";
import {ScoreInterface} from "../model/student/Score.interface";


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly studentUrl = "students";
  private readonly scoreUrl = "scores";

  private selectedStudent = signal<StudentInterface | undefined>(undefined);

  constructor(private http: HttpClient, private configService: ConfigService, private router: Router) {
  }

  public async getRecord(studentNo: string): Promise<Observable<StudentInterface>> {
    return await this.initUrl().then(() => {
      const url: string = `${this.configService.getUrl()}/${this.studentUrl}/${studentNo}`;
      return this.http.get<StudentInterface>(url);
    });

  }

  public async getAll(page: number = 0, size: number = 25): Promise<Observable<PageInterface>> {
    return await this.initUrl().then(() => {
      const params: HttpParams = this.getPaginationParam(page, size);
      return this.http.get<PageInterface>(`${this.configService.getUrl()}/${this.studentUrl}`, {params});
    });
  }

  public async search(criteria: SearchCriteria, page: number = 0, size: number = 25): Promise<Observable<PageInterface>> {
    return await this.initUrl().then(() => {
      const params: HttpParams = this.getPaginationParam(page, size);
      return this.http.post<PageInterface>(`${this.configService.getUrl()}/${this.studentUrl}/search`, criteria, {params});
    });
  }

  public async create(student: StudentInterface): Promise<Observable<StudentInterface>> {
    return await this.initUrl().then(() => {
      return this.http.post<StudentInterface>(`${this.configService.getUrl()}/${this.studentUrl}`, student);
    });
  }

  public async update(studentNo: string, student: StudentInterface): Promise<Observable<StudentInterface>> {
    return await this.initUrl().then(() => {
      return this.http.put<StudentInterface>(`${this.configService.getUrl()}/${this.studentUrl}/${studentNo}`, student);
    });
  }

  public async delete(studentNo: string): Promise<Observable<void>> {
    return await this.initUrl().then(() => {
      return this.http.delete<void>(`${this.configService.getUrl()}/${this.studentUrl}/${studentNo}`);
    });
  }

  public async addScore(scoreReq: ScoreInterface): Promise<Observable<ScoreInterface>> {
    return await this.initUrl().then(() => {
      const url: string = `${this.configService.getUrl()}/${this.scoreUrl}`;
      return this.http.post<ScoreInterface>(url, scoreReq);
    });
  }

  getStudent(): StudentInterface | undefined {
    return this.selectedStudent();
  }

  setSelectedStudent(student: StudentInterface) {
    this.selectedStudent.set(student);
  }

  removeSelectedStudent() {
    this.selectedStudent.set(undefined);
    this.router.navigate([AppRoutes.SEARCH])
  }

  async initUrl() {
    await this.configService.getWsUrl();
  }

  private getPaginationParam(page: number, size: number): HttpParams {
    return  new HttpParams()
      .set("page", page)
      .set("size", size);
  }
}
