'use client';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';
import { LESSONS } from '@/lib/lessons';

export default function LearnPage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const khmer = lang === 'km';

  return (
    <div className="min-h-screen bg-app">
      <TopBar title={t('learn.title', lang)} titleKm="រៀន" />

      <div className="page-content space-y-4">
        {/* Header */}
        <div className="card p-4 gradient-primary text-white rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📚</div>
            <div>
              <h2 className="font-extrabold text-lg" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('learn.title', lang)}
              </h2>
              <p className="text-sm opacity-85" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('learn.subtitle', lang)}
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {LESSONS.length} {lang === 'km' ? 'មេរៀន' : 'Lessons'}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              &lt; 3 {t('learn.min', lang)}
            </span>
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-3">
          {LESSONS.map((lesson, idx) => (
            <Link key={lesson.id} href={`/learn/${lesson.slug}`}>
              <div className="card p-4 flex items-center gap-4 card-hover cursor-pointer">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: 'var(--color-primary-light)' }}>
                  {lesson.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-muted">
                      {lang === 'km' ? `មេរៀន ${idx + 1}` : `Lesson ${idx + 1}`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary-dark)' }}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p className="font-bold text-sm leading-snug mb-1"
                    style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                    {khmer ? lesson.titleKm : lesson.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    <span style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                      {lesson.duration} {t('learn.min', lang)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {lesson.completed
                    ? <CheckCircle size={24} color="var(--color-secondary)" />
                    : <div className="w-6 h-6 rounded-full border-2 border-[var(--color-border)]" />
                  }
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
