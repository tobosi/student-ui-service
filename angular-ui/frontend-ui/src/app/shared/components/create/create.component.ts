import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import * as countrycodes from "country-codes-list";
import {CountryData} from "country-codes-list";
import {NavigationService} from "../../services/navigation.service";
import {AppRoutes} from "../../model/AppRoutes";
import {StudentInterface} from "../../model/student/student.interface";
import {StudentService} from "../../services/student.service";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnDestroy {

  createStudentForm: FormGroup;
  private readonly required = Validators.required;
  private readonly region = "Africa";
  readonly countryCodes: CountryData[] = [];

  constructor(private fb: FormBuilder,
              private navigationService: NavigationService,
              private studentService: StudentService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(s => {
      const param = s["studentNo"];
      if (this.isNotNull(param)) {
        if (!this.isNotNull(this.getStudent())) {
          this.createForm();
          this.getRecord(param);
        }
      }
    });

    this.createStudentForm = this.createForm();
    this.countryCodes = countrycodes.all().filter((country: CountryData) => country.region === this.region);
  }

  private createForm(): FormGroup {
    return  this.fb.group({
      firstName: new FormControl(this.getValue(this.getStudent(), "name"), [this.required]),
      lastName: new FormControl(this.getValue(this.getStudent(), "surname"), [this.required]),
      countryCode: new FormControl(this.getValue(this.getStudent(), "countryCode"), [this.required]),
      cellphoneNo: new FormControl(this.getValue(this.getStudent(), "mobile"), [this.required, Validators.pattern("^[0-9]{9}$")]),
      email: new FormControl(this.getValue(this.getStudent(), "email"), [this.required, Validators.email]),
      dob: new FormControl(this.getValue(this.getStudent(), "dateOfBirth"), [this.required]),
      score: new FormControl(this.getValue(this.getStudent(), "currentScore"), [Validators.min(0), Validators.max(100)])
    })
  }

  onSubmit(event: any) {
    if (!this.createStudentForm.valid) {
      event.target.disabled = true;
      return;
    }

    if (!this.isNotNull(this.getStudent()) && !this.isNotNull(this.getStudent()?.studentNo)) {
      this.create(this.getRequest());
    } else {
      this.update(this.getStudent()?.studentNo, this.getRequest());
    }

  }

  private getRequest(): StudentInterface {
    const formData: any = this.createStudentForm.value;

    return  {
      name: formData.firstName,
      surname: formData.lastName,
      mobile: `+${formData.countryCode}${formData.cellphoneNo}`,
      email: formData.email,
      dateOfBirth: this.transformDate(formData.dob),
      currentScore: formData.score
    };
  }

  private transformDate(date: string): string {
    return  new DatePipe('en-US').transform(date, 'dd/MM/yyyy') as string;
  }

  private create(request: StudentInterface) {
    this.studentService.create(request).then((a) => a.subscribe(student =>{
      this.navigationService.updateRoute(AppRoutes.SEARCH);
    }), error=> {
      console.error(error);
    });
  }

  private update(studentNo: any, request: StudentInterface) {
    this.studentService.update(studentNo, request).then((a) => a.subscribe(student =>{
      this.navigationService.updateRoute(AppRoutes.SEARCH);
    }), error=> {
      console.error(error);
    });
  }

  private getRecord(studentNo: string) {
    this.studentService.getRecord(studentNo).then((a) => a.subscribe(student =>{
      this.studentService.setSelectedStudent(student);
      this.createStudentForm = this.createForm();
    }), error=> {
      console.error(error);
    });
  }

  private getValue(student: any | undefined, field: string) {
    return this.isNotNull(student) ? student[field] : "";
  }

  private getStudent(): StudentInterface | undefined {
    return this.studentService.getStudent()
  }

  onCancel(cancel: any) {
    this.navigationService.updateRoute(AppRoutes.SEARCH);
  }

  ngOnDestroy(): void {
    this.studentService.removeSelectedStudent();
  }

  private isNotNull(data: any) {
    return data !== undefined && data !== null;
  }


}
