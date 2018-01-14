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

  constructor(platform: Platform, public settingsProvider: SettingsProvider) {
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
        // Also check for Enter/Pause and O for onOption
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

    // Listen for the cart to run to override some default functions
    this.listenForCartRun();
  }

  listenForCartRun() {
    if((<any>window).Module &&
    (<any>window).Module["calledRun"]) {
      // Override / create events for Anything here

      // Create our paused event
      const pauseEvent = new Event('picoDeployPause');

      // Replace the pause functions so we can access them, and throttle them
      (<any>window).Module._pico8PicoDeployPauseThrottleStatus = false;
      (<any>window).Module.pico8PicoDeployPauseThrottle = () => {
        (<any>window).Module._pico8PicoDeployPauseThrottleStatus = true;
        setTimeout(() => {
          (<any>window).Module._pico8PicoDeployPauseThrottleStatus = false;
        }, 750);
      };

      (<any>window).Module.pico8TogglePaused = () => {

        if((<any>window).Module._pico8PicoDeployPauseThrottleStatus) {
          return;
        }

        (<any>window).codo_command = 4;
        (<any>window).Module.pico8IsPaused = !(<any>window).Module.pico8IsPaused;

        (<any>window).Module.pico8PicoDeployPauseThrottle();
        (<any>window).dispatchEvent(pauseEvent);
      }

      (<any>window).Module.pico8SetPaused = (shouldPause) => {

        if((<any>window).Module._pico8PicoDeployPauseThrottleStatus) {
          return;
        }

        (<any>window).codo_command = 5;
        (<any>window).codo_command_p = 0;
        if(shouldPause) {
          (<any>window).Module.pico8IsPaused = true;
          (<any>window).codo_command_p = 1;
        } else {
          (<any>window).Module.pico8IsPaused = false;
        }

        (<any>window).Module.pico8PicoDeployPauseThrottle();
        (<any>window).dispatchEvent(pauseEvent);
      }


      // Lastly create/displatch our called run event
      const cartCalledRunEvent = new Event('picoDeployCartCalledRun');
      (<any>window).dispatchEvent(cartCalledRunEvent);
    }

    if((<any>window).Module && (<any>window)._cdpos > 0) {

      // Lastly create/displatch our called run event
      const cartPlayableEvent = new Event('picoDeployCartPlayable');
      (<any>window).dispatchEvent(cartPlayableEvent);

      // Return stop listening
      return;
    }


    // Keep Listening
    setTimeout(() => {
      this.listenForCartRun();
    }, 250);
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
