import configStorage from '@root/src/shared/storages/configStorage';
import danmakuStorage from '@root/src/shared/storages/danmakuStorage';
import { pickRandomColor } from '@root/src/utils/consts';
import Danmaku from 'danmaku';
import { DComment } from './types';
import { danmakuStyle } from '@root/src/shared/storages/styleStorage';

export const isDev = false;
export const createDanmakuStage = (comments: DComment[]) => {
  const video = document.getElementsByTagName('video')[0];
  const container = video.parentNode as HTMLElement;
  container.style.height = '100%';
  console.log('danmaku loaded', video);
  const danmaku = new Danmaku({
    // 必填。用于显示弹幕的「舞台」会被添加到该容器中。
    container,

    // 媒体可以是 <video> 或 <audio> 元素，如果未提供，会变成实时模式。
    media: video,

    // 预设的弹幕数据数组，在媒体模式中使用。在 emit API 中有说明格式。
    comments,

    // 支持 DOM 引擎和 canvas 引擎。canvas 引擎比 DOM 更高效，但相对更耗内存。
    // 完整版本中默认为 DOM 引擎。
    engine: 'dom',

    // 弹幕速度，也可以用 speed API 设置。
    speed: 144,
  });
  return { danmaku, video };
};
export const renderHtml = (text: string) => {
  const toNodes = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.firstChild as HTMLElement;
  return toNodes(`<div style='${styleString()};color:${pickRandomColor()}'>${text}</div>`);
};

const styleString = () =>
  Object.entries(danmakuStyle)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${v}`)
    .join(';');

export const checkIsLive = async () => {
  await delay(2000);
  const chatFrame = document.querySelector('iframe#chatframe') as HTMLIFrameElement;
  const isLive = !!chatFrame;
  configStorage.update({ isLive });
  return isLive;
};
const prevID: string[] = [];
export const queryLiveChats = () => {
  const chatFrame = document.querySelector('iframe#chatframe') as HTMLIFrameElement;
  if (!chatFrame) throw new Error('No chat frame');
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

export const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));
