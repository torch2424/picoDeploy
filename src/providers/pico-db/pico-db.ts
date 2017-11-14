import { Injectable } from '@angular/core';
const idb = require('idb');
const Buffer = require('buffer/').Buffer
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


    // pico 8 idb version is 21
    // TODO: Need to also listen for when the database is
    // created so we can start alerting the pub sub as well
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
      this.currentValue = this.bufferToPico8Text(val.contents);

      this.listen();
    });
  }

  // idb value will be returned as a UTF8 array buffer
  // This will convert the buffer to text, and return a proper decimal based array
  bufferToPico8Text(buffer) {
    // How to buffer: https://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
    // By manual testing and reading cart code, the save file is text, that is saved as a buffer
    // Converting the buffer to a utf8 string will give you some random 520 character string
    // By manually testing, I compared values in the string (that are in hex), and finally
    // realized that they were the numbers in my game. Thus, we need to convert the buffer to a
    // utf8 string. .replace() to remove all whitespace and new lines
    let utf8HexString = Buffer.from(buffer).toString('utf8').replace(/\r?\n|\r/g, '');

    // From: http://pico-8.wikia.com/wiki/Dset we know that there are 64 numbers.
    // And since http://pico-8.wikia.com/wiki/Math tells us the max number is 32767. Therefore
    // The maximum value we can store in hex is: 7FFF. From this, I am going to assume we can chop
    // This string by every 4 characters. Since, I also noticed my personal save had the numbers
    // 03e6 -> 998 . And the preceding zero is space for the max?
    /*
      Also, after additional testing the code of:

        for i = 0, 63 do
          dset(i, -32767)
        end

      Which would fill the save file with only the maximum negative number, Gave us:

      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000
      8001000080010000800100008001000080010000800100008001000080010000

      Filling with the postive gave the same effect, except with 7fff.
      Meaning we take every other 4 sets of numbers to replicate our dget() from pico 8 :)
    */

    let pico8TextArray = [];
    for(let i = 0; i < 64; i++) {
      let currentIndex = i * 8;
      // Get the string represenatation of the number of hex, and then user parseInt() to get the decimal value
      let currentValueInHex = utf8HexString.substring(currentIndex, currentIndex + 4);
      pico8TextArray.push(parseInt(currentValueInHex, 16));
    }

    return pico8TextArray;
  }

  listen() {
    setTimeout(() => {

      // Check if the value changes
      this.idbKeyval.get(this.cartDataKey).then(val => {

        // Check for differences between the two arrays
        const diff = this.currentValue.filter(x => val.contents.indexOf(x) < 0);
        if(diff.length > 0) {
          // Save the new current value
          this.currentValue = this.bufferToPico8Text(val.contents);

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
