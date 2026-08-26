import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import PageUtilities from '@/components/PageUtilities';

const columns = [
  { title: 'Keyboard', links: [['Keyboard Test', '/keyboard-test'], ['Spacebar Test', '/spacebar-test'], ['Typing Speed', '/typing-speed-test']] },
  { title: 'Mouse', links: [['Mouse Test', '/mouse-test'], ['CPS Test', '/cps-test'], ['Mouse Accuracy', '/mouse-accuracy-test'], ['DPI Estimator', '/mouse-dpi-estimator'], ['Polling Rate', '/mouse-polling-rate-test'], ['Scroll Test', '/scroll-test'], ['Double Click', '/double-click-test'], ['Jitter Click', '/jitter-click-test'], ['Butterfly Click', '/butterfly-click-test'], ['Drag Click', '/drag-click-test']] },
  { title: 'Network', links: [['Internet Speed', '/internet-speed-test'], ['Latency Test', '/latency-test'], ['Browser Test', '/browser-test']] },
  { title: 'Display', links: [['Dead Pixel Test', '/dead-pixel-test'], ['Monitor Test', '/monitor-test'], ['Reaction Time', '/reaction-time-test']] },
  { title: 'Devices', links: [['Gamepad Test', '/gamepad-test'], ['Microphone Test', '/microphone-test'], ['Speaker Test', '/speaker-test'], ['Webcam Test', '/webcam-test'], ['Touchscreen Test', '/touchscreen-test']] },
  { title: 'Tools', links: [['Full Device Test', '/device-test-series'], ['Hissa Calculator', '/hissa-calculator']] },
] as const;

function LinkColumn({ title, links, compact = false }: { title: string; links: readonly (readonly [string, string])[]; compact?: boolean }) {
  return (
    <div>
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground/45">{title}</h2>
      <ul className={compact ? 'grid grid-cols-2 gap-x-5 gap-y-2' : 'space-y-2'}>
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-xs leading-5 text-foreground/65 transition-colors hover:text-primary sm:text-sm">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const keyboard = columns[0];
  const mouse = columns[1];
  const more = columns.slice(2);

  return (
    <>
      <PageUtilities />
      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-9 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.7fr_1.25fr_1.8fr] lg:gap-10 lg:py-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <AppLogo size={32} />
              <span className="font-bold text-foreground">Test<span className="text-primary">Wizard</span></span>
            </Link>
            <p className="mt-4 max-w-[250px] text-xs leading-5 text-foreground/45 sm:text-sm sm:leading-6">Free online tools to test your gear. No downloads, instant results.</p>
            <Link href="/test-tool-page" className="mt-4 inline-block text-xs font-semibold text-primary hover:text-foreground sm:text-sm">View all 24 tests →</Link>
          </div>

          <LinkColumn title={keyboard.title} links={keyboard.links} />
          <LinkColumn title={mouse.title} links={mouse.links} compact />

          <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-2">
            {more.map((column) => <LinkColumn key={column.title} title={column.title} links={column.links} compact={column.title === 'Devices'} />)}
          </div>
        </div>

        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-border px-5 py-5 text-[11px] text-foreground/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 TestWizard. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
