import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export const danmakuStyle = {
  fontSize: '25px',
  textShadow: '1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000',
  opacity: '0.8',
};
export const defaultSpeed = 144;

type Config = {
  style: {
    fontSize: string;
    opacity: string;
  };
  speed: number;
};

type StyleStorage = BaseStorage<Config> & {
  updateSpeed: (speed: number) => Promise<void>;
  updateStyle: (style: Partial<Config['style']>) => Promise<void>;
};

const fallbackConfig: Config = {
  style: danmakuStyle,
  speed: defaultSpeed,
};

const storage = createStorage<Config>('style-storage-key', fallbackConfig, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const styleStorage: StyleStorage = {
  ...storage,
  updateSpeed: async speed => {
    await storage.set({
      ...storage.getSnapshot(),
      speed,
    });
  },
  updateStyle: async style => {
    danmakuStyle.opacity = style.opacity || danmakuStyle.opacity;
    danmakuStyle.fontSize = style.fontSize || danmakuStyle.fontSize;
    await storage.set({
      speed: storage.getSnapshot().speed,
      style: {
        ...storage.getSnapshot().style,
        ...style,
      },
    });
  },
};

styleStorage.get().then(res => {
  const style = res.style;
  danmakuStyle.opacity = style.opacity || danmakuStyle.opacity;
  danmakuStyle.fontSize = style.fontSize || danmakuStyle.fontSize;
});

export default styleStorage;
