import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SimplePageRoutingModule } from "./subject-page-routing.module";
import { SimplePageComponent } from "./subject-page.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [CommonModule, SimplePageRoutingModule, SharedModule],
  declarations: [SimplePageComponent],
})
export class SimplePageModule {}
