import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';

import { SettingsProvider } from '../../providers/settings/settings';

const picoDeployConfig = require('../../../picoDeployConfig.json');

/**
 * Generated class for the CartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'cart',
  templateUrl: 'cart.html'
})
export class CartComponent {
  @Output() onPause: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onOption: EventEmitter<boolean> = new EventEmitter<boolean>();

  canvas: HTMLCanvasElement;
  platform: Platform;
  private onResumeSubscription: Subscription;
  private onPauseSubscription: Subscription;
  private exitTimeout: any;

  constructor(platform: Platform, private settingsProvider: SettingsProvider) {
    // Subscribe to pause and resume events
    // to pause the cart from running to save battery
    this.platform = platform;
    this.platform.ready().then(() => {
      // Ensure that the platform is mobile
      if(this.platform.is('cordova')) {

        // Subscribe to pause
        this.onPauseSubscription = this.platform.pause.subscribe(() => {
          if((<any>window).Module && (<any>window).Module.pico8SetPaused) {
              // Set paused
              (<any>window).Module.pico8SetPaused(true);

              // If we have an inactive to exit delay, create the timeout
              if(picoDeployConfig.inactiveToExitDelayInMilli &&
              picoDeployConfig.inactiveToExitDelayInMilli >= 0) {
                this.exitTimeout = setTimeout(() => {
                  this.platform.exitApp();
                }, picoDeployConfig.inactiveToExitDelayInMilli);
              }
          }
        });

        // Subscribe to resume
        this.onResumeSubscription = this.platform.resume.subscribe(() => {
         if((<any>window).Module && (<any>window).Module.pico8SetPaused) {
             // Unpause
             (<any>window).Module.pico8SetPaused(false);

             // Clear the exitTimeout if we set one
             if(this.exitTimeout) {
               clearTimeout(this.exitTimeout);
             }
         }
        });
      }
    });
  }

  ngOnInit() {
    // Get our canvas element
    this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		// show Emscripten environment where the canvas is
		// arguments are passed to PICO-8

    (<any>window).Module = {};
		(<any>window).Module.canvas = this.canvas;

    // key blocker. prevent cursor keys from scrolling page while playing cart.
    // Generated with cart.html
    document.addEventListener('keydown', (event: any) => {
      event = event || window.event;
      var o = document.activeElement;
      if (!o || o == document.body || o.tagName == "canvas") {
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
          if (event.preventDefault) event.preventDefault();
        }
        // Also check for Enter/Paause and O for onOption
        // Escape will cause a lot of problems with Ionic :(
        // Doing everything to stop this propogation, even on other handlers
        // https://javascript.info/bubbling-and-capturing
        if ([13, 80].indexOf(event.keyCode) > -1) {
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          if (event.stopPropagation) event.stopPropagation();
          if (event.preventDefault) event.preventDefault();
          this.onPause.emit(true);
        }
        if ([79].indexOf(event.keyCode) > -1) {
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          if (event.stopPropagation) event.stopPropagation();
          if (event.preventDefault) event.preventDefault();
          // In a timeout to stop modal from closing itself
          this.onOption.emit(true);
        }
      }
    }, false);

    // Lastly, Load the cart
    const cartScript = document.createElement('script');
    cartScript.setAttribute('src', `cart/${picoDeployConfig.cart.cartName}`);
    cartScript.setAttribute('type', 'text/javascript');
    document.body.appendChild(cartScript);
  }

  ngOnDestroy() {
    if(this.platform.is('cordova') &&
      this.onResumeSubscription &&
      this.onPauseSubscription) {
      // always unsubscribe your subscriptions to prevent leaks
      this.onResumeSubscription.unsubscribe();
      this.onPauseSubscription.unsubscribe();
    }
  }
}
