import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ManageproductsProvider } from '../../../providers/manageproducts/manageproducts';
import { CartserviceProvider } from '../../../providers/cartservice/cartservice';
import { ViewcartPage } from '../../cart/viewcart/viewcart'
import { DetailcartPage } from '../../cart/detailcart/detailcart';
import { Storage } from '@ionic/storage';
import Client from 'shopify-buy';
import { OrdersPage } from '../../orders/orders';
/**
 * Generated class for the ViewproductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewproducts',
  templateUrl: 'viewproducts.html',
})
export class ViewproductsPage {

  cart = [];
  products : any;
  checkoutid : string;
  client : any;
  prodcheckout : any;
  loginuser : string;
  // lastpagevisited : string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private manageproducts : ManageproductsProvider,
    private storage : Storage, private cartservice : CartserviceProvider) {
      this.client = Client.buildClient({
        domain: 'grocerium-exelic-poc.myshopify.com',
        storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
        // appId: '6'
      });

      this.storage.get("email").then((val : string) => {
        this.loginuser = val;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewproductsPage');
    this.manageproducts.getproducts().then(products => {
      console.log('printing products in ionViewDidLoad method;')
      console.log(products);
      this.products= products;
    })
  }

  ionViewWillEnter() {
    this.cart = this.cartservice.getcart();
  }

  showorders() {
    this.navCtrl.push(OrdersPage);
  }
  logout() {
    this.storage.set("email","");
  }
  viewcart(){
    // console.log('You click the image');
    this.cart = this.cartservice.getcart();
    // this.router.navigateByUrl('viewmycart');
    this.navCtrl.push(ViewcartPage);
  }

  showdetailitems(prod){
    this.cartservice.setproduct(prod);
    // this.router.navigate(['/detailcart']);
    this.navCtrl.push(DetailcartPage);
  }

  async addtocart(prod){
    var prodjson = '{"id":"' + prod.id
    + '","title":"' +  prod.title
    + '","image":"' + prod.images[0].src
    + '","price":' + prod.variants[0].price
    + ',"qty":1'
    // + ',"lineitemsid":"' +  checkout.lineItems[checkout.lineItems.length-1].id
    +  '}';
    console.log('prod json = ' + prodjson);
    this.cartservice.addToCart(prodjson);

    await this.addlineitems(prod);
  }

  addlineitems(prod){
    //this.checkoutid = this.cartservice.getcheckoutid();
    // console.log('Adding line item for ' + prod.id);
    this.storage.get('checkoutid')
    .then((val) => {
      this.checkoutid = val;
      console.log('Checkout id in addlineitems:' + this.checkoutid);
    });


    if(this.checkoutid == undefined){
      // const ShippingAddress = {
      //   address1: 'Chestnut Street 92',
      //   address2: 'Apartment 2"',
      //   city: 'Louisville',
      //   company: null,
      //   country: 'United States',
      //   firstName: 'Bob',
      //   lastName: 'Norman',
      //   phone: '555-625-1199',
      //   province: 'Kentucky',
      //   zip: '40202'
      // };
      // const input = {
      //   email : "pmestry007@gmail.com",
      //   shippingAddress: ShippingAddress
      // };
      this.client.checkout.create().then((checkout) => {
        this.prodcheckout = checkout;
        this.cartservice.setwebUrl(checkout.webUrl);
        this.cartservice.setcheckoutid(checkout.attrs.id.value);
        this.storage.set('checkoutid',checkout.attrs.id.value);
        this.storage.set('weburl',checkout.webUrl);
        // console.log('web url = ' + checkout.webUrl);
        this.client.product.fetch(prod.id).then((product) => {
          // console.log('Product details ');
          // console.log(product);
          var lineItemsToAdd = [
            {
              variantId: product.attrs.variants[0].id,
              quantity: 1,
              customAttributes: [{key: "prodid", value: prod.id}]
            }
          ];


          console.log('Line items details');
          console.log(lineItemsToAdd);

           this.client.checkout.addLineItems(checkout.attrs.id.value, lineItemsToAdd).then((checkout) => {
            console.log(checkout.lineItems);
              // var prodjson = '{"id":"' + prod.id
              //   + '","title":"' +  prod.title
              //   + '","image":"' + prod.images[0].src
              //   + '","price":' + prod.variants[0].price
              //   + ',"qty":1'
              //   + ',"lineitemsid":"' +  checkout.lineItems[0].id +  '"}';
              //   console.log('prod json = ' + prodjson);
              //   this.cartservice.addToCart(prodjson);
          });
        });
      })
    }
    else {
      this.client.product.fetch(prod.id).then((product) => {
        // console.log('Product details ');
        // console.log(product);
        var lineItemsToAdd = [
          {
            variantId: product.attrs.variants[0].id,
            quantity: 1,
            customAttributes: [{key: "prodid", value: prod.id}]
          }
        ];

        console.log('Line items details');
        console.log(lineItemsToAdd);

        this.client.checkout.addLineItems(this.checkoutid, lineItemsToAdd).then((checkout) => {
          console.log(checkout.lineItems);
        });
      });
    }
  }
}
