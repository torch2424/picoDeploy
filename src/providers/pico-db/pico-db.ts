import { Injectable } from '@angular/core';
const idb = require('idb');
const picoDeployConfig = require('../../../picoDeployConfig.json');

/*
  Generated class for the PicoDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PicoDbProvider {

  idbKeyval: any
  cartDataKey: string

  constructor() {

    // Enable or disable the indexedDB provider
    if(!picoDeployConfig.dbWatcher.enable) {
      return;
    }

    // Set our defaults
    const dbName = '/user_data';
    const objectStoreName = 'FILE_DATA';
    const cartDataName = "nocomplygames_letsgetdismoney_v1";
    const cartDataKey = `/user_data/cdata/${cartDataName}.p8d.txt`;
    this.cartDataKey = cartDataKey;


    //pico 8 idb version is 21
    const dbPromise = idb.open(dbName, 21, upgradeDB => {
      //TODO: Handle Upgrade
    });

    // Only need the get functionality of idbKeyval
    // https://github.com/jakearchibald/idb
    this.idbKeyval = {
      get(key) {
        return dbPromise.then(db => {
          if(db.objectStoreNames.contains(objectStoreName)) {
            return db.transaction(objectStoreName)
              .objectStore(objectStoreName).get(key);
          }
          return undefined;
        });
      }
    };

    this.idbKeyval.get(cartDataKey).then(val => {
      if(val === undefined) {
        console.warn('PicoDbProvider: The Returned value for the cart data came undefined. Either the cart data has not been created, or there is an invalid cartDataKey.');
        return;
      }

      console.log('PicoDbProvider: ', val);
    });
  }

}
