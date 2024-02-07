import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log('content view loaded');
  }, []);

  return <div className="fixed top-0 left-0 right-0 w-screen h-20 z-[9999]">conssssssstent view</div>;
}
