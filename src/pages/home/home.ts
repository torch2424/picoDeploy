import { Component } from '@angular/core';
import { ModalController, NavController, IonicPage } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  settingsModal: any
  settingsModalShown: boolean


  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    public settingsProvider: SettingsProvider) {
    this.settingsModalShown = false;
  }

  ngOnInit() {
    this.settingsModal = this.modalCtrl.create('SettingsModal', {onClose: () => {
      this.settingsModalShown = false;
    }});
  }

  openSettings() {
    if(!this.settingsModalShown) {
      (<any>window).Module.pico8SetPaused(true);
      this.settingsModal.present();
      this.settingsModalShown = true;
    }
  }

  pauseGame() {
    (<any>window).Module.pico8TogglePaused();
  }
}
