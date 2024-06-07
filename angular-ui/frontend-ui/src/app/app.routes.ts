import {Routes} from '@angular/router';
import {CreateComponent} from "./shared/components/create/create.component";
import {StudentListComponent} from "./shared/components/student-list/student-list.component";

export const routes: Routes = [
  { path: "search", component: StudentListComponent, pathMatch: "full" },
  { path: "create", component: CreateComponent, pathMatch: "full" },
  { path: "create/:studentNo", component: CreateComponent, pathMatch: "full" }
];
