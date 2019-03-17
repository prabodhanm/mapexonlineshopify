import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ManagecustomersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

// declare var cordova : any;
@Injectable()
export class ManagecustomersProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ManagecustomersProvider Provider');
  }

  getCustomers(){
    let url = '/api';
    return this.http.get(`${url}`);
  }

  getOrdersByCustomer() {
    let url = '/orders';
    return this.http.get(`${url}`);
  }
}
