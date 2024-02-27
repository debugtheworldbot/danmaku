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

export const getDBList = async (id: string) => {
  return await fetch(`${host}/youtube/list/api?id=${id}`, {
    method: 'GET',
  }).then(res => res.json());
};

export const getComments = async (id?: string) => {
  const finalId = getId(id);
  const res = await fetch(`${host}/youtube/api?id=${finalId}`, {
    method: 'GET',
  }).then(res => res.json());
  console.log('rrrrr', res);
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
