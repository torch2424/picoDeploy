import { Component } from '@angular/core';

/**
 * Generated class for the PicosplashComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'picosplash',
  templateUrl: 'picosplash.html'
})
export class PicosplashComponent {

  initializingCart: boolean
  cartMuted: boolean

  constructor() {
    console.log('Hello PicosplashComponent Component');
    this.initializingCart = true;
    this.cartMuted = false;
  }

  ngOnInit() {
    this.listenForCartRun();
  }

  // Function to ping the window cart Module,
  // to performa actions based on the surretn cart status
  listenForCartRun() {
    // Check to mute the initial cart sound
    if((<any>window).Module &&
      (<any>window).Module.pico8ToggleSound &&
      (<any>window).Module["calledRun"]) {

      // Toggle sound off
      if(!this.cartMuted) {
        (<any>window).Module.pico8ToggleSound();
        this.cartMuted = true;
      }
    }

    // Check for when the cart is full loaded
    // The carts "cart data position" will change past zero once the cart is fully loaded and interpreted
    if((<any>window).Module && (<any>window)._cdpos > 0) {

      // Toggle sound back on in a second
      setTimeout(() => {
        // Toggle sound back on
        if(this.cartMuted) {
          (<any>window).Module.pico8ToggleSound();
        }

        // Wait for the sound on prompt to disappear
        setTimeout(() => {
          this.initializingCart = false;
        }, 1000)
      }, 1000);

      // Return to stop listening
      return;
    }

    // Listen for the cart
    setTimeout(() => {
      this.listenForCartRun();
    }, 250);
  }
}
