import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import { Nav } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ViewproductsPage } from '../pages/products/viewproducts/viewproducts';
import { OrdersPage } from '../pages/orders/orders'
import { LoginPage } from '../pages/public/login/login';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ViewcartPage } from '../pages/cart/viewcart/viewcart';
import { DetailcartPage } from '../pages/cart/detailcart/detailcart';
import { ManagecustomersProvider } from '../providers/managecustomers/managecustomers';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ManageproductsProvider } from '../providers/manageproducts/manageproducts';
import { IonicStorageModule } from '@ionic/storage';
import { CartserviceProvider } from '../providers/cartservice/cartservice';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file';
import {GlobalProvider} from '../providers/global/global';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ViewproductsPage,
    OrdersPage,
    LoginPage, ViewcartPage,
    DetailcartPage, AboutUsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,ViewproductsPage,
    OrdersPage,LoginPage,
    ViewcartPage,DetailcartPage, AboutUsPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ManagecustomersProvider, HttpClient,
    ManageproductsProvider,
    CartserviceProvider,
    InAppBrowser ,GlobalProvider
  ]
})
export class AppModule {}
