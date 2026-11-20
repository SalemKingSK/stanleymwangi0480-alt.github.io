
  var WORKER_URL = 'https://mystique-analytics.sksalemking.workers.dev';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderBars(containerId, dataObj, sortByKey) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';
    var entries = Object.entries(dataObj || {});
    if (entries.length === 0) {
      container.innerHTML = '<div style="color:var(--text-dim);font-size:0.8rem;">No data yet.</div>';
      return;
    }
    entries.sort(function(a, b) { return sortByKey ? a[0].localeCompare(b[0]) : b[1] - a[1]; });
    var max = Math.max.apply(null, entries.map(function(e) { return e[1]; }).concat([1]));
    for (var i = 0; i < entries.length; i++) {
      var label = entries[i][0], count = entries[i][1];
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML =
        '<div class="bar-label">' + escapeHtml(label) + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + ((count / max) * 100) + '%"></div></div>' +
        '<div class="bar-count">' + count + '</div>';
      container.appendChild(row);
    }
  }

  function refresh() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('stats-content').style.display = 'none';

    fetch(WORKER_URL + '/stats')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(stats) {
        document.getElementById('s-installs').textContent = stats.totalInstalls || 0;
        document.getElementById('s-sessions').textContent = stats.totalSessions || 0;
        document.getElementById('s-shares').textContent = stats.totalShares || 0;
        document.getElementById('s-devices').textContent = stats.uniqueDevices || 0;

        renderBars('country-bars', stats.byCountry, false);
        renderBars('day-bars', stats.byDay, true);
        renderBars('share-bars', stats.shareMethodCounts, false);

        document.getElementById('meta-note').textContent =
          'Scanned ' + stats.recordsScanned + ' of ' + stats.totalRawKeysStored +
          ' stored batches \u00B7 generated ' + new Date(stats.generatedAt).toLocaleString();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('stats-content').style.display = 'block';
      })
      .catch(function(err) {
        document.getElementById('loading').style.display = 'none';
        var el = document.getElementById('error');
        el.textContent = 'Could not load stats: ' + err.message;
        el.style.display = 'block';
      });
  }

  document.getElementById('refresh-btn').addEventListener('click', refresh);
  // Auto-load on page open — zero clicks needed
  refresh();
