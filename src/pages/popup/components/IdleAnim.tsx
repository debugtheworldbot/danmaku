import { Player } from '@lottiefiles/react-lottie-player';
import logoLottie from '../danmucat_animate.json';

export default function IdleAnim() {
  return <Player speed={1.25} autoplay loop src={logoLottie} className="w-40" />;
}
