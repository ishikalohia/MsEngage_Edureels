import { Subject } from "rxjs";
import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { ImageService } from "../../../shared/image.service";
import { UserService } from "../../../shared/users.service";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";
import swal from "sweetalert";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard-default",
  templateUrl: "./dashboard-default.component.html",
  styleUrls: ["./dashboard-default.component.scss"],
})
export class DashboardDefaultComponent implements OnInit {
  users: any;
  date =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  constructor(
    private storage: AngularFireStorage,
    public service: ImageService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}
  currentUser: any = {};
  discussionList: boolean = true;
  discussionMessage: boolean = false;
  discussions: any = [];
  selectedImage: any = null;
  selectedVideo: any = null;
  isSubmitted: boolean;
  videos: any = [];
  tags: any = [];
  messages: any = [];
  role = localStorage.getItem("Role");
  underReviewVideos: any = undefined;
  TodayVideos: any = undefined;
  TeachersVideo: any = undefined;
  StudentsVideo: any = undefined;
  videoArray = [];
  currentDiscussion: any;
  discussionDetails: any = [];

  uploading: boolean = false;

  eligibleSE: any = false;
  eligibleSubject: any = "";

  tagOption = [
    { name: "Data Structures", points: 5, Date: "false" },
    { name: "Algorithms", points: 5, Date: "false" },
    { name: "Web Tech", points: 5, Date: "false" },
    { name: "Machine Learning", points: 5, Date: "false" },
    { name: "Data Analysis", points: 5, Date: "false" },
    { name: "Tips & Tricks", points: 5, Date: "false" },
    { name: "Placements", points: 5, Date: "false" },
    { name: "Interview Prep", points: 5, Date: "false" },
    { name: "Competitive Programming", points: 5, Date: "false" },
    { name: "Computer Science", points: 5, Date: "false" },
    { name: "Electric", points: 5, Date: "false" },
    { name: "Information Technology", points: 5, Date: "false" },
  ];

  subjects = [
    { name: "Computer Science", url: "../../../../assets/images/comp.jpg" },
    {
      name: "Information Technology",
      url: "../../../../assets/images/InfoTech.jpg",
    },
    {
      name: "Electrical Engineering",
      url: "../../../../assets/images/elec.jpg",
    },
    { name: "Chemical Engineering", url: "../../../../assets/images/chem.jpg" },
    {
      name: "Mechanical Engineering",
      url: "../../../../assets/images/mech.jpg",
    },
    {
      name: "Telecommunication Engineering",
      url: "../../../../assets/images/telecommunication.jpg",
    },
  ];

  formTemplate = new FormGroup({
    caption: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    videoUrl: new FormControl("", Validators.required),
    subject: new FormControl("", Validators.required),
  });

  tagTemplate = new FormGroup({
    name: new FormControl("", Validators.required),
  });

  discussionTemplate = new FormGroup({
    title: new FormControl("", Validators.required),
    subject: new FormControl("", Validators.required),
  });

  messageTemplate = new FormGroup({
    message: new FormControl("", Validators.required),
  });

