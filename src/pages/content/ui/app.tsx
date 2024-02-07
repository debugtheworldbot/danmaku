import Danmaku from 'danmaku';
import { useRef } from 'react';

export default function App() {
  const d = useRef(null);
  const init = () => {
    const video = document.getElementsByTagName('video')[0];
    console.log('content view loaded', video);
    const danmaku = new Danmaku({
      // 必填。用于显示弹幕的「舞台」会被添加到该容器中。
      container: video.parentNode as HTMLElement,

      // 媒体可以是 <video> 或 <audio> 元素，如果未提供，会变成实时模式。
      media: video,

      // 预设的弹幕数据数组，在媒体模式中使用。在 emit API 中有说明格式。
      comments: [
        {
          text: 'hello',
          time: 2,
        },
      ],

      // 支持 DOM 引擎和 canvas 引擎。canvas 引擎比 DOM 更高效，但相对更耗内存。
      // 完整版本中默认为 DOM 引擎。
      engine: 'dom',

      // 弹幕速度，也可以用 speed API 设置。
      speed: 144,
    });
    d.current = danmaku;
  };
  const emit = () => {
    const comment = {
      text: 'bla blaaaaaaa',
    };
    d.current.emit(comment);
  };
  return (
    <div className="fixed top-0 left-0 right-0 w-screen h-20 z-[9999]">
      <button onClick={init}>init</button>
      <button onClick={emit}>emit</button>
    </div>
  );
}
