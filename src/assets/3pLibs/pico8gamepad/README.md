The default HTML export the PICO-8 produces does not support gamepad controls.
Both Chrome and Firefox now are able to handle them, so I created a small
script that rectifies that.

Tested with Xbox pads and Logitech F710 - should work with other gamepads as well.

## Usage

* Drop [pico8gamepad.js](https://raw.githubusercontent.com/krajzeg/pico8gamepad/master/pico8gamepad.js) in the same directory with your game's HTML and JS. 
* In your HTML file, add the following, right before the `<script ... src="yourgame.js">` tag:

```
  <script src="pico8gamepad.js"></script>
```

And you're done! :)

## Configuration

If you like, you can edit the configuration at the top of `pico8gamepad.js` to suit your needs (defaults should be fine most of the time):

* `supportedPlayers` - set to 1 if your game is single player to map all controllers to player #1. In general, set it to the number of
  players supported by your game.
* `mapXXX` - you can choose whether different types of buttons on the controller should be mapped to PICO-8's O and X
* `stickDeadzone` - controls how far you have to push an analog stick for it to register as a PICO-8 d-pad press.

## License: zlib license

Copyright (c) 2016 Jakub Wasilewski

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
   claim that you wrote the original software. If you use this software
   in a product, an acknowledgement in the product documentation would be
   appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
