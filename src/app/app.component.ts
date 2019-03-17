import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav, MenuController  } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { ViewproductsPage } from '../pages/products/viewproducts/viewproducts';
import { OrdersPage } from '../pages/orders/orders'
import { LoginPage } from '../pages/public/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav :Nav;
  rootPage:any = HomePage;
//private navCtrl : NavController,

  // pages : Array<{title:string,component:any, url:string}>;

  pages : any;
  selectedMenu: any;
  showLevel1 = null;
  showLevel2 = null;
  constructor(platform: Platform, statusBar: StatusBar,
     splashScreen: SplashScreen, private menuCtrl : MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      {title:'Home',component:HomePage, url:'home'},
      {
        title:'Products',
        subpages : [{
          title: 'Fruits',
          component : ViewproductsPage
        },
        {
          title : 'Grains',
          component: ViewproductsPage
        }],
        component:ViewproductsPage,
        url:'home'
      },
      {title:'Orders',component:OrdersPage, url:'home'},
      {title:'Login',component:LoginPage, url:'log-in'}
    ]
  }

  // openPage(page){
  //   console.log('Page clicked..', page.component);
  //   this.nav.setRoot(page.component);
  // }

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  toggleLevel1(page, idx, index) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      if(page.subpages){
        this.showLevel1 = idx;
      }

      this.openPage(page,index);
    }
  };

  toggleLevel2(page,idx, index) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
      console.log('Open page now...');
      this.openPage(page,index);
    }
  };

  openPage(page, index) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log('printing page ', page );
    console.log('print index ' , index);
    console.log(page.component);


    if (page.subpages) {
      console.log('Page is having sub pages...');
      if (this.selectedMenu) {
        this.selectedMenu = 0;
      } else {
        this.selectedMenu = index;
      }
    } else {
      console.log('Opening a page...');
      this.nav.setRoot(page.component);
      this.menuCtrl.close();
    }
  }
}

