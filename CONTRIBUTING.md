# Build a mobile game for PlayDeck

1. Fork the repository and create a branch.
2. Copy `games/template/` to `games/your-game/`. Build a local HTML, CSS and JavaScript game. The starter includes a working touch joystick, action buttons, pause, restart and keyboard fallback.
3. Design movement around a classic circular joystick. Read `PlayDeck.axes` every animation frame: X and Y range from -1 to 1 with a dead zone. Up is negative Y. `PlayDeck.on(action => ...)` provides discrete directions plus `select`, `pause` and `back`. Prefer analog axes for walking games and discrete directions for grid games. Do not add little directional arrow buttons. Games without movement can use large tap targets instead.
4. Keep controls inside `.game-stage` so they remain available in fullscreen. Keep essential gameplay clear of the lower control corners. Support landscape screens, safe areas, pointer cancellation and multiple simultaneous touches. Pause on visibility loss and blur. Provide a clear return to the library, restart and Play / Pause buttons.
5. For 3D, load `../../vendor/three.min.js` before your script and use global `THREE`. Handle WebGL failure with a visible message. Limit scene complexity and render resolution for phones.
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
