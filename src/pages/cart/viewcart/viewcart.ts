import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartserviceProvider } from '../../../providers/cartservice/cartservice';
import { ManagecustomersProvider } from '../../../providers/managecustomers/managecustomers';
import {LoginPage} from '../../public/login/login';
import { OrdersPage } from '../../orders/orders';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import Client from 'shopify-buy';
/**
 * Generated class for the ViewcartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewcart',
  templateUrl: 'viewcart.html',
})
export class ViewcartPage {

  // cart = [];
  // checkoutid : string;
  // client : any;
  // totalAmt : number;

  cart : any = [];
  newcart  : any = [];
  totalAmt: number = 0;
  client : any;
  singleproduct : any;
  variantid : string;
  checkoutid : string;
  scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  weburl : string;
  login : string;
  customerdetails : any;
  loginuser : string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private cartservice:CartserviceProvider,
    private storage : Storage,private managecustomers : ManagecustomersProvider,
    private iab : InAppBrowser ) {
      this.client = Client.buildClient({
        domain: 'grocerium-exelic-poc.myshopify.com',
        storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
      });


      this.storage.get("email").then((val : string) => {
        this.loginuser = val;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewcartPage');
    this.storage.set("currenpage","viewcarts");
    // this.storage.set("email", "");
    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

    this.managecustomers.getCustomers()
      .subscribe((result : any) => {

        console.log(result.customers);
        this.customerdetails = result.customers;
        for(let customer of result.customers){
          console.log(customer.id);
        }
      }, (error) => {
        console.log(error);
      });
  }

  ionViewWillEnter() {
    //this.cart = this.cartservice.getcart();
    //this.storage.set("email", "");
    //console.log('Email in ionViewWillEnter is ', this.storage.get("email").then(val => {}));
    this.storage.get("email").then((val : string)=>{
      console.log('Email in ionViewWillEnter is ', val);
      this.loginuser = val;
    });
    // if(this.cart.length > 0) {
      this.showlineitems();
    // }

  }

  logout() {
    this.storage.set("email","");
  }

  showorders() {
    this.navCtrl.push(OrdersPage);
  }
  showlineitems(){
    //this.checkoutid = this.cartservice.getcheckoutid();
    this.storage.get('checkoutid')
    .then((val) => {
      this.checkoutid = val;
      this.getcheckoutitemdetails();
    });

    //this.showcheckoutdetails();

  }

  getcheckoutitemdetails(){
    this.cartservice.clearCart();
    this.client.checkout.fetch(this.checkoutid).then((checkout) => {
      console.log('Checkout details in showlineitems');
      console.log(checkout);
      var prodjson = "";
      for(let i = 0; i< checkout.lineItems.length;i++){
        // console.log('Variant id is ' + checkout.lineItems[i].variant.id);
        prodjson = '{"id":"' + checkout.lineItems[i].customAttributes[0].value
        + '","title":"' +  checkout.lineItems[i].title
        + '","image":"' + checkout.lineItems[i].variant.image.src
        + '","price":' + checkout.lineItems[i].variant.price
        + ',"qty":' + checkout.lineItems[i].quantity //+  '}';
        //+ ',"variantid":"' + checkout.lineItems[i].variant.id
        + ',"lineitemsid":"' +  checkout.lineItems[i].id +  '"}';

        // console.log(prodjson);
        this.cartservice.addToCart(prodjson);
      }
      this.cart = this.cartservice.getcart();
      console.log('cart items...');
      console.log(this.cart);
      this.calculateAmount();

    });
  }

  removeitemfromcart(prod){

    /*this.cartservice.removeFromCart(prod);
    this.calculateAmount();*/
    //this.checkoutid = this.cartservice.getcheckoutid();
    this.storage.get('checkoutid')
    .then((val) => {
      this.checkoutid = val;
      console.log('checkout id in removeitemfromcart ' + this.checkoutid);

      //Removing item
      this.client.product.fetch(prod.id).then((product) => {
        console.log('lineitems id in removeitemfromcart = ' + prod.lineitemsid);
        const lineItemIdsToRemove = [
          prod.lineitemsid
        ];

        console.log('lineitemsid in removeitemfromcart =' + prod.lineitemsid);
        this.client.checkout.removeLineItems(this.checkoutid, lineItemIdsToRemove).then((checkout) => {
          // Do something with the updated checkout
          // console.log(checkout.lineItems);
          //this.cart = this.cartservice.getcart();
          this.cartservice.removeFromCart(prod);
        });
      });
    });
  }

  reduceqty(item) {

    this.cart = this.cartservice.getcart();

    //this.cart = this.cartservice.getcart();

    let counter : number = 0;
    counter = item.qty;
    if(counter  > 1){
      counter -= 1;
      const lineItemsToUpdate = [
        {
          id: item.lineitemsid,
          quantity: counter
        }
      ];
      this.storage.get('checkoutid')
      .then((val) => {
        this.checkoutid = val;
        this.client.checkout.updateLineItems(this.checkoutid, lineItemsToUpdate).then((checkout) => {
          console.log('item updated ');
          console.log(checkout);
          // this.showlineitems();
          for(let d of this.cart){
            if(d.id == item.id){
              if(d.qty > 1){
                d.qty = d.qty - 1;
              }
            }
          }
        this.calculateAmount();
        });
      });

    }
  }

  addqty(item){

    this.cart = this.cartservice.getcart();

    let counter : number = 0;
    counter = item.qty;
    counter += 1;

    const lineItemsToUpdate = [
      {
        id: item.lineitemsid,
        quantity: counter
      }
    ];

    // this.checkoutid = this.cartservice.getcheckoutid();

    this.storage.get('checkoutid')
    .then((val) => {
      this.checkoutid = val;
      this.client.checkout.updateLineItems(this.checkoutid, lineItemsToUpdate).then((checkout) => {
        console.log('item updated ');
        console.log(checkout);
        // this.showlineitems();
        for(let d of this.cart){
          if(d.id == item.id){
            // console.log(d);
            d.qty = d.qty + 1;
          }
        }
    this.calculateAmount();
      });
    });

    // Update the line item on the checkout (change the quantity or variant)

  }

  calculateAmount(){
    this.totalAmt = 0;

    for(let d of this.cart){
      this.totalAmt += (Number(d.price) * Number(d.qty)) ;
    }
  }


  async checkout(){
    this.showcheckoutdetails();
  }

  showcheckoutdetails(){

    // const options : InAppBrowserOptions = {
    //   zoom: 'no'
    // }
    // this.weburl = this.cartservice.getwebUrl();
    this.checkoutid = this.cartservice.getcheckoutid();
     const ShippingAddress = {
          address1: '',
          address2: '',
          city: '',
          company: null,
          country: '',
          firstName: '',
          lastName: '',
          phone: '',
          province: '',
          zip: ''
        };

    // const input = {shippingAddress: ShippingAddress};

        this.storage.get("address1").then((val : string) => {
          ShippingAddress.address1 = val;
        });
        this.storage.get("address2").then((val : string) => {
          ShippingAddress.address2 = val;
        });
        this.storage.get("city").then((val : string) => {
          ShippingAddress.city = val;
        });
        this.storage.get("country").then((val : string) => {
          ShippingAddress.country = val;
        });
        this.storage.get("fname").then((val : string) => {
          ShippingAddress.firstName = val;
        });
        this.storage.get("lname").then((val : string) => {
          ShippingAddress.lastName = val;
        });
        this.storage.get("phone").then((val : string) => {
          ShippingAddress.phone = val;
        });
        this.storage.get("province").then((val : string) => {
          ShippingAddress.province = val;
        });
        this.storage.get("zip").then((val : string) => {
          ShippingAddress.zip = val;
        });

    // this.storage.get('weburl')
    //   .then((val) => {
    //     this.weburl = val;
    //     console.log('printing weburl...');
    //     console.log(this.weburl);
    //     const browser = this.iab.create(this.weburl, '_system', {location:'yes'});
    //   });

    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    this.storage.get('email')
        .then((val) => {
          console.log('Email is = ', val );
          this.login = val;
          console.log('Login details ', this.login)
          console.log('call customer details...');
          //this.customerdetails = this.getcustomerdetails();
          if(this.login == null || this.login == ""){
            this.navCtrl.push(LoginPage);
          }
          else {
            this.client.checkout.updateEmail(this.checkoutid,this.login).then(checkout => {

            });
            this.client.checkout.updateShippingAddress(this.checkoutid, ShippingAddress).then(checkout => {
                  // Do something with the updated checkout
              this.storage.get('weburl')
              .then((val) => {
                this.weburl = val;
                console.log('printing weburl...');
                console.log(this.weburl);
                // const browser = this.iab.create(this.weburl, '_system', options);
                this.iab.create(this.weburl, '_blank', options);
              });
            });
          }
        });
  }
}
