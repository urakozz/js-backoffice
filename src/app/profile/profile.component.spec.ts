/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By, BrowserModule} from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfileComponent } from './profile.component';
import {AppComponent} from "../app.component";
import {MainComponent} from "../main/main.component";
import {Page404Component} from "../page-404/page-404.component";
import {CartComponent, ClearCartDialog, ConfirmOrderDialog} from "../cart/cart.component";
import {LoginComponent} from "../login/login.component";
import {ProductComponent} from "../product/product.component";
import {ProductEditComponent} from "../product-edit/product-edit.component";
import {RegistrationComponent} from "../registration/registration.component";
import {LoginBlockComponent} from "../_components/login-block/login.component";
import {AddressBlockComponent} from "../_components/address-block/address-block.component";
import {ProductBlockComponent} from "../_components/product-block/product-block.component";
import {LinklyPipe} from "../_infrastructure/pipes/linkly.pipe";
import {DialogPaletteBlockComponent} from "../_components/dialog-palette-block/dialog-palette-block.component";
import {OrderContentBlockComponent} from "../_components/order-content-block/order-content-block.component";
import {CartConfirmComponent} from "../cart-confirm/cart-confirm.component";
import {UppercaseDirective} from "../_infrastructure/directives/uppercase.directive";
import {AllowNumbersDirective} from "../_infrastructure/directives/allow-numbers.directive";
import {ProductPdpBlockComponent} from "../_components/product-pdp-block/product-pdp-block.component";
import {DialogLoginBlockComponent} from "../_components/dialog-login-block/dialog-login-block.component";
import {LowercaseDirective} from "../_infrastructure/directives/lowercase.directive";
import {I18nPipe} from "../_infrastructure/modules/i18n/i18n.pipe";
import {I18nDirective} from "../_infrastructure/modules/i18n/i18n.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@angular/material";
import {ROUTES} from "../app.module";
import {UserService} from "../_services/user.service";
import {I18nService} from "../_infrastructure/modules/i18n/i18n.service";
import {APP_BASE_HREF} from "@angular/common";
import {OrderService} from "../_services/order.service";
import {CartService} from "../_services/cart.service";
import {BackendService} from "../_services/backend.service";
import {BackendProductService} from "../_services/backend-product.service";
import {BackendOrderService} from "../_services/backend-order.service";
import {TRANSLATION} from "../_infrastructure/modules/i18n/translations/translation";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    var OrdersComponent;
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MainComponent,
        Page404Component,
        CartComponent,
        LoginComponent,
        ProductComponent,
        ProductEditComponent,
        ProfileComponent,
        RegistrationComponent,
        LoginComponent,
        LoginBlockComponent,
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
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES),
        MaterialModule.forRoot(),
      ],
      providers: [
        UserService, OrderService, CartService, BackendService, BackendProductService, BackendOrderService,
        {provide: I18nService, useFactory: () => new I18nService().init(TRANSLATION)},
        {provide: APP_BASE_HREF, useValue: "/"}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
