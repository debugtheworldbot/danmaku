import { useCallback, useEffect, useState } from 'react';

export const SendDashboard = (props: { onAdd: (text: string) => void }) => {
  const { onAdd } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const closePopup = useCallback(() => {
    setVisible(false);
    setText('');
  }, []);

  useEffect(() => {
    const trackKey = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === 'Enter') {
        setVisible(true);
      }
      if (e.key === 'Escape') {
        closePopup();
      }
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
