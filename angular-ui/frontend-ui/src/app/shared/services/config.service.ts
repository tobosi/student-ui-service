import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {first, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private url = signal("");

  constructor(private http: HttpClient) {
  }

  async getWsUrl() {
    return await this.retrieveConfigs().then((configs) => {
      this.url.set(configs.url);
    });
  }

  private async retrieveConfigs() {
    return await this.getConfig().pipe(first()).toPromise();
  }

  private getConfig(): Observable<any> {
    return this.http.get("/config");
  }

  getUrl(): string {
    return this.url();
  }
}
