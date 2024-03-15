import { useState } from 'react';
import clsx from 'clsx';
import styleStorage, { defaultSpeed } from '@root/src/shared/storages/styleStorage';
import useStorage from '@root/src/shared/hooks/useStorage';

export default function ControlPannel() {
  const [showPanel, setShowPanel] = useState(true);
  const style = useStorage(styleStorage);
  return (
    <div className="absolute left-20 top-60" onMouseLeave={() => setShowPanel(false)}>
      <div
        className={clsx(
          'absolute bottom-full z-10 bg-white rounded block divide-y divide-gray-100 shadow transition-all px-4',
          showPanel ? 'opacity-100' : 'opacity-0 hidden pointer-events-none',
        )}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li className="flex gap-4">
            <span>font size</span>
            <button
              onClick={() => {
                styleStorage.updateStyle({ fontSize: '20px' });
              }}
              className={clsx('border border-gray-300', style.style.fontSize === '20px' && 'bg-gray-300')}>
              sm
            </button>
            <button
              onClick={() => {
                styleStorage.updateStyle({ fontSize: '25px' });
              }}
              className={clsx('border border-gray-300', style.style.fontSize === '25px' && 'bg-gray-300')}>
              md
            </button>
            <button
              onClick={() => {
                styleStorage.updateStyle({ fontSize: '30px' });
              }}
              className={clsx('border border-gray-300', style.style.fontSize === '30px' && 'bg-gray-300')}>
              lg
            </button>
          </li>
          <li>
            <SpeedControl />
          </li>
          <li>
            <OpacityControl />
          </li>
        </ul>
        {JSON.stringify(styleStorage.getSnapshot())}
      </div>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="rounded-full bg-red-200 text-white font-medium border border-white w-6 h-6"
        type="button">
        弹
      </button>
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
      <span className="w-4">{value}</span>
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
      <span className="w-4">{value}</span>
    </div>
  );
};
