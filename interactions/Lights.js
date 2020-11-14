const MagicHome = require('../interfaces/MagicHome');

const { BLUE } = require('../constants/colors');
const { red_strobe_flash, red_gradual_change, green_gradual_change } = require('../constants/effects');

module.exports = class LightsInteractions {
  constructor() {
    this.magicHome = new MagicHome();
  }

  async boot(silent = true) {
    try {
      await this.magicHome.findDevices();
      if (!silent) await this.magicHome.printDevices();
    } catch (error) {
      await this.boot();
    }
  }

  async off() {
    await this.magicHome.setPowerAllDevices(false);
  }

  async idle() {
    await this.magicHome.setColorAllDevices(BLUE, 1000);
    await this.magicHome.setPowerAllDevices(true);
  }

  async shoot() {
    await this.magicHome.setPatternAllDevices(red_strobe_flash, 120);
  }

  async lifeReducing() {
    await this.magicHome.setPatternAllDevices(red_gradual_change, 80);
  }

  async lifeIncreasing() {
    await this.magicHome.setPatternAllDevices(green_gradual_change, 80);
  }

  async lowLife() {
    await this.magicHome.setPatternAllDevices(red_gradual_change, 100);
  }
};
