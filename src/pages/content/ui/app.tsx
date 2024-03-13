import { pickRandomColor } from '@root/src/utils/consts';
import Danmaku from 'danmaku';
import { useEffect, useRef, useCallback } from 'react';
import { getComments, addComments } from './requests';
import configStorage from '@root/src/shared/storages/configStorage';
import useStorage from '@root/src/shared/hooks/useStorage';
import { SendDashboard } from './SendDashboard';
import { checkIsLive, createDanmakuStage, danmakuStyle, queryLiveChats, renderHtml } from './utils';
import { DComment } from './types';

let livePollTimer: NodeJS.Timeout;
const liveDelayTimer: NodeJS.Timeout[] = [];

export default function App() {
  const d = useRef<Danmaku>(null);
  const videoSizeObserver = useRef<ResizeObserver>(null);
  const config = useStorage(configStorage);
  const videoId = config.videoId;

  const initLiveChats = useCallback(() => {
    try {
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
    } catch (e) {
      console.log(e);
    }
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

  const initDanmaku = (comments: DComment[]) => {
    d.current && d.current.destroy();
    const { danmaku, video } = createDanmakuStage(comments);
    d.current = danmaku;
    videoSizeObserver.current?.disconnect();
    videoSizeObserver.current = new ResizeObserver(() => {
      d.current?.resize();
    });
    videoSizeObserver.current.observe(video);
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
      initComments(id);
      checkIsLive();
    },
    [clearTimers, initComments],
  );

  const addDanmaku = useCallback(
    async (text: string) => {
      emit(text);
      const video = document.getElementsByTagName('video')[0];
      const time = Math.floor(video.currentTime);
      await addComments(videoId, text, time);
    },
    [emit, videoId],
  );

  useEffect(() => {
    if (config.isLive) {
      initLiveChats();
    }
  }, [config.isLive, initLiveChats]);

  useEffect(() => {
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

  return (
    <div>
      <SendDashboard onAdd={addDanmaku} />;
    </div>
  );
}
