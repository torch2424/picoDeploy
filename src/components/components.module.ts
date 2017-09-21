import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CartComponent } from './cart/cart';
import { GamepadComponent } from './gamepad/gamepad';
import { PicosplashComponent } from './picosplash/picosplash';
@NgModule({
	declarations: [CartComponent,
    GamepadComponent,
    PicosplashComponent],
	imports: [IonicModule],
	exports: [CartComponent,
    GamepadComponent,
    PicosplashComponent]
})
export class ComponentsModule {}
