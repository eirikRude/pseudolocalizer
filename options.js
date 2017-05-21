// Saves options to localStorage.
function save_options() {
  var accent = isChecked('accent');
  var pad = isChecked('pad');
  var bidi = isChecked('bidi');
  var dir = isChecked('dir');

  chrome.storage.sync.set({
      accent: accent,
      pad: pad,
      bidi: bidi,
      dir: dir
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function isChecked(name) {
	return document.getElementById(name).checked;
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  chrome.storage.sync.get({
    accent: true,
    pad: false,
    bidi: false,
    dir: false
  }, function(items) {
    setOption('accent', items.accent);
    setOption('pad', items.pad);
    setOption('bidi', items.bidi);
    setOption('dir', items.dir);

  });
  
}

function setOption(name, val) {
	document.getElementById(name).checked = val;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);