'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, BookOpen, ShieldAlert, History, User } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';

const navItems = [
  { href: '/home', icon: Home, key: 'nav.home' },
  { href: '/verify', icon: Search, key: 'nav.verify' },
  { href: '/learn', icon: BookOpen, key: 'nav.learn' },
  { href: '/scam-checker', icon: ShieldAlert, key: 'nav.scam' },
  { href: '/history', icon: History, key: 'nav.history' },
  { href: '/profile', icon: User, key: 'nav.profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map(({ href, icon: Icon, key }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={t(key, lang)}
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 py-1 rounded-xl transition-all duration-200 min-h-[52px] ${
              active
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)]'
            }`}
            style={{ minWidth: 44 }}
          >
            <div className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${active ? 'bg-[var(--color-primary-light)]' : ''}`}>
              <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[var(--color-primary)]" />
              )}
            </div>
            <span className={`text-[10px] font-${active ? '700' : '500'} leading-tight`}
              style={{ fontFamily: lang === 'km' ? 'var(--font-khmer)' : 'var(--font-sans)', fontSize: lang === 'km' ? '9px' : '10px' }}>
              {t(key, lang)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
