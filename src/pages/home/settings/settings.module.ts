import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExpandableListModule } from 'angular2-expandable-list';

import { SettingsModal } from './settings';
@NgModule({
  declarations: [
    SettingsModal
  ],
  imports: [
    ColorPickerModule,
    ExpandableListModule,
    IonicPageModule.forChild(SettingsModal)
  ]
})
export class SettingsModalModule { }
