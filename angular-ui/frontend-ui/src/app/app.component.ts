import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavigationService} from "./shared/services/navigation.service";
import {ConfigService} from "./shared/services/config.service";
import {HttpClientModule} from "@angular/common/http";
import {JsonPipe} from "@angular/common";
import {AppRoutes} from "./shared/model/AppRoutes";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  constructor(public navigationService: NavigationService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  navigate(url: string) {
    if (this.navigationService.currentRoute().indexOf(url) === -1) {
      this.navigationService.updateRoute(url);
      this.router.navigate([url]);
    }
  }

  protected readonly AppRoutes = AppRoutes;
}
