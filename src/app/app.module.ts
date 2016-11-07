import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { MaterialModule } from '@angular/material';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {Page404Component} from './page-404/page-404.component';
import {CartComponent} from './cart/cart.component';
import {OrdersComponent} from './orders/orders.component';
import {ProductComponent} from './product/product.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProfileComponent} from './profile/profile.component';
import {RegistrationComponent} from './registration/registration.component';
import {RouterModule} from '@angular/router';
import {UserService} from "./_services/user.service";
import { LoginComponent } from './login/login.component';
import { LoginBlockComponent as LB } from './_components/login/login.component';
import { RegistrationBlockComponent } from './_components/registration-block/registration-block.component';
import { AddressBlockComponent } from './_components/address-block/address-block.component';

const ROUTES = [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registration',
        component: RegistrationComponent
    },
    {
        path: 'cart/:id',
        component: CartComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'profile/:id',
        component: ProfileComponent
    },
    {
        path: 'product',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'product/:id',
        component: ProductComponent
    },
    {
        path: 'product-edit/:id',
        component: ProductEditComponent
    },
    {path: '**', component: Page404Component}
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
        LB,
        RegistrationBlockComponent,
        AddressBlockComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES),
        MaterialModule.forRoot(),
    ],
    providers: [UserService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
