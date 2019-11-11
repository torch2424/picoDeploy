import { Component, Input, AfterViewInit } from '@angular/core';

/**
 * Generated class for the PicomediaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'picomedia',
  templateUrl: 'picomedia.html'
})
export class PicomediaComponent implements AfterViewInit {
  @Input() filepath: string;

  isImage: boolean;
  isVideo: boolean;
  videoElementId: any;
  videoElement: any;

  constructor() {
    // Set our variables to false
    this.isImage = false;
    this.isVideo = false;
  }

  ngAfterViewInit() {
    // Error and return if we do not have a passed path
    if(!this.filepath) {
      console.error('Picomedia Component: No passed path was found.');
      return;
    }

    // Regex for isImage and is video
    if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(this.filepath)) {
      this.isImage = true;
    } else if((/\.(mp4|webm|)$/i).test(this.filepath)) {
      this.isVideo = true;
    } else {
      // File type not supported by native HTML5
      console.error(`Picomedia Component: Supplied path is not a supported HTML5 file type: ${this.filepath}`);
      return;
    }

    // Start our listener for the media to pause if the media is video
    // Find when the game is paused
    if (this.isVideo) {
      this.videoElementId = `picomedia-video${Math.floor(Math.random() * 10000)}`
      // Timeout to wait for ngIf to apply
      setTimeout(() => {
        // Get our video element
        this.videoElement = document.getElementById(this.videoElementId);
        // Play the video
        // TODO: Need to think of a solution from Chrome autoplay policy,
        // as video wont play without interaction
        // this.videoElement.play();

        // Listen to our pause event from cart.js
        (<any>window).addEventListener('picoDeployPause', () => {
          if(!(<any>window).Module.pico8IsPaused &&
          this.videoElement.paused) {
            // resume
            this.videoElement.play();
          } else if ((<any>window).Module.pico8IsPaused &&
          !this.videoElement.paused) {
            // Pause
            this.videoElement.pause()
          }
        });
      });
    }
  }
}
