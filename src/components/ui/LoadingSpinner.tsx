'use client';

export function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        style={{ width: size, height: size }}
        className="rounded-full border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] animate-spin"
      />
      <p className="text-sm text-muted font-medium animate-pulse">Analyzing...</p>
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

export function AnalyzingOverlay({ message, messageKm, lang }: { message: string; messageKm: string; lang: string }) {
  const steps = lang === 'km'
    ? ['កំពុងផ្ទៀងផ្ទាត់ប្រភព...', 'កំពុងស្វែងរកសញ្ញាព្រមាន...', 'កំពុងបង្កើតរបាយការណ៍...']
    : ['Checking sources...', 'Scanning for warning signs...', 'Generating report...'];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 px-4 text-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center pulse-ring">
          <span className="text-4xl">🔍</span>
        </div>
      </div>
      <div>
        <p className="text-lg font-bold text-[var(--color-text)] mb-1" style={{ fontFamily: lang === 'km' ? 'var(--font-khmer)' : 'inherit' }}>
          {lang === 'km' ? messageKm : message}
        </p>
        <p className="text-sm text-muted">AI-powered analysis</p>
      </div>
      <div className="w-full max-w-xs space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin shrink-0"
              style={{ animationDelay: `${i * 0.4}s`, animationDuration: '0.8s' }}
            />
            <span className="text-sm text-muted text-left" style={{ fontFamily: lang === 'km' ? 'var(--font-khmer)' : 'inherit' }}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
