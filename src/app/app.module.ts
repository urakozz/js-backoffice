import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {APP_BASE_HREF} from "@angular/common";

import {AppComponent} from "./app.component";
import {MainComponent} from "./main/main.component";
import {Page404Component} from "./page-404/page-404.component";
import {CartComponent, ClearCartDialog, ConfirmOrderDialog} from "./cart/cart.component";
import {OrdersComponent} from "./orders/orders.component";
import {ProductComponent} from "./product/product.component";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {ProfileComponent} from "./profile/profile.component";
import {RegistrationComponent} from "./registration/registration.component";
import {RouterModule} from "@angular/router";
import {UserService} from "./_services/user.service";
import {LoginComponent} from "./login/login.component";
import {LoginBlockComponent} from "./_components/login-block/login.component";
import {RegistrationBlockComponent} from "./_components/registration-block/registration-block.component";
import {AddressBlockComponent} from "./_components/address-block/address-block.component";
import {BackendProductService} from "./_services/backend-product.service";
import {BackendOrderService} from "./_services/backend-order.service";
import {BackendService} from "./_services/backend.service";
import {ProductBlockComponent} from "./_components/product-block/product-block.component";
import {LinklyPipe} from "./_infrastructure/pipes/linkly.pipe";
import {OrderService} from "./_services/order.service";
import {CartService} from "./_services/cart.service";
import {OrderContentBlockComponent} from "./_components/order-content-block/order-content-block.component";
import {CartConfirmComponent} from "./cart-confirm/cart-confirm.component";
import {UppercaseDirective} from "./_infrastructure/directives/uppercase.directive";
import {AllowNumbersDirective} from "./_infrastructure/directives/allow-numbers.directive";
import {ProductPdpBlockComponent} from "./_components/product-pdp-block/product-pdp-block.component";
import {DialogPaletteBlockComponent} from "./_components/dialog-palette-block/dialog-palette-block.component";
import {DialogLoginBlockComponent} from "./_components/dialog-login-block/dialog-login-block.component";
import {LowercaseDirective} from "./_infrastructure/directives/lowercase.directive";
import {I18nService} from "./_services/i18n.service";
import {I18nPipe} from "./_infrastructure/pipes/i18n.pipe";
import {TRANSLATION} from "./_infrastructure/translations/translation";
import { I18nDirective } from "./_infrastructure/directives/i18n.directive";
import { AutogrowDirective } from "./_infrastructure/directives/autogrow.directive";
import { RegistrationConfirmationComponent } from "./registration-confirmation/registration-confirmation.component";
import {MailService} from "./_services/mail.service";
import { UsersComponent } from './users/users.component';
import {BackendUserService} from "./_services/backend-user-service.service";
import {AddressReadBlockComponent} from "./_components/address-block/address-read-block.component";
import {AuthGuardService} from "./_services/auth-guard.service";

export const ROUTES = [
    {
        path: "",
        component: MainComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "registration",
        component: RegistrationComponent
    },
    {
        path: "registration/confirmation",
        component: RegistrationConfirmationComponent
    },
    {
        path: "cart/:id",
        component: CartComponent
    },
    {
        path: "cart/:id/confirm",
        component: CartConfirmComponent
    },
    {
        path: "orders",
        component: OrdersComponent
    },
    {
        path: "profile/:id",
        component: ProfileComponent
    },
    {
        path: "users",
        component: UsersComponent, canActivate: [AuthGuardService]
    },
    {
        path: "product",
        redirectTo: "",
        pathMatch: "full"
    },
    {
        path: "product/:id",
        component: ProductComponent
    },
    {
        path: "product-edit/:id",
        component: ProductEditComponent, canActivate: [AuthGuardService]
    },
    {path: "**", component: Page404Component}
];

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        Page404Component,
        CartComponent,
        LoginComponent,
        OrdersComponent,
        ProductComponent,
        ProductEditComponent,
        ProfileComponent,
        RegistrationComponent,
        LoginComponent,
        LoginBlockComponent,
        RegistrationBlockComponent,
        AddressBlockComponent,
        ProductBlockComponent,
        LinklyPipe,
        DialogPaletteBlockComponent,
        ClearCartDialog,
        OrderContentBlockComponent,
        ConfirmOrderDialog,
        CartConfirmComponent,
        UppercaseDirective,
        AllowNumbersDirective,
        ProductPdpBlockComponent,
        DialogPaletteBlockComponent,
        DialogLoginBlockComponent,
        LowercaseDirective,
        I18nPipe,
        I18nDirective,
        AutogrowDirective,
        RegistrationConfirmationComponent,
        UsersComponent,
        AddressReadBlockComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES),
        MaterialModule.forRoot(),
    ],
    entryComponents: [DialogPaletteBlockComponent, DialogLoginBlockComponent, ClearCartDialog, ConfirmOrderDialog],
    providers: [
        UserService, OrderService, CartService, BackendService, BackendProductService, BackendOrderService, BackendUserService,
        AuthGuardService,
        MailService,
        {provide: I18nService, useFactory: () => new I18nService().init(TRANSLATION)},
        {provide: APP_BASE_HREF, useValue : "/" }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
