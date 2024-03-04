import { Player, Controls } from '@lottiefiles/react-lottie-player';
import logoLottie from './danmucat_animate.json';

export default function LottieAnim() {
  return (
    <Player autoplay loop src={logoLottie} className="w-52">
      <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
    </Player>
  );
}
