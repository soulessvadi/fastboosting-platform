import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { ElementsModule } from "./elements";
import { ProfileComponent } from "./_profile/profile.component";
import { OrdersComponent } from "./_orders/orders.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ElementsModule,
  ],
  declarations: [
    ProfileComponent,
    OrdersComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ElementsModule,
  ]
})

export class ComponentsModule {}
