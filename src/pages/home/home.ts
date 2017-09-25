import { Component } from '@angular/core';
import { ModalController, NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  settingsModal: any

  constructor(public modalCtrl: ModalController, public navCtrl: NavController) {
  }

  ngOnInit() {
    this.settingsModal = this.modalCtrl.create('SettingsModal');
  }

  openSettings() {
    (<any>window).Module.pico8SetPaused(true);
    this.settingsModal.present();
  }
}
