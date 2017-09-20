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

    // Get our buttons, and their position
    this.buttons = {
      dpad: {
        element: document.getElementById('dpad'),
        pressed: {
          left: false,
          right: false,
          up: false,
          down: false
        }
      },
      squareBtn: {
        element: document.getElementById('squareBtn'),
        pressed: false
      },
      crossBtn: {
        element: document.getElementById('crossBtn'),
        pressed: false
      }
    }

    // Read from the DOM, and get each of our elements position, doing this here, as it is best to read from the dom in sequence
    // use element.getBoundingRect() top, bottom, left, right to get clientX and clientY in touch events :)
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    Object.keys(this.buttons).forEach((button) => {
      const buttonBoundingRect = this.buttons[button].element.getBoundingClientRect();
      this.buttons[button].rect = buttonBoundingRect;
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

    // Poll to keep updating the controller state
    window.requestAnimationFrame(() => this.updatePico8Controller());
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

    // Get our key event info
    if(event.type === "touchstart" || event.type === "touchmove") {

      // Handle Dpad events
      if(event.target.id === 'dpad') {
        // Reset the dpad, only one direction at a time
        this.resetDpad();

        // Calculate for the correct key
        // Only using the first touch, since we shouldn't be having two fingers on the dpad
        const touch = event.touches[0];

        // Find if the horizontal or vertical influence is greater
        const isHorizontal =
          Math.abs(this.buttons.dpad.rect.left + (this.buttons.dpad.rect.width / 2) - touch.clientX) >
          Math.abs(this.buttons.dpad.rect.top + (this.buttons.dpad.rect.height / 2) - touch.clientY);

        // Find the greatest absolute value, -X, +X, -Y, +Y
        if(isHorizontal) {
          const isLeft = this.buttons.dpad.rect.left + (this.buttons.dpad.rect.width / 2) > touch.clientX;
          if(isLeft) {
            this.buttons.dpad.pressed.left = true;
          } else {
            this.buttons.dpad.pressed.right = true;
          }
        } else {
          const isUp = this.buttons.dpad.rect.top + (this.buttons.dpad.rect.height / 2) > touch.clientY;
          if(isUp) {
            this.buttons.dpad.pressed.up = true;
          } else {
            this.buttons.dpad.pressed.down = true;
          }
        }
      }

      // Handle Square button
      if(event.target.id === 'squareBtn') {
        this.buttons.squareBtn.pressed = true;
      }

      // Handle Cross Button
      if(event.target.id === 'crossBtn') {
        this.buttons.crossBtn.pressed = true;
      }
    } else {

      // Handle Dpad events
      if(event.target.id === 'dpad') {
        this.resetDpad();
      }

      // Handle Square button
      if(event.target.id === 'squareBtn') {
        this.buttons.squareBtn.pressed = false;
      }

      // Handle Cross Button
      if(event.target.id === 'crossBtn') {
        this.buttons.crossBtn.pressed = false;
      }
    }
  }

  resetDpad() {
    if(!this.buttons || !this.buttons.dpad || !this.buttons.dpad.pressed) {
      return;
    }

    Object.keys(this.buttons.dpad.pressed).forEach(dpadKey => {
      this.buttons.dpad.pressed[dpadKey] = false;
    });
  }

  // Our Pico 8 Gamepad with help from: https://github.com/krajzeg/pico8gamepad
  updatePico8Controller() {
    let bitmask = 0;

    // Go through all of our buttons for the bitmask
    if(this.buttons.dpad.pressed.left) {
      bitmask |= 1;
    }
    if(this.buttons.dpad.pressed.right) {
      bitmask |= 2;
    }
    if(this.buttons.dpad.pressed.up) {
      bitmask |= 4;
    }
    if(this.buttons.dpad.pressed.down) {
      bitmask |= 8;
    }
    if(this.buttons.squareBtn.pressed) {
      bitmask |= 16;
    }
    if(this.buttons.crossBtn.pressed) {
      bitmask |= 32;
    }

    // Set for player one
    (<any>window).pico8_buttons[0] |= bitmask;

    // Call the update next frame
    window.requestAnimationFrame(() => this.updatePico8Controller());
  }

}
