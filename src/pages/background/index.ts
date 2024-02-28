import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isYoutubeVid = tab.url.includes('https://www.youtube.com/watch?');
  console.log('tab updated!!', isYoutubeVid, tab.url);

  if (isYoutubeVid) {
    const id = new URL(tab.url).searchParams.get('v');
    chrome.tabs.sendMessage(tabId, { id });
  }
});
