import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CartComponent } from './cart/cart';
import { GamepadComponent } from './gamepad/gamepad';
import { PicosplashComponent } from './picosplash/picosplash';
import { PicomediaComponent } from './picomedia/picomedia';
@NgModule({
	declarations: [
    CartComponent,
    GamepadComponent,
    PicosplashComponent,
    PicomediaComponent
  ],
	imports: [IonicModule],
	exports: [
    CartComponent,
    GamepadComponent,
    PicosplashComponent,
    PicomediaComponent
  ]
})
export class ComponentsModule {}
