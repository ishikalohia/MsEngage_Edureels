import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import * as firebase from "firebase";
import { firebaseConfig } from "../environments/environment";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Welcome ! Guru Able Angular 8+";
  storage: any;
  storageRef: any;
  imageRef: any;
  constructor(private router: Router, public auth: AuthService) {
    this.storage = firebase.storage();
    this.storageRef = firebase.storage().ref();
    this.imageRef = firebase.storage().ref().child("images");
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
