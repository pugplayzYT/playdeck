# PlayDeck

A free, community-built HTML arcade for browsers, designed with TV screens and controllers in mind. Includes Snake and Wander, a small Three.js exploration game. No runtime dependencies or external CDN requests.

## Run locally

Run `npm start` (Python 3 required), then open http://localhost:8080. Run `npm run check` to validate submissions. There is no install or build step. Keep URLs relative so deployment works under `/playdeck/`.

## GitHub Pages

In repository Settings → Pages, set **Source: GitHub Actions**. Merge this project into `main`; the workflow checks and deploys the static files. Pull requests run checks but do not deploy. The expected project URL is https://pugplayzyt.github.io/playdeck/ . Deployment requires repository Pages configuration and pushing these files; writing them locally does not publish the site.

## Controls and compatibility

The library supports keyboard arrows / Tab / Enter, pointer and touch. Standard-mapped controllers use D-pad or left stick, bottom face button (× / A) to select, right face button (○ / B) to return, and Options / Start to pause. Press a controller button after opening the page to allow detection. CSS hides the page cursor while controller input is active; pointer movement restores it. Browser chrome and OS cursors are outside the page's control.

Gamepad API, button mappings, fullscreen and WebGL availability vary across console browsers. PS4/PS5 support is a target, **not verified compatibility**. PS5 does not offer a normal standalone browser app. Test on actual hardware before claiming support. Keyboard, pointer and on-screen controls remain available when a gamepad is not exposed. Snake uses Canvas 2D; Wander needs WebGL. Scores are stored on the current device when storage is available.

## Add a game

See [CONTRIBUTING.md](CONTRIBUTING.md). Games are code submissions reviewed through GitHub pull requests, not uploads from the website. Three.js 0.160.1 is bundled at `vendor/three.min.js`, with its upstream MIT license. Its classic script build avoids requiring ES module support in console browsers; upgrades should be tested carefully.

Project code is MIT licensed; see [LICENSE](LICENSE).
