import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type Config = {
  enabled: boolean;
};

type ConfigStorage = BaseStorage<Config> & {
  toggle: (enabled: boolean) => Promise<void>;
};

const fallbackConfig: Config = {
  enabled: true,
};

const storage = createStorage<Config>('theme-storage-key', fallbackConfig, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const configStorage: ConfigStorage = {
  ...storage,
  toggle: async (enabled: boolean) => {
    await storage.set({ enabled });
  },
};

export default configStorage;
