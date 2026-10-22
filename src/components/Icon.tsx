import type { CSSProperties } from 'react';

type IconName = 'arrow' | 'chevron' | 'heart' | 'home' | 'check' | 'pin' | 'clock' | 'message' | 'menu' | 'close' | 'expand' | 'leaf';
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  heart: <path d="M20.5 5.8a5.3 5.3 0 0 0-7.5 0L12 7l-1.1-1.2a5.3 5.3 0 0 0-7.5 7.5L12 22l8.5-8.7a5.3 5.3 0 0 0 0-7.5Z" />,
  home: <><path d="m3 10 9-8 9 8v11H3Z"/><path d="M8 12c-3 0-3 4 4 7 7-3 7-7 4-7-2 0-3 1-4 2-1-1-2-2-4-2Z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2" /></>,
  message: <path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  expand: <><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><path d="m3 3 6 6m12-6-6 6m6 12-6-6M3 21l6-6" /></>,
  leaf: <><path d="M20 3C8 2 2 7 5 15c8 5 15-1 15-12Z"/><path d="M3 21 15 9" /></>,
};
export function Icon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>;
}
