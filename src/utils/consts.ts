const isDev = false;
export const host = isDev ? 'http://localhost:3000' : 'https://danmaku-backend.vercel.app';
export const COLOR_LIST = ['#FFFF00', '#FFAA02', '#FE0302', '#FFFFFF', '#89D5FF', '#00CD00', '#9D7CD8'];
export const pickRandomColor = () => COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
