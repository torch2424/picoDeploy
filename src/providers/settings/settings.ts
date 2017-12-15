import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

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

  constructor(private storage: Storage) {
    // Set our default settings
    this.settings = {
      sound: true,
      backgroundColor: "#272727",
      gamepadColor: "#FFFFFF",
      stretch: false
    }

    // Apply the default passed in by picoDeployConfig
    this.settings = Object.assign({}, this.settings, picoDeployConfig.defaultSettings);

    // Get our true settings
    Object.keys(this.settings).forEach(settingKey => {
      storage.get(settingKey).then(value => {
        if(value !== undefined && value !== null) {
          this.settings[settingKey] = value;
        }
      });
    });
  }

  // Save our settings object back into the storage
  save() {
     Object.keys(this.settings).forEach(settingKey => {
       this.storage.set(settingKey, this.settings[settingKey]);
     });
  }

}
