import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type Config = {
  enabled: boolean;
  isLive: boolean;
  videoId: string;
  loading: boolean;
};

type ConfigStorage = BaseStorage<Config> & {
  update: (payload: Partial<Config>) => Promise<void>;
  reset: () => Promise<void>;
};

const fallbackConfig: Config = {
  enabled: true,
  isLive: false,
  videoId: '',
  loading: false,
};

const storage = createStorage<Config>('theme-storage-key', fallbackConfig, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const configStorage: ConfigStorage = {
  ...storage,
  update: async state => {
    await storage.set({
      ...storage.getSnapshot(),
      ...state,
    });
  },
  reset: async () => {
    await storage.set(fallbackConfig);
  },
};

export default configStorage;
