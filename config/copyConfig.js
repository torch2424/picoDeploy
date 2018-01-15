#!/usr/bin/env node

var fs = require('fs');

function copyConfig(configFileName) {
  fs.createReadStream(`./config/${configFileName}`).pipe(fs.createWriteStream('picoDeployConfig.json'));
}

let consoleMsg = 'Using the following config: ';

//If tou have multiple configs for the same cart
// if (process.env.MOBILE && process.env.MOBILE !== "false") {
//   const mobileConfig = 'picoDeployConfig.mobile.json';
//   copyConfig(mobileConfig);
//   consoleMsg += mobileConfig;
// }

// Include the Jelpi Config
const getDisMoneyCommunittyConfig = 'picoDeployConfig.getdismoney-communitty.json';
copyConfig(getDisMoneyCommunittyConfig);
consoleMsg += getDisMoneyCommunittyConfig;

console.log(consoleMsg);
