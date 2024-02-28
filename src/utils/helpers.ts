export const formatTime = (s: number) => {
  const minutes = Math.floor(s / 60);
  const seconds = Math.floor(s % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
