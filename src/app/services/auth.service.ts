import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { auth } from "firebase";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    location.reload();
    return this.router.navigate(["/"]);
  }

  setUserData(user: any) {
    console.log("Set user data::", user);
    localStorage.setItem("uid", user.uid);
    localStorage.setItem("FirstName", user.firstName);
    localStorage.setItem("LastName", user.lastName);
    localStorage.setItem("Role", user.role);
    localStorage.setItem("Email", user.email);
    localStorage.setItem("PhoneNo", user.phoneNo);
    localStorage.setItem("Institute", user.institute);
    localStorage.setItem("University", user.university);
    localStorage.setItem("Image", user.file);
    if (user.role == "Subject Expert") {
      localStorage.setItem("subject", user.subject);
    }
    this.router.navigate(["/dashboard"]);
  }

  async updateUserData({ uid, email }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${uid}`);

    const data = {
      uid,
      email,
    };

    userRef.ref.get().then((doc) => {
      if (doc.exists) {
        console.log("User exists!");
        this.setUserData(doc.data());
      } else {
        this.router.navigate(["/authentication/registration"]);
        userRef.set(data);
      }
    });

    console.log("data of logged in user is::", data);
    // this.router.navigate(["/dashboard"]);
    return data;
  }

  async addNewPostData(pointsData: any) {
    console.log(pointsData);
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `user/${pointsData.uid}`
    );
    userRef.ref.get().then((doc: any) => {
      var userData = doc.data();
      if (userData.numPost === undefined) {
        userData.numPost = 1;
      } else {
        userData.numPost++;
      }
      if (userData.postPoints === undefined) {
        userData.postPoints = pointsData.points;
      } else {
        userData.postPoints += pointsData.points;
      }
      if (userData[pointsData.subject] === undefined) {
        userData[pointsData.subject] = pointsData.points;
      } else {
        userData[pointsData.subject] += pointsData.points;
      }
      userRef.set(userData, { merge: true });
    });
  }

  async deleteDiscussionMessage(uid: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${uid}`);
    userRef.ref.get().then((doc: any) => {
      var userData = doc.data();
      console.log("Delete Discussion::", userData);
      if (userData.deletedDiscussion === undefined) {
        userData.deletedDiscussion = 1;
      } else {
        userData.deletedDiscussion += 1;
      }
      userRef.set(userData, { merge: true });
    });
  }

  async changeRole(subject: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `user/${localStorage.getItem("uid")}`
    );
    userRef.ref.get().then((doc: any) => {
      var userData = doc.data();
      userData["role"] = "Subject Expert";
      userData["subject"] = subject;

      userRef.set(userData, { merge: true });
      this.setUserData(userData);
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }

  async addUserProfileInfo(profile: any) {
    console.log("addUserProfileInfo::", profile);
    await this.afAuth.user.subscribe((data: any) => {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(
        `user/${data.uid}`
      );
      if (profile.role != "Subject Expert") {
        delete profile.subject;
      }
      userRef.set(profile, { merge: true });
      userRef.ref.get().then((doc: any) => {
        this.setUserData({ ...doc.data(), ...profile });
      });
    });
  }

  getCurrentUser() {
    return this.afAuth.user;
  }
}
