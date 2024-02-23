import { pickRandomColor } from '@root/src/utils/consts';
import Danmaku from 'danmaku';
import { useEffect, useRef, useCallback } from 'react';
import { checkIsLive, getLiveChats, getComments } from './requests';

interface Comment {
  text?: string;
  /**
   * @default rtl
   */
  mode?: 'ltr' | 'rtl' | 'top' | 'bottom';
  /**
   * Specified in seconds. Not required in live mode.
   * @default media?.currentTime
   */
  time?: number;
  style?: Partial<CSSStyleDeclaration> | CanvasRenderingContext2D;
  /**
   * A custom render to draw comment.
   * When it exist, `text` and `style` will be ignored.
   */
  render?(): HTMLElement | HTMLCanvasElement;
}

const isDev = true;
export const host = isDev ? 'http://localhost:3000' : 'https://danmaku-backend.vercel.app';
let timer: NodeJS.Timeout;
export default function App() {
  const d = useRef(null);
  const currentId = useRef(null);

  const emitLiveComments = useCallback(async (channelId: string, pageToken?: string) => {
    const { pollingIntervalMillis, items, nextPageToken } = await getLiveChats({ channelId, pageToken });
    const comments = items.map(l => ({
      text: l.text,
      style: {
        ...style,
        color: pickRandomColor(),
      },
    }));
    return { pollingIntervalMillis, nextPageToken, comments };
  }, []);

  const initLiveChats = useCallback(
    async (channelId: string, pageToken?: string) => {
      console.log('initLiveChats', channelId, pageToken);
      const { pollingIntervalMillis, nextPageToken, comments } = await emitLiveComments(channelId, pageToken);
      if (d.current) {
        comments.forEach(comment => d.current.emit(comment));
      } else {
        initDanmaku([]);
      }
      timer = setTimeout(() => {
        initLiveChats(channelId, nextPageToken);
      }, pollingIntervalMillis);
    },
    [emitLiveComments],
  );

  const initComments = useCallback(async (id?: string) => {
    console.log('initComments', id);
    const list = await getComments(id);
    const comments = list.map(l => ({
      ...l,
      style: {
        ...style,
        color: pickRandomColor(),
      },
    }));
    const video = document.getElementsByTagName('video')[0];
    console.log('init video', video);
    if (!video)
      return setTimeout(() => {
        initComments(id);
      }, 1000);

    initDanmaku(comments);
  }, []);

  const initDanmaku = (comments: Comment[]) => {
    d.current && d.current.destroy();
    const video = document.getElementsByTagName('video')[0];
    const container = video.parentNode as HTMLElement;
    container.style.height = '100%';
    console.log('damnaku loaded', video);
    const danmaku = new Danmaku({
      // 必填。用于显示弹幕的「舞台」会被添加到该容器中。
      container,

      // 媒体可以是 <video> 或 <audio> 元素，如果未提供，会变成实时模式。
      media: video,

      // 预设的弹幕数据数组，在媒体模式中使用。在 emit API 中有说明格式。
      comments: comments,

      // 支持 DOM 引擎和 canvas 引擎。canvas 引擎比 DOM 更高效，但相对更耗内存。
      // 完整版本中默认为 DOM 引擎。
      engine: 'dom',

      // 弹幕速度，也可以用 speed API 设置。
      speed: 144,
    });
    d.current = danmaku;
  };
  const emit = async () => {
    if (!d.current) {
      await initComments();
    }
    const comment = {
      text: 'bla blaaaaaaa',
      style,
    };
    d.current.emit(comment);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async function (message) {
      const id = message.id;
      if (!id) return;
      if (currentId.current === id) return;
      currentId.current = id;

      console.log('new video id:', id);
      timer && clearTimeout(timer);
      const liveChannelId = await checkIsLive(id);
      console.log('liveChannelId', liveChannelId);
      if (liveChannelId) return initLiveChats(liveChannelId);
      initComments(id);
    });
  }, [initComments, initLiveChats]);

  // return null;
  return (
    <div className="fixed top-0 right-0 h-20 z-[9999] bg-gray-200/20 flex text-xl gap-4">
      <button className="px-4 py-2 rounded-full" onClick={emit}>
        emit
      </button>
    </div>
  );
}
const style = {
  fontWeight: 'bold',
  fontSize: '25px',
  textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
};
