'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';

const groups = [
  { label: '⌨ Keyboard', links: [['Keyboard Test', '/keyboard-test'], ['Spacebar Test', '/spacebar-test'], ['Typing Speed', '/typing-speed-test']] },
  { label: '🖱 Mouse', links: [['Mouse Test', '/mouse-test'], ['CPS Test', '/cps-test'], ['Mouse Accuracy', '/mouse-accuracy-test'], ['DPI Estimator', '/mouse-dpi-estimator'], ['Polling Rate', '/mouse-polling-rate-test'], ['Scroll Test', '/scroll-test'], ['Double Click Test', '/double-click-test'], ['Jitter Click Test', '/jitter-click-test'], ['Butterfly Click Test', '/butterfly-click-test'], ['Drag Click Test', '/drag-click-test']] },
  { label: '🌐 Network', links: [['Internet Speed', '/internet-speed-test'], ['Latency Test', '/latency-test'], ['Browser Test', '/browser-test']] },
  { label: '▣ Display', links: [['Dead Pixel Test', '/dead-pixel-test'], ['Monitor Test', '/monitor-test'], ['Reaction Time', '/reaction-time-test']] },
  { label: '🎮 Devices', links: [['Gamepad Test', '/gamepad-test'], ['Microphone Test', '/microphone-test'], ['Speaker Test', '/speaker-test'], ['Webcam Test', '/webcam-test'], ['Touchscreen Test', '/touchscreen-test']] },
];

const THEME_KEY = 'tw-theme';

type Theme = 'dark' | 'light';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    const next: Theme = saved === 'light' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new CustomEvent('tw-theme-change', { detail: next }));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <AppLogo size={38} />
          <span className="text-lg font-bold text-foreground">Test<span className="text-primary">Wizard</span></span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {groups.map((group) => (
            <div key={group.label} className="group relative" onMouseLeave={(e) => (e.currentTarget as HTMLElement).blur()}>
              <button
                type="button"
                className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:bg-foreground/5 focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-haspopup="true"
              >
                {group.label}
                <span className="ml-1 inline-block text-xs text-foreground/50 transition-transform group-hover:rotate-180 group-focus-within:rotate-180">⌄</span>
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 translate-y-1 rounded-2xl border border-border bg-card p-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {group.links.map(([label, href]) => (
                  <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-all duration-150 hover:translate-x-1 hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary">
                    {label}<span aria-hidden className="float-right opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-switch inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground/75 transition hover:border-primary/50 hover:text-foreground"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden>{theme === 'dark' ? '☀' : '☾'}</span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <Link href="/about" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">About</Link>
          <Link href="/test-tool-page" className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,212,255,0.35)]">Start Testing</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="sm:hidden rounded-lg border border-border px-3 py-2 text-sm text-foreground" aria-expanded={open}>Menu</button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-border bg-card px-5 py-4 space-y-1">
          <button type="button" onClick={toggleTheme} className="mb-2 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground">
            <span>Theme</span><span>{theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}</span>
          </button>
          {groups.flatMap((group) => group.links).map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-foreground/75 transition-colors hover:bg-primary/10 hover:text-primary">{label}</Link>)}
          <Link href="/about" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-foreground/75 transition-colors hover:bg-primary/10 hover:text-primary">About</Link>
        </nav>
      )}
    </header>
  );
}
