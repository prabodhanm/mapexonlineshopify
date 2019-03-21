import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartserviceProvider } from '../../providers/cartservice/cartservice';
import { ViewcartPage } from '../cart/viewcart/viewcart'
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  cart : any = [];
  loginuser : string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, private cartservice : CartserviceProvider,
    private storage : Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
    this.cart = this.cartservice.getcart();

    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });
  }

  viewcart(){
    this.cart = this.cartservice.getcart();
    // this.router.navigateByUrl('viewmycart');

    console.log('Print cart details in home ', this.cart);
    if (this.cart.length > 0){
      this.navCtrl.push(ViewcartPage);
    }
  }

  logout() {
    this.storage.set("email","");
    this.loginuser = "";
  }

}
