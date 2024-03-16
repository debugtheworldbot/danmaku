import { createRoot } from 'react-dom/client';
import { attachTwindStyle } from '@src/shared/style/twind';
import ControlPannel from './ControlPannel';

const ytControlClass = 'ytd-watch-flexy .ytp-left-controls';
const testClass = '.player';
const injectDom = () => {
  const isDev = false;
  return isDev ? document.querySelector(testClass) : document.querySelector(ytControlClass);
};
function injectControl() {
  try {
    injectDom()?.setAttribute('style', 'overflow: unset;');

    buildControls();
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      injectControl();
    }, 3000);
  }
}

function buildControls() {
  if (!injectDom()) throw new Error('no class');
  if (document.getElementById('ytb-danmaku-config')) return console.log('already injected');
  const root = document.createElement('div');
  root.id = 'ytb-danmaku-config';

  injectDom().append(root);

  console.log('inject control', root);
  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';
  rootIntoShadow.style.width = 'auto';
  rootIntoShadow.style.height = '100%';

  // createRoot(document.querySelector('ytb-danmaku-configin')).render(<ControlPannel />);
  const shadowRoot = root.attachShadow({ mode: 'closed' });
  shadowRoot.appendChild(rootIntoShadow);
  // /** Inject styles into shadow dom */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
        :host { all: initial ;font-size: 16px; }
      `;
  shadowRoot.appendChild(styleElement);

  attachTwindStyle(rootIntoShadow, shadowRoot);
  createRoot(rootIntoShadow).render(<ControlPannel />);

  // document.querySelector('ytd-watch-flexy .ytp-left-controls').append(root);
}

export { injectControl };
