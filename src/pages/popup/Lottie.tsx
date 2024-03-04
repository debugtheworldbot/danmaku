import { Player, Controls } from '@lottiefiles/react-lottie-player';
import logoLottie from './danmucat_animate.json';

export default function LottieAnim() {
  return (
    <Player speed={1.25} autoplay loop src={logoLottie} className="w-40">
      <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
    </Player>
  );
}
