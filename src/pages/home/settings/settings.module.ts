import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsModal } from './settings';
@NgModule({
  declarations: [
    SettingsModal
  ],
  imports: [
    IonicPageModule.forChild(SettingsModal)
  ]
})
export class SettingsModalModule { }
