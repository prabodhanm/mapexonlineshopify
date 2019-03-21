import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManageproductsProvider } from '../../providers/manageproducts/manageproducts';
import { CartserviceProvider } from '../../providers/cartservice/cartservice';
import { ViewcartPage } from '../cart/viewcart/viewcart'
import { FilePath } from '@ionic-native/file-path/ngx';
import {File} from '@ionic-native/file/ngx';
import {GlobalProvider} from '../../providers/global/global';
import { OrdersPage } from '../../pages/orders/orders'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FilePath,  File, GlobalProvider]
})
export class HomePage {

  products: any;
  cart : any = [];

  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };

  loginuser : string;
  imgcollection : any = [];
  slideOpts = {
    effect: 'flip'
  };
  constructor(public navCtrl: NavController,
    private manageproducts : ManageproductsProvider,
    private storage: Storage, private cartservice : CartserviceProvider,
    private file : File,
    private platform : Platform, private global : GlobalProvider) {
      this.manageproducts.getproducts().then(products => {
        console.log('printing products in ionViewDidLoad method;')
        console.log(products);
        this.products= products;
      })

  }

  ionViewDidLoad(){
    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

    this.imgcollection = this.global.globalimages;


    // this.platform.ready().then(() => {
    //   this.file.listDir('./assets/img/slider','directory').then((result) => {
    //     for(let file of result){
    //       console.log('File Name ', file);
    //     }
    //   })
    // })
  }

  viewcart(){
    // console.log('You click the image');
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

  getProduct() {
    this.manageproducts.getproducts()
    .then(res => {
      console.log(res);
      this.products = res;
    },
    err => {
      console.log(err);
    })
}

showorders() {
  this.navCtrl.push(OrdersPage);
}
}
