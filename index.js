const CSGameState = new (require('cs-gamestate'))(3000, '0.0.0.0');
const LightsInteractions = require('./interactions/Lights');

const MIN_HEALTH = 20;

const start = async () => {
  const lights = new LightsInteractions();

  await lights.boot();
  await lights.idle();

  CSGameState.on('player.state.health', async (health, oldValue) => {
    if (health <= 0) {
      await lights.off();
    } else if (health < MIN_HEALTH) {
      await lights.lowLife();
    } else if (health < oldValue) {
      await lights.lifeReducing();
    } else if (health > oldValue) {
      await lights.lifeIncreasing();
    }
  });
};

start();
