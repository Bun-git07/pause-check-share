'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';
import { LESSONS } from '@/lib/lessons';
import { QuizOption } from '@/types';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { settings } = useSettings();
  const lang = settings.language;
  const khmer = lang === 'km';

  const lesson = LESSONS.find(l => l.slug === params.slug);
  const [step, setStep] = useState(0); // 0 = slides, then quiz
  const [slideIdx, setSlideIdx] = useState(0);
  const [quizPhase, setQuizPhase] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!lesson) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted">Lesson not found.</p>
    </div>
  );

  const totalSlides = lesson.slides.length;
  const totalQuestions = lesson.quiz.length;
  const progress = quizPhase
    ? ((totalSlides + quizIdx) / (totalSlides + totalQuestions)) * 100
    : (slideIdx / (totalSlides + totalQuestions)) * 100;

  const currentSlide = lesson.slides[slideIdx];
  const currentQuestion = lesson.quiz[quizIdx];

  const SLIDE_COLORS: Record<string, string> = {
    intro: 'var(--color-primary)',
    warning: 'var(--color-danger)',
    tip: 'var(--color-secondary)',
    info: 'var(--color-warning)',
    example: '#7B1FA2',
  };

  const handleAnswer = (optId: string) => {
    if (showAnswer) return;
    setSelected(optId);
    setShowAnswer(true);
    if (optId === currentQuestion.correctOptionId) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (quizIdx + 1 < totalQuestions) {
      setQuizIdx(i => i + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setDone(true);
    }
  };

  // Done screen
  if (done) {
    return (
      <div className="min-h-screen bg-app flex flex-col">
        <TopBar title={khmer ? lesson.titleKm : lesson.title} showBack />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          <div className="text-8xl">🏆</div>
          <div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {lang === 'km' ? 'រួចរាល់ហើយ!' : 'Lesson Complete!'}
            </h2>
            <p className="text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {lang === 'km' ? `ពិន្ទុ: ${score}/${totalQuestions}` : `Score: ${score}/${totalQuestions}`}
            </p>
          </div>
          <div className="w-full max-w-xs space-y-3">
            <button onClick={() => router.push('/learn')} className="btn-primary">
              {lang === 'km' ? 'ត្រឡប់ទៅបញ្ជីមេរៀន' : 'Back to Lessons'}
            </button>
            <button onClick={() => router.push('/verify')} className="btn-secondary">
              {lang === 'km' ? 'ពិនិត្យមាតិកា' : 'Verify Content Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <TopBar title={khmer ? lesson.titleKm : lesson.title} showBack />

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!quizPhase ? (
          // Slide View
          <div className="p-5 space-y-4">
            <div
              className="rounded-2xl p-6 text-white space-y-3 min-h-40"
              style={{ background: SLIDE_COLORS[currentSlide.type] || 'var(--color-primary)' }}
            >
              <span className="text-xs uppercase tracking-wide opacity-70 font-semibold">{currentSlide.type}</span>
              <h2 className="text-xl font-extrabold leading-tight" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {khmer ? currentSlide.titleKm : currentSlide.title}
              </h2>
              <p className="text-sm opacity-90 leading-relaxed" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2.2 : 1.6 }}>
                {khmer ? currentSlide.contentKm : currentSlide.content}
              </p>
            </div>

            {(currentSlide.badExample || currentSlide.goodExample) && (
              <div className="space-y-2">
                {currentSlide.badExample && (
                  <div className="card p-4 border-[var(--color-danger)]" style={{ borderColor: 'var(--color-danger)', borderWidth: 1.5 }}>
                    <p className="text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                      {khmer ? currentSlide.badExampleKm : currentSlide.badExample}
                    </p>
                  </div>
                )}
                {currentSlide.goodExample && (
                  <div className="card p-4" style={{ borderColor: 'var(--color-secondary)', borderWidth: 1.5 }}>
                    <p className="text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', whiteSpace: 'pre-line' }}>
                      {khmer ? currentSlide.goodExampleKm : currentSlide.goodExample}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {slideIdx > 0 && (
                <button onClick={() => setSlideIdx(i => i - 1)} className="btn-ghost flex-none w-14 border border-[var(--color-border)]">
                  <ChevronLeft size={20} />
                </button>
              )}
              <button
                onClick={() => {
                  if (slideIdx + 1 < totalSlides) setSlideIdx(i => i + 1);
                  else { setQuizPhase(true); }
                }}
                className="btn-primary flex-1"
              >
                {slideIdx + 1 < totalSlides ? (
                  <><span style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>{t('learn.next', lang)}</span><ChevronRight size={18} /></>
                ) : (
                  <span style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>{lang === 'km' ? '🧠 ពេលសំណួរ' : '🧠 Take Quiz'}</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Quiz View
          <div className="p-5 space-y-4">
            <div className="card p-4 gradient-primary text-white rounded-2xl">
              <p className="text-xs opacity-70 mb-1">{t('learn.quiz_title', lang)} {quizIdx + 1}/{totalQuestions}</p>
              <p className="font-bold text-base leading-snug" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.5 }}>
                {khmer ? currentQuestion.questionKm : currentQuestion.question}
              </p>
            </div>

            <div className="space-y-2">
              {currentQuestion.options.map((opt: QuizOption) => {
                const isCorrect = opt.id === currentQuestion.correctOptionId;
                const isSelected = opt.id === selected;
                let bg = 'var(--color-surface)';
                let border = 'var(--color-border)';
                if (showAnswer && isCorrect) { bg = 'var(--color-secondary-light)'; border = 'var(--color-secondary)'; }
                else if (showAnswer && isSelected && !isCorrect) { bg = 'var(--color-danger-light)'; border = 'var(--color-danger)'; }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    className="w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-200 border-2"
                    style={{ background: bg, borderColor: border }}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm ${isSelected ? 'border-current' : 'border-[var(--color-border)]'}`}>
                      {opt.id.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.4 }}>
                      {khmer ? opt.textKm : opt.text}
                    </span>
                    {showAnswer && isCorrect && <CheckCircle size={20} className="ml-auto shrink-0" color="var(--color-secondary)" />}
                    {showAnswer && isSelected && !isCorrect && <XCircle size={20} className="ml-auto shrink-0" color="var(--color-danger)" />}
                  </button>
                );
              })}
            </div>

            {showAnswer && (
              <div className="card p-4 space-y-3" style={{ borderColor: selected === currentQuestion.correctOptionId ? 'var(--color-secondary)' : 'var(--color-danger)', borderWidth: 1.5 }}>
                <p className="font-bold" style={{ color: selected === currentQuestion.correctOptionId ? 'var(--color-secondary)' : 'var(--color-danger)', fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {selected === currentQuestion.correctOptionId ? t('learn.correct', lang) : t('learn.incorrect', lang)}
                </p>
                <p className="text-sm text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.5 }}>
                  {khmer ? currentQuestion.explanationKm : currentQuestion.explanation}
                </p>
                <button onClick={nextQuestion} className="btn-primary">
                  {quizIdx + 1 < totalQuestions
                    ? <><span style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>{t('learn.next', lang)}</span><ChevronRight size={18} /></>
                    : <><Trophy size={18} /><span style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>{t('learn.finish', lang)}</span></>
                  }
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
