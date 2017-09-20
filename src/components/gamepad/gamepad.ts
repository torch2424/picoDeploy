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

    // Pico 8 does some craziness where the is a buttons object on the window with an array of all buttons that need to be toggles.
    (<any>window).pico8_buttons = [0,0,0,0,0,0,0,0];

    // Get our buttons, and their position
    this.buttons = {
      dpad: {
        element: document.getElementById('dpad')
      },
      squareBtn: {
        element: document.getElementById('squareBtn')
      },
      crossBtn: {
        element: document.getElementById('crossBtn')
      }
    }

    // Read from the DOM, and get each of our elements position, doing this here, as it is best to read from the dom in sequence
    // use element.getBoundingRect() top, bottom, left, right to get clientX and clientY in touch events :)
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    Object.keys(this.buttons).forEach((button) => {
      const buttonBoundingRect = this.buttons[button].element.getBoundingClientRect();
      this.buttons[button] = Object.assign(this.buttons[button], buttonBoundingRect);
    });



    // Loop through our buttons and add touch events
    Object.keys(this.buttons).forEach((button) => {
      this.buttons[button].element.addEventListener("touchstart", (event) => {
        this.touchEventHandler(event);
      }, false);
      this.buttons[button].element.addEventListener("touchmove", (event) => {
        this.touchEventHandler(event);
      }, false);
      this.buttons[button].element.addEventListener("touchend", (event) => {
        this.touchEventHandler(event);
      }, false);
    });
  }

  // Our handler function for touch events
  // Will stop event from propogating, and pass to the correct handler
  touchEventHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log(event);
    Array.from(event.touches).forEach(touch => {
      console.log('Hai!', touch);
    });

    // Get our keycode
    let keyCode = 0;

    // Handle Dpad events
    if(event.target.id === 'dpad') {
      keyCode = 39
    }

    // Handle Square button
    if(event.target.id === 'squareBtn') {
      keyCode = 90
    }

    // Handle Cross Button
    if(event.target.id === 'crossBtn') {
      keyCode = 88
    }


    // Get our key event info
    if(event.type === "touchstart" || event.type === "touchmove") {
      //this.simulateKeyEvent('press', keyCode);
      //this.simulateKeyEvent('down', keyCode);
      //pico8_buttons = [  ]
    } else {
      //this.simulateKeyEvent('up', keyCode);
    }
  }

  // Our Pico 8 Gamepad from: https://github.com/krajzeg/pico8gamepad


}
