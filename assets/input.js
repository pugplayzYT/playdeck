(function () {
  var axes = [0, 0], touchAxes = [0, 0], pointer = null, previous = {}, lastDirection = '', nextRepeat = 0;
  function emit(action) { window.dispatchEvent(new CustomEvent('playdeckinput', {detail: {action: action}})); }
  function clearTouch() { pointer = null; touchAxes[0] = touchAxes[1] = 0; if (knob) knob.style.transform = ''; }
  window.PlayDeck = {
    axes: axes,
    on: function (fn) { window.addEventListener('playdeckinput', function (e) { fn(e.detail.action); }); },
    fullscreen: async function (el) {
      try { if (!document.fullscreenElement && el.requestFullscreen) await el.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
      } catch (e) { /* Installed PWAs request landscape via the manifest; browsers can restrict locking. */ }
    }
  };
  var stick = document.querySelector('.joystick'), knob = stick && stick.querySelector('.joystick-knob');
  function update(e) {
    var bounds = stick.getBoundingClientRect(), radius = bounds.width * .32;
    var x = e.clientX - bounds.left - bounds.width / 2, y = e.clientY - bounds.top - bounds.height / 2;
    var distance = Math.hypot(x, y); if (distance > radius) { x *= radius / distance; y *= radius / distance; }
    touchAxes[0] = Math.abs(x / radius) > .18 ? x / radius : 0;
    touchAxes[1] = Math.abs(y / radius) > .18 ? y / radius : 0;
    knob.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  if (stick) {
    stick.addEventListener('pointerdown', function (e) { if (pointer !== null) return; e.preventDefault(); pointer = e.pointerId; stick.setPointerCapture(pointer); update(e); });
    stick.addEventListener('pointermove', function (e) { if (e.pointerId === pointer) update(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (event) { stick.addEventListener(event, function (e) { if (e.pointerId === pointer) clearTouch(); }); });
    stick.addEventListener('keydown', function (e) { var action = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key]; if (action) { e.preventDefault(); emit(action); } });
  }
  // Mobile browsers often reserve click synthesis for the first finger.
  // Trigger action buttons on touch-down so a second thumb works with the stick.
  document.querySelectorAll('.game-actions button').forEach(function (button) {
    var handledAt = 0;
    button.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      e.preventDefault(); handledAt = Date.now(); button.click();
    });
    button.addEventListener('click', function (e) {
      if (e.isTrusted && (e.pointerType === 'touch' || (e.detail > 0 && Date.now() - handledAt < 700))) {
        e.preventDefault(); e.stopImmediatePropagation();
      }
    }, true);
  });
  window.addEventListener('blur', clearTouch);
  document.addEventListener('visibilitychange', function () { if (document.hidden) { clearTouch(); axes[0] = axes[1] = 0; } });
  function frame(time) {
    var pads = navigator.getGamepads ? navigator.getGamepads() : [], pad = null;
    for (var i = 0; i < pads.length; i++) if (pads[i] && pads[i].connected) { pad = pads[i]; break; }
    function pressed(n) { return !!(pad && pad.buttons[n] && pad.buttons[n].pressed); }
    var touching = pointer !== null;
    axes[0] = touching ? touchAxes[0] : pad && Math.abs(pad.axes[0] || 0) > .25 ? pad.axes[0] : 0;
    axes[1] = touching ? touchAxes[1] : pad && Math.abs(pad.axes[1] || 0) > .25 ? pad.axes[1] : 0;
    var direction = !touching && pressed(12) ? 'up' : !touching && pressed(13) ? 'down' : !touching && pressed(14) ? 'left' : !touching && pressed(15) ? 'right' : Math.abs(axes[0]) > Math.abs(axes[1]) ? axes[0] > .4 ? 'right' : axes[0] < -.4 ? 'left' : '' : axes[1] > .4 ? 'down' : axes[1] < -.4 ? 'up' : '';
    if (direction && (direction !== lastDirection || time >= nextRepeat)) { emit(direction); nextRepeat = time + (direction !== lastDirection ? 280 : 130); }
    lastDirection = direction;
    var mapping = {0:'select',1:'back',9:'pause'};
    Object.keys(mapping).forEach(function (n) { var down = pressed(+n); if (down && !previous[n]) emit(mapping[n]); previous[n] = down; });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
