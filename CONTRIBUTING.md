# Build a mobile game for PlayDeck

1. Fork the repository and create a branch.
2. Copy `games/template/` to `games/your-game/`. Build a local HTML, CSS and JavaScript game. The starter includes a working touch joystick, action buttons, pause, restart and keyboard fallback.
3. Design movement around a classic circular joystick. Read `PlayDeck.axes` every animation frame: X and Y range from -1 to 1 with a dead zone. Up is negative Y. `PlayDeck.on(action => ...)` provides discrete directions plus `select`, `pause` and `back`. Prefer analog axes for walking games and discrete directions for grid games. Do not add little directional arrow buttons. Games without movement can use large tap targets instead.
4. Keep controls inside `.game-stage` so they remain available in fullscreen. Keep essential gameplay clear of the lower control corners. Support landscape screens, safe areas, pointer cancellation and multiple simultaneous touches. Pause on visibility loss and blur. Provide a clear return to the library, restart and Play / Pause buttons. Keep the `data-exit-game` link inside the game stage; `PlayDeck.exitGame()` leaves fullscreen, clears input and returns directly to the game library.
5. For 3D, load `../../vendor/three.min.js` before your script and use global `THREE`. Handle WebGL failure with a visible message. Limit scene complexity and render resolution for phones. For first-person games, use joystick movement plus camera dragging on the world canvas (see the shared API below and Wander).
6. Add a record to `games.json`: `{"id":"your-game","title":"Your Game","description":"A short description.","category":"Arcade","author":"Your name","entry":"games/your-game/index.html"}`. Supported categories: `Arcade`, `Exploration`. New categories also need a library filter and validator update.
7. Run `npm run build`, `npm start` and `npm run check`. Test a GitHub Pages project subpath, portrait and landscape layouts, joystick release/cancel, keyboard, and actual Android devices when available. Check the installed PWA too, including offline play after its first online visit.
8. Open a pull request with controls, screenshots, asset licenses, performance notes and tested devices. Maintainers review code and gameplay. Merging deploys the website and generates an updated offline cache for the PWA.

## Review requirements

- Use relative local paths. No accounts, tracking, ads, secrets, remote scripts, network requests or paid assets. Include licenses for artwork, audio and third-party code. Only submit work you can distribute.
- Use large touch targets (at least 44 CSS pixels), readable text and visible keyboard focus. Avoid flashing and autoplay audio. Provide mute controls if audio is used.
- Keep the joystick responsive and reset movement after cancelled touches or app backgrounding. Do not rely solely on color.
- Document real phone and installed PWA testing honestly. Browser emulation is useful but does not prove device compatibility.
- Games run as reviewed, same-origin code. Catalog checks do not sandbox games or prove safety; inspect scripts, assets, dependencies and storage access.

## Repository administration

Protect `main`, require pull request review and validation, and restrict direct pushes. Review workflow changes carefully. Set Pages to GitHub Actions. The Pages workflow generates a content-hashed offline cache including every local game asset. Keep games self-contained so they work offline.

PWA updates wait until the player chooses **Update PlayDeck** in the library or closes all app tabs. Do not force-reload games to apply updates. Landscape orientation is requested by the web manifest; desktop browsers and iOS may handle orientation differently.

## Standard 3D movement and camera controls

Use the left joystick to walk forward/backward and strafe left/right. Let the other thumb drag anywhere on the world canvas to look horizontally and vertically. Attach look controls to the canvas, not the whole document, so touching the joystick, menus or action buttons cannot rotate the camera. Both thumbs must work simultaneously.

```js
const look = PlayDeck.enableLook(document.getElementById('canvas'));
// In your animation loop (consume once per frame):
const [dragX, dragY] = look.consume();
yaw -= dragX * 2.6;
pitch = Math.max(-Math.PI / 2 + 0.1,
  Math.min(Math.PI / 2 - 0.1, pitch - dragY * 2.6));
camera.rotation.order = 'YXZ';
camera.rotation.set(pitch, yaw, 0);
const strafe = PlayDeck.axes[0];
const forward = -PlayDeck.axes[1];
// Move along the camera heading on the ground plane; normalize diagonal movement.
```

Drag deltas are fractions of the canvas's shorter CSS dimension; they are relative movement, so **do not multiply them by frame time**. `PlayDeck.lookAxes` contains optional external controller right-stick axes; multiply those velocities by frame time. `look.reset()` clears a gesture when pausing or restarting; `look.destroy()` removes its listeners when disposing a game. The helper handles pointer capture, release, cancellation and focus loss. Consume and discard look deltas while paused so resuming never jumps the camera.

Wander is a working Three.js reference with simultaneous joystick/look input, clamped vertical look, ground-plane movement, diagonal speed limiting, WASD movement, and mouse dragging or arrow-key camera control. Test the two-thumb gesture, cancellation, pause and restart on a real phone as well as in a browser.
