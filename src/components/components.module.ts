import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CartComponent } from './cart/cart';
import { GamepadComponent } from './gamepad/gamepad';
@NgModule({
	declarations: [CartComponent,
    GamepadComponent],
	imports: [IonicModule],
	exports: [CartComponent,
    GamepadComponent]
})
export class ComponentsModule {}
