import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ColorPickerModule } from 'ngx-color-picker';

import { SettingsModal } from './settings';
@NgModule({
  declarations: [
    SettingsModal
  ],
  imports: [
    ColorPickerModule,
    IonicPageModule.forChild(SettingsModal)
  ]
})
export class SettingsModalModule { }
