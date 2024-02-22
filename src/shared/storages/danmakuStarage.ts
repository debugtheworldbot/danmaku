import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type YT_Response = {
  time: number;
  text: string;
}[];

type DanmakuStorage = BaseStorage<YT_Response> & {
  set: (data: YT_Response) => Promise<void>;
};

const storage = createStorage<YT_Response>('danmaku-storage-key', [], {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const danmakuStorage: DanmakuStorage = {
  ...storage,
  set: async (data: YT_Response) => {
    await storage.set(data);
  },
};

export default danmakuStorage;
