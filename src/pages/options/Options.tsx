import React from 'react';
import SideAnim from './components/SideAnim';
import { Logo } from './components/Logo';

const Checkbox = ({ checked }: { checked?: boolean }) => {
  return (
    <svg
      className="w-5 h-5 me-2 text-green-500 flex-shrink-0"
      style={{
        color: checked ? '#4AB94B' : 'gray',
      }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
    </svg>
  );
};

const Kbd = (props: { text: string }) => (
  <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-[#F5F2F2] border border-gray-300 rounded-lg">
    {props.text}
  </kbd>
);

const Options: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-3 w-screen">
        <Logo />
        <a
          className="rounded-full bg-primary py-1 px-4 text-white font-medium text-base"
          rel="noreferrer"
          target="_blank"
          href="https://github.com/debugtheworldbot/danmaku/issues">
          Feedback
        </a>
      </header>
      <div className="flex-1 flex bg-[#FCFAF0] p-8 gap-8">
        <aside className="self-center relative">
          <Bg />

          <div className="absolute top-[20%]">
            <SideAnim />
          </div>
        </aside>
        <main className="flex-1 flex flex-col bg-white rounded-xl px-6 py-4">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Shortcuts</h2>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-sm text-gray-700 uppercase bg-[#F5F2F2] rounded-full">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-l-lg">
                    Key
                  </th>
                  <th scope="col" className="px-6 py-3 rounded-r-lg">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <th scope="row" className="px-2 py-6 font-medium text-gray-500 whitespace-nowrap">
                    <Kbd text="Enter" />
                    <span className="mx-2">or</span>
                    <Kbd text="return" />
                  </th>
                  <td className="px-6 py-4">Open danmaku send dashboard</td>
                </tr>
                <tr className="bg-white border-b">
                  <th scope="row" className="px-2 py-4 font-medium text-gray-500 whitespace-nowrap">
                    <Kbd text="Ctrl + q" />
                    <span className="mx-2">or</span>
                    <Kbd text="Esc" />
                  </th>
                  <td className="px-6 py-4 leading-8">
                    <div>Close danmaku send dashboard</div>
                    suggest use <Kbd text="Ctrl + q" /> , beacuse <Kbd text="Esc" /> will quit fullscreen mode :)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">Support operations</h2>
          <ul className="space-y-3 text-lg list-inside">
            <li className="flex items-center gap-2">
              <Checkbox checked />
              Show comments with time tag as danmaku
            </li>
            <li className="flex items-center gap-2">
              <Checkbox checked />
              Show live chat messages as danmaku
            </li>
            <li className="flex items-center gap-2">
              <Checkbox checked />
              Send real time danmaku
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
};

const Bg = () => (
  <svg width="360" height="640" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="40" width="200" height="40" rx="8" fill="#FF6666" fillOpacity="0.08" />
    <rect width="200" height="40" rx="8" transform="matrix(-1 0 0 1 360 480)" fill="#FF6666" fillOpacity="0.08" />
    <rect x="120" y="120" width="200" height="40" rx="8" fill="#FF6666" fillOpacity="0.08" />
    <rect width="200" height="40" rx="8" transform="matrix(-1 0 0 1 240 560)" fill="#FF6666" fillOpacity="0.08" />
    <rect y="240" width="200" height="40" rx="8" fill="#FF6666" fillOpacity="0.08" />
    <rect x="160" y="320" width="200" height="40" rx="8" fill="#FF6666" fillOpacity="0.08" />
  </svg>
);

export default Options;
