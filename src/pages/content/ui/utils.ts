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
