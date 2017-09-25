import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PicoDbProvider } from '../providers/pico-db/pico-db';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'HomePage';

  constructor(platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      screenOrientation: ScreenOrientation,
      picoDbProvider: PicoDbProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if(platform.is('cordova')) {
        screenOrientation.lock(screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
    });
  }
}
