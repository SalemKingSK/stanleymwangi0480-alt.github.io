// Opt-out switch for anonymous usage counts. Keys must match
// src/lib/usage-tracker.ts (OPT_OUT_KEY, DEVICE_ID_KEY, QUEUE_KEY).
(function () {
  var OPT_OUT_KEY = 'mystique-analytics-optout';
  var DEVICE_ID_KEY = 'mystique-device-id';
  var QUEUE_KEY = 'mystique-usage-queue';
  var statusEl = document.getElementById('optout-status');
  var button = document.getElementById('optout-toggle');

  function isOut() {
    try { return localStorage.getItem(OPT_OUT_KEY) === '1'; } catch (e) { return false; }
  }
  function render() {
    var out = isOut();
    statusEl.innerHTML = 'Usage counts are <strong>' + (out ? 'off' : 'on') + '</strong> for this browser.';
    button.textContent = out ? 'Turn usage counts back on' : 'Turn off usage counts';
  }
  button.addEventListener('click', function () {
    try {
      if (isOut()) {
        localStorage.removeItem(OPT_OUT_KEY);
      } else {
        localStorage.setItem(OPT_OUT_KEY, '1');
        localStorage.removeItem(DEVICE_ID_KEY);
        localStorage.removeItem(QUEUE_KEY);
      }
    } catch (e) {
      statusEl.textContent = 'Your browser blocked site storage, so the setting could not be saved.';
      return;
    }
    render();
  });
  render();
})();
