import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManageproductsProvider } from '../../providers/manageproducts/manageproducts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  products: any;
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };

  loginuser : string;

  slideOpts = {
    effect: 'flip'
  };
  constructor(public navCtrl: NavController,
    private manageproducts : ManageproductsProvider, private storage: Storage) {
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
}
