import React from 'react';
import SideAnim from './components/SideAnim';
import { Logo } from './components/Logo';

const Checkbox = ({ checked }: { checked?: boolean }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM4.70696 10.7781C4.31643 10.3876 4.31643 9.75445 4.70696 9.36392C5.09748 8.9734 5.73065 8.9734 6.12117 9.36392L8.9496 12.1923L13.8993 7.2426C14.2899 6.85208 14.923 6.85208 15.3136 7.2426C15.7041 7.63312 15.7041 8.26629 15.3136 8.65681L8.9496 15.0208L4.70696 10.7781Z"
        fill={checked ? '#4AB94B' : '#052333'}
      />
    </svg>
  );
};

const Kbd = (props: { text: string }) => (
  <kbd className="px-3 py-2 text-sm font-semibold text-gray-800 text-black bg-[#F5F2F2] border-[#EBE8E8] border rounded-lg">
    {props.text}
  </kbd>
);

const Options: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center py-3 px-12 w-screen">
        <Logo />
        <a
          className="rounded-full bg-primary py-1 px-4 text-white font-medium text-base"
          rel="noreferrer"
          target="_blank"
          href="https://github.com/debugtheworldbot/danmaku/issues">
          Feedback
        </a>
      </header>
      <div className="flex-1 flex bg-[#FCFAF0] p-12 gap-8">
        <aside className="self-center relative">
          <Bg />

          <div className="absolute top-[20%]">
            <SideAnim />
          </div>
        </aside>
        <main className="flex-1 flex flex-col bg-white rounded-xl p-12">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 leading-4">Shortcuts</h2>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-lg text-gray-700 bg-[#F5F2F2] rounded-full">
                <tr>
                  <th scope="col" className="px-4 py-2 rounded-l-lg font-medium">
                    Key
                  </th>
                  <th scope="col" className="px-4 py-2 rounded-r-lg font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-base text-[#666666]">
                <tr className="bg-white border-b">
                  <th scope="row" className="py-6 font-medium whitespace-nowrap">
                    <Kbd text="Enter" />
                    <span className="mx-2">or</span>
                    <Kbd text="return" />
                  </th>
                  <td className="px-4 py-4">Open danmaku send dashboard</td>
                </tr>
                <tr className="bg-white border-b">
                  <th scope="row" className="py-6 font-medium whitespace-nowrap">
                    <Kbd text="Ctrl + q" />
                    <span className="mx-2">or</span>
                    <Kbd text="Esc" />
                  </th>
                  <td className="px-4 py-4 leading-6">
                    <div>Close danmaku send dashboard</div>
                    suggest use <span className="font-bold">Ctrl + q</span>, beacuse Esc will quit fullscreen mode :)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-12 mb-6 text-2xl font-semibold text-gray-900">Support operations</h2>
          <ul className="space-y-2 text-lg list-inside">
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
