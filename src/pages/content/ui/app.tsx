import { pickRandomColor } from '@root/src/utils/consts';
import Danmaku from 'danmaku';
import { useEffect, useRef, useCallback } from 'react';

export type YT_Response = {
  time: number;
  text: string;
}[];

export const host = 'https://danmaku-backend.vercel.app';
export default function App() {
  const d = useRef(null);
  const currentId = useRef(null);

  const loadRemote = async (id?: string) => {
    let finalId = id;
    if (!id) {
      const search = window.location.search;
      if (!search) throw new Error('No search');
      finalId = window.location.search.replace('?v=', '');
    }
    const res = await fetch(`${host}/youtube/api?id=${finalId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    console.log('rrrrr', res);
    return res.data as YT_Response;
  };
  const init = useCallback(async (id?: string) => {
    d.current && d.current.destroy();
    const list = await loadRemote(id);
    const video = document.getElementsByTagName('video')[0];
    console.log('init video', video);
    if (!video)
      return setTimeout(() => {
        init(id);
      }, 1000);

    const container = video.parentNode as HTMLElement;
    container.style.height = '100%';
    console.log('damnaku loaded', video);
    const comments = list.map(l => ({
      ...l,
      style: {
        ...style,
        color: pickRandomColor(),
      },
    }));
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
  }, []);
  const emit = async () => {
    if (!d.current) {
      await init();
    }
    const comment = {
      text: 'bla blaaaaaaa',
      style,
    };
    d.current.emit(comment);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message) {
      const id = message.id;
      if (!id) return;
      if (currentId.current === id) return;
      currentId.current = id;

      console.log('new video id:', id);
      init(id);
    });
  }, [init]);

  return null;
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