  ngOnInit() {
    this.userService.getAllUserProfile().subscribe((users: any) => {
      this.users = users;
      this.currentUser = this.users.find((user) => {
        return user.uid === localStorage.getItem("uid");
      });
      console.log(this.currentUser);
      if (this.currentUser.role == "Student") {
        if (
          this.currentUser["Computer Science"] != undefined &&
          this.currentUser["Computer Science"] >= 500
        ) {
          this.eligibleSE = true;
          this.eligibleSubject = "Computer Science";
        } else if (
          this.currentUser["Information Technology"] != undefined &&
          this.currentUser["Information Technology"] >= 500
        ) {
          this.eligibleSE = true;
          this.eligibleSubject = "Information Technology";
        } else if (
          this.currentUser["Electrical Engineering"] != undefined &&
          this.currentUser["Electrical Engineering"] >= 500
        ) {
          this.eligibleSE = true;
          this.eligibleSubject = "Electrical Engineering";
        } else if (
          this.currentUser["Mechanical Engineering"] != undefined &&
          this.currentUser["Mechanical Engineering"] >= 500
        ) {
          this.eligibleSE = true;
          this.eligibleSubject = "Mechanical Engineering";
        } else if (
          this.currentUser["Telecommunication Engineering"] != undefined &&
          this.currentUser["Telecommunication Engineering"] >= 500
        ) {
          this.eligibleSE = true;
          this.eligibleSubject = "Telecommunication Engineering";
        }
      }

      this.users.sort((user1, user2) =>
        user1.postPoints < user2.postPoints ? 1 : -1
      );
      this.videoArray = [];
      this.service.getTodayTagList().subscribe((valueOfTag) => {
        this.tags = [];
        valueOfTag.forEach((tag: any) => {
          this.tagOption.unshift({
            name: tag.name,
            points: 10,
            Date: tag.date,
          });
          const user = this.users.find((user) => {
            return user.uid === tag.uid;
          });
          this.tags.push({ ...tag, ...user });
        });
        console.log(this.tags);
      });
      if (localStorage.getItem("Role") == "Subject Expert") {
        this.service.getUnderReviewVideo().subscribe((valueofItems) => {
          console.log(valueofItems);
          this.underReviewVideos = [];
          valueofItems.forEach((video: any) => {
            console.log(video.subject, localStorage.getItem("subject"));
            if (video.subject == localStorage.getItem("subject")) {
              const user = this.users.find((user) => {
                return user.uid === video.uid;
              });
              this.underReviewVideos.push({ ...video, ...user });
            }
          });
          this.underReviewVideos.reverse();
          console.log(this.underReviewVideos);
          this.videoArray[0] = {
            Heading: "EduReels to Review",
            videos: this.underReviewVideos,
          };
        });
      }
      this.service.getAllVideos().subscribe((valueOfItems) => {
        console.log("getAllVideos Called");
        this.videos = [];
        this.TodayVideos = [];
        this.StudentsVideo = [];
        this.TeachersVideo = [];
        valueOfItems.forEach((video: any) => {
          const user = this.users.find((user) => {
            return user.uid === video.uid;
          });
          if (video.category.Date == this.date) {
            this.TodayVideos.push({ ...video, ...user });
          } else if (user.role == "Student") {
            this.StudentsVideo.push({ ...video, ...user });
          } else if (user.role == "Teacher") {
            this.TeachersVideo.push({ ...video, ...user });
          }
          this.videos.push({ ...video, ...user });
        });
        this.videos.reverse();
        this.TodayVideos.reverse();
        this.StudentsVideo.reverse();
        this.TeachersVideo.reverse();

        this.videoArray[1] = {
          Heading: "EduReels on Today's Topic",
          videos: this.TodayVideos,
        };

        this.videoArray[2] = {
          Heading: "EduReels by Students",
          videos: this.StudentsVideo,
        };

        this.videoArray[3] = {
          Heading: "EduReels by Teachers",
          videos: this.TeachersVideo,
        };
      });

      this.service.getAllDiscussions().subscribe((valueOfItems) => {
        this.discussions = [];
        valueOfItems.forEach((value: any) => {
          const user = this.users.find((user) => {
            return user.uid === value.uid;
          });
          this.discussions.push({ ...value, ...user });
        });
        console.log(this.discussions);
      });
    });
  }

  openDiscussion(discussion: any) {
    this.discussionMessage = true;
    this.discussionList = false;
    this.currentDiscussion = discussion;
    this.service.getMessages(discussion).subscribe((values: any) => {
      this.messages = [];
      values.forEach((value: any) => {
        const user = this.users.find((user) => {
          return user.uid === value.uid;
        });
        this.messages.push({ ...value, ...user });
      });
      console.log(this.messages);
    });
  }

  openList() {
    this.discussionMessage = false;
    this.discussionList = true;
  }

