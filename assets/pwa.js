(function () {
  var base = new URL('../', document.currentScript.src), pendingInstall = null, registration = null, updating = false;
  var install = document.getElementById('install-app'), help = document.getElementById('install-help');
  var update = document.getElementById('update-app'), status = document.getElementById('offline-status');
  var installed = window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  function markInstalled() { if (install) install.hidden = true; if (help) help.textContent = 'PlayDeck is installed. Your pocket arcade is ready.'; }
  if (installed) markInstalled();
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault(); pendingInstall = event;
    if (install && !installed) install.hidden = false;
    if (help && !installed) help.textContent = 'Install PlayDeck on your home screen. No app store or APK needed.';
  });
  window.addEventListener('appinstalled', function () { installed = true; pendingInstall = null; markInstalled(); });
  if (install) install.addEventListener('click', async function () {
    if (!pendingInstall) return;
    install.disabled = true;
    try {
      await pendingInstall.prompt();
      var result = await pendingInstall.userChoice;
      if (result.outcome === 'accepted') markInstalled();
      else if (help) help.textContent = 'You can install later from your browser menu.';
    } catch (e) { if (help) help.textContent = 'Use your browser menu to install PlayDeck.'; }
    pendingInstall = null; install.hidden = true; install.disabled = false;
  });
  function showUpdate() { if (update && registration.waiting) update.hidden = false; }
  if (update) update.addEventListener('click', function () {
    if (!registration || !registration.waiting) return;
    updating = true; update.disabled = true; registration.waiting.postMessage({type:'SKIP_WAITING'});
  });
  if (!('serviceWorker' in navigator)) {
    if (status) status.textContent = 'Offline installation is not available in this browser. You can still play online.';
    return;
  }
  navigator.serviceWorker.addEventListener('controllerchange', function () { if (updating) location.reload(); });
  navigator.serviceWorker.register(new URL('sw.js', base).href, {scope:base.href, updateViaCache:'none'}).then(function (reg) {
    registration = reg; showUpdate();
    reg.addEventListener('updatefound', function () {
      var worker = reg.installing;
      if (worker) worker.addEventListener('statechange', function () {
        if (worker.state === 'installed') showUpdate();
        if (worker.state === 'redundant' && status && !navigator.serviceWorker.controller) status.textContent = 'Offline setup could not finish. Reconnect and reload to try again.';
      });
    });
    return navigator.serviceWorker.ready;
  }).then(function () {
    if (status) status.textContent = 'Games saved. Ready to play offline.';
  }).catch(function () { if (status) status.textContent = 'Offline setup could not finish. Use HTTPS or localhost, then reload.'; });
})();
