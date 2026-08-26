import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Device Test – Keyboard, Mouse, Display, Network & More',
  description:
    'Run TestWizard\'s complete device checklist: device overview, browser, keyboard, mouse, touchscreen, display, pixel, network response, internet speed, speaker, microphone and camera tests.',
};

export default function CompleteDeviceTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
