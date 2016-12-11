import {BrowserModule, Title} from "@angular/platform-browser";
import {NgModule, ErrorHandler} from "@angular/core";
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
import { AutogrowDirective } from "./_infrastructure/directives/autogrow.directive";
import { RegistrationConfirmationComponent } from "./registration-confirmation/registration-confirmation.component";
import {MailService, SENDGRID_KEY} from "./_services/mail.service";
import { UsersComponent } from './users/users.component';
import {BackendUserService} from "./_services/backend-user-service.service";
import {AddressReadBlockComponent} from "./_components/address-block/address-read-block.component";
import {AdminAuthGuardService, AuthGuardService} from "./_services/auth-guard.service";
import {environment} from "../environments/environment";

import {FirebaseDB, firebaseDbInitializer, FIREBASE_KEY} from "./_services/firebase-db.service";
import { OrderMessagesComponent } from './order-messages/order-messages.component';
import { CartSuccessComponent } from './cart-success/cart-success.component';
import {LazyLoadImageModule} from "./_infrastructure/modules/image-lazy-load/image-lazy-load.module";
import {MetrikaService} from "./_services/metrika.service";
import { UserReadBlockComponent } from './_components/user-read-block/user-read-block.component';
import {ImageZoomModule} from "./_infrastructure/modules/image-zoom/image-zoom.module";
import {I18nModule} from "./_infrastructure/modules/i18n/i18n.module";
import {CustomErrorHandler} from "./_infrastructure/error-handler";
import {RAVEN_URL, RavenLoggerService} from "./_services/raven-logger.service";

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
        path: "cart/:id/success",
        component: CartSuccessComponent
    },
    {
        path: "orders",
        component: OrdersComponent
    },
    {
        path: "orders/:id/messages",
        component: OrderMessagesComponent
    },
    {
        path: "profile/:id",
        component: ProfileComponent
    },
    {
        path: "users",
        component: UsersComponent, canActivate: [AdminAuthGuardService]
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
        component: ProductEditComponent, canActivate: [AdminAuthGuardService]
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
        AutogrowDirective,
        RegistrationConfirmationComponent,
        UsersComponent,
        AddressReadBlockComponent,
        OrderMessagesComponent,
        CartSuccessComponent,
        UserReadBlockComponent,
    ],
    imports: [
        BrowserModule,
        LazyLoadImageModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES),
        MaterialModule.forRoot(),
        ImageZoomModule,
        I18nModule
    ],
    entryComponents: [DialogPaletteBlockComponent, DialogLoginBlockComponent, ClearCartDialog, ConfirmOrderDialog],
    providers: [
        UserService, OrderService, CartService, BackendService, BackendProductService, BackendOrderService, BackendUserService,
        AdminAuthGuardService, AuthGuardService,
        MailService,
        MetrikaService,
        Title,
        RavenLoggerService,
        {provide: APP_BASE_HREF, useValue : "/" },
        {provide: FIREBASE_KEY, useValue : environment.DATABASE_KEY },
        {provide: SENDGRID_KEY, useValue: environment.MAIL_KEY},
        {provide: RAVEN_URL, useValue: environment.RAVEN_URL},
        {provide: FirebaseDB, useFactory: firebaseDbInitializer, deps:[FIREBASE_KEY]},
        {provide: ErrorHandler, useClass: CustomErrorHandler}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
