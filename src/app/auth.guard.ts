import { AuthService } from "./services/auth.service";
import { Injectable } from "@angular/core";
import { Router, CanLoad, Route } from "@angular/router";
import { Observable } from "rxjs";
import { tap, map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) {}
  canLoad(route: Route): Observable<boolean> {
    return this.auth.getCurrentUser().pipe(
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        if (loggedIn) {
          return true;
        }
        this.router.navigate(["/authentication/login"]);
        return false;
      })
    );
  }
}
