import { User } from "../../services/user.model";
import { UserService } from "../../shared/users.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ImageService } from "../../shared/image.service";
import { analytics } from "firebase";
import { Subject } from "rxjs";
import { AnimateTimings } from "@angular/animations";

@Component({
  selector: "app-simple-page",
  templateUrl: "./subject-page.component.html",
  styleUrls: ["./subject-page.component.scss"],
})
export class SimplePageComponent implements OnInit {
  public subject: any;
  users: any;
  teacherVideos: any = [];
  studentVideos: any = [];
  videoArray: any = [];

  constructor(
    public router: Router,
    public userService: UserService,
    public service: ImageService
  ) {
    const navigation = this.router.getCurrentNavigation();

    let state = navigation.extras.state as {
      subject: any;
    };

    if (state) {
      this.subject = state.subject;
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }

  subjectDetails: any;

  ngOnInit() {
    this.subjectDetails = this.subject;
    console.log("Subject Details::", this.subjectDetails);
    this.userService.getAllUserProfile().subscribe((users: any) => {
      this.users = users;
      this.service
        .getVideoDetailsBySubject(this.subjectDetails.name)
        .subscribe((videos: any) => {
          this.studentVideos = [];
          this.teacherVideos = [];
          this.videoArray = [];
          videos.forEach((video: any) => {
            if (video.subject == localStorage.getItem("subject")) {
              const user = this.users.find((user) => {
                return user.uid === video.uid;
              });
              if (user.role == "Teacher") {
                this.teacherVideos.push({ ...video, ...user });
              } else if (user.role == "Student") {
                this.studentVideos.push({ ...video, ...user });
              }
              this.teacherVideos.reverse();
              this.studentVideos.reverse();

              this.videoArray[0] = {
                Heading: "EduReels by Teachers",
                videos: this.teacherVideos,
              };
              this.videoArray[1] = {
                Heading: "EduReels by Students",
                videos: this.studentVideos,
              };
            }
          });
        });
    });
  }
}
