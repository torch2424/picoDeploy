import { Component, Input } from '@angular/core';

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
export class PicomediaComponent {
  @Input() filepath: string;

  isImage: boolean;
  isVideo: boolean;

  constructor() {
    // Set our variables to false
    this.isImage = false;
    this.isVideo = false;
  }

  ngOnInit() {
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
  }

}