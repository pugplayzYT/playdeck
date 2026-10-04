# Add a game to PlayDeck

1. Fork this repository and create a branch.
2. Copy `games/template/` to `games/your-game/`. Build an HTML, CSS and JavaScript game with a local `index.html`. Keep all game assets inside your directory.
3. Use `../../assets/input.js` for the shared controller API. `PlayDeck.on(action => ...)` receives `up`, `down`, `left`, `right`, `select`, `back` and `pause`; `PlayDeck.axes` provides the left stick axes with a dead zone. Support keyboard and touch as well. Implement restart and pause buttons. Pause when the tab loses visibility. The template is scaffolding; complete these handlers before submission.
4. For 3D games, add `<script src="../../vendor/three.min.js" defer></script>` before your game script. Use the global `THREE`. Handle WebGL failure with a visible message. Keep render resolution and scene complexity modest.
5. Add a record to `games.json`: `{"id":"your-game","title":"Your Game","description":"A short description.","category":"Arcade","author":"Your name","entry":"games/your-game/index.html"}`. Categories currently supported: `Arcade`, `Exploration`. For another category, also add a filter to the library and update the validator. Custom artwork may be implemented in the library's cover renderer and CSS using local assets.
6. Run `npm start`, play the game, and run `npm run check`. Check under a project subpath, on mobile, with keyboard, and with a controller when available.
7. Open a pull request with controls, screenshots, asset licenses, performance notes and the browsers / hardware tested. Maintainers review the source and gameplay before merging. Merging to `main` publishes the approved game through GitHub Pages.

## Review requirements

- No accounts, tracking, ads, secrets, remote scripts, network requests or paid assets. Include licenses for artwork, audio and third-party code. Only submit work you can distribute.
- Use relative links; do not reference root paths such as `/assets/`.
- Show controls and a clear way back to the library. Do not intercept console browser shortcuts; handle only game inputs. Prevent unwanted arrow-key page scrolling during play.
- Provide large readable text and visible focus. Do not rely solely on color. Avoid flashing effects and autoplay audio. Allow sound to be muted if used.
- Document real device testing honestly. Browser emulation does not prove console compatibility.
- Games run as reviewed, same-origin site code. Catalog validation does not sandbox games or prove safety; reviewers must inspect scripts, assets, dependencies and storage access.

## Repository administration

Enable branch protection / rulesets for `main`, require pull request review and the `validate` check, and restrict direct pushes. These settings are configured on GitHub, not by the static site. Configure Pages to deploy with GitHub Actions. Review workflow changes especially carefully.
