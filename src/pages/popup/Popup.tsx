import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useState, useEffect, useCallback } from 'react';
import useStorage from '@root/src/shared/hooks/useStorage';
import danmakuStorage, { YT_Response } from '@root/src/shared/storages/danmakuStarage';
import configStorage from '@root/src/shared/storages/configStorage';
import { getComments } from '../content/ui/requests';
import { formatTime } from '@root/src/utils/helpers';

const Popup = () => {
  const danmakus = useStorage(danmakuStorage);
  const config = useStorage(configStorage);
  const [id, setId] = useState('');
  const [list, setList] = useState<YT_Response>([]);
  const [loading, setLoading] = useState(false);

  const getCurrentTab = useCallback(async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    const isYoutube = tab.url.includes('https://www.youtube.com/watch?');
    if (!isYoutube) return '';
    const id = new URL(tab.url).searchParams.get('v');
    setId(id);
    return id;
  }, []);

  const updateList = useCallback(async () => {
    const id = await getCurrentTab();
    if (!id) return;
    setLoading(true);
    const res = await getComments(id);
    setLoading(false);
    console.log('rrrrr', res);
    setList(res);
  }, [getCurrentTab]);

  useEffect(() => {
    console.log('popup useEffect');
    setList(danmakus);
  }, [danmakus]);

  useEffect(() => {
    getCurrentTab();
  }, [getCurrentTab]);

  if (loading) return <div className="h-screen flex justify-center items-center text-2xl font-medium">Loading...</div>;
  return (
    <div className="text-center relative">
      <Switch checked={config.enabled} onChange={value => configStorage.update({ enabled: value })} />
      {config.isLive && (
        <div className="absolute left-2 top-2 text-red-500 font-medium text-base animate-pulse"> live </div>
      )}
      {id ? (
        <main className="pl-4 pb-4 pr-1">
          <button onClick={updateList} className="text-lg font-medium text-left">
            total count: {list?.length}
            <span className="text-sm text-gray-500 ml-4">{id}</span>
          </button>
          <ol className="list-disc text-base">
            {list?.map((comment, index) => (
              <li className="text-left" key={index}>
                <span className="text-blue-600 mr-2">{formatTime(comment?.time)}</span>
                {comment.text}
              </li>
            ))}
          </ol>
        </main>
      ) : (
        <main className="mt-8 text-2xl font-medium">Visit youtube video to see danmakus!</main>
      )}
    </div>
  );
};

const Switch = (props: { checked: boolean; onChange: (value: boolean) => void }) => {
  const [turnOn, setTurnOn] = useState(false);
  return (
    <div>
      <label
        onChange={() => {
          const res = !props.checked;
          props.onChange(res);
          setTurnOn(res);
        }}
        className="inline-flex cursor-pointer items-center text-2xl font-medium">
        <span className="mr-3">Danmaku</span>
        <input type="checkbox" checked={props.checked} className="peer sr-only" />
        <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
      </label>

      <div>{turnOn && 'refresh the page to take effect'}</div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
