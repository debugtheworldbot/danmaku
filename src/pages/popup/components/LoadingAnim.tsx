import { Player } from '@lottiefiles/react-lottie-player';
import loadingLottie from '../cat_animate.json';

export default function LoadingAnim() {
  return <Player speed={2} autoplay loop src={loadingLottie} className="w-40" />;
}
