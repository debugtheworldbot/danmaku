import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type YT_Response = {
  time?: number;
  text: string;
  displayText?: string;
}[];

type DanmakuStorage = BaseStorage<YT_Response> & {
  set: (data: YT_Response) => Promise<void>;
  push: (data: YT_Response) => Promise<void>;
  clear: () => Promise<void>;
};

const storage = createStorage<YT_Response>('danmaku-storage-key', [], {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const danmakuStorage: DanmakuStorage = {
  ...storage,
  clear: async () => {
    await storage.set([]);
  },
  set: async (data: YT_Response) => {
    await storage.set(data);
  },
  push: async (data: YT_Response) => {
    await storage.set([...storage.getSnapshot(), ...data]);
  },
};

export default danmakuStorage;
