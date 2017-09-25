import { Injectable } from '@angular/core';
const idb = require('idb');

/*
  Generated class for the PicoDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PicoDbProvider {

  idbKeyval: any

  constructor() {
    console.log('Hello PicoDbProvider Provider');
    // Set our defaults
    const dbName = '/user_data';
    const objectStoreName = 'FILE_DATA';


    //pico 8 idb version is 21
    const dbPromise = idb.open(dbName, 21, upgradeDB => {
      //TODO: Handle Upgrade
    });

    this.idbKeyval = {
      get(key) {
        return dbPromise.then(db => {
          return db.transaction(objectStoreName)
            .objectStore(objectStoreName).get(key);
        });
      },
      set(key, val) {
        return dbPromise.then(db => {
          const tx = db.transaction(objectStoreName, 'readwrite');
          tx.objectStore(objectStoreName).put(val, key);
          return tx.complete;
        });
      },
      delete(key) {
        return dbPromise.then(db => {
          const tx = db.transaction(objectStoreName, 'readwrite');
          tx.objectStore(objectStoreName).delete(key);
          return tx.complete;
        });
      },
      clear() {
        return dbPromise.then(db => {
          const tx = db.transaction(objectStoreName, 'readwrite');
          tx.objectStore(objectStoreName).clear();
          return tx.complete;
        });
      },
      keys() {
        return dbPromise.then(db => {
          const tx = db.transaction(objectStoreName);
          const keys = [];
          const store = tx.objectStore(objectStoreName);

          // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
          // openKeyCursor isn't supported by Safari, so we fall back
          (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
            if (!cursor) return;
            keys.push(cursor.key);
            cursor.continue();
          });

          return tx.complete.then(() => keys);
        });
      }
    };

    this.idbKeyval.get('/user_data/cdata/nocomplygames_letsgetdismoney_v1.p8d.txt').then(val => {
      // TODO: Watch the value for changes
      console.log('ayyee: ', val);
    });
  }

}
