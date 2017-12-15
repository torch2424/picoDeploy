import { Component } from '@angular/core';
import { SettingsProvider } from '../../providers/settings/settings';

const picoDeployConfig = require('../../../picoDeployConfig.json');

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
  splashMedia: string
  splashBackgroundMedia: any
  cartMuted: boolean

  constructor(private settingsProvider: SettingsProvider) {
    this.initializingCart = false;
    this.splashMedia = ""
    if(picoDeployConfig.picosplash.enable) {
      this.initializingCart = true;
      this.splashMedia = picoDeployConfig.picosplash.splashMedia
    }
    // Also, Get our cart background media, that way we can loop it above the cart and all looks good
    this.splashBackgroundMedia = false;
    if(picoDeployConfig.backgroundMedia) {
      this.splashBackgroundMedia = picoDeployConfig.backgroundMedia;
    }
    this.cartMuted = false;
  }

  ngOnInit() {
    if(picoDeployConfig.picosplash.enable) {
      // Listen to events on the cart.js attatched to the window for picoDeploy
      (<any>window).addEventListener('picoDeployCartCalledRun', () => {
        // Toggle sound off
        if(!this.cartMuted) {
          (<any>window).Module.pico8ToggleSound();
          this.cartMuted = true;
        }
      });

      (<any>window).addEventListener('picoDeployCartPlayable', () => {
        // Toggle sound back on in a second
        setTimeout(() => {
          // Toggle sound back on
          if(this.cartMuted && this.settingsProvider.settings.sound) {
            (<any>window).Module.pico8ToggleSound();
          }

          // Wait for the sound on prompt to disappear
          setTimeout(() => {
            this.initializingCart = false;
          }, 1000)
        }, 1000);
      });
    }
  }
}
