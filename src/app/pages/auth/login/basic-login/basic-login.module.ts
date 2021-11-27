import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BasicLoginComponent } from "./basic-login.component";
import { BasicLoginRoutingModule } from "./basic-login-routing.module";
import { SharedModule } from "../../../../shared/shared.module";
import {
  AngularFirestoreModule,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

@NgModule({
  imports: [
    CommonModule,
    BasicLoginRoutingModule,
    SharedModule,
    // AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [BasicLoginComponent],
})
export class BasicLoginModule {}
