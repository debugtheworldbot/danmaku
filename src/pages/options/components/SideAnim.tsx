import { Player } from '@lottiefiles/react-lottie-player';
import anim from './side_anim.json';

export default function SideAnim() {
  return <Player speed={1.25} autoplay loop src={anim} className="h-120" />;
}
