import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { PicoDbProvider } from '../pico-db/pico-db';

/*
  Generated class for the PlatformSdkWrapperProvider provider.

  This will be used as a single service

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlatformSdkWrapperProvider {

  isServiceReady: any
  picoDbProvider: PicoDbProvider
  dbProviderKey: any
  platform: Platform
  CONSTANTS: any
  //greenworks: any

  constructor(
    platform: Platform,
    picoDbProvider: PicoDbProvider
  ) {

    // Prepare our isService ready
    this.isServiceReady = {};

    // Get our electron window for greenworks
    // https://github.com/electron/electron/issues/1095
    // Using window.require because: https://github.com/electron/electron/issues/7300
    // if((<any>window).require) {
    //   const electron = (<any>window).require('electron');
    //   const electronWindow = electron.remote.getCurrentWindow();
    //   this.greenworks = electronWindow.greenworks;
    // }
    this.platform = platform;
    this.picoDbProvider = picoDbProvider;

    // Define our achievements
    this.CONSTANTS = {
      ACHIEVEMENTS: {
        EXAMPLE: {
          STEAM_ID: 'EXAMPLE_STEAM_ID',
          GOOGLE_PLAY: 'EXAMPLE_GOOGLE_PLAY_ID'
        }
      },
      LEADERBOARD: {
        STEAM: {
          EXAMPLE_ID: false
        },
        GOOGLE_PLAY: {
          EXAMPLE_ID: 'EXAMPLE_LEADERBOARD_ID',
        }
      }
    }
  }

  // Function to start watching the DB to send events to our platforms
  initialize() {
    console.log('PlatformSdkWrapperProvider: Starting SDK Services...');

    // Attempt to start greenworks
    // if (!this.platform.is('mobile') && this.greenworks) {
    //   this.isServiceReady.greenworks = true;
    //   console.log('PlatformSdkWrapperProvider: Steamworks working!');
    // }

    // https://www.npmjs.com/package/cordova-plugin-play-games-services
    // Attempt to start play games
    // if (this.platform.is('android') &&
    // (<any>window).plugins &&
    // (<any>window).plugins.playGamesServices) {
    //   // Sign into play games
    //   (<any>window).plugins.playGamesServices.auth(() => {
    //     // Success
    //     console.log('Google Play Games Ready!');
    //     this.isServiceReady.playGames = true;
    //   }, () => {
    //     // Failed
    //     console.log('Google Play Games Failed!');
    //   });
    // }

    this.dbProviderKey = 'PlatformSdkWrapperProvider-picoDeploy';
    this.picoDbProvider.subscribe(this.dbProviderKey, (newValue, oldValue) => {
      this.checkAchievements(newValue, oldValue);
      this.postToLeaderboard(newValue, oldValue);
    });
  }

  // Function called everythime the db watcher tells us something changed
  checkAchievements(newValue, oldValue) {
    console.log('PlatformSdkWrapperProvider: ', 'Checking Achievements...')

    // Example: Launch an achievement when the first value changes
    if (newValue[0] > 0) {
      // Unlock Achievements
      this.unlockAchievement(this.CONSTANTS.ACHIEVEMENTS.EXAMPLE);
    }
  }

  // Function to unlock an achievement
  unlockAchievement(achievementObject) {

    console.log('PlatformSdkWrapperProvider: Unlocking Achievement: ', achievementObject);

    // Unlock Achievements for Google Play example
    // if (this.isServiceReady.playGames) {
    //   (<any>window).plugins.playGamesServices.unlockAchievement({
    //     achievementId: achievementObject.GOOGLE_PLAY_ID
    //   });
    // }

    // Unlock Achievements for steam using greenworks example
    // if (this.isServiceReady.greenworks) {
    //   this.greenworks.getAchievement(
    //     achievementObject.STEAM_ID,
    //     (isAchieved) => {
    //       // Success
    //       if (!isAchieved) {
    //         this.greenworks.activateAchievement(
    //           achievementObject.STEAM_ID,
    //           () => {
    //             // Success
    //             console.log('Success Unlocked Achievement: ', achievementObject);
    //           }, () => {
    //             // Error
    //             console.log('Error unlocking Achievement: ', achievementObject);
    //           }
    //         );
    //       }
    //       // Achievement already unlocked, ignoring...
    //     }, () => {
    //       // Error
    //       console.log('Could Not check achievement status.', achievementObject);
    //     }
    //   );
    // }
  }

  // Function to Post to a Leaderboard
  postToLeaderboard(newValue, oldValue) {

    console.log('PlatformSdkWrapperProvider: Posting to leaderboard: ', newValue, oldValue);


    // Example Posting to a Google Play Leaderboard

    // // Create an array of scores to submit
    // // Push data in the format of: https://github.com/artberri/cordova-plugin-play-games-services#sumit-score-now
    // var scoresToSubmit = [];
    //
    // if (newValue[1] !== oldValue[1] &&
    //   newValue[1] < oldValue[1]) {
    //     scoresToSubmit.push({
    //       score: newValue[1],
    //       leaderboardId: this.CONSTANTS.LEADERBOARD.EXAMPLE,
    //     });
    // }
    //
    // if (newValue[6] !== oldValue[6] &&
    //   newValue[6] > oldValue[6]) {
    //     scoresToSubmit.push({
    //       score: newValue[6],
    //       leaderboardId: this.CONSTANTS.LEADERBOARD.EXAMPLE,
    //     });
    // }
    //
    // scoresToSubmit.forEach(scoreObject => {
    //   if (this.isServiceReady.playGames) {
    //     (<any>window).plugins.playGamesServices.submitScoreNow(scoreObject);
    //   }
    //
    //   if (this.isServiceReady.greenworks) {
    //     // Do Nothing.
    //     // Leaderboards for steam is not supported by greenworks, and will require their web API.
    //     // Because of this, will need to be hosted on a secure server, and then that server, will interact
    //     // with the steam web api.
    //     // https://github.com/greenheartgames/greenworks/issues/12
    //     // https://partner.steamgames.com/doc/webapi/ISteamLeaderboards#GetLeaderboardEntries
    //   }
    // });
  }
}
