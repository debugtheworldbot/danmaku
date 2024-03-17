import { useState } from 'react';
import clsx from 'clsx';
import styleStorage, { defaultSpeed } from '@root/src/shared/storages/styleStorage';
import useStorage from '@root/src/shared/hooks/useStorage';

export default function ControlPannel(props: { onVisibleChange: (visible: boolean) => void }) {
  const { onVisibleChange } = props;
  const [showPanel, setShowPanel] = useState(true);
  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(false)}
        className={clsx(showPanel ? 'fixed absolute inset-0 cursor-auto' : 'hidden pointer-events-none')}
      />
      <div
        className={clsx(
          'absolute bottom-full mb-6 bg-gray-500/70 rounded-2xl block transition-all p-4 text-white',
          showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none',
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
            setShowPanel(!showPanel);
            onVisibleChange(!showPanel);
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
      <span className="w-20 text-center">Size</span>
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
  const [value, setValue] = useState(Math.floor((style.speed / defaultSpeed) * 50));
  return (
    <div className="flex items-center gap-4">
      <span className="w-20 text-center">Speed</span>
      <input
        type="range"
        value={value}
        onChange={e => {
          const v = Math.floor(Number(e.target.value));
          setValue(v);
          styleStorage.updateSpeed((v * defaultSpeed) / 50);
        }}
        className="w-40 h-2 bg-gray-300 rounded-lg opacity-90 hover:opacity-100 appearance-none cursor-pointer slider"
      />
      <span className="w-8 text-base">{value}</span>
    </div>
  );
};
const OpacityControl = () => {
  const style = useStorage(styleStorage);
  const [value, setValue] = useState(parseFloat(style.style.opacity) * 100);
  return (
    <div className="flex items-center gap-4">
      <span className="w-20 text-center">Opacity</span>
      <input
        type="range"
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
      d="M20.8067 7.62361L20.1842 6.54352C19.6577 5.6296 18.4907 5.31432 17.5755 5.83872C17.1399 6.09534 16.6201 6.16815 16.1307 6.04109C15.6413 5.91402 15.2226 5.59752 14.9668 5.16137C14.8023 4.88415 14.7139 4.56839 14.7105 4.24604C14.7254 3.72922 14.5304 3.2284 14.17 2.85767C13.8096 2.48694 13.3145 2.27786 12.7975 2.27808H11.5435C11.037 2.27808 10.5513 2.47991 10.194 2.83895C9.83669 3.19798 9.63717 3.68459 9.63961 4.19112C9.6246 5.23693 8.77248 6.07681 7.72657 6.0767C7.40421 6.07336 7.08846 5.98494 6.81123 5.82041C5.89606 5.29601 4.72911 5.61129 4.20254 6.52522L3.53435 7.62361C3.00841 8.53639 3.3194 9.70261 4.23 10.2323C4.8219 10.574 5.18653 11.2056 5.18653 11.8891C5.18653 12.5725 4.8219 13.2041 4.23 13.5458C3.32056 14.0719 3.00923 15.2353 3.53435 16.1454L4.16593 17.2346C4.41265 17.6798 4.8266 18.0083 5.31619 18.1474C5.80578 18.2866 6.33064 18.2249 6.77462 17.976C7.21108 17.7213 7.73119 17.6516 8.21934 17.7822C8.70749 17.9128 9.12324 18.233 9.37416 18.6717C9.5387 18.9489 9.62711 19.2646 9.63046 19.587C9.63046 20.6435 10.487 21.5 11.5435 21.5H12.7975C13.8505 21.5 14.7055 20.6491 14.7105 19.5962C14.7081 19.088 14.9089 18.6 15.2682 18.2407C15.6275 17.8814 16.1155 17.6807 16.6236 17.6831C16.9452 17.6917 17.2596 17.7798 17.5389 17.9394C18.4517 18.4653 19.6179 18.1544 20.1476 17.2438L20.8067 16.1454C21.0618 15.7075 21.1318 15.186 21.0012 14.6964C20.8706 14.2067 20.5502 13.7894 20.111 13.5367C19.6718 13.284 19.3514 12.8666 19.2208 12.3769C19.0902 11.8873 19.1603 11.3658 19.4154 10.928C19.5812 10.6383 19.8214 10.3982 20.111 10.2323C21.0161 9.70289 21.3264 8.54349 20.8067 7.63277V7.62361Z"
      stroke="#200E32"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1751 14.5249C13.6309 14.5249 14.8111 13.3448 14.8111 11.8889C14.8111 10.4331 13.6309 9.25293 12.1751 9.25293C10.7192 9.25293 9.53906 10.4331 9.53906 11.8889C9.53906 13.3448 10.7192 14.5249 12.1751 14.5249Z"
      stroke="#200E32"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
