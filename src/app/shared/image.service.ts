import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import * as uuid from "uuid";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  videoDetailList: AngularFireList<any>;
  tagDetailList: AngularFireList<any>;
  discussionList: AngularFireList<any>;
  messageList: AngularFireList<any>;
  chatMessage: AngularFireList<any>;
  chatList: AngularFireList<any>;
  items: any;
  uid = localStorage.getItem("uid");
  constructor(private firebase: AngularFireDatabase) {}

  addVideoStatus(video: any, status: string) {
    this.firebase.list("/videoDetails", (ref) =>
      ref
        .orderByChild("videoUrl")
        .equalTo(video.videoUrl)
        .on("value", (snapshot) => {
          snapshot.forEach((childSnapshot: any) => {
            childSnapshot.ref.update({ status: status });
          });
        })
    );
  }

  getVideoDetailsBySubject(subject: any) {
    console.log("in getVideoDetails::", subject);
    return this.firebase
      .list("/videoDetails", (ref) =>
        ref.orderByChild("subject").equalTo(subject)
      )
      .valueChanges();
  }

  getVideoDetailList(uid: any) {
    return this.firebase
      .list("/videoDetails", (ref) => ref.orderByChild("uid").equalTo(uid))
      .valueChanges();
  }

  getAllVideos() {
    return this.firebase
      .list("/videoDetails", (ref) =>
        ref.orderByChild("status").equalTo("Pass")
      )
      .valueChanges();
  }

  getUnderReviewVideo() {
    return this.firebase
      .list("/videoDetails", (ref) =>
        ref.orderByChild("status").equalTo("Review")
      )
      .valueChanges();
  }

  insertVideoDetails(videoDetails) {
    this.videoDetailList = this.firebase.list("videoDetails");
    videoDetails["uid"] = localStorage.getItem("uid");
    this.videoDetailList.push(videoDetails);
  }

  insertTag(tagDetails) {
    this.tagDetailList = this.firebase.list("tagDetails");
    this.tagDetailList.push(tagDetails);
  }

  insertDiscussion(discussion) {
    this.discussionList = this.firebase.list("discussionList");
    discussion["discussionId"] = uuid.v4();
    this.discussionList.push(discussion);
  }

  insertMessage(message: any) {
    message["messageId"] = uuid.v4();
    this.messageList = this.firebase.list("messageList");
    this.messageList.push(message);
  }

  deleteDiscussionMessage(message: any) {
    this.firebase.list("/messageList", (ref) =>
      ref
        .orderByChild("messageId")
        .equalTo(message.messageId)
        .on("value", (snapshot) => {
          snapshot.forEach((childSnapshot: any) => {
            childSnapshot.ref.remove();
          });
        })
    );
  }

  getMessages(discussion: any) {
    return this.firebase
      .list("/messageList", (ref) =>
        ref.orderByChild("discussionId").equalTo(discussion.discussionId)
      )
      .valueChanges();
    // return this.firebase.list("/messageList").valueChanges();
  }

  createChat(room: any) {
    this.chatList = this.firebase.list("chatList");
    this.chatList.push({
      roomId: room.roomid,
      user1: this.uid,
      user2: room.uid,
    });
  }

  getChatListWithUser1() {
    return this.firebase
      .list("/chatList", (ref) => ref.orderByChild("user1").equalTo(this.uid))
      .valueChanges();
  }

  getChatListWithUser2() {
    return this.firebase
      .list("/chatList", (ref) => ref.orderByChild("user2").equalTo(this.uid))
      .valueChanges();
  }

  addChatMessage(message: any) {
    console.log(message);
    this.chatMessage = this.firebase.list("chatMessage");
    this.chatMessage.push(message);
  }

  getChatMessage(room: any) {
    return this.firebase
      .list("/chatMessage", (ref) =>
        ref.orderByChild("roomid").equalTo(room.roomId)
      )
      .valueChanges();
  }

  getAllDiscussions() {
    return this.firebase.list("discussionList").valueChanges();
  }

  getTodayTagList() {
    return this.firebase
      .list("/tagDetails", (ref) =>
        ref
          .orderByChild("date")
          .equalTo(
            new Date().getDate() +
              "/" +
              (new Date().getMonth() + 1) +
              "/" +
              new Date().getFullYear()
          )
      )
      .valueChanges();
  }
}
