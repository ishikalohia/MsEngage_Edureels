import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxSpinnerModule } from "ngx-spinner";
import { DashboardDefaultRoutingModule } from "./dashboard-default-routing.module";
import { DashboardDefaultComponent } from "./dashboard-default.component";
import { SharedModule } from "../../../shared/shared.module";
import { ChartModule } from "angular2-chartjs";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireStorageModule } from "@angular/fire/storage";

@NgModule({
  imports: [
    CommonModule,
    DashboardDefaultRoutingModule,
    SharedModule,
    ChartModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    NgxSpinnerModule,
  ],
  declarations: [DashboardDefaultComponent],
})
export class DashboardDefaultModule {}
