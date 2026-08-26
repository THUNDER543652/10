'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';

type Status = 'pending' | 'passed' | 'skipped';
type Step = {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  href?: string;
  external?: boolean;
};

type Result = {
  id: string;
  status: Status;
  detail: string;
};

/**
 * Full Device Test is intentionally a directory of the site's real tests.
 * Do not duplicate the individual test implementations here: each linked
 * route is the canonical TestWizard test page.
 */
const STEPS: Step[] = [
  {
    id: 'device',
    number: 1,
    title: 'Device overview',
    category: 'Device',
    description: 'Detect your device type, operating system, browser, viewport and touch capability.',
  },
  {
    id: 'browser',
    number: 2,
    title: 'Browser test',
    category: 'Browser',
    href: '/browser-test',
    description: 'Check browser capabilities and available browser information using the existing TestWizard Browser Test.',
  },
  {
    id: 'keyboard',
    number: 3,
    title: 'Keyboard test',
    category: 'Input',
    href: '/keyboard-test',
    description: 'Use the site\'s own Keyboard Test to check keyboard keys and layouts.',
  },
  {
    id: 'mouse',
    number: 4,
    title: 'Mouse test',
    category: 'Input',
    href: '/mouse-test',
    description: 'Use the site\'s own Mouse Test to check buttons, movement and scroll input.',
  },
  {
    id: 'touchscreen',
    number: 5,
    title: 'Touchscreen test',
    category: 'Input',
    href: '/touchscreen-test',
    description: 'Use the site\'s own Touchscreen Test to check touch input and multi-touch behavior.',
  },
  {
    id: 'display',
    number: 6,
    title: 'Display check',
    category: 'Display',
    href: '/monitor-test',
    description: 'Use the site\'s own Monitor Test to check display colors, contrast and visual behavior.',
  },
  {
    id: 'pixel',
    number: 7,
    title: 'Pixel test',
    category: 'Display',
    href: '/dead-pixel-test',
    description: 'Check the display for dead or stuck pixels with the existing TestWizard pixel test.',
  },
  {
    id: 'network',
    number: 8,
    title: 'Network response test',
    category: 'Network',
    href: '/latency-test',
    description: 'Use the site\'s own Latency Test to measure network response and latency.',
  },
  {
    id: 'internet',
    number: 9,
    title: 'Internet speed test',
    category: 'Network',
    href: '/internet-speed-test',
    description: 'Check your download and upload connection speed with the existing Internet Speed Test.',
  },
  {
    id: 'speaker',
    number: 10,
    title: 'Speaker test',
    category: 'Audio',
    href: '/speaker-test',
    description: 'Use the site\'s own Speaker Test to verify audio output.',
  },
  {
    id: 'microphone',
    number: 11,
    title: 'Microphone test',
    category: 'Audio',
    href: '/microphone-test',
    description: 'Use the site\'s own Microphone Test to check microphone access and input.',
  },
  {
    id: 'camera',
    number: 12,
    title: 'Camera test',
    category: 'Camera',
    href: '/webcam-test',
    description: 'Use the site\'s own Camera/Webcam Test to check camera access and video.',
  },
];

const initialResults = (): Result[] =>
  STEPS.map((step) => ({ id: step.id, status: 'pending', detail: 'Not completed yet' }));

