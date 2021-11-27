import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-basic-login",
  templateUrl: "./basic-login.component.html",
  styleUrls: ["./basic-login.component.scss"],
})
export class BasicLoginComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {
    document.querySelector("body").setAttribute("themebg-pattern", "theme1");
  }
}
