import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { SettingsProvider } from '../../../providers/settings/settings';
import { Platform } from 'ionic-angular';

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
  // Allow window to be checked by the template for requre
  window: any = (<any>window);

 constructor(private params: NavParams, private view: ViewController, public settingsProvider: SettingsProvider, public platform: Platform) {

   // Check if we have cart background media
   this.hasCartBackgroundMedia = false;
   if(picoDeployConfig.backgroundMedia) {
     this.hasCartBackgroundMedia = true;
   }
 }

 fullscreenChange(event) {
   // Check if we can fullscreen the app
   if(!this.platform.is('cordova') && !!(<any>window).require) {
     (<any>window).require('electron').remote.getCurrentWindow().setFullScreen(event);
     // ng-model'd don't need to set to save
     this.settingsProvider.save();
   }
 }

 soundChange() {
   (<any>window).Module.pico8ToggleSound();
   // ng-model'd don't need to set to save
   this.settingsProvider.save();
 }

 gamepadColorChange(event) {
   this.settingsProvider.settings.gamepadColor = event;
   this.settingsProvider.save();
 }

 bgColorChange(event) {
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
