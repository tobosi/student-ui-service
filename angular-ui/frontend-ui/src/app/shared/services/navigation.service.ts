import {Injectable, signal} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AppRoutes} from "../model/AppRoutes";


interface Link {
  text: string,
  url: string
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  currentRoute = signal<String>(this.location.path())

  readonly links = signal<Link[]>([
    {
      text: "Search",
      url: AppRoutes.SEARCH
    },
    {
      text: "Create",
      url: AppRoutes.CREATE
    }
  ])

  constructor(private location: Location,
              private router: Router) {
    this.currentRoute.set(this.location.path());
  }

  updateRoute(url: string, extras: NavigationExtras = {}) {
    this.currentRoute.set(url);
    this.router.navigate([url], extras);
  }

}
