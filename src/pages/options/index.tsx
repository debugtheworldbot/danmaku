import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from '@pages/options/Options';
import '@pages/options/index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { attachTwindStyle } from '@root/src/shared/style/twind';

refreshOnUpdate('pages/options');

function init() {
  const appContainer = document.querySelector('#app-container');
  attachTwindStyle(appContainer, document);
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<Options />);
}

init();
