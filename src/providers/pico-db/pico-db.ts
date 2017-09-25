import { Injectable } from '@angular/core';
const idb = require('idb');
const picoDeployConfig = require('../../../picoDeployConfig.json');

/*
  Generated class for the PicoDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
// Simple Pub/Sub Listener for changes on the Pico 8 IndexedDB
@Injectable()
export class PicoDbProvider {

  idbKeyval: any
  cartDataKey: string
  currentValue: any
  subscribers: any

  constructor() {

    // Enable or disable the indexedDB provider
    if(!picoDeployConfig.dbWatcher.enable) {
      return;
    }

    // Set our defaults
    const dbName = '/user_data';
    const objectStoreName = 'FILE_DATA';
    const cartDataName = picoDeployConfig.dbWatcher.cartDataName;
    const cartDataKey = `/user_data/cdata/${cartDataName}.p8d.txt`;
    this.cartDataKey = cartDataKey;
    this.subscribers = {};


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
      console.log(val);
      this.currentValue = val.contents;

      this.listen();
    });
  }

  listen() {
    setTimeout(() => {

      // Check if the value changes
      this.idbKeyval.get(this.cartDataKey).then(val => {

        // Check for differences between the two arrays
        const diff = this.currentValue.filter(x => val.contents.indexOf(x) < 0);
        if(diff.length > 0) {
          // Save the new current value
          this.currentValue = val.contents;

          // Publish to our subscribers
          this.publish();
        }
        // Continue Listening
        this.listen();
      });
    }, 3500);
  }

  get() {
    return this.currentValue;
  }

  publish() {
    Object.keys(this.subscribers).forEach(subscriberKey => {
      this.subscribers[subscriberKey](this.currentValue);
    });
  }

  subscribe(key, callback) {
    this.subscribers[key] = callback;
  }

  unsubscribe(key) {
    delete this.subscribers[key];
  }

}
