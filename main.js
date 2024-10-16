import NoSleep from './node_modules/@zakj/no-sleep/dist/no-sleep.js';

// We skip the service worker for localhost so we don't need
// to worry about clearing the cache during local development
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  // Once the caching service worker is installed the application
  // can be loaded offline; files are served from the worker
  navigator.serviceWorker.register('service-worker.js');
}

var noSleep = new NoSleep();

const handleVisibilityChange = () => {
  if (noSleep !== null && document.visibilityState === 'visible') {
    // Disable wake lock at some point in the future.
    // (does not need to be wrapped in any user input event handler)
    noSleep.enable();
    console.log("..No Sleep..")
  } else if (noSleep !== null && document.visibilityState === 'hidden') {
    noSleep.disable()
    console.log("..Sleep..")
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// Enable wake lock.
// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
document.addEventListener(
  'click',
  function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
    console.log("..No Sleep..")
  },
  false,
);

/*
// test support
let isSupported = false;
// create a reference for the wake lock
let wakeLock = null;

if ('wakeLock' in navigator) {
  isSupported = true;
}
console.log(isSupported);

if (isSupported) {
  // create an async function to request a wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log(wakeLock);
      // listen for our release event
      wakeLock.onrelease = function(ev) {
        console.log(ev);
      }

    } catch (err) {
      // if wake lock request fails - usually system related, such as battery
      console.log(err.name + err.message);

    }
  } // requestWakeLock()
  requestWakeLock();
  
  const handleVisibilityChange = () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
}
*/
// APP

(async() => {
  const app = new PIXI.Application();
  const currentOrientation = {portrait: false, landscape: false};

  await app.init({
    autoStart: false,
    resizeTo: window,
    sharedTicker: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  });

  app.canvas.style.position = 'absolute';
  globalThis.__PIXI_APP__ = app;

  document.body.appendChild(app.canvas);

  function resizeElements() {
    app.stage.children.forEach(child => {
        if (child instanceof PIXI.Sprite) {
          if (child.label == "Background") {
            child.width = app.screen.width;
            child.height = app.screen.height;
          } else {
            child.scale.set(Math.min(app.renderer.width / child.texture.width, app.renderer.height / child.texture.height));
          }
        }
        if (child instanceof GameObject) {
          child.sprite.position.x = child.position.x();
          child.sprite.position.y = child.position.y();
          app.stage.addChild(child.sprite)
        }
    });
  }


  window.addEventListener('resize', () => {
    if (app.renderer.width > app.renderer.height) {
        currentOrientation.landscape = true;
        currentOrientation.portrait = false;
    } else { 
        currentOrientation.portrait = true;
        currentOrientation.landscape = false;
    }

    app.renderer.resize(window.innerWidth, window.innerHeight);
    resizeElements();
  })

  // MAIN

  await createBackground(app);
  await createClouds(app);
  await createCity(app);
  await createBottomUi(app);
  await createTopUi(app);
  
  resizeElements();
  
  // MAIN


})();

//APP

async function createTopUi(app) {
  const topBarBg = new GameObject(await PIXI.Assets.load("assets/ui/top/coin_bg(1).png"));
  const topMiddleLeftIcon = new GameObject(await PIXI.Assets.load("assets/ui/top/coin(1).png"));
  const topMiddleRightIcon = new GameObject(await PIXI.Assets.load("assets/ui/top/+(1).png"));
  const topLeftTrailIcon = new GameObject(await PIXI.Assets.load("assets/ui/top/gamburger_button(1)_variant.png"));
  const topLeftProfileIcon = new GameObject(await PIXI.Assets.load("assets/ui/top/profile_icons_0013_variant.png"));
  const topRightIcon = new GameObject(await PIXI.Assets.load("assets/ui/top/shield(1)_variant.png"));

  topBarBg.sprite.anchor.set(0.5, 0.305);
  topBarBg.position.x = () => { return app.renderer.width / 2; };
  topBarBg.position.y = () => { return 0; };

  topMiddleLeftIcon.sprite.anchor.set(0.5, 0.305);
  topMiddleLeftIcon.position.x = () => { return app.renderer.width / 2; };
  topMiddleLeftIcon.position.y = () => { return 0; };

  topMiddleRightIcon.sprite.anchor.set(0.5, 0.305);
  topMiddleRightIcon.position.x = () => { return app.renderer.width / 2; };
  topMiddleRightIcon.position.y = () => { return 0; };

  topLeftTrailIcon.sprite.anchor.set(0.46, 0.335);
  topLeftTrailIcon.position.x = () => { return 0; };
  topLeftTrailIcon.position.y = () => { return 0; };

  topLeftProfileIcon.sprite.anchor.set(0.375, 0.32);
  topLeftProfileIcon.position.x = () => { return 0; };
  topLeftProfileIcon.position.y = () => { return 0; };

  topRightIcon.sprite.anchor.set(0.58, 0.315);
  topRightIcon.position.x = () => { return app.renderer.width; };
  topRightIcon.position.y = () => { return 0; };

  topBarBg.fitToScreen(app);
  topMiddleLeftIcon.fitToScreen(app);
  topMiddleRightIcon.fitToScreen(app);
  topLeftTrailIcon.fitToScreen(app);
  topLeftProfileIcon.fitToScreen(app);
  topRightIcon.fitToScreen(app);
  app.stage.addChild(topBarBg, topMiddleLeftIcon, topMiddleRightIcon, topLeftTrailIcon, topLeftProfileIcon, topRightIcon);
}

async function createBottomUi(app) {
  const botBgObject = new GameObject(await PIXI.Assets.load("assets/ui/bot.png"));
  const botBgButtonObject = new GameObject(await PIXI.Assets.load("assets/ui/Button_red(1).png"));
  const botBgDiceIconObject = new GameObject(await PIXI.Assets.load("assets/ui/Button_dice_icon.png"));
  const botLeftBgButtonObject = new GameObject(await PIXI.Assets.load("assets/ui/bot_rightBgButton.png"));
  const botRightBgButtonObject = new GameObject(await PIXI.Assets.load("assets/ui/bot_leftBgButton.png"));
  const botRightButtonIconObject = new GameObject(await PIXI.Assets.load("assets/ui/news_icon.png"));
  const botLeftButtonIconObject = new GameObject(await PIXI.Assets.load("assets/ui/MB_icon.png"));
  const botMiddleLight = new GameObject(await PIXI.Assets.load("assets/ui/Light.png"));

  botBgObject.sprite.anchor.set(0.5, 1);
  botBgObject.position.x = () => { return app.renderer.width / 2; };
  botBgObject.position.y = () => { return app.renderer.height; };

  botBgButtonObject.sprite.anchor.set(0.5, 1);
  botBgButtonObject.position.x = () => { return app.renderer.width / 2; };
  botBgButtonObject.position.y = () => { return app.renderer.height; };
  botBgButtonObject.sprite.alpha = 0.5;

  botBgDiceIconObject.sprite.anchor.set(0.5, 1);
  botBgDiceIconObject.position.x = () => { return app.renderer.width / 2; };
  botBgDiceIconObject.position.y = () => { return app.renderer.height; };

  botRightBgButtonObject.sprite.anchor.set(1);
  botRightBgButtonObject.position.x = () => { return app.renderer.width; };
  botRightBgButtonObject.position.y = () => { return app.renderer.height; };

  botLeftBgButtonObject.sprite.anchor.set(1);
  botLeftBgButtonObject.position.x = () => { return app.renderer.width; };
  botLeftBgButtonObject.position.y = () => { return app.renderer.height; };

  botRightButtonIconObject.sprite.anchor.set(1);
  botRightButtonIconObject.position.x = () => { return app.renderer.width; };
  botRightButtonIconObject.position.y = () => { return app.renderer.height; };

  botRightButtonIconObject.sprite.anchor.set(1);
  botRightButtonIconObject.position.x = () => { return app.renderer.width; };
  botRightButtonIconObject.position.y = () => { return app.renderer.height; };

  botLeftButtonIconObject.sprite.anchor.set(1);
  botLeftButtonIconObject.position.x = () => { return app.renderer.width; };
  botLeftButtonIconObject.position.y = () => { return app.renderer.height; };

  botMiddleLight.sprite.anchor.set(1);
  botMiddleLight.position.x = () => { return app.renderer.width; };
  botMiddleLight.position.y = () => { return app.renderer.height; };

  botBgObject.fitToScreen(app);
  botBgButtonObject.fitToScreen(app);
  botBgDiceIconObject.fitToScreen(app);
  botLeftBgButtonObject.fitToScreen(app);
  botLeftButtonIconObject.fitToScreen(app);
  botRightBgButtonObject.fitToScreen(app);
  botRightButtonIconObject.fitToScreen(app);
  botMiddleLight.fitToScreen(app);
  app.stage.addChild(botBgObject, botBgButtonObject, botBgDiceIconObject,
      botLeftBgButtonObject, botLeftButtonIconObject,
      botRightBgButtonObject, botRightButtonIconObject,
      botMiddleLight);
}

async function createClouds(app) {
  const cloud1Object = new GameObject(await PIXI.Assets.load("assets/background/cloud.png"));
  const cloud2Object = new GameObject(await PIXI.Assets.load("assets/background/cloud2.png"));
  const cloud3Object = new GameObject(await PIXI.Assets.load("assets/background/cloud3.png"));
  const cloud3bisObject = new GameObject(await PIXI.Assets.load("assets/background/cloud3.png"));

  cloud1Object.sprite.anchor.set(0.5);
  cloud1Object.position.x = () => { return app.renderer.width / 4; };
  cloud1Object.position.y = () => { return app.renderer.height / 4; };

  cloud2Object.sprite.anchor.set(0.5);
  cloud2Object.position.x = () => { return app.renderer.width / 2; };
  cloud2Object.position.y = () => { return app.renderer.height / 4; };

  cloud3Object.sprite.anchor.set(0.5);
  cloud3Object.position.x = () => { return app.renderer.width; };
  cloud3Object.position.y = () => { return app.renderer.height / 4; };

  cloud3bisObject.sprite.anchor.set(0.5);
  cloud3bisObject.position.x = () => { return app.renderer.width / 4; };
  cloud3bisObject.position.y = () => { return app.renderer.height / 4; };

  cloud1Object.fitToScreen(app);
  cloud2Object.fitToScreen(app);
  cloud3Object.fitToScreen(app);
  cloud3bisObject.fitToScreen(app);

  app.stage.addChild(cloud1Object, cloud2Object, cloud3Object, cloud3bisObject);
}

async function createCity(app) {
  const gameObject = new GameObject(await PIXI.Assets.load("assets/background/city.png"));
  
  gameObject.sprite.anchor.set(0.5);
  gameObject.position.x = () => { return app.renderer.width / 2; };
  gameObject.position.y = () => { return app.renderer.height / 2; };
  
  gameObject.fitToScreen(app);

  app.stage.addChild(gameObject);
}

async function createBackground(app) {
  const texture = await PIXI.Assets.load("assets/background/bg.png");
  const sprite = new PIXI.Sprite(texture);

  sprite.width = app.screen.width;
  sprite.height = app.screen.height;
  sprite.label = "Background";

  app.stage.addChild(sprite);
}

// Small Sprite Wrapper

class GameObject extends PIXI.Sprite{
  constructor(texture, landscapeTexture) {
    super()
    if (texture != undefined) {
        this.sprite = new PIXI.Sprite(texture);
    }
    if (landscapeTexture != undefined) {
        this.spriteLandscape = new PIXI.Sprite(landscapeTexture);
    }
  }
  async init(texturePath) {
    const texture = await PIXI.Assets.load(texturePath);
    this.sprite = new PIXI.Sprite(texture)
  }
  _texturePath = "";
  sprite;
  spriteLandscape;
  position = {x: () => {}, y: () => {}};
  fitToScreen = (app) => {
    this.sprite.scale.set(Math.min(app.renderer.width / this.sprite.texture.width, app.renderer.height / this.sprite.texture.height))
  }
}

// Small Sprite Wrapper
