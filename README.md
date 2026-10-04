# PlayDeck

A community-built mobile gaming PWA. Tap a game, drag the joystick, and play. Includes Snake and Wander, a Three.js exploration game.

## Play and install

Open https://pugplayzyt.github.io/playdeck/ . On Android Chrome, tap **Install PlayDeck** when offered, or use the browser menu → Install app / Add to Home screen. On iPhone, open in Safari and use Share → Add to Home Screen. Installation availability depends on your browser.

PlayDeck launches as a fullscreen app where supported, with landscape orientation requested by its manifest. Android Chrome supports this for installed PWAs; iOS and ordinary browser tabs may require manual rotation. No APK, native build or app store is needed.

Open online once and wait for **Games saved. Ready to play offline.** The service worker saves the library, games, icons and bundled Three.js. The installed app and browser can then play offline. A browser may evict site storage; reopen online if games need to be saved again. Scores stay in local storage on the current device.

When a new version is ready, use **Update PlayDeck** in the library. Updates do not interrupt an active game. Closing all PlayDeck tabs also lets a waiting update activate.

## Development and GitHub Pages

Run `npm run build` to generate the offline cache, then `npm start` (Python 3 required) and open http://localhost:8080. No dependency installation is needed. After editing files, run `npm run build` again. `npm run check` validates the catalog, local HTML references and PWA manifest. Service workers require HTTPS or localhost.

Set repository Settings → Pages → Source to **GitHub Actions**. Pushing to `main` generates the content-hashed cache, validates files and deploys the static PWA. Relative paths keep the manifest, service worker and games scoped to `/playdeck/`.

## Touch controls

Games use a circular joystick and large Play / Pause buttons. Two-thumb input is supported; releasing or cancelling a touch resets movement. Keyboard and optional external gamepads remain available. Snake uses Canvas 2D. Wander requires WebGL and uses standard first-person controls: joystick movement and strafing, plus drag anywhere on the world to look around. Test real phones and installed PWAs before claiming device compatibility.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Reviewed HTML, CSS and JavaScript games are added through pull requests. Copy `games/template/` for 2D or `games/template-3d/` for a Three.js game with joystick movement and screen-drag camera controls. Three.js 0.160.1 is bundled locally with its MIT license. Project code is MIT licensed; see [LICENSE](LICENSE).
