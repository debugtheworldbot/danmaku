import { useState } from 'react';
import clsx from 'clsx';
import styleStorage, { defaultSpeed } from '@root/src/shared/storages/styleStorage';
import useStorage from '@root/src/shared/hooks/useStorage';

export default function ControlPannel(props: { visible: boolean; setVisible: (visible: boolean) => void }) {
  const { visible, setVisible } = props;
  return (
    <div className="relative">
      <div
        className={clsx(
          'absolute bottom-full mb-8 bg-gray-500/90 backdrop-blur rounded-2xl block transition-all p-4 text-white',
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}>
        <ul className="py-2 text-xl flex flex-col gap-4">
          <li>
            <SizeControl />
          </li>
          <li>
            <SpeedControl />
          </li>
          <li>
            <OpacityControl />
          </li>
        </ul>
      </div>
      <div className="h-full flex items-center">
        <button
          onClick={() => {
            setVisible(!visible);
          }}
          className="rounded-full bg-gray-300 rounded-full p-2 w-10 h-10 focus:outline focus:outline-white cursor-pointer"
          type="button">
          <Setting />
        </button>
      </div>
    </div>
  );
}

const SizeControl = () => {
  const style = useStorage(styleStorage);
  const [value, setValue] = useState(parseInt(style.style.fontSize.replace('px', '')));
  return (
    <div className="flex items-center gap-4">
      <span className="w-20">Size</span>
      <div className="flex items-center relative">
        <span className="text-sm absolute -left-4">A</span>

        <input
          type="range"
          min={15}
          max={35}
          step={5}
          value={value}
          onChange={e => {
            const v = Math.floor(Number(e.target.value));
            setValue(v);
            styleStorage.updateStyle({ fontSize: `${v}px` });
          }}
          className="w-40 h-2 bg-gray-300 rounded-lg opacity-90 hover:opacity-100 appearance-none cursor-pointer slider"
        />
      </div>
      <span className="text-2xl">A</span>
    </div>
  );
};
const SpeedControl = () => {
  const style = useStorage(styleStorage);
  const [value, setValue] = useState(Number((style.speed / defaultSpeed).toFixed(1)));
  return (
    <div className="flex items-center gap-4">
      <span className="w-20">Speed</span>
      <input
        type="range"
        value={value}
        min={0.4}
        max={2}
        step={0.1}
        onChange={e => {
          const v = Number(e.target.value);
          setValue(v);
          styleStorage.updateSpeed(v * defaultSpeed);
        }}
        className="w-40 h-2 bg-gray-300 rounded-lg opacity-90 hover:opacity-100 appearance-none cursor-pointer slider"
      />
      <span className="w-8 text-base">{(style.speed / defaultSpeed).toFixed(1)}x</span>
    </div>
  );
};
const OpacityControl = () => {
  const style = useStorage(styleStorage);
  const [value, setValue] = useState(parseFloat(style.style.opacity) * 100);
  return (
    <div className="flex items-center gap-4">
      <span className="w-20">Opacity</span>
      <input
        type="range"
        min={10}
        max={100}
        step={10}
        value={value}
        onChange={e => {
          const v = Number(e.target.value);
          setValue(v);
          styleStorage.updateStyle({ opacity: String(v / 100) });
        }}
        className="w-40 h-2 bg-gray-300 rounded-lg opacity-90 hover:opacity-100 appearance-none cursor-pointer slider"
      />
      <span className="w-8 text-base">{value}</span>
    </div>
  );
};

const Setting = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.0293 7.56191L20.3784 6.4381C19.8278 5.48718 18.6075 5.15914 17.6505 5.70476C17.1949 5.97178 16.6513 6.04753 16.1396 5.91532C15.6278 5.78311 15.19 5.4538 14.9225 5C14.7505 4.71156 14.658 4.38302 14.6545 4.04762C14.67 3.50988 14.4661 2.98879 14.0893 2.60305C13.7124 2.21731 13.1947 1.99978 12.654 2H11.3427C10.813 2 10.3052 2.21001 9.9315 2.58357C9.55786 2.95713 9.34923 3.46345 9.35177 3.99048C9.33607 5.07861 8.445 5.95249 7.35128 5.95238C7.01419 5.9489 6.684 5.85691 6.39411 5.68571C5.4371 5.14009 4.21681 5.46813 3.66616 6.41905L2.96743 7.56191C2.41745 8.51163 2.74265 9.72505 3.69488 10.2762C4.31384 10.6318 4.69513 11.2889 4.69513 12C4.69513 12.7111 4.31384 13.3682 3.69488 13.7238C2.74386 14.2712 2.4183 15.4817 2.96743 16.4286L3.62787 17.5619C3.88587 18.0251 4.31875 18.3669 4.83072 18.5117C5.34269 18.6565 5.89154 18.5923 6.35582 18.3333C6.81223 18.0684 7.35611 17.9957 7.86658 18.1317C8.37704 18.2676 8.81179 18.6008 9.07419 19.0571C9.24625 19.3456 9.3387 19.6741 9.3422 20.0095C9.3422 21.1088 10.2378 22 11.3427 22H12.654C13.7551 22 14.6492 21.1146 14.6545 20.019C14.652 19.4904 14.8619 18.9826 15.2376 18.6088C15.6133 18.2349 16.1237 18.026 16.655 18.0286C16.9913 18.0375 17.3201 18.1291 17.6122 18.2952C18.5667 18.8425 19.7862 18.5189 20.3401 17.5714L21.0293 16.4286C21.296 15.973 21.3693 15.4304 21.2327 14.9209C21.0962 14.4115 20.7612 13.9772 20.3018 13.7143C19.8425 13.4514 19.5075 13.0171 19.3709 12.5076C19.2344 11.9982 19.3076 11.4556 19.5744 11C19.7479 10.6987 19.999 10.4488 20.3018 10.2762C21.2484 9.72535 21.5728 8.51902 21.0293 7.57143V7.56191Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
