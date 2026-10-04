# PlayDeck

A community-built mobile arcade. Tap a game, drag the joystick, and play. Includes Snake and Wander, a Three.js exploration game. The PlayDeck name and repository stay the same.

## Play on the web

Run `npm start` (Python 3 required) and open http://localhost:8080. No dependency install or web build needed. `npm run check` validates the catalog and HTML references. The site works under a GitHub Pages project path.

Set repository Settings → Pages → Source to **GitHub Actions**. Pushing to `main` validates and deploys the site at https://pugplayzyt.github.io/playdeck/ .

## Android app

[Download the Android APK](https://github.com/pugplayzYT/playdeck/releases/download/android-latest/playdeck.apk) after the **Build Android app** workflow completes. On Android, open the downloaded APK and allow installation from your browser when prompted. Requires Android 7.0+ and an up-to-date Android System WebView. The preview app runs in landscape in either horizontal orientation, hides system bars during play, and includes games offline. External links open in your browser. New games arrive through app updates; the website updates independently.

The workflow builds and publishes an installable APK to the `android-latest` release. Pull requests build and lint without publishing. Preview builds use a development signing identity cached between builds. If that cache is lost, an update may require uninstalling the old preview, which removes local scores. For production distribution, configure a permanent private release signing key and increase versionCode for every release. This preview is not a Google Play release.

To build locally, install JDK 17+, Android SDK 35 and Gradle 8.9, set `ANDROID_HOME`, then run `gradle -p android assembleRelease lintRelease`. The build copies the web files into app assets. No JavaScript native bridge or network permission is needed.

## Touch controls

Games use a circular touch joystick and large Play / Pause buttons. Releasing or cancelling the touch resets movement. Rotate your phone for landscape gameplay; the Android app enforces landscape. Browsers may refuse orientation locking outside fullscreen. Keyboard controls remain available, and optional external gamepads use the shared input API.

Snake uses Canvas 2D and stores high scores locally when storage is available. Wander requires WebGL. Test on actual phones before claiming device support.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Reviewed HTML, CSS and JavaScript games are added through pull requests. Three.js 0.160.1 is bundled locally with its MIT license. Project code is MIT licensed; see [LICENSE](LICENSE).