  openProfile(user: any) {
    this.router.navigate(["/user"], {
      state: { user },
    });
  }

  openSubjectVideos(subject: any) {
    console.log(subject);
    this.router.navigate(["/subject"], {
      state: { subject: subject },
    });
  }

  changeVideoStatus(video: any, status: string) {
    this.videoArray = [];
    this.service.addVideoStatus(video, status);
    if (status == "Pass") {
      this.authService.addNewPostData({
        points: video.category.points,
        subject: video.subject,
        uid: video.uid,
      });
    }
    console.log(video);
  }

  saveVideo(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedVideo = event.target.files[0];
      this.validateFile(this.selectedVideo, event);
    } else {
      this.selectedVideo = null;
    }
  }

  validateFile(file, event: any) {
    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 60) {
        console.log("Invalid Video! video is greater than 60 seacond");
        swal(
          "Invalid Video",
          "Video duration is greater than 60 second. Please try again!",
          "error"
        );
        event.target.value = "";
        return;
      }
    };

    video.src = URL.createObjectURL(file);
  }

  changeRoleToSubjectExpert() {
    this.authService.changeRole(this.eligibleSubject);
  }

  ShowSpinner() {
    console.log("ShowSpinner called...");
    this.spinner.show();
  }

  HideSpinner() {
    console.log("HideSpinner called...");
    this.spinner.hide();
  }

  onAdd(formValue) {
    if (this.tagTemplate.valid) {
      this.service.insertTag({
        name: formValue.name,
        date:
          new Date().getDate() +
          "/" +
          (new Date().getMonth() + 1) +
          "/" +
          new Date().getFullYear(),
        uid: localStorage.getItem("uid"),
      });
      this.tagTemplate.reset();
      this.tagTemplate.setValue({
        name: "",
      });
    }
  }

  addDiscussion(formValue) {
    if (this.discussionTemplate.valid) {
      this.service.insertDiscussion({
        Topic: formValue.title,
        uid: localStorage.getItem("uid"),
        subject: formValue.subject,
      });
    }
  }

  addMessage(formValue) {
    console.log(this.currentDiscussion);
    console.log(formValue);
    if (this.messageTemplate.valid) {
      this.service.insertMessage({
        content: formValue.message,
        uid: localStorage.getItem("uid"),
        discussionId: this.currentDiscussion.discussionId,
      });

      this.messageTemplate.reset();
      this.messageTemplate.setValue({
        message: "",
      });
    }
  }

  deleteMessage(message: any) {
    console.log(message);
    this.service.deleteDiscussionMessage(message);
    if (message.uid != this.currentUser.uid) {
      this.authService.deleteDiscussionMessage(message.uid);
    }
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    this.uploading = true;
    if (this.formTemplate.valid) {
      this.ShowSpinner();
      var filePath = `eduReels/${
        formValue.category.name
      }/${this.selectedVideo.name
        .split(".")
        .slice(0, -1)
        .join(".")}_${new Date().getTime()}`;

      const fileRef = this.storage.ref(filePath);

      this.storage
        .upload(filePath, this.selectedVideo)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              formValue["videoUrl"] = url;
              if (this.currentUser.role === "Student") {
                formValue["status"] = "Review";
                swal(
                  "Under Review",
                  "Your EduReel will be reviewed by our subject Experts before posting.",
                  "success"
                );
              } else {
                formValue["status"] = "Pass";
                swal(
                  "EduReel Posted",
                  "Thanks for uploading the Edureel. It is avaliable for students now!",
                  "success"
                );
              }

              console.log(formValue);
              this.service.insertVideoDetails(formValue);
              this.resetForm();
              this.spinner.hide();
            });
          })
        )
        .subscribe();
    }
  }

  get formControls() {
    return this.formTemplate["controls"];
  }

  resetForm() {
    this.uploading = false;
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption: "",
      videoUrl: "",
      category: "",
      subject: "",
    });
    this.selectedVideo = null;
    this.isSubmitted = false;
  }
}
