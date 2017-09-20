import { Component } from '@angular/core';

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

  canvas: HTMLCanvasElement;

  constructor() {
    console.log('Hello CartComponent Component');
  }

  ngOnInit() {
    console.log("I'm alive!");

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
      }
    }, false);
  }
}
