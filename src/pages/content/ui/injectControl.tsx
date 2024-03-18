import { createRoot } from 'react-dom/client';
import { attachTwindStyle } from '@src/shared/style/twind';
import { ReactNode } from 'react';
import { isDev } from './utils';

const ytControlClass = 'ytd-watch-flexy .ytp-left-controls';
const testClass = '.player';
const injectDom = () => {
  return isDev ? document.querySelector(testClass) : document.querySelector(ytControlClass);
};
function injectControl(el: ReactNode) {
  try {
    if (!injectDom()) throw new Error('no class');
    injectDom()?.setAttribute('style', 'overflow: unset;');
    if (document.getElementById('ytb-danmaku-config')) return console.log('already injected');
    const root = document.createElement('div');
    root.id = 'ytb-danmaku-config';

    injectDom().append(root);

    console.log('inject control', root);
    const rootIntoShadow = document.createElement('div');
    rootIntoShadow.id = 'shadow-root';
    rootIntoShadow.style.width = 'auto';
    rootIntoShadow.style.height = '100%';

    const shadowRoot = root.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(rootIntoShadow);
    // /** Inject styles into shadow dom */
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        :host { all: initial ;font-size: 16px; }
      `;
    shadowRoot.appendChild(styleElement);

    attachTwindStyle(rootIntoShadow, shadowRoot);
    createRoot(rootIntoShadow).render(el);
  } catch (e) {
    setTimeout(() => {
      injectControl(el);
    }, 1000);
  }
}

export { injectControl };
