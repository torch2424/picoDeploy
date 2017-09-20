// ====== [CONFIGURATION] - tailor to your specific needs

// How many PICO-8 players to support?
// - if set to 1, all connected controllers will control PICO-8 player 1
// - if set to 2, controller #0 will control player 1, controller #2 - player 2, controller #3 - player 1, and so on
// - higher numbers will distribute the controls among the players in the same way
var supportedPlayers = 2;

// These flags control whether or not different types of buttons should
// be mapped to PICO-8 O and X buttons.
var mapFaceButtons = true;
var mapShoulderButtons = true;
var mapTriggerButtons = false;
var mapStickButtons = false;

// How far you have to pull an analog stick before it register as a PICO-8 d-pad direction
var stickDeadzone = 0.4;

// ====== [IMPLEMENTATION]

// Array through which we'll communicate with PICO-8.
var pico8_buttons = [0,0,0,0,0,0,0,0];

// Start polling gamepads (if supported by browser)
if (navigator.getGamepads)
	requestAnimationFrame(updateGamepads);

// Workhorse function, updates pico8_buttons once per frame.
function updateGamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  // Reset the array.
  for (var p = 0; p < supportedPlayers; p++)
  	pico8_buttons[p] = 0;
  // Gather input from all known gamepads.
  for (var i = 0; i < gamepads.length; i++) {
  	var gp = gamepads[i];
  	if (!gp || !gp.connected) continue;

  	// which player is this assigned to?
  	var player = i % supportedPlayers;

  	var bitmask = 0;
    // directions (from axes or d-pad "buttons")
  	bitmask |= (axis(gp,0) < -stickDeadzone || axis(gp,2) < -stickDeadzone || btn(gp,14)) ? 1 : 0;  // left
  	bitmask |= (axis(gp,0) > +stickDeadzone || axis(gp,2) > +stickDeadzone || btn(gp,15)) ? 2 : 0; // right
  	bitmask |= (axis(gp,1) < -stickDeadzone || axis(gp,3) < -stickDeadzone || btn(gp,12)) ? 4 : 0;  // up
  	bitmask |= (axis(gp,1) > +stickDeadzone || axis(gp,3) > +stickDeadzone || btn(gp,13)) ? 8 : 0; // down
    // O and X buttons
    var pressedO = 
    	(mapFaceButtons && (btn(gp,0) || btn(gp,2))) ||
    	(mapShoulderButtons && btn(gp,5)) ||
    	(mapTriggerButtons && btn(gp,7)) ||
    	(mapStickButtons && btn(gp,11));
    var pressedX = 
    	(mapFaceButtons && (btn(gp,1) || btn(gp,3))) ||
    	(mapShoulderButtons && btn(gp,4)) ||
    	(mapTriggerButtons && btn(gp,6)) ||
    	(mapStickButtons && btn(gp,10));
    bitmask |= pressedO ? 16 : 0;
    bitmask |= pressedX ? 32 : 0;
  	// update array for the player (keeping any info from previous controllers)
  	pico8_buttons[player] |= bitmask;
  	// pause button is a bit different - PICO-8 only respects the 6th bit on the first player's input
  	// we allow all controllers to influence it, regardless of number of players
  	pico8_buttons[0] |= (btn(gp,8) || btn(gp,9)) ? 64 : 0;
  }
 
  requestAnimationFrame(updateGamepads);
}

// Helpers for accessing gamepad
function axis(gp,n) { return gp.axes[n] || 0.0; }
function btn(gp,b) { return gp.buttons[b] ? gp.buttons[b].pressed : false; }
