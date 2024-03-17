import { pickRandomColor } from '@root/src/utils/consts';
import Danmaku from 'danmaku';
import { useEffect, useRef, useCallback, useState } from 'react';
import { getComments, addComments } from './requests';
import configStorage from '@root/src/shared/storages/configStorage';
import useStorage from '@root/src/shared/hooks/useStorage';
import { SendDashboard } from './SendDashboard';
import { checkIsLive, createDanmakuStage, delay, getDanmakuStyle, isDev, queryLiveChats, renderHtml } from './utils';
import { DComment } from './types';
import { injectControl } from './injectControl';
import styleStorage from '@root/src/shared/storages/styleStorage';
import { OpenBtn } from './OpenBtn';

let livePollTimer: NodeJS.Timeout;
const liveDelayTimer: NodeJS.Timeout[] = [];

export default function App() {
  const d = useRef<Danmaku>(null);
  const videoSizeObserver = useRef<ResizeObserver>(null);
  const config = useStorage(configStorage);
  const { speed } = useStorage(styleStorage);
  const videoId = config.videoId;

  useEffect(() => {
    if (d.current) {
      d.current.speed = speed;
    }
  }, [speed]);

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
    if (!video) {
      await delay(1000);
      initComments(id);
    }

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
          ...getDanmakuStyle(),
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
      await initComments(id);
      const isLive = await checkIsLive();
      if (isLive) {
        initLiveChats();
      }
      injectControl(<OpenBtn onClick={() => setVisible(v => !v)} />);
    },
    [clearTimers, initComments, initLiveChats],
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
    if (isDev) {
      injectControl(<OpenBtn onClick={() => setVisible(v => !v)} />);
    }
    if (videoId && config.enabled) {
      init(videoId);
      return;
    }
    d.current?.destroy();
    clearTimers();
  }, [clearTimers, config.enabled, init, videoId]);

  const [visible, setVisible] = useState(false);
  return (
    <div>
      <SendDashboard visible={visible} setVisible={setVisible} onAdd={addDanmaku} />
    </div>
  );
}
