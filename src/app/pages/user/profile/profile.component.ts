import { Component, OnInit } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { ImageService } from "../../../shared/image.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [
    trigger("fadeInOutTranslate", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("400ms ease-in-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ transform: "translate(0)" }),
        animate("400ms ease-in-out", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  editProfile = true;
  editProfileIcon = "icofont-edit";
  userprofile: any;
  editAbout = true;
  editAboutIcon = "icofont-edit";
  videos: any;
  user: any;
  uid: any = localStorage.getItem("uid");

  public basicContent: string;

  public rowsOnPage = 10;
  public filterQuery = "";
  public sortBy = "";
  public sortOrder = "desc";
  profitChartOption: any;

  constructor(
    public auth: AuthService,
    public service: ImageService,
    public router: Router
  ) {
    // };
    const navigation = this.router.getCurrentNavigation();

    let state = navigation.extras.state as {
      user: any;
    };

    if (state) {
      this.user = state.user;
      this.userprofile = {
        Name: this.user.firstName + " " + this.user.lastName,
        FirstName: this.user.firstName,
        LastName: this.user.lastName,
        Role: this.user.role,
        Email: this.user.email,
        University: this.user.university,
        Institute: this.user.institute,
        Phone: this.user.phoneNo,
        Image: this.user.file,
        uid: this.user.uid,
      };
    } else {
      // this.router.navigate(["/dashboard"]);
      this.userprofile = {
        Name:
          localStorage.getItem("FirstName") +
          " " +
          localStorage.getItem("LastName"),
        FirstName: localStorage.getItem("FirstName"),
        LastName: localStorage.getItem("LastName"),
        Role: localStorage.getItem("Role"),
        Email: localStorage.getItem("Email"),
        University: localStorage.getItem("University"),
        Institute: localStorage.getItem("Institute"),
        Phone: localStorage.getItem("PhoneNo"),
        Image: localStorage.getItem("Image"),
        uid: localStorage.getItem("uid"),
      };
    }
  }

  ngOnInit() {
    console.log(this.uid);
    console.log(this.userprofile.uid);
    this.service
      .getVideoDetailList(this.userprofile.uid)
      .subscribe((valueOfItems) => {
        this.videos = valueOfItems;
        console.log(this.videos);
      });
  }

  profileForm = new FormGroup({
    firstName: new FormControl(
      localStorage.getItem("FirstName"),
      Validators.required
    ),
    lastName: new FormControl(
      localStorage.getItem("LastName"),
      Validators.required
    ),
    phoneNo: new FormControl(
      localStorage.getItem("PhoneNo"),
      Validators.required
    ),
    role: new FormControl(localStorage.getItem("Role"), Validators.required),
    university: new FormControl(
      localStorage.getItem("University"),
      Validators.required
    ),
    institute: new FormControl(
      localStorage.getItem("Institute"),
      Validators.required
    ),
    email: new FormControl(localStorage.getItem("Email"), Validators.required),
  });

  OnSubmit() {
    console.log(this.profileForm.value);
    this.auth.addUserProfileInfo(this.profileForm.value);
  }

  toggleEditProfile() {
    this.editProfileIcon =
      this.editProfileIcon === "icofont-close"
        ? "icofont-edit"
        : "icofont-close";
    this.editProfile = !this.editProfile;
  }

  toggleEditAbout() {
    this.editAboutIcon =
      this.editAboutIcon === "icofont-close" ? "icofont-edit" : "icofont-close";
    this.editAbout = !this.editAbout;
  }
}
