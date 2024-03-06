import useStorage from '@root/src/shared/hooks/useStorage';
import configStorage from '@root/src/shared/storages/configStorage';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

export const SendDashboard = (props: { onAdd: (text: string) => void }) => {
  const config = useStorage(configStorage);
  const { onAdd } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const focusing = useRef(false);
  const inputRef = useRef(null);

  const closePopup = useCallback(() => {
    setVisible(false);
    focusing.current = false;
    setText('');
  }, []);

  useEffect(() => {
    const focusin = () => {
      console.log('listen focus');
      if (visible) return;
      focusing.current = true;
    };

    const focusout = () => {
      console.log('listen blur');
      if (visible) return;
      focusing.current = false;
    };
    const inputs = document.getElementsByTagName('input');
    [...inputs]
      .filter(i => i.type === 'text')
      .forEach(i => {
        i.addEventListener('focusin', focusin);
        i.addEventListener('focusout', focusout);
      });

    return () => {
      [...inputs]
        .filter(i => i.type === 'text')
        .forEach(i => {
          i.removeEventListener('focusin', focusin);
          i.removeEventListener('focusout', focusout);
        });
    };
  }, [visible]);

  useEffect(() => {
    const trackKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (focusing.current) return console.log('ffffffocusing');
        if (window.location.pathname !== '/watch') return console.log('not a watch page');
        if (config.isLive) return console.log('live mode');
        inputRef.current.focus();
        setVisible(true);
        e.stopImmediatePropagation();
      }
      if ((e.key === 'q' && e.ctrlKey) || e.key === 'Escape') {
        console.log('esc');
        closePopup();
      }
    };
    window.addEventListener('keydown', trackKey, true);
    return () => {
      window.removeEventListener('keydown', trackKey);
    };
  }, [closePopup, config.isLive]);

  return (
    <div
      className="fixed top-[80%] z-[9999] flex text-xl gap-4 w-full flex transition-all"
      style={{
        opacity: visible ? '1' : '0',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20%) scale(0.95)',
        pointerEvents: visible ? 'all' : 'none',
      }}>
      <Rnd
        className="border rounded-full"
        default={{
          x: 0,
          y: 0,
          width: 'fit-content',
          height: 'fit-content',
        }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            if (!text) return;
            onAdd(text);
            closePopup();
          }}
          className="bg-gray-500/70 dark:bg-gray-500/50 shadow-xl mx-auto backdrop-blur flex items-center gap-4 p-4 rounded-full w-[60vw] border border-gray-300 border-1 border-solid outline outline-black/50">
          <button
            className="flex p-1 items-center bg-gray-300 rounded-full w-10 h-10"
            type="button"
            onClick={closePopup}>
            <Close />
          </button>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={visible}
            ref={inputRef}
            onKeyDown={e => {
              e.stopPropagation();
            }}
            onKeyUp={e => {
              e.stopPropagation();
            }}
            onKeyDownCapture={e => {
              e.stopPropagation();
            }}
            onKeyUpCapture={e => {
              e.stopPropagation();
            }}
            className="rounded-full flex-1 px-4 py-2 bg-gray-600/30 text-white outline-none border border-transparent focus:border-white"
            value={text}
            onChange={e => {
              setText(e.target.value);
            }}
          />
          <button className="bg-gray-300 rounded-full px-4 py-2" type="submit">
            Send
          </button>
        </form>
      </Rnd>
    </div>
  );
};

const Close = () => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_14_12)">
      <rect
        x="92.2842"
        y="28.6447"
        width="10"
        height="90"
        rx="5"
        transform="rotate(45 92.2842 28.6447)"
        fill="#332E2E"
      />
      <rect
        x="99.3555"
        y="92.2843"
        width="10"
        height="90"
        rx="5"
        transform="rotate(135 99.3555 92.2843)"
        fill="#332E2E"
      />
    </g>
    <defs>
      <clipPath id="clip0_14_12">
        <rect width="128" height="128" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
