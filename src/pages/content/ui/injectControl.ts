function injectControl(cb: () => void) {
  try {
    console.trace('ytb-danmaku-inited');

    document.querySelector('ytd-watch-flexy .ytp-left-controls').setAttribute('style', 'overflow: unset;');

    buildControls();
    cb && cb();
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      injectControl(cb);
    }, 3000);
  }
}

function buildControls() {
  if (document.getElementById('ytb-danmaku-config')) return;
  const div = document.createElement('div');
  div.style.width = 'auto';
  div.id = 'ytb-danmaku-config';
  document.querySelector('ytd-watch-flexy .ytp-left-controls').append(div);
}

export { injectControl };
