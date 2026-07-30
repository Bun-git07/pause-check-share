import { ClassificationLevel } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';

interface ClassificationBadgeProps {
  level: ClassificationLevel;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG = {
  reliable: { className: 'badge-reliable', key: 'result.reliable', bg: 'var(--color-secondary-light)', border: 'var(--color-secondary)' },
  needs_verification: { className: 'badge-needs-verification', key: 'result.needs_verification', bg: 'var(--color-warning-light)', border: 'var(--color-warning)' },
  potentially_misleading: { className: 'badge-misleading', key: 'result.potentially_misleading', bg: 'var(--color-danger-light)', border: 'var(--color-danger)' },
};

export default function ClassificationBadge({ level, size = 'md' }: ClassificationBadgeProps) {
  const { settings } = useSettings();
  const config = CONFIG[level];
  const sizeClass = size === 'lg' ? 'text-lg py-2 px-5' : size === 'sm' ? 'text-xs py-1 px-3' : '';

  return (
    <span className={`${config.className} ${sizeClass}`}>
      {t(config.key, settings.language)}
    </span>
  );
}
