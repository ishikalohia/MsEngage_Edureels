import { finalize } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { AuthService } from "../../../../services/auth.service";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-basic-reg",
  templateUrl: "./basic-reg.component.html",
  styleUrls: ["./basic-reg.component.scss"],
})
export class BasicRegComponent implements OnInit {
  constructor(public auth: AuthService, private storage: AngularFireStorage) {}
  selectedImage: any;
  selectedRole: any;
  selectedSubject: any;
  role = ["Student", "Teacher", "Subject Expert"];
  subjects = [
    "Computer Science",
    "Information Technology",
    "Electrical Engineering",
    "Chemical Engineering",
    "Mechanical Engineering",
    "Telecommunication Engineering",
  ];

  ngOnInit() {
    document.querySelector("body").setAttribute("themebg-pattern", "theme1");
  }

  profileForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    phoneNo: new FormControl("", Validators.required),
    role: new FormControl(""),
    university: new FormControl("", Validators.required),
    institute: new FormControl("", Validators.required),
    file: new FormControl("", Validators.required),
    subject: new FormControl(""),
  });

  SaveImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    } else {
      this.selectedImage = null;
    }
  }

  showSubject() {
    console.log(this.selectedSubject);
  }

  showRole() {
    console.log(this.selectedRole);
  }

  ShowInput(event: any) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
    }
    console.log(event);
  }

  OnSubmit() {
    console.log(this.profileForm.value);
    console.log(this.profileForm.value.file.split(".").slice(0, -1).join("."));
    var filePath = `profileImage/${this.selectedImage.name
      .split(".")
      .slice(0, -1)
      .join(".")}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.storage
      .upload(filePath, this.selectedImage)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.profileForm.value.file = url;
            this.auth.addUserProfileInfo(this.profileForm.value);
          });
        })
      )
      .subscribe();
  }
}
