var INPUT = 0;
var OUTPUT = 1;
var PWM_OUTPUT = 2;

var wiringPimode;

var pins_wpi = [8, 9, 7, 0, 2, 3, 12, 13, 14, 15, 16, 1, 4, 5, 6, 10, 11];
var pins_gpio = [2, 3, 4, 17, 27, 22, 10, 9, 11, 14, 15, 18, 23, 24, 25, 8, 7];
var pins_sys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

var c = require('../build/Release/wiringPi');

function noop() {}

function validateMode(mode) {
  if (mode != INPUT && mode != OUTPUT && mode != PWM_OUTPUT) {
    throw new Error('Invalid mode');
  }

}

function validatePin(pin) {

  if (wiringPimode === 'wiringPiSetup') {
    if (pins_wpi.indexOf(pin) === -1) {
      throw new Error('Invalid pin number');
    }
  } else if (wiringPimode === 'wiringPiSetupGpio') {
    if (pins_gpio.indexOf(pin) === -1) {
      throw new Error('Invalid pin number');
    }
  } else if (wiringPimode === 'wiringPiSetupSys') {
    if (pins_sys.indexOf(pin) === -1) {
      throw new Error('Invalid pin number');
    }
  }
}

exports = {
  VERSION: require('../package').version,
  modes: {
    INPUT: INPUT,
    OUTPUT: OUTPUT,
    PWM_OUTPUT: PWM_OUTPUT
  },
  HIGH: 1,
  LOW: 0,
  piBoardRev: c.piBoardRev,
  pwmSetRange: c.pwmSetRange,
  pwmSetClock: c.pwmSetClock,
  pwmWrite: c.pwmWrite
};

exports.setup = function setup(mode) {

  if (mode === undefined)
    mode = 'wpi';

  if (typeof mode == 'string')
    mode = mode.toLowerCase();

  var setup;
  /**/
  if (mode === 'wpi')
    setup = 'wiringPiSetup';
  else if (mode === 'gpio')
    setup = 'wiringPiSetupGpio';
  else if (mode === 'sys')
    setup = 'wiringPiSetupSys';
  else throw new Error('Invalid argument');

  if (c[setup]() == -1) {
    throw new Error('wiringPiSetup failed');
  }
  wiringPimode = setup;

  exports.setup = noop;
};

exports.pinMode = function pinMode(pin, mode) {
  validatePin(pin);
  validateMode(mode);
  c.pinMode(pin, mode);
};

exports.digitalWrite = function digitalWrite(pin, value) {
  validatePin(pin);
  value = +(value != 0);
  c.digitalWrite(pin, value);
};

exports.digitalRead = function digitalRead(pin) {
  validatePin(pin);
  return +(c.digitalRead(pin) != 0);
};

module.exports = exports;
