import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BasicRegComponent } from "./basic-reg.component";
import { BasicRegRoutingModule } from "./basic-reg-routing.module";
import { SharedModule } from "../../../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";

@NgModule({
  imports: [
    CommonModule,
    BasicRegRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  declarations: [BasicRegComponent],
})
export class BasicRegModule {}