export default function DeviceTestSeriesPage() {
  const [selected, setSelected] = useState(0);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [deviceInfo, setDeviceInfo] = useState({
    mobile: false,
    touch: false,
    browser: 'Detecting…',
    os: 'Detecting…',
    width: 0,
    height: 0,
  });

  const step = STEPS[selected];
  const completed = results.filter((result) => result.status !== 'pending').length;
  const passed = results.filter((result) => result.status === 'passed').length;
  const skipped = results.filter((result) => result.status === 'skipped').length;
  const allDone = completed === STEPS.length;
  const progress = Math.round((completed / STEPS.length) * 100);

  useEffect(() => {
    const ua = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    const touch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    const browser = /Edg\//.test(ua)
      ? 'Microsoft Edge'
      : /Chrome\//.test(ua)
        ? 'Google Chrome'
        : /Firefox\//.test(ua)
          ? 'Mozilla Firefox'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'Other';
    const os = /Windows/i.test(ua)
      ? 'Windows'
      : /Mac OS/i.test(ua)
        ? 'macOS'
        : /Android/i.test(ua)
          ? 'Android'
          : /iPhone|iPad|iPod/i.test(ua)
            ? 'iOS/iPadOS'
            : /Linux/i.test(ua)
              ? 'Linux'
              : 'Other';

    setDeviceInfo({
      mobile,
      touch,
      browser,
      os,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const updateViewport = () => {
      setDeviceInfo((current) => ({ ...current, width: window.innerWidth, height: window.innerHeight }));
    };
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const mark = (status: Status, detail: string) => {
    setResults((current) =>
      current.map((result, index) =>
        index === selected ? { ...result, status, detail } : result,
      ),
    );
  };

  const markDevicePassed = () => {
    mark(
      'passed',
      `${deviceInfo.mobile ? 'Mobile / tablet' : 'Laptop / desktop'} · ${deviceInfo.os} · ${deviceInfo.browser} · ${deviceInfo.width} × ${deviceInfo.height}${deviceInfo.touch ? ' · Touch capable' : ''}`,
    );
  };

  const markLinkedComplete = () => {
    mark('passed', `Completed ${step.title} on the TestWizard test page.`);
  };

  const skip = () => {
    mark('skipped', 'Skipped by user.');
  };

  const selectNext = () => {
    setSelected((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const selectPrevious = () => {
    setSelected((current) => Math.max(current - 1, 0));
  };

  const finishAndPdf = () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const colors = {
      background: [10, 10, 15] as [number, number, number],
      panel: [17, 17, 24] as [number, number, number],
      border: [42, 46, 60] as [number, number, number],
      text: [240, 244, 255] as [number, number, number],
      muted: [145, 157, 181] as [number, number, number],
      cyan: [0, 212, 255] as [number, number, number],
      green: [52, 211, 153] as [number, number, number],
      amber: [251, 191, 36] as [number, number, number],
    };

    const fillPage = () => {
      doc.setFillColor(...colors.background);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    };

    const addHeader = () => {
      fillPage();
      doc.setFillColor(...colors.cyan);
      doc.rect(0, 0, pageWidth, 3, 'F');
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(21);
      doc.text('TestWizard', 16, 24);
      doc.setTextColor(...colors.cyan);
      doc.setFontSize(11);
      doc.text('COMPLETE DEVICE TEST REPORT', 16, 33);
      doc.setTextColor(...colors.muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Generated: ${now}`, 16, 42);
      doc.text('TESTWIZARD  /  DEVICE TEST', 16, pageHeight - 10);
      doc.text(String(doc.getNumberOfPages()), pageWidth - 16, pageHeight - 10, { align: 'right' });
    };

    addHeader();

    doc.setFillColor(...colors.panel);
    doc.setDrawColor(...colors.border);
    doc.roundedRect(16, 52, pageWidth - 32, 43, 5, 5, 'FD');
    doc.setTextColor(...colors.muted);
    doc.setFontSize(8);
    doc.text('DEVICE', 23, 64);
    doc.text('OPERATING SYSTEM', 23, 78);
    doc.text('BROWSER', 91, 64);
    doc.text('VIEWPORT', 91, 78);
    doc.text('COMPLETION', 159, 64);
    doc.text('PASSED / SKIPPED', 159, 78);

    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(deviceInfo.mobile ? 'Mobile / Tablet' : 'Laptop / Desktop', 23, 70);
    doc.text(deviceInfo.os, 23, 84);
    doc.text(deviceInfo.browser, 91, 70);
    doc.text(`${deviceInfo.width} × ${deviceInfo.height}`, 91, 84);
    doc.text(`${completed}/${STEPS.length} (${progress}%)`, 159, 70);
    doc.text(`${passed} passed / ${skipped} skipped`, 159, 84);

    let y = 110;
    STEPS.forEach((item, index) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        addHeader();
        y = 54;
      }

      const result = results[index];
      const statusText = result.status === 'passed' ? 'PASS' : result.status === 'skipped' ? 'SKIP' : 'PENDING';
      const statusColor = result.status === 'passed' ? colors.green : result.status === 'skipped' ? colors.amber : colors.muted;

      doc.setFillColor(...colors.panel);
      doc.setDrawColor(...colors.border);
      doc.roundedRect(16, y, pageWidth - 32, 24, 4, 4, 'FD');
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${item.number}. ${item.title}`, 23, y + 9);
      doc.setTextColor(...statusColor);
      doc.text(statusText, pageWidth - 23, y + 9, { align: 'right' });
      doc.setTextColor(...colors.muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(result.detail, 23, y + 17, { maxWidth: pageWidth - 55 });
      y += 29;
    });

    doc.save('testwizard-complete-device-test-report.pdf');
  };

  const selectedResult = results[selected];
  const isLinkedTest = Boolean(step.href);
  const deviceSummary = useMemo(
    () => `${deviceInfo.mobile ? 'Mobile / tablet' : 'Laptop / desktop'} · ${deviceInfo.os} · ${deviceInfo.browser}`,
    [deviceInfo.mobile, deviceInfo.os, deviceInfo.browser],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Complete Device Test</span>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Check your device <span className="text-primary">one test at a time.</span>
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/60">
                One place to launch TestWizard&apos;s real keyboard, mouse, touchscreen, display, pixel, network, internet, audio and camera tests. The individual test pages remain the source of truth — this page simply brings them together.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-5 py-4 text-sm shadow-lg">
              <div className="text-foreground/45">Progress</div>
              <div className="mt-1 text-2xl font-bold text-primary">{completed}/{STEPS.length}</div>
              <div className="mt-1 text-xs text-foreground/45">{progress}% complete</div>
            </div>
          </div>

          <div className="mt-8 h-2 overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[310px_1fr]">
            <aside className="rounded-3xl border border-border bg-card p-3 shadow-xl">
              <div className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground/40">Test checklist</div>
              <div className="space-y-1">
                {STEPS.map((item, index) => {
                  const result = results[index];
                  const active = index === selected;
                  const statusMark = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '–' : item.number;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelected(index)}
                      className={`group w-full rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-primary/10 text-primary' : 'text-foreground/65 hover:bg-foreground/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${result.status === 'passed' ? 'border-emerald-400/40 text-emerald-400' : result.status === 'skipped' ? 'border-amber-400/40 text-amber-400' : 'border-border'}`}>
                          {statusMark}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{item.title}</span>
                          <span className="mt-0.5 block text-[11px] text-foreground/35">{item.category}</span>
                        </span>
                        {item.href && <span className="text-xs opacity-50">↗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground/45">{step.category}</span>
                <span className="text-xs font-bold text-foreground/40">Test {step.number} of {STEPS.length}</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold text-foreground">{step.title}</h2>
                {isLinkedTest && step.href && (
                  <Link
                    href={step.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary/15"
                  >
                    Open test ↗
                  </Link>
                )}
              </div>
              <p className="mt-3 max-w-3xl leading-7 text-foreground/60">{step.description}</p>

              {step.id === 'device' ? (
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Info label="Device" value={deviceInfo.mobile ? 'Mobile / tablet' : 'Laptop / desktop'} />
                  <Info label="Operating system" value={deviceInfo.os} />
                  <Info label="Browser" value={deviceInfo.browser} />
                  <Info label="Viewport" value={`${deviceInfo.width} × ${deviceInfo.height}`} />
                  <Info label="Touch" value={deviceInfo.touch ? 'Supported' : 'Not detected'} />
                  <Info label="Summary" value={deviceSummary} />
                </div>
              ) : (
                <div className="mt-7 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-primary">Use the existing TestWizard page</div>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/55">
                        This full-device page does not duplicate the test. Open the real test in a new tab, complete it there, then return here and mark it complete.
                      </p>
                    </div>
                    {step.href && (
                      <Link
                        href={step.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:brightness-110"
                      >
                        Start {step.title} ↗
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {step.id === 'device' && selectedResult.status === 'pending' && (
                  <button type="button" onClick={markDevicePassed} className="rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:brightness-110">
                    Confirm device overview
                  </button>
                )}
                {isLinkedTest && selectedResult.status === 'pending' && (
                  <button type="button" onClick={markLinkedComplete} className="rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:brightness-110">
                    Mark test complete
                  </button>
                )}
                {selectedResult.status === 'pending' && (
                  <button type="button" onClick={skip} className="rounded-xl border border-border px-6 py-3 font-semibold text-foreground/70 transition hover:border-primary/40 hover:text-foreground">
                    Skip
                  </button>
                )}
                {selected > 0 && (
                  <button type="button" onClick={selectPrevious} className="rounded-xl border border-border px-6 py-3 font-semibold text-foreground/70 transition hover:border-primary/40 hover:text-foreground">
                    ← Previous
                  </button>
                )}
                {selectedResult.status !== 'pending' && selected < STEPS.length - 1 && (
                  <button type="button" onClick={selectNext} className="rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:brightness-110">
                    Next test →
                  </button>
                )}
              </div>

              {selectedResult.status !== 'pending' && (
                <div className="mt-6 rounded-xl border border-border bg-background px-4 py-3 text-sm">
                  <span className={`font-bold ${selectedResult.status === 'passed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedResult.status === 'passed' ? 'COMPLETED' : 'SKIPPED'}
                  </span>
                  <span className="ml-3 text-foreground/60">{selectedResult.detail}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard label="Completed" value={String(passed)} />
            <SummaryCard label="Skipped" value={String(skipped)} />
            <SummaryCard label="Remaining" value={String(STEPS.length - completed)} />
          </div>

          {allDone && (
            <div className="mt-8 rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-8">
              <h2 className="text-2xl font-bold">Device test checklist complete.</h2>
              <p className="mx-auto mt-2 max-w-2xl text-foreground/55">
                All {STEPS.length} tests have been marked completed or skipped. You can save the checklist and device information as one PDF report.
              </p>
              <button type="button" onClick={finishAndPdf} className="mt-5 rounded-xl bg-primary px-7 py-3 font-bold text-black transition hover:brightness-110">
                Download PDF report
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="text-xs uppercase tracking-wider text-foreground/40">{label}</div>
      <div className="mt-1 font-semibold text-foreground">{value || 'Detecting…'}</div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-foreground/40">{label}</div>
      <div className="mt-2 text-2xl font-black text-primary">{value}</div>
    </div>
  );
}
