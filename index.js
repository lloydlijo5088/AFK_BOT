const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'elver.aternos.host',
    port: 31369,
    username: '1_Theo',
    auth: 'offline'
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log("✅ Bot spawned!");

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    function randomMovement() {
      const move = Math.floor(Math.random() * 10) + 1;

      switch (move) {
        case 1:
          setTimeout(() => {
            bot.setControlState('forward', true);
            setTimeout(() => {
              bot.setControlState('forward', false);
              setTimeout(() => {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
              }, 2000);
            }, 3000);
          }, 3000);
          break;

        case 2:
          setTimeout(() => {
            bot.setControlState('back', true);
            setTimeout(() => {
              bot.setControlState('back', false);
              setTimeout(() => {
                bot.setControlState('forward', true);
                setTimeout(() => bot.setControlState('forward', false), 1000);
              }, 2000);
            }, 2000);
          }, 5000);
          break;

        case 3:
          bot.activateItem(); // open inventory
          setTimeout(() => {
            bot.setQuickBarSlot(3);
            bot.deactivateItem();
          }, 2000);
          break;

        case 4:
          bot.look(1, 0, true); // look right
          setTimeout(() => {
            bot.look(-1, 0, true); // then left
          }, 3000);
          break;

        case 5:
          bot.setControlState('jump', true);
          setTimeout(() => {
            bot.setControlState('jump', false);
            setTimeout(() => {
              bot.setControlState('jump', true);
              setTimeout(() => bot.setControlState('jump', false), 500);
            }, 5000);
          }, 500);
          break;

        case 6:
          bot.look(Math.random(), Math.random(), true);
          setTimeout(() => {
            bot.look(Math.random(), Math.random(), true);
          }, 10000);
          break;

        case 7:
          setTimeout(() => {
            bot.setControlState('forward', true);
            setTimeout(() => {
              bot.setControlState('forward', false);
              bot.setControlState('back', true);
              setTimeout(() => {
                bot.setControlState('back', false);
              }, 3000);
            }, 3000);
          }, 10000);
          break;

        case 8:
          const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];
          const action = actions[Math.floor(Math.random() * actions.length)];
          bot.setControlState(action, true);
          setTimeout(() => bot.setControlState(action, false), 2000);
          break;

        case 9:
          bot.chat('Good morning guys');
          break;

        case 10:
          bot.setControlState('sneak', true);
          bot.setControlState('forward', true);
          setTimeout(() => {
            bot.setControlState('forward', false);
            bot.setControlState('jump', true);
            setTimeout(() => {
              bot.setControlState('jump', false);
              bot.setControlState('back', true);
              setTimeout(() => {
                bot.setControlState('back', false);
                bot.setControlState('sneak', false);
              }, 3000);
            }, 500);
          }, 3000);
          break;
      }
    }

    setInterval(randomMovement, 15000); // Runs one random movement every 15 seconds

    // Random logout/relogin logic
    const minTime = 2.5 * 60 * 60 * 1000; // 2.5 hours
    const maxTime = 3.5 * 60 * 60 * 1000; // 3.5 hours
    const randomLogoutDelay = Math.floor(Math.random() * (maxTime - minTime)) + minTime;

    setTimeout(() => {
      console.log("🕒 Logging out for scheduled cooldown...");
      bot.quit("Routine logout");

      const relogDelay = Math.floor(Math.random() * 10000) + 10000; // 10–20 sec
      setTimeout(() => {
        console.log("🔁 Reconnecting bot...");
        createBot();
      }, relogDelay);

    }, randomLogoutDelay);
  });

  bot.on('end', () => {
    console.log("❌ Bot disconnected. Reconnecting...");
    setTimeout(() => process.exit(1), 1000);
  });

  bot.on('error', err => {
    console.log("Bot error:", err);
  });
}

// Initial bot launch
createBot();

// --- Web server for Render ---
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ AFK Bot is running on Render!');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
