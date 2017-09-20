import { Component } from '@angular/core';

/**
 * Generated class for the GamepadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'gamepad',
  templateUrl: 'gamepad.html'
})
export class GamepadComponent {

  text: string;

  constructor() {
    console.log('Hello GamepadComponent Component');
    this.text = 'Hello World';
  }

}
