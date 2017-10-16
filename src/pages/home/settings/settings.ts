import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { SettingsProvider } from '../../../providers/settings/settings';

const picoDeployConfig = require('../../../../picoDeployConfig.json');

// Settings Modal
// How to: https://github.com/PaulHalliday/Ionic-3-Modal-Example/tree/master/src/pages
@IonicPage()
@Component({
  templateUrl: 'settings.html'
})
export class SettingsModal {

  isOpen: boolean
  hasCartBackgroundMedia: boolean

 constructor(private params: NavParams, private view: ViewController, public settingsProvider: SettingsProvider) {

   // Check if we have cart background media
   this.hasCartBackgroundMedia = false;
   if(picoDeployConfig.backgroundMedia) {
     this.hasCartBackgroundMedia = true;
   }
 }

 // Function on sound click
 soundChange() {
   (<any>window).Module.pico8ToggleSound();
   this.settingsProvider.save();
 }

 colorChange(event) {
   this.settingsProvider.settings.backgroundColor = event;
   this.settingsProvider.save();
 }

 closeModal() {
    this.view.dismiss();
    (<any>window).Module.pico8SetPaused(false);
    if(this.params.get('onClose')) {
      this.params.get('onClose')();
    }
  }
}
