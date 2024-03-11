import configStorage from '@root/src/shared/storages/configStorage';
import danmakuStorage from '@root/src/shared/storages/danmakuStarage';
import { pickRandomColor } from '@root/src/utils/consts';

export const renderHtml = (text: string) => {
  const toNodes = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.firstChild as HTMLElement;
  return toNodes(`<div style='${styleString};color:${pickRandomColor()}'>${text}</div>`);
};

export const danmakuStyle = {
  fontSize: '25px',
  textShadow: '1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000',
  opacity: '0.8',
};
const styleString = Object.entries(danmakuStyle)
  .map(([k, v]) => `${k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${v}`)
  .join(';');

const prevID: string[] = [];
export const queryLiveChats = () => {
  const chatFrame = document.querySelector('iframe#chatframe') as HTMLIFrameElement;
  const liveStatusChanged = configStorage.getSnapshot().isLive !== !!chatFrame;
  if (liveStatusChanged) {
    configStorage.update({ isLive: !!chatFrame });
  }
  if (!chatFrame) return [];
  return Array.from(
    chatFrame.contentDocument.querySelectorAll('yt-live-chat-paid-message-renderer,yt-live-chat-text-message-renderer'),
  )
    .slice(-10)
    .map(node => {
      const nextID = node.id;

      if (prevID.includes(nextID)) return;
      prevID.push(nextID);
      prevID.slice(-20);
      const text = (node.querySelector('#message') as HTMLElement).innerText;
      danmakuStorage.push([{ text }]);
      return {
        text,
        style: {
          ...danmakuStyle,
          color: pickRandomColor(),
        },
      };
    })
    .filter(Boolean);
};
