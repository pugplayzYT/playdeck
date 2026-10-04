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
  for (var i = 0; i < 65; i++) {
    var x = Math.sin(i * 17.3) * 48, z = Math.cos(i * 9.1) * 48;
    if (Math.abs(x) < 3 && z > 0) continue;
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(.15, .25, 2, 6), new THREE.MeshLambertMaterial({color:0x64533d}));
    trunk.position.set(x, 1, z); scene.add(trunk);
    var crown = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 7), new THREE.MeshLambertMaterial({color:i % 2 ? 0x385c43 : 0x4a6d4b}));
    crown.position.set(x, 3.5, z); scene.add(crown);
  }
  var beacon = new THREE.Mesh(new THREE.IcosahedronGeometry(.65), new THREE.MeshStandardMaterial({color:0xf2d284, emissive:0x6b4815, roughness:.4}));
  beacon.position.set(0, 2, -14); scene.add(beacon);
  var keys = {}, paused = false, found = false, last = 0, yaw = 0, pitch = 0;
  var look = PlayDeck.enableLook(canvas);
  camera.rotation.order = 'YXZ';
  function reset() {
    camera.position.set(0, 1.7, 12); yaw = pitch = 0;
    camera.rotation.set(0, 0, 0); look.reset(); keys = {};
    paused = false; found = false; beacon.visible = true;
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
      beacon.rotation.y += dt;
      beacon.position.y = 2 + Math.sin(time / 700) * .2;
      if (!found && camera.position.distanceTo(beacon.position) < 2) { found = true; beacon.visible = false; }
    }
    status.textContent = paused ? 'Paused — press Play or Space to resume' : found ? 'Beacon found! Keep exploring, or restart for another walk.' : 'Find the golden beacon · Joystick to move · Drag the world to look';
    renderer.render(scene, camera); requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
