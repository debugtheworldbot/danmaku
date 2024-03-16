import { useState } from 'react';
import clsx from 'clsx';
import styleStorage, { defaultSpeed } from '@root/src/shared/storages/styleStorage';
import useStorage from '@root/src/shared/hooks/useStorage';
import configStorage from '@root/src/shared/storages/configStorage';

export default function ControlPannel() {
  const [showPanel, setShowPanel] = useState(false);
  const style = useStorage(styleStorage);
  const config = useStorage(configStorage);
  return (
    <div className="relative h-full">
      <button
        onClick={() => setShowPanel(false)}
        className={clsx(showPanel ? 'fixed absolute inset-0 cursor-auto' : 'hidden pointer-events-none')}
      />
      <div
        style={{
          background: 'rgba(28,28,28,.9)',
        }}
        className={clsx(
          'absolute bottom-full z-10 rounded block transition-all p-4 text-white',
          showPanel ? 'opacity-100' : 'opacity-0 hidden pointer-events-none',
        )}>
        <ul className="py-2 text-2xl flex flex-col gap-4">
          <li className="flex gap-12">
            <span>size</span>
            <div className="flex gap-4 font-mono">
              <button
                onClick={() => {
                  styleStorage.updateStyle({ fontSize: '20px' });
                }}
                className={clsx(
                  'border border-gray-300 rounded-xl px-2',
                  style.style.fontSize === '20px' && 'bg-red-500',
                )}>
                sm
              </button>
              <button
                onClick={() => {
                  styleStorage.updateStyle({ fontSize: '25px' });
                }}
                className={clsx(
                  'border border-gray-300 rounded-xl px-2',
                  style.style.fontSize === '25px' && 'bg-red-500',
                )}>
                md
              </button>
              <button
                onClick={() => {
                  styleStorage.updateStyle({ fontSize: '30px' });
                }}
                className={clsx(
                  'border border-gray-300 rounded-xl px-2',
                  style.style.fontSize === '30px' && 'bg-red-500',
                )}>
                lg
              </button>
            </div>
          </li>
          <li>
            <SpeedControl />
          </li>
          <li>
            <OpacityControl />
          </li>
        </ul>
      </div>
      <div className="h-full flex items-center ml-6">
        <button
          onClick={() => {
            configStorage.update({ enabled: !config.enabled });
          }}
          className="rounded-full bg-red-200 text-white font-medium border border-white w-[28px] h-[28px] text-[16px]"
          type="button">
          {config.enabled ? 'on' : 'off'}
        </button>
        <button
          disabled={!config.enabled}
          onClick={() => setShowPanel(!showPanel)}
          className="rounded-full disabled:cursor-not-allowed disabled:opacity-50 bg-red-200 text-white font-medium border border-white w-[28px] h-[28px] text-[16px]"
          type="button">
          弹
        </button>
      </div>
    </div>
  );
}

const SpeedControl = () => {
  const style = useStorage(styleStorage);
  const [value, setValue] = useState(Math.floor((style.speed / defaultSpeed) * 50));
  return (
    <div className="flex items-center gap-4">
      <span className="flex-1">speed</span>
      <input
        type="range"
        value={value}
        onChange={e => {
          const v = Math.floor(Number(e.target.value));
          setValue(v);
          styleStorage.updateSpeed((v * defaultSpeed) / 50);
        }}
        className="h-1 bg-gray-200 cursor-pointer w-40 accent-red-500"
      />
      <span className="w-8">{value}</span>
    </div>
  );
};
const OpacityControl = () => {
  const style = useStorage(styleStorage);
  const [value, setValue] = useState(parseFloat(style.style.opacity) * 100);
  return (
    <div className="flex items-center gap-4">
      <span className="flex-1">opacity</span>
      <input
        type="range"
        value={value}
        onChange={e => {
          const v = Number(e.target.value);
          setValue(v);
          styleStorage.updateStyle({ opacity: String(v / 100) });
        }}
        className="h-1 bg-gray-200 cursor-pointer w-40 accent-red-500"
      />
      <span className="w-8">{value}</span>
    </div>
  );
};
