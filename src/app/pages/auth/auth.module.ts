import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  declarations: [],
})
export class AuthModule {}
