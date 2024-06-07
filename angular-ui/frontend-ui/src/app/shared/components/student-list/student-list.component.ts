import {Component, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StudentService} from "../../services/student.service";
import {SearchCriteria} from "../../model/search/search-criteria.enum";
import {NgForOf, PercentPipe} from "@angular/common";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatIcon} from "@angular/material/icon";
import {StudentInterface} from "../../model/student/student.interface";
import {PageInterface} from "../../model/Page.interface";
import {NavigationService} from "../../services/navigation.service";
import {AppRoutes} from "../../model/AppRoutes";
import {MatDialog} from "@angular/material/dialog";
import {AddScoreDialogComponent} from "../add-score-dialog/add-score-dialog.component";
import {ScoreInterface} from "../../model/student/Score.interface";
import {SearchFieldInterface} from "../../model/search/saerch-field.interface";

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatIcon,
    PercentPipe
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  searchForm: FormGroup;

  criterias: string[];

  readonly page = signal(0);
  readonly previousPage = 1;
  readonly size = signal(2);

  totalPages: number = 0;
  length: number = 0;

  displayedColumns: string[] = ['studentNo', 'fullName', 'mobile', 'email', 'currentScore', 'averageScore', 'action'];
  dataSource: MatTableDataSource<StudentInterface, MatPaginator> = new MatTableDataSource<StudentInterface>([]);

  readonly searchFields: SearchFieldInterface[] = [
    {
      display: "Student Number",
      value: SearchCriteria.STUDENT_NUMBER,
    },
    {
      display: "First Name",
      value: SearchCriteria.FIRST_NAME
    },
    {
      display: "Last Name",
      value: SearchCriteria.LAST_NAME
    },
    {
      display: "Email",
      value: SearchCriteria.EMAIL
    }
  ]

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(private fb: FormBuilder,
              private studentService: StudentService,
              private navigationService: NavigationService,
              public dialog: MatDialog) {
    this.criterias = Object.keys(SearchCriteria);
    this.searchForm = this.createForm();
    this.init();
  }

  private createForm(): FormGroup {
    return  this.fb.group({
      criteria: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
      page: new FormControl(this.page()),
      size: new FormControl(this.size())
    })
  }

  private init() {
    this.studentService.getAll(this.page(), this.size()).then((a) => a.subscribe(page =>{
      this.dataSource = new MatTableDataSource(page?.content ? page.content: []);
      this.setPage(page);
    }), error=> {
      console.error(error);
    })
  }

  private search(criteria: SearchCriteria, page: number = 0, size: number = 25) {
    this.studentService.search(criteria, page, size).then((a) => a.subscribe(page =>{
      this.dataSource = new MatTableDataSource(page?.content ? page.content: []);
      this.setPage(page);
    }), error=> {
      console.error(error);
    })
  }

  private delete(studentNo: string) {
    this.studentService.delete(studentNo).then((d) => d.subscribe(() => {
      this.init();
    }, error => {
      console.error(error);
    }));
  }

  private addScore(score: ScoreInterface) {
    this.studentService.addScore(score).then((d) => d.subscribe(() => {
      this.navigationService.updateRoute(`${AppRoutes.CREATE}/${score.studentNo}`)
    }, error => {
      console.error(error);
    }));
  }

  private setPage(page: PageInterface) {
    this.totalPages = page.totalPages;
    this.length = page.length;
  }

  onAddScore(studentNo: string) {
    const dialogRef = this.dialog.open(AddScoreDialogComponent, {
      data: { studentNo: studentNo, score: 0 },
      height: "280px",
      width: "330px",
    });

    dialogRef.afterClosed().subscribe((score: number) => {
      if (score !== null && score !== undefined) {
        const scoreRequest: ScoreInterface = {
          score,
          studentNo
        }

        this.addScore(scoreRequest);
      }
    });
  }

  onEdit(student: StudentInterface) {
      this.studentService.setSelectedStudent(student)
      this.navigationService.updateRoute(`${AppRoutes.CREATE}/${student.studentNo}`);
  }

  onDelete(studentNo: string, index: number) {
    this.delete(studentNo);
  }

  onSubmit(event: any) {
    if (!this.searchForm.valid) {
      event.target.disabled = true;
      return;
    }

    const formData: any = this.searchForm.value;

    const request: any = {
      searchCriteria: formData.criteria,
      value: formData.value
    };

    this.search(request, this.page(), this.size());

  }

  onPage(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.init();
  }

  onCancel(cancel: any) {
    this.searchForm.reset();
    this.init();
  }

  convertToInt(value: number): number {
    return Math.floor(value);
  }
}
