import { useCallback, useEffect, useState, useRef } from 'react';

export const SendDashboard = (props: { onAdd: (text: string) => void }) => {
  const { onAdd } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const focusing = useRef(false);

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
  }, [closePopup, onAdd]);

  if (!visible) return null;

  return (
    <div className="fixed top-[80%] z-[9999] flex text-xl gap-4 w-full flex ">
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (!text) return;
          onAdd(text);
          closePopup();
        }}
        className="shadow-xl mx-auto bg-white flex gap-2 p-2 rounded-lg w-[60%] border">
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={true}
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
          className="border rounded-full flex-1 px-2 py-1"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <button type="submit">send</button>
      </form>
    </div>
  );
};
