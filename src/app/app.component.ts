import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PlatformSdkWrapperProvider } from '../providers/platform-sdk-wrapper/platform-sdk-wrapper';
const picoDeployConfig = require('../../picoDeployConfig.json');

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'HomePage';

  constructor(platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      screenOrientation: ScreenOrientation,
      platformSdkWrapper: PlatformSdkWrapperProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (platform.is('cordova')) {
        screenOrientation.lock(screenOrientation.ORIENTATIONS.LANDSCAPE);
      }

      // Finally start our platform sdk wrapper, if we are watching the db
      if(picoDeployConfig.dbWatcher.enable) {
        platformSdkWrapper.initialize();
      }
    });
  }
}
