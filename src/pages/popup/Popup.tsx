import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useState, useEffect, useCallback } from 'react';
import useStorage from '@root/src/shared/hooks/useStorage';
import danmakuStorage from '@root/src/shared/storages/danmakuStarage';
import configStorage from '@root/src/shared/storages/configStorage';
import { getComments } from '../content/ui/requests';
import { formatTime } from '@root/src/utils/helpers';
import LottieAnim from './Lottie';

const Popup = () => {
  const danmakus = useStorage(danmakuStorage);
  const config = useStorage(configStorage);
  const [loading, setLoading] = useState(false);

  const getCurrentTab = useCallback(async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    const isYoutube = tab.url.includes('https://www.youtube.com/watch?');
    if (!isYoutube) return '';
    const id = new URL(tab.url).searchParams.get('v');
    configStorage.update({ videoId: id });
    return id;
  }, []);

  const updateList = useCallback(async () => {
    const id = await getCurrentTab();
    if (id === config.videoId) return;
    configStorage.update({ videoId: id });
    if (!id) return;
    setLoading(true);
    const res = await getComments(id);
    setLoading(false);
    console.log('rrrrr', res);
    danmakuStorage.set(res);
  }, [config.videoId, getCurrentTab]);

  useEffect(() => {
    getCurrentTab().then(updateList);
  }, [getCurrentTab, updateList]);

  if (loading) return <div className="h-screen flex justify-center items-center text-2xl font-medium">Loading...</div>;
  return (
    <div className="text-center relative pb-2">
      <Switch
        isLive={config.isLive}
        checked={config.enabled}
        onChange={value => configStorage.update({ enabled: value })}
      />
      {config.videoId ? (
        <main className="pl-2 mt-2 pr-1">
          <button className="absolute right-2 mt-1" onClick={updateList}>
            {config.videoId}
          </button>
          <table className="table-auto text-left text-base">
            <thead>
              <tr>
                <th>Time</th>
                <th>Danmaku</th>
              </tr>
            </thead>
            <tbody>
              {danmakus?.map(comment => (
                <>
                  <tr>
                    <td className="align-top">
                      <span className="text-blue-600 mr-2">{formatTime(comment?.time)}</span>
                    </td>
                    <td className="min-w-[300px]">{comment.text}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </main>
      ) : (
        <main className="text-lg mb-2 px-8">
          <LottieAnim />
          Visit a youtube video page to see danmakus!
        </main>
      )}
    </div>
  );
};

const Switch = (props: { isLive: boolean; checked: boolean; onChange: (value: boolean) => void }) => {
  const [turnOn, setTurnOn] = useState(false);
  return (
    <div className="flex items-center p-2 border-b-1">
      <label
        onChange={() => {
          const res = !props.checked;
          props.onChange(res);
          setTurnOn(res);
        }}
        className="inline-flex cursor-pointer items-center text-2xl font-medium flex-1">
        <input type="checkbox" checked={props.checked} className="peer sr-only" />
        <div className="flex-shrink-0 bg-gray-200 peer relative h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rtl:peer-checked:after:-translate-x-full" />
        <Logo />
        {turnOn && <div className="text-xs text-left ml-2">plz refresh the page :)</div>}
        {props.isLive && <Ping />}
      </label>
      <Options />
    </div>
  );
};

const Options = () => (
  <button
    onClick={() => {
      chrome.runtime.openOptionsPage();
    }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0002 3C12.0002 4.10457 11.1048 5 10.0002 5C8.89567 5 8.00024 4.10457 8.00024 3C8.00024 1.89543 8.89567 1 10.0002 1C11.1048 1 12.0002 1.89543 12.0002 3ZM12.0002 9.92314C12.0002 11.0277 11.1048 11.9231 10.0002 11.9231C8.89567 11.9231 8.00024 11.0277 8.00024 9.92314C8.00024 8.81857 8.89567 7.92314 10.0002 7.92314C11.1048 7.92314 12.0002 8.81857 12.0002 9.92314ZM10.0002 18.8464C11.1048 18.8464 12.0002 17.951 12.0002 16.8464C12.0002 15.7418 11.1048 14.8464 10.0002 14.8464C8.89567 14.8464 8.00024 15.7418 8.00024 16.8464C8.00024 17.951 8.89567 18.8464 10.0002 18.8464Z"
        fill="black"
      />
    </svg>
  </button>
);

const Ping = () => (
  <span className="relative flex h-2 w-2 self-start ml-1">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
  </span>
);

const Logo = () => (
  <svg className="w-28 ml-2 flex-shrink-0 py-2" viewBox="0 0 257 39" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.9336 0.914062C17.7565 0.914062 22.1576 2.4375 25.1367 5.48438C28.1328 8.53125 29.6309 13.0169 29.6309 18.9414C29.6309 25.0521 28.1497 29.6816 25.1875 32.8301C22.2422 35.9785 17.9089 37.5527 12.1875 37.5527H0.0507812L0 0.914062H11.9336ZM12.1875 31.002C15.3698 31.002 17.7819 29.9863 19.4238 27.9551C21.0658 25.9069 21.8867 22.9023 21.8867 18.9414C21.8867 15.1667 21.0404 12.3145 19.3477 10.3848C17.6719 8.43815 15.2005 7.46484 11.9336 7.46484H7.74414V31.002H12.1875Z"
      fill="#052333"
    />
    <path
      d="M58.5 37.5527H51.0859V33.7695H50.832C50.2565 35.0729 49.2747 36.1309 47.8867 36.9434C46.5156 37.7559 44.8991 38.1621 43.0371 38.1621C41.1751 38.1621 39.5671 37.8151 38.2129 37.1211C36.8757 36.4271 35.8516 35.4199 35.1406 34.0996C34.4297 32.7793 34.0742 31.2135 34.0742 29.4023C34.0742 27.7943 34.5059 26.347 35.3691 25.0605C36.2324 23.7572 37.4766 22.6654 39.1016 21.7852C40.7435 20.9049 42.6986 20.2702 44.9668 19.8809C45.9655 19.7116 46.8711 19.5846 47.6836 19.5C48.513 19.4154 49.5456 19.3307 50.7812 19.2461C50.4596 17.7396 49.8672 16.6393 49.0039 15.9453C48.1406 15.2344 46.9219 14.8789 45.3477 14.8789C44.2305 14.8789 43.0286 15.0143 41.7422 15.2852C40.4557 15.5391 39.1777 15.9199 37.9082 16.4277L36.791 10.9688C38.2637 10.3763 39.8548 9.91081 41.5645 9.57227C43.2741 9.2168 44.7637 9.03906 46.0332 9.03906C48.9616 9.03906 51.3398 9.52148 53.168 10.4863C54.9961 11.4342 56.3333 12.89 57.1797 14.8535C58.043 16.8171 58.4831 19.3477 58.5 22.4453V37.5527ZM45.0176 32.7031C46.5241 32.7031 47.8275 32.2884 48.9277 31.459C50.028 30.6126 50.7474 29.5632 51.0859 28.3105V24.248C49.8164 24.2988 48.8008 24.3665 48.0391 24.4512C47.2773 24.5189 46.431 24.6374 45.5 24.8066C44.2812 25.0436 43.2995 25.5345 42.5547 26.2793C41.8099 27.0241 41.4375 27.9635 41.4375 29.0977C41.4375 30.2148 41.7507 31.0951 42.377 31.7383C43.0033 32.3815 43.8835 32.7031 45.0176 32.7031Z"
      fill="#052333"
    />
    <path
      d="M79.7266 9.01367C82.9596 9.01367 85.4225 9.96159 87.1152 11.8574C88.8079 13.7363 89.6543 16.4785 89.6543 20.084V37.5527H82.2656V21.4297C82.2656 19.4323 81.8424 17.9173 80.9961 16.8848C80.1497 15.8353 78.9225 15.3105 77.3145 15.3105C75.8926 15.2936 74.7331 15.8014 73.8359 16.834C72.9557 17.8496 72.4564 19.2376 72.3379 20.998V37.5527H64.9492V9.62305H72.3379V13.1777H72.6172C73.2773 11.8405 74.2253 10.8164 75.4609 10.1055C76.6966 9.3776 78.1185 9.01367 79.7266 9.01367Z"
      fill="#052333"
    />
    <path
      d="M136.119 37.5273H128.73V20.541C128.73 18.9668 128.4 17.7227 127.74 16.8086C127.08 15.8776 126.166 15.4121 124.998 15.4121C123.999 15.4121 123.119 15.6999 122.357 16.2754C121.596 16.8509 120.986 17.638 120.529 18.6367C120.089 19.6185 119.81 20.7103 119.691 21.9121V37.5273H112.557V20.2871C112.557 18.7806 112.21 17.5957 111.516 16.7324C110.839 15.8522 109.874 15.4121 108.621 15.4121C107.233 15.4121 106.082 15.9876 105.168 17.1387C104.271 18.2897 103.721 19.8555 103.518 21.8359V37.5527H96.1289V9.62305H103.518V13.457H103.746C104.542 12.0182 105.498 10.918 106.615 10.1562C107.749 9.3776 109.01 8.98828 110.398 8.98828C112.413 8.98828 114.122 9.4707 115.527 10.4355C116.949 11.4004 118.007 12.7715 118.701 14.5488H118.904C119.734 12.7715 120.809 11.4089 122.129 10.4609C123.466 9.51302 125.023 9.03906 126.801 9.03906C128.764 9.03906 130.44 9.51302 131.828 10.4609C133.233 11.3919 134.299 12.7207 135.027 14.4473C135.755 16.1569 136.119 18.1797 136.119 20.5156V37.5273Z"
      fill="#052333"
    />
    <path
      d="M155.086 38.1367C152.564 38.1367 150.355 37.6712 148.459 36.7402C146.58 35.8092 145.133 34.4805 144.117 32.7539C143.102 31.0273 142.594 29.013 142.594 26.7109V9.62305H149.982V26.7109C149.982 27.862 150.202 28.8607 150.643 29.707C151.083 30.5365 151.684 31.1797 152.445 31.6367C153.224 32.0768 154.104 32.2969 155.086 32.2969C156.542 32.2969 157.718 31.806 158.615 30.8242C159.512 29.8255 159.961 28.4544 159.961 26.7109V9.62305H167.35V26.7109C167.35 29.0299 166.859 31.0527 165.877 32.7793C164.895 34.4889 163.482 35.8092 161.637 36.7402C159.792 37.6712 157.608 38.1367 155.086 38.1367Z"
      fill="#052333"
    />
    <path
      d="M191.039 31.8398C192.901 31.8398 194.628 31.332 196.219 30.3164C197.827 29.2839 199.232 27.7858 200.434 25.8223L205.486 29.5547C204.014 32.4492 202.042 34.6667 199.57 36.207C197.099 37.7305 194.255 38.4922 191.039 38.4922C187.518 38.4922 184.404 37.6966 181.695 36.1055C179.004 34.5143 176.905 32.2715 175.398 29.377C173.892 26.4655 173.113 23.0885 173.062 19.2461C173.113 15.4036 173.892 12.0352 175.398 9.14062C176.905 6.22917 179.004 3.97786 181.695 2.38672C184.404 0.795573 187.518 0 191.039 0C194.255 0 197.09 0.770182 199.545 2.31055C202.016 3.83398 203.997 6.05143 205.486 8.96289L200.434 12.6953C199.249 10.7318 197.852 9.23372 196.244 8.20117C194.653 7.16862 192.918 6.65234 191.039 6.65234C189.076 6.65234 187.324 7.17708 185.783 8.22656C184.243 9.25911 183.024 10.7318 182.127 12.6445C181.247 14.5573 180.79 16.7578 180.756 19.2461C180.79 21.7513 181.247 23.9603 182.127 25.873C183.007 27.7689 184.217 29.2415 185.758 30.291C187.298 31.3236 189.059 31.8398 191.039 31.8398Z"
      fill="#052333"
    />
    <path
      d="M234.254 37.5527H226.84V33.7695H226.586C226.01 35.0729 225.029 36.1309 223.641 36.9434C222.27 37.7559 220.653 38.1621 218.791 38.1621C216.929 38.1621 215.321 37.8151 213.967 37.1211C212.63 36.4271 211.605 35.4199 210.895 34.0996C210.184 32.7793 209.828 31.2135 209.828 29.4023C209.828 27.7943 210.26 26.347 211.123 25.0605C211.986 23.7572 213.23 22.6654 214.855 21.7852C216.497 20.9049 218.452 20.2702 220.721 19.8809C221.719 19.7116 222.625 19.5846 223.438 19.5C224.267 19.4154 225.299 19.3307 226.535 19.2461C226.214 17.7396 225.621 16.6393 224.758 15.9453C223.895 15.2344 222.676 14.8789 221.102 14.8789C219.984 14.8789 218.783 15.0143 217.496 15.2852C216.21 15.5391 214.932 15.9199 213.662 16.4277L212.545 10.9688C214.018 10.3763 215.609 9.91081 217.318 9.57227C219.028 9.2168 220.518 9.03906 221.787 9.03906C224.715 9.03906 227.094 9.52148 228.922 10.4863C230.75 11.4342 232.087 12.89 232.934 14.8535C233.797 16.8171 234.237 19.3477 234.254 22.4453V37.5527ZM220.771 32.7031C222.278 32.7031 223.581 32.2884 224.682 31.459C225.782 30.6126 226.501 29.5632 226.84 28.3105V24.248C225.57 24.2988 224.555 24.3665 223.793 24.4512C223.031 24.5189 222.185 24.6374 221.254 24.8066C220.035 25.0436 219.053 25.5345 218.309 26.2793C217.564 27.0241 217.191 27.9635 217.191 29.0977C217.191 30.2148 217.505 31.0951 218.131 31.7383C218.757 32.3815 219.637 32.7031 220.771 32.7031Z"
      fill="#052333"
    />
    <path
      d="M250.986 15.8945V27.9043C250.986 28.8691 251.088 29.6139 251.291 30.1387C251.494 30.6634 251.799 31.0273 252.205 31.2305C252.628 31.4336 253.204 31.5352 253.932 31.5352H256.039V37.6543H252.154C249.395 37.6543 247.279 36.918 245.807 35.4453C244.334 33.9557 243.598 31.7467 243.598 28.8184V15.8945H239.332V9.62305H243.598V3.40234L250.986 0.863281V9.62305H256.318V15.8945H250.986Z"
      fill="#052333"
    />
  </svg>
);

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
