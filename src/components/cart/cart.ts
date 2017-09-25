import { Component, Output, EventEmitter } from '@angular/core';
import { SettingsProvider } from '../../providers/settings/settings';

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

  constructor(private settingsProvider: SettingsProvider) {
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

    // Lastly, load the cart
    const cartScript = document.createElement('script');
    cartScript.setAttribute('src', 'cart/cart.js');
    cartScript.setAttribute('type', 'text/javascript');
    document.body.appendChild(cartScript);
  }
}
