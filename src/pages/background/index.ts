import configStorage from '@root/src/shared/storages/configStorage';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const isYoutubeVid = tab.url.includes('https://www.youtube.com/watch?');
  console.log('tab updated!!', isYoutubeVid, tab.url);

  if (isYoutubeVid) {
    console.log('is a yt video');
    const id = new URL(tab.url).searchParams.get('v');
    if (id === configStorage.getSnapshot().videoId) return console.log('same video id');
    configStorage.update({ videoId: id });
  } else {
    console.log('not a yt video');
    configStorage.reset();
  }
});

chrome.runtime.onInstalled.addListener(object => {
  const externalUrl = 'https://danmucat.com';

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl }, () => {
      console.log('New tab launched with ', externalUrl);
    });
  }
});
