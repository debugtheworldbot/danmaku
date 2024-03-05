import configStorage from '@root/src/shared/storages/configStorage';
import danmakuStorage, { YT_Response } from '@root/src/shared/storages/danmakuStarage';
import { host } from '@root/src/utils/consts';

const getId = (id?: string) => {
  let finalId = id;
  if (!id) {
    const search = window.location.search;
    if (!search) throw new Error('No search');
    finalId = window.location.search.replace('?v=', '');
  }

  return finalId;
};

export const addComments = async (id: string, text: string, time: number) => {
  await fetch(`${host}/youtube/list/api`, {
    method: 'POST',
    body: JSON.stringify({
      text,
      videoId: id,
      time,
    }),
  });
  return getComments(id);
};

export const getComments = async (id?: string) => {
  const finalId = getId(id);
  configStorage.update({ loading: true });
  const res = await fetch(`${host}/youtube/api?id=${finalId}`, {
    method: 'GET',
  }).then(res => res.json());
  console.log('danmakus', res.data);
  configStorage.update({ loading: false });
  danmakuStorage.set(res.data);
  return res.data as YT_Response;
};

export const checkIsLive = async (id?: string) => {
  const finalId = getId(id);
  const res = await fetch(`${host}/youtube/checkLive?id=${finalId}`, {
    method: 'GET',
  }).then(res => res.json());
  const channelId = res.channelId;
  return channelId;
};

export const getLiveChats = async ({ channelId, pageToken }: { channelId: string; pageToken?: string }) => {
  const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : '';
  const res = await fetch(`${host}/youtube/live?channelId=${channelId}${pageTokenParam}`, {
    method: 'GET',
  }).then(res => res.json());
  if (pageToken) {
    danmakuStorage.push(res.data.items);
  } else {
    danmakuStorage.clear();
  }
  return res.data as YT_LIVE_RES;
};

interface YT_LIVE_RES {
  pollingIntervalMillis: number | null | undefined;
  nextPageToken: string | null | undefined;
  items: {
    text: string | null | undefined;
    author: {
      displayName: string;
    };
  }[];
  channelId: string;
}
