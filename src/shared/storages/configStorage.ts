import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type Config = {
  enabled: boolean;
  isLive: boolean;
};

type ConfigStorage = BaseStorage<Config> & {
  update: (parload: Partial<Config>) => Promise<void>;
};

const fallbackConfig: Config = {
  enabled: true,
  isLive: false,
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
};

export default configStorage;
