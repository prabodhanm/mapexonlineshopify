import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { ManagecustomersProvider } from '../providers/managecustomers/managecustomers';
import { ManagecustomersProvider } from '../../../providers/managecustomers/managecustomers';
import { Storage } from '@ionic/storage';
import {ViewcartPage} from '../../cart/viewcart/viewcart';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username : string;
  password: string;
  email : string;

  customers: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, private managecustomers : ManagecustomersProvider,
    private storage : Storage) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.managecustomers.getCustomers()
      .subscribe((result : any) => {
        // this.customers = result;
        console.log(result.customers);
        this.customers = result.customers;
        // console.log(result.customers[0].email);
        // console.log(result.customers.length);

      }, (error) => {
        console.log(error);
      });
  }

  login(){
    //this.authService.login();
    console.log('Login check...');
    console.log("email is - ", this.email);
    console.log("password is - ", this.password);
    for(let customer of this.customers){
      if(customer.email == this.email){
        console.log('Login successful...');
        this.storage.set("email", this.email);
        this.storage.set("password",this.password);

        this.storage.set("address1",customer.default_address.address1);
        this.storage.set("address2",customer.default_address.address2);
        this.storage.set("city",customer.default_address.city);
        this.storage.set("country",customer.default_address.country);
        this.storage.set("fname",customer.default_address.first_name);
        this.storage.set("lname",customer.default_address.last_name);
        this.storage.set("phone",customer.default_address.phone);
        console.log('Phone number in login - ', customer.default_address.phone);
        this.storage.set("province",customer.default_address.province_code);
        this.storage.set("zip",customer.default_address.zip);
        this.navCtrl.push(ViewcartPage);
      }
    }


  }

  register(){
    //this.router.navigate(['/register']);
  }
}
