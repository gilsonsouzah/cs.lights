const hexToRGB = require('hex-rgb');

const { Discovery, Control, CustomMode } = require('magic-home');

module.exports = class MagicHome {
  constructor() {
    this.devices = [];
  }

  async findDevices() {
    const devices = await Discovery.scan(2000);

    if (devices.length <= 0) {
      throw new Error('MagicHome: No one device is connected on your network');
    }

    this.devices = devices.map((device) => ({
      ...device,
      control: new Control(device.address, {
        ack: {
          power: true,
          color: false,
          pattern: false,
          custom_pattern: false,
        },
      }),
    }));
  }

  async setPowerAllDevices(state = true) {
    for (let light of this.devices) {
      await light.control.setPower(state);
    }
  }

  async setColorRGBAllDevices(red = 0, green = 0, blue = 255) {
    for (let light of this.devices) {
      await light.control.setColor(red, green, blue);
    }
  }

  async setColorAllDevices(color) {
    const pattern = hexToRGB(color);

    await this.setColorRGBAllDevices(pattern.red, pattern.green, pattern.blue);
  }

  async setCustomEffectAllDevices(colors = [], transitionType = 'yellow_strobe_flash', speed = 75) {
    const effect = new CustomMode();

    for (let color of colors) {
      const pattern = hexToRGB(color);

      effect.addColor(pattern.red, pattern.green, pattern.blue);
    }

    effect.setTransitionType(transitionType);

    for (let light of this.devices) {
      await light.control.setCustomPattern(effect, speed);
    }
  }

  async setPatternAllDevices(effect, speed = 75) {
    for (let light of this.devices) {
      await light.control.setPattern(effect, speed);
    }
  }

  printDevices() {
    console.log('Discovered the following devices:');
    console.log();
    console.log('Address    \t| ID         \t| Model');
    console.log('---------------------------------------');

    for (let light of this.devices) {
      console.log(`${light.address}\t| ${light.id}\t| ${light.model}`);
    }
  }
};
