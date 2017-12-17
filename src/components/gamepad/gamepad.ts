import { Component, Output, EventEmitter } from '@angular/core';
import { SettingsProvider } from '../../providers/settings/settings';
import { Platform } from 'ionic-angular';

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
  @Output() onSettingsClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  buttons: any
  currentTouch: any
  showVirtualGamepad: boolean

  constructor(public settingsProvider: SettingsProvider, public platform: Platform) {

    // Set up our buttons
    (<any>window).pico8_buttons = [0,0,0,0,0,0,0,0];
    // Show the virtualgamepad if we are on a cordova device, or a mobile device
    // Inside a web browser (e.g chrome mobile device emeulator)
    if(this.platform.is('cordova') ||
    this.platform.is('mobileweb')) {
      this.showVirtualGamepad = true;
    } else {
      this.showVirtualGamepad = false;
      // Also, Add the gamepad script
      const picoGamepadScript = document.createElement('script');
      picoGamepadScript.setAttribute('src', 'assets/3pLibs/pico8gamepad/pico8gamepad.js');
      picoGamepadScript.setAttribute('type', 'text/javascript');
      document.body.appendChild(picoGamepadScript);
    }
  }

  ngOnInit() {

    // Check if we are showing the gamepad. If not, simply return here
    if(!this.showVirtualGamepad) {
      return;
    }

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
      },
      settingsBtn: {
        element: document.getElementById('settingsBtn'),
      },
      pauseBtn: {
        element: document.getElementById('pauseBtn'),
      }
    }

    // Add a resize listen to update the gamepad rect on resize
    window.addEventListener("resize", () => {
      this.updateGamepadRect();
    });
    this.updateGamepadRect();

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
      this.buttons[button].element.addEventListener("mousedown", (event) => {
        this.touchEventHandler(event);
      }, false);
      this.buttons[button].element.addEventListener("mouseup", (event) => {
        this.touchEventHandler(event);
      }, false);
    });

    // Poll to keep updating the controller state
    window.requestAnimationFrame(() => this.updatePico8Controller());
  }

  //Function to get an element target from SVGs being embedded in HTML
  getEventTargetElementId(event) {

    let targetId = event.target.id;
    // Return the first id in the event path
    event.path.some((element) => {
      if(element.id && element.id.length > 0) {
        targetId = element.id;
        return true;
      }
      return false;
    });

    return targetId;
  }

  // Function to update button position and size
  updateGamepadRect() {
    // Read from the DOM, and get each of our elements position, doing this here, as it is best to read from the dom in sequence
    // use element.getBoundingRect() top, bottom, left, right to get clientX and clientY in touch events :)
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    //console.log("GamepadComponent: Updating Rect()...");
    Object.keys(this.buttons).forEach((button) => {
      const buttonBoundingRect = this.buttons[button].element.getBoundingClientRect();
      this.buttons[button].rect = buttonBoundingRect;
    });
  }

  // Our handler function for touch events
  // Will stop event from propogating, and pass to the correct handler
  touchEventHandler(event) {
    if (!event || !event.touches) return

    //event.stopPropagation();
    event.preventDefault();

    //this.debugCurrentTouch(event);

    // Get our key event info
    if(event.type === "touchstart" ||
      event.type === "touchmove" ||
      event.type === "mousedown") {

      // Handle Dpad events
      if(this.getEventTargetElementId(event) === 'dpad') {
        // Reset the dpad, only one direction at a time
        this.resetDpad();

        // Calculate for the correct key
        // Only using the first touch, since we shouldn't be having two fingers on the dpad
        let touch;
        if (event.type.includes('touch')) {
          touch = event.touches[0];
        } else if (event.type.includes('mouse')) {
          touch = event;
        }

        // Find if the horizontal or vertical influence is greater
        // Find our centers of our rectangles, and our unbiased X Y values on the rect
        const rectCenterX = (this.buttons.dpad.rect.right - this.buttons.dpad.rect.left) / 2;
        const rectCenterY = (this.buttons.dpad.rect.bottom - this.buttons.dpad.rect.top) / 2;
        const touchX = touch.clientX - this.buttons.dpad.rect.left;
        let touchY = touch.clientY - this.buttons.dpad.rect.top;

        // Fix for shoot button causing the character to move right on multi touch error
        // + 50 for some buffer
        if(touchX > (rectCenterX + (this.buttons.dpad.rect.width / 2) + 50)) {
          // Ignore the event
          return;
        }

        // Create an additonal influece for horizontal, to make it feel better
        const horizontalInfluence = this.buttons.dpad.rect.width / 8;

        // Determine if we are horizontal or vertical
        const isHorizontal = Math.abs(rectCenterX - touchX) + horizontalInfluence > Math.abs(rectCenterY - touchY);

        // Find if left or right from width, vice versa for height
        if(isHorizontal) {
          // Add a horizontal dead zone
          const deadzoneSize = this.buttons.dpad.rect.width / 20;
          if(Math.abs((this.buttons.dpad.rect.width / 2) - touchX) > deadzoneSize) {
            const isLeft = touchX < (this.buttons.dpad.rect.width / 2);
            if(isLeft) {
              this.buttons.dpad.pressed.left = true;
            } else {
              this.buttons.dpad.pressed.right = true;
            }
          }
        } else {
          const isUp = touchY < (this.buttons.dpad.rect.height / 2);
          if(isUp) {
            this.buttons.dpad.pressed.up = true;
          } else {
            this.buttons.dpad.pressed.down = true;
          }
        }
      }

      // Handle Square button
      if(this.getEventTargetElementId(event) === 'squareBtn') {
        this.buttons.squareBtn.pressed = true;
      }

      // Handle Cross Button
      if(this.getEventTargetElementId(event) === 'crossBtn') {
        this.buttons.crossBtn.pressed = true;
      }

      // Handle Settings Button
      if(this.getEventTargetElementId(event) === 'settingsBtn') {
        // Only want to respect the touch start event
        if(event.type !== "touchmove") {
          this.onSettingsClick.emit(true);
        }
      }

      // Handle Pause Button
      if(this.getEventTargetElementId(event) === 'pauseBtn') {
        // Only want to respect the touch start event
        if(event.type !== "touchmove") {
          (<any>window).Module.pico8TogglePaused();
        }
      }
    } else {

      // Handle Dpad events
      if(this.getEventTargetElementId(event) === 'dpad') {
        this.resetDpad();
      }

      // Handle Square button
      if(this.getEventTargetElementId(event) === 'squareBtn') {
        this.buttons.squareBtn.pressed = false;
      }

      // Handle Cross Button
      if(this.getEventTargetElementId(event) === 'crossBtn') {
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
    (<any>window).pico8_buttons[0] = 0;

    let bitmask = 0;

    // Go through all of our buttons for the bitmask
    if(this.buttons.dpad.pressed.left) bitmask |= 1;
    if(this.buttons.dpad.pressed.right) bitmask |= 2;
    if(this.buttons.dpad.pressed.up) bitmask |= 4;
    if(this.buttons.dpad.pressed.down) bitmask |= 8;
    if(this.buttons.squareBtn.pressed) bitmask |= 16;
    if(this.buttons.crossBtn.pressed) bitmask |= 32;

    // Set for player one
    (<any>window).pico8_buttons[0] |= bitmask;

    // Call the update next frame
    window.requestAnimationFrame(() => this.updatePico8Controller());
  }

  debugCurrentTouch(event) {
    if (event.touches[0]) {
      this.currentTouch = JSON.stringify({
        target: this.getEventTargetElementId(event),
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY
      }, null, 2);
    }
  }

}
