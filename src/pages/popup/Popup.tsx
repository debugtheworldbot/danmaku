import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useEffect, useCallback } from 'react';
import useStorage from '@root/src/shared/hooks/useStorage';
import danmakuStorage from '@root/src/shared/storages/danmakuStarage';
import configStorage from '@root/src/shared/storages/configStorage';
import { getComments } from '../content/ui/requests';
import { formatTime } from '@root/src/utils/helpers';
import { Switch } from './components/Switch';
import LoadingAnim from './components/LoadingAnim';
import IdleAnim from './components/IdleAnim';

const Popup = () => {
  const danmakus = useStorage(danmakuStorage);
  const config = useStorage(configStorage);
  const loading = config.loading;

  const getCurrentTab = useCallback(async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    const isYoutube = tab.url.includes('https://www.youtube.com/watch?');
    if (!isYoutube) return '';
    const id = new URL(tab.url).searchParams.get('v');
    configStorage.update({ videoId: id });
    return id;
  }, []);

  const updateList = useCallback(async () => {
    const id = await getCurrentTab();
    if (id === config.videoId) return;
    configStorage.update({ videoId: id });
    if (!id) return;
    const res = await getComments(id);
    console.log('rrrrr', res);
    danmakuStorage.set(res);
  }, [config.videoId, getCurrentTab]);

  useEffect(() => {
    getCurrentTab().then(updateList);
  }, [getCurrentTab, updateList]);

  if (loading)
    return (
      <div className="flex justify-center items-center text-2xl font-medium p-10">
        <LoadingAnim />
      </div>
    );
  return (
    <div className="text-center relative pb-2 px-4">
      <Switch
        isLive={config.isLive}
        checked={config.enabled}
        onChange={value => configStorage.update({ enabled: value })}
      />
      {config.videoId ? (
        <main className="mt-2 relative">
          <button className="absolute right-2 mt-2 text-gray-500" onClick={updateList}>
            {config.videoId}
          </button>
          <table className="table-auto text-left border-separate border-spacing-x-1">
            <thead className="text-lg">
              <tr>
                <th>Time</th>
                <th>Danmaku</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {danmakus.map((comment, index) => (
                <tr key={index}>
                  <td className="align-top text-center">
                    <span className="text-blue-600 mr-2">{formatTime(comment?.time)}</span>
                  </td>
                  <td className="min-w-[300px]">{comment.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {danmakus.length === 0 && <div className="text-base">No danmakus </div>}
        </main>
      ) : (
        <main className="text-lg mb-6 px-8 pt-2 leading-5">
          <IdleAnim />
          Visit a youtube video page to see danmakus!
        </main>
      )}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
