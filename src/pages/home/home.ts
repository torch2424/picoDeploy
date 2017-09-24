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
    this.settingsModal = this.modalCtrl.create('SettingsModal', { userId: 8675309 });
    setTimeout(() => {
      this.settingsModal.present();
    }, 7000);
  }

}
