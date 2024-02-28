import useStorage from '@root/src/shared/hooks/useStorage';
import configStorage from '@root/src/shared/storages/configStorage';
import { useCallback, useEffect, useState, useRef } from 'react';

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
      if (e.key === 'q' && e.ctrlKey) {
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
      }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (!text) return;
          onAdd(text);
          closePopup();
        }}
        className="drop-shadow-2xl mx-auto backdrop-blur flex items-center gap-4 p-4 rounded-full w-[60%] border">
        <button className="bg-white/50 rounded-full w-10 h-10" type="button" onClick={closePopup}>
          X
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
          className="border rounded-full flex-1 px-4 py-2"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <button className="bg-white/50 rounded-full px-4 py-2" type="submit">
          send
        </button>
      </form>
    </div>
  );
};
