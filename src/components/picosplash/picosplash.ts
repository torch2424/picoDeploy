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

  listenForCartRun() {
    console.log(window.status)
    if((<any>window).Module && (<any>window).Module["calledRun"]) {
      // Wait an additional second before hiding the splash
      setTimeout(() => {
        // Toggle sound back on
        if(this.cartMuted) {
          (<any>window).Module.pico8ToggleSound();
        }
        this.initializingCart = false;

      }, 1000);
    } else {

      if(!this.cartMuted && (<any>window).Module && (<any>window).Module.pico8ToggleSound) {
        // Toggle sound back off
        (<any>window).Module.pico8ToggleSound();
        this.cartMuted = true;
      }

      setTimeout(() => {
        this.listenForCartRun();
      }, 250);
    }
  }

}
