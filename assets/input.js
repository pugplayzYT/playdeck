(function () {
  var libraryURL = new URL('../index.html#library', document.currentScript.src).href;
  var exiting = false;
  var lookAxes = [0, 0];
  var axes = [0, 0], touchAxes = [0, 0], pointer = null, previous = {}, lastDirection = '', nextRepeat = 0;
  function emit(action) { window.dispatchEvent(new CustomEvent('playdeckinput', {detail: {action: action}})); }
  function clearTouch() { pointer = null; touchAxes[0] = touchAxes[1] = 0; if (knob) knob.style.transform = ''; }
  window.PlayDeck = {
    axes: axes,
    lookAxes: lookAxes,
    enableLook: enableLook,
    exitGame: async function () {
      if (exiting) return;
      exiting = true; clearTouch(); axes[0] = axes[1] = 0;
      window.dispatchEvent(new Event('blur'));
      try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) { /* Navigation also ends fullscreen. */ }
      location.replace(libraryURL);
    },
    on: function (fn) { window.addEventListener('playdeckinput', function (e) { fn(e.detail.action); }); },
    fullscreen: async function (el) {
      try { if (!document.fullscreenElement && el.requestFullscreen) await el.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
      } catch (e) { /* Installed PWAs request landscape via the manifest; browsers can restrict locking. */ }
    }
  };
  // Attach to the game canvas so joysticks and action buttons keep their own touches.
  // Deltas are fractions of the surface's shorter side, independent of pixel density.
  function enableLook(surface) {
    var active = null, x = 0, y = 0, delta = [0, 0], previousTouchAction = surface.style.touchAction;
    surface.style.touchAction = 'none';
    function reset() {
      var id = active; active = null; delta[0] = delta[1] = 0;
      if (id !== null && surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    }
    function down(e) {
      if (active !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault(); active = e.pointerId; x = e.clientX; y = e.clientY;
      surface.setPointerCapture(active);
    }
    function move(e) {
      if (e.pointerId !== active) return;
      e.preventDefault();
      var bounds = surface.getBoundingClientRect(), size = Math.max(1, Math.min(bounds.width, bounds.height));
      delta[0] += (e.clientX - x) / size; delta[1] += (e.clientY - y) / size;
      x = e.clientX; y = e.clientY;
    }
    function up(e) {
      if (e.pointerId !== active) return;
      var id = active; active = null;
      if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    }
    function cancel(e) { if (e.pointerId === active) reset(); }
    function hidden() { if (document.hidden) reset(); }
    surface.addEventListener('pointerdown', down);
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerup', up);
    surface.addEventListener('pointercancel', cancel);
    surface.addEventListener('lostpointercapture', cancel);
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', hidden);
    return {
      consume: function () { var result = delta.slice(); delta[0] = delta[1] = 0; return result; },
      reset: reset,
      destroy: function () {
        reset(); surface.style.touchAction = previousTouchAction;
        surface.removeEventListener('pointerdown', down);
        surface.removeEventListener('pointermove', move);
        surface.removeEventListener('pointerup', up);
        surface.removeEventListener('pointercancel', cancel);
        surface.removeEventListener('lostpointercapture', cancel);
        window.removeEventListener('blur', reset);
        document.removeEventListener('visibilitychange', hidden);
      }
    };
  }
  document.querySelectorAll('[data-exit-game]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); PlayDeck.exitGame(); });
  });
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
    lookAxes[0] = pad && Math.abs(pad.axes[2] || 0) > .25 ? pad.axes[2] : 0;
    lookAxes[1] = pad && Math.abs(pad.axes[3] || 0) > .25 ? pad.axes[3] : 0;
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
