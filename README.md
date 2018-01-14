# Notes

Using Electron and [Electron Builder](https://github.com/electron-userland/electron-builder). Simply Follow the quick setup guide for electron builder for help.

Play with the config.xml: https://cordova.apache.org/docs/en/latest/config_ref/

Plugins can have settings in config.xml, splashscreen editing: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/

May only need the cart.js. Convert the Cart.html into an angular component and be chilling. And be sure to include the cart.js in index.html

Deploying with Ionic: https://ionicframework.com/docs/intro/deploying/

Generating Resources and icons: https://ionicframework.com/docs/cli/cordova/resources/

crosswalk for performance: https://www.techiediaries.com/mobiledev/boosting-ionic2-apps-performance-with-crosswalk/

Using Greenworks: https://github.com/greenheartgames/greenworks

Install Greenworks with: https://github.com/greenheartgames/greenworks/blob/master/docs/build-instructions-electron.md#building-with-electron-rebuild and skip to step 4

Also will require steamworks sdk: https://github.com/greenheartgames/greenworks/blob/master/docs/get-steamworks-sdk.md

May need to manually add releases for each distro greenworks for electron .node files to `node_modules/greenworks/lib`

doign some funny stuff with the files key for electron builder to keep our build size small, and not include node modules, since they are included with the vendor on ionic.

may actually want to follow the NW.js for greenworks. NW.js is just a browserify/webpack thing that used to exist. Which we will have due to electron and all that

see how I am copy steam_app id for builds and stuff in main.js. and follow greenworks directory structure.

32 bit linux for steam not supported because names are same in [this guide](https://github.com/greenheartgames/greenworks/blob/master/docs/quick-start-nwjs.md)

Must Use Correct [electron](https://github.com/electron/electron/releases/tag/v1.8.1) AND [node](https://github.com/electron/electron/blob/04430c6dda80c25d24b7752f38f87003ac7ab3aa/.node-version) version, and then [do some cleanup](https://stackoverflow.com/questions/19996312/should-i-backup-the-npm-and-node-gyp-folder), or else will get a NODE_MODULE_VERSION (which Electron has its own compared to NOde :p), if going to use  [prebuilt .node addons for greenworks](https://github.com/greenheartgames/greenworks/releases/tag/v0.11.0).

Linux AppIMage doesn't work for greenworks testing because [appImage directory is read-only](https://github.com/AppImage/AppImages/issues/80), thus we can't copy over the steam appId.

Used this for google play games: https://github.com/artberri/cordova-plugin-play-games-services

NOTE: Will only work if installed from google play store after you have it built. So will have a long testing process :p Currently have it installed under aaron@aaronthedev

Maybe? Used this to add neccessary android manifest stuff: https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html#edit-config

may need to this to build for all: https://github.com/electron-userland/electron-builder/issues/2204
Also, need to make sure we have `resources/icons/` folder, with an app icon named `512x512.png` [for linux icon](https://www.electron.build/icons)


This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myBlank blank
```

Then, to run it, cd into `myBlank` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.
