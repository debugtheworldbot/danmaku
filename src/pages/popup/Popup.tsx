import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useState, useEffect, useCallback } from 'react';
import useStorage from '@root/src/shared/hooks/useStorage';
import danmakuStorage, { YT_Response } from '@root/src/shared/storages/danmakuStarage';
import configStorage from '@root/src/shared/storages/configStorage';
import { getComments } from '../content/ui/requests';

const Popup = () => {
  const danmakus = useStorage(danmakuStorage);
  const config = useStorage(configStorage);
  const [id, setId] = useState('');
  const [list, setList] = useState<YT_Response>([]);
  const [loading, setLoading] = useState(false);
  const [turnOn, setTurnOn] = useState(false);

  const getCurrentTab = useCallback(async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    const isYoutube = tab.url.includes('https://www.youtube.com/watch?');
    if (!isYoutube) return '';
    const id = tab.url.replace('https://www.youtube.com/watch?v=', '');
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
    <div className="text-center">
      <button
        onClick={() => {
          const res = !config.enabled;
          setTurnOn(res);

          configStorage.toggle(res);
        }}
        className="text-2xl font-medium">
        Danmaku: {config.enabled ? 'on' : 'off'}
      </button>
      <div>{turnOn && 'refresh the page to take effect'}</div>
      {id ? (
        <main className="pl-4 pb-4 pr-1">
          <button onClick={updateList} className="text-lg font-medium text-left">
            total count: {list?.length}
            <span className="text-sm text-gray-500 ml-4">{id}</span>
          </button>
          <ol className="list-disc text-base">
            {list?.map((comment, index) => (
              <li className="text-left" key={index}>
                <span className="text-blue-600 mr-2">{comment?.time}</span>
                {comment.text}
              </li>
            ))}
          </ol>
        </main>
      ) : (
        <main className="text-2xl font-medium">not a youtube video</main>
      )}
    </div>
  );
};

export const Add = (props: { onAdd: (text: string) => void }) => {
  const { onAdd } = props;
  const [text, setText] = useState('');

  return (
    <div>
      <div>
        text:
        <input value={text} onChange={e => setText(e.target.value)} />
      </div>
      <button
        onClick={() => {
          onAdd(text);
        }}>
        Add
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
