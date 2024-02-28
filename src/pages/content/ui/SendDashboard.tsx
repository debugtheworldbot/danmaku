import { useCallback, useEffect, useState, useRef } from 'react';

export const SendDashboard = (props: { onAdd: (text: string) => void }) => {
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
    window.addEventListener('focusin', focusin);

    const focusout = () => {
      console.log('listen blur');
      if (visible) return;
      focusing.current = false;
    };
    window.addEventListener('focusout', focusout);

    return () => {
      window.removeEventListener('focusin', focusin);
      window.removeEventListener('focusout', focusout);
    };
  }, [visible]);

  useEffect(() => {
    const trackKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (focusing.current) return console.log('ffffffocusing');
        if (window.location.pathname !== '/watch') return console.log('not a watch page');
        inputRef.current.focus();
        setVisible(true);
      }
      if (e.key === 'Escape') {
        closePopup();
      }
      e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', trackKey, true);
    return () => {
      window.removeEventListener('keydown', trackKey);
    };
  }, [closePopup]);

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
        className="drop-shadow-2xl mx-auto backdrop-blur flex gap-4 p-4 rounded-full w-[60%] border">
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
        <button className="bg-white/50 rounded-full px-4" type="submit">
          send
        </button>
      </form>
    </div>
  );
};
