import { AuthGuard } from "./auth.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./layout/admin/admin.component";
import { AuthComponent } from "./layout/auth/auth.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import(
            "./pages/dashboard/dashboard-default/dashboard-default.module"
          ).then((m) => m.DashboardDefaultModule),
        canLoad: [AuthGuard],
      },

      {
        path: "user",
        loadChildren: () =>
          import("./pages/user/profile/profile.module").then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: "subject",
        loadChildren: () =>
          import("./pages/subject-page/subject-page.module").then(
            (m) => m.SimplePageModule
          ),
      },
    ],
  },
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "authentication",
        loadChildren: () =>
          import("./pages/auth/auth.module").then((m) => m.AuthModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
