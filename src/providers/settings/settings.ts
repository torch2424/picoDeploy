import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

const picoDeployConfig = require('../../../picoDeployConfig.json');

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  // Our default settings
  // Can be edited directly by components
  settings: any

  constructor(private storage: Storage, private platform: Platform) {
    // Set our default settings
    this.settings = {
      fullscreen: true,
      sound: true,
      backgroundColor: "#272727",
      gamepadColor: "#FFFFFF",
      stretch: false
    }

    // Apply the default passed in by picoDeployConfig
    this.settings = Object.assign({}, this.settings, picoDeployConfig.defaultSettings);

    // Get our saved settings
    const savedSettingsPromises = [];
    Object.keys(this.settings).forEach(settingKey => {
      savedSettingsPromises.push(new Promise((resolve, reject) => {
        storage.get(settingKey).then(value => {
          if(value !== undefined && value !== null) {
            this.settings[settingKey] = value;
          }
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }));
    });

    // Check if we can fullscreen the app
    Promise.all(savedSettingsPromises).then(() => {
      if (this.settings.fullscreen && !this.platform.is('cordova') && !!(<any>window).require) {
        (<any>window).require('electron').remote.getCurrentWindow().setFullScreen(true);
      }
    });
  }

  // Save our settings object back into the storage
  save() {
     Object.keys(this.settings).forEach(settingKey => {
       this.storage.set(settingKey, this.settings[settingKey]);
     });
  }

}
