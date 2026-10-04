// Copy this directory to games/your-game, customize the scene, then register it in games.json.
// Three.js and the shared joystick/camera helpers are loaded by index.html.
(function () {
  var status = document.getElementById('status'), canvas = document.getElementById('canvas');
  var stage = document.getElementById('stage'), renderer;
  try { renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true}); }
  catch (e) { status.textContent = 'This browser cannot start WebGL. Try Snake or another browser.'; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  var scene = new THREE.Scene();
  scene.background = new THREE.Color('#a7bcb2');
  scene.fog = new THREE.Fog('#a7bcb2', 12, 65);
  var camera = new THREE.PerspectiveCamera(65, 1, .1, 100);
  camera.position.set(0, 1.7, 12);
  scene.add(new THREE.HemisphereLight(0xfff5ce, 0x43573c, 2));
  var light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(8, 15, 3); scene.add(light);
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.MeshLambertMaterial({color:0x71885b}));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  // Replace these landmarks with your level. No collision system is included.
  var grid = new THREE.GridHelper(100, 50, 0x95af70, 0x58704c);
  grid.position.y = .01; scene.add(grid);
  [[-5, -6], [4, -9], [7, 3]].forEach(function (position, i) {
    var landmark = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), new THREE.MeshLambertMaterial({color:[0xccf580, 0xf2a886, 0x91bbc6][i]}));
    landmark.position.set(position[0], 1.5, position[1]); scene.add(landmark);
  });
  var keys = {}, paused = true, last = 0, yaw = 0, pitch = 0;
  var look = PlayDeck.enableLook(canvas);
  camera.rotation.order = 'YXZ';
  function reset() {
    camera.position.set(0, 1.7, 12); yaw = pitch = 0;
    camera.rotation.set(0, 0, 0); look.reset(); keys = {};
    paused = false;
  }
  function act(action) {
    if (action === 'back') PlayDeck.exitGame();
    if (action === 'pause') { paused = !paused; look.reset(); }
    if (action === 'select') { paused = false; look.reset(); }
  }
  PlayDeck.on(act);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { act('back'); return; }
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
    keys[e.key.toLowerCase()] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) >= 0) e.preventDefault();
    if (!e.repeat && e.key === ' ') act('pause');
    if (!e.repeat && e.key === 'Enter') act('select');
  });
  document.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
  function suspend() { keys = {}; paused = true; look.reset(); }
  window.addEventListener('blur', suspend);
  document.addEventListener('visibilitychange', function () { if (document.hidden) suspend(); });
  document.getElementById('play').onclick = function () { act('select'); };
  document.getElementById('restart').onclick = reset;
  document.getElementById('pause').onclick = function () { act('pause'); };
  document.getElementById('fullscreen').onclick = function () { PlayDeck.fullscreen(stage); };
  function frame(time) {
    var dt = Math.min((time - last) / 1000, .05); last = time;
    var w = stage.clientWidth, h = stage.clientHeight;
    if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    var drag = look.consume();
    if (!paused) {
      yaw -= drag[0] * 2.6 + ((keys.arrowright ? 1 : 0) - (keys.arrowleft ? 1 : 0) + PlayDeck.lookAxes[0]) * dt * 1.8;
      pitch -= drag[1] * 2.6 + ((keys.arrowdown ? 1 : 0) - (keys.arrowup ? 1 : 0) + PlayDeck.lookAxes[1]) * dt * 1.8;
      pitch = Math.max(-Math.PI / 2 + .1, Math.min(Math.PI / 2 - .1, pitch));
      camera.rotation.set(pitch, yaw, 0);
      var forward = (keys.w ? 1 : 0) - (keys.s ? 1 : 0) - PlayDeck.axes[1];
      var strafe = (keys.d ? 1 : 0) - (keys.a ? 1 : 0) + PlayDeck.axes[0];
      var length = Math.hypot(forward, strafe);
      if (length > 1) { forward /= length; strafe /= length; }
      // Walk relative to heading; looking up never makes the player fly.
      camera.position.x += (-Math.sin(yaw) * forward + Math.cos(yaw) * strafe) * dt * 5;
      camera.position.z += (-Math.cos(yaw) * forward - Math.sin(yaw) * strafe) * dt * 5;
      camera.position.x = Math.max(-55, Math.min(55, camera.position.x));
      camera.position.z = Math.max(-55, Math.min(55, camera.position.z));
      // Add gameplay updates here. Keep movement on the ground unless your game adds jumping.
    }
    status.textContent = paused ? 'Tap Play or press Enter to start / resume' : 'Joystick to move · Drag the world to look';
    renderer.render(scene, camera); requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
