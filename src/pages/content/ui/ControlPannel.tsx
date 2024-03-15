import { useState } from 'react';
import clsx from 'clsx';

export default function ControlPannel() {
  const [showPanel, setShowPanel] = useState(false);
  return (
    <div className="absolute left-0 top-20" onMouseLeave={() => setShowPanel(false)}>
      <button
        className={clsx(
          'z-10 w-44 bg-white rounded block divide-y divide-gray-100 shadow transition-all',
          showPanel ? 'opacity-100' : 'opacity-0 hidden pointer-events-none',
        )}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>Dashboard</li>
          <li>Settings</li>
          <li>Earnings</li>
          <li>Sign out</li>
        </ul>
      </button>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="rounded-full text-white fonr-medium border border-white w-6 h-6"
        type="button">
        弹
      </button>
    </div>
  );
}
