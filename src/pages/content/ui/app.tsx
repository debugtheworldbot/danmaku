import { pickRandomColor } from '@root/src/utils/consts';
import Danmaku from 'danmaku';
import { useEffect, useRef, useCallback } from 'react';
import { getComments, addComments } from './requests';
import configStorage from '@root/src/shared/storages/configStorage';
import useStorage from '@root/src/shared/hooks/useStorage';
import { SendDashboard } from './SendDashboard';
import { danmakuStyle, queryLiveChats, renderHtml } from './utils';

let livePollTimer: NodeJS.Timeout;
const liveDelayTimer: NodeJS.Timeout[] = [];

export default function App() {
  const d = useRef<Danmaku>(null);
  const videoSizeObserver = useRef(null);
  const config = useStorage(configStorage);
  const videoId = config.videoId;

  const initLiveChats = useCallback(async () => {
    const pollingIntervalMillis = 2000;
    const comments = queryLiveChats();
    if (d.current) {
      comments.forEach(comment => {
        liveDelayTimer.push(
          setTimeout(() => {
            d.current?.emit(comment);
          }, Math.random() * pollingIntervalMillis),
        );
      });
    } else {
      initDanmaku([]);
    }
    livePollTimer = setTimeout(() => {
      initLiveChats();
    }, pollingIntervalMillis);
  }, []);

  const initComments = useCallback(async (id?: string) => {
    console.log('initComments', id);
    const list = await getComments(id);
    const comments = list.map(l => ({
      ...l,
      render: () => renderHtml(l.text),
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
      comments,

      // 支持 DOM 引擎和 canvas 引擎。canvas 引擎比 DOM 更高效，但相对更耗内存。
      // 完整版本中默认为 DOM 引擎。
      engine: 'dom',

      // 弹幕速度，也可以用 speed API 设置。
      speed: 144,
    });
    d.current = danmaku;
    videoSizeObserver.current?.disconnect();
    videoSizeObserver.current = new ResizeObserver(() => {
      d.current?.resize();
    }).observe(video);
  };
  const emit = useCallback(async (text: string, type: 'html' | 'text' = 'html') => {
    if (type === 'text') {
      const comment = {
        text,
        style: {
          ...danmakuStyle,
          color: pickRandomColor(),
        },
      };

      d.current.emit(comment);
      return;
    }
    d.current.emit({
      render: () => renderHtml(text),
    });
  }, []);

  const clearTimers = useCallback(() => {
    livePollTimer && clearTimeout(livePollTimer);
    liveDelayTimer.forEach(clearTimeout);
  }, []);

  const init = useCallback(
    async (id?: string) => {
      clearTimers();
      initLiveChats();
      initComments(id);
    },
    [clearTimers, initComments, initLiveChats],
  );

  useEffect(() => {
    window.onresize = () => {
      d.current && d.current.resize();
    };
    if (videoId) {
      init(videoId);
    } else {
      clearTimers();
    }
  }, [clearTimers, init, videoId]);

  useEffect(() => {
    console.log('config update');
    if (!config.enabled) {
      console.log('destroy danmaku');
      d.current?.destroy();
      clearTimers();
    }
  }, [clearTimers, config.enabled, init]);

  const addDanmaku = useCallback(
    async (text: string) => {
      emit(text);
      const video = document.getElementsByTagName('video')[0];
      const time = Math.floor(video.currentTime);
      await addComments(videoId, text, time);
    },
    [emit, videoId],
  );

  return (
    <div>
      <SendDashboard onAdd={addDanmaku} />;
    </div>
  );
}
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
