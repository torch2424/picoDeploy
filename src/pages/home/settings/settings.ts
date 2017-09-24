import { Component } from '@angular/core';
import { NavParams, IonicPage, ViewController } from 'ionic-angular';

// Settings Modal
// How to: https://github.com/PaulHalliday/Ionic-3-Modal-Example/tree/master/src/pages
@IonicPage()
@Component({
  templateUrl: 'settings.html'
})
export class SettingsModal {

 constructor(params: NavParams, private view: ViewController) {
   console.log('SettingsModal, Passed params: ', params);
 }

 closeModal() {
    this.view.dismiss();
    (<any>window).Module.pico8SetPaused(false);
  }
}
