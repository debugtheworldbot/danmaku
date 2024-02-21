import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useState, useEffect, useCallback } from 'react';
import { host } from '../content/ui/app';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [id, setId] = useState('');
  const [list, setList] = useState([]);

  async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    const isYoutube = tab.url.includes('https://www.youtube.com/watch?');
    if (!isYoutube) return '';
    const id = tab.url.replace('https://www.youtube.com/watch?v=', '');
    setId(id);
    return id;
  }

  const getList = useCallback(async () => {
    const id = await getCurrentTab();
    if (!id) return;
    const res = await fetch(`${host}/youtube/api?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    console.log('rrrrr', res);
    setList(res.data);
  }, []);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      {id ? (
        <main>
          <p>video id: {id}</p>
          <button className="border rounded px-2 cursor-pointer text-lg" onClick={getList}>
            update
          </button>
          <div>total count: {list?.length}</div>
          <ul>
            {list?.map((comment, index) => (
              <li key={index}>
                <div>time:{comment.time}s</div>
                <div>{comment.text}</div>
                ----
              </li>
            ))}
          </ul>
        </main>
      ) : (
        <main className="text-2xl font-medium">not a youtube video</main>
      )}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
