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

  buttons: any

  constructor() {
    console.log('Hello GamepadComponent Component');
  }

  ngOnInit() {

    // Get our buttons
    this.buttons = {
      dpad: document.getElementById('dpad'),
      squareBtn: document.getElementById('squareBtn'),
      crossBtn: document.getElementById('squareBtn')
    }

    // Loop through our buttons and add touch events
    // use element.getBoundingRect() top, bottom, left, right to get clientX and clientY in touch events :)
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    Object.keys(this.buttons).forEach((button) => {
      this.buttons[button].addEventListener("touchstart", function (event) {
        Array.from(event.touches).forEach(touch => {
          console.log('Hai!', touch);
        })
        //pico8_buttons_event(event, 0);
      }, false);
      this.buttons[button].addEventListener("touchmove", function (event) {
        //pico8_buttons_event(event, 1);
      }, false);
      this.buttons[button].addEventListener("touchend", function (event) {
        //pico8_buttons_event(event, 2);
      }, false);
    });
  }

  // Our handler function for touch events


}
