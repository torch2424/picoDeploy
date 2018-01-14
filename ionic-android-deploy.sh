#!/bin/bash

# Commands to run sign and zipalign all ionic android output files
if [ $# -ne 4 ]; then
  # Print Help
  echo " "
  echo "Wrong number of commands. Printing Help..."
  echo " "
  echo "Ionic Android Deploy. Simply follows commands from: http://ionicframework.com/docs/v1/guide/publishing.html"
  echo " "
  echo "Keystore can be created by following the keytool command in the above link"
  echo " "
  echo "USAGE:"
  echo " "
  echo "./ionic-android-deploy.sh [Path to keystore] [Keystore Password] [Output directory (No Trailing slash)] [apk file name (without trailing .apk)]"
  echo " "
else

  # Sign files with passed keystore
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore $1 -storepass $2 \
  platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk getdismoney

  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore $1 -storepass $2 \
  platforms/android/build/outputs/apk/android-x86-release-unsigned.apk getdismoney

  # Make our passed output directory/clean out already existing apks
  mkdir -p $3
  rm $3/$4-armv7.apk
  rm $3/$4-x86.apk

  # Zip align apks. Using crazy ls to get the zipalign tool
  ~/Library/Android/sdk/build-tools/$(ls ~/Library/Android/sdk/build-tools | head -n 1)/zipalign \
  -v 4 \
  platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk \
  $3/$4-armv7.apk

  ~/Library/Android/sdk/build-tools/$(ls ~/Library/Android/sdk/build-tools | head -n 1)/zipalign \
  -v 4 \
  platforms/android/build/outputs/apk/android-x86-release-unsigned.apk \
  $3/$4-x86.apk
fi
