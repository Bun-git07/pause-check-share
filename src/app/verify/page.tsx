'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Link as LinkIcon, MessageSquare, Image, Video, FileText } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { AnalyzingOverlay } from '@/components/ui/LoadingSpinner';
import GuideModal from '@/components/ui/GuideModal';
import { useSettings } from '@/contexts/SettingsContext';
import { useHistory } from '@/contexts/HistoryContext';
import { t } from '@/lib/i18n';
import { analyzeContent } from '@/lib/mockAI';
import { ContentType } from '@/types';

type Tab = 'upload' | 'link' | 'text';

const LINK_TYPES: { label: string; labelKm: string; placeholder: string; type: ContentType }[] = [
  { label: 'Facebook', labelKm: 'Facebook', placeholder: 'https://www.facebook.com/...', type: 'facebook_link' },
  { label: 'TikTok', labelKm: 'TikTok', placeholder: 'https://www.tiktok.com/...', type: 'tiktok_link' },
  { label: 'YouTube', labelKm: 'YouTube', placeholder: 'https://www.youtube.com/...', type: 'youtube_link' },
];

export default function VerifyPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { addToHistory } = useHistory();
  const lang = settings.language;
  const khmer = lang === 'km';

  const [tab, setTab] = useState<Tab>('upload');
  const [linkType, setLinkType] = useState(0);
  const [linkInput, setLinkInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideDefaultTab, setGuideDefaultTab] = useState<'link' | 'screenshot'>('link');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    } else {
      setUploadPreview('');
    }
  };

  const canAnalyze = () => {
    if (tab === 'upload') return !!uploadedFile;
    if (tab === 'link') return linkInput.trim().length > 5;
    if (tab === 'text') return textInput.trim().length > 5;
    return false;
  };

  const handleAnalyze = async () => {
    if (!canAnalyze()) return;
    setAnalyzing(true);
    try {
      let input = '';
      let type: ContentType = 'text';
      if (tab === 'upload' && uploadedFile) {
        input = uploadedFile.name;
        type = uploadedFile.type.startsWith('video/') ? 'video' : 'image';
      } else if (tab === 'link') {
        input = linkInput.trim();
        if (/tiktok\.com|vt\.tiktok/i.test(input)) {
          type = 'tiktok_link';
        } else if (/youtube\.com|youtu\.be/i.test(input)) {
          type = 'youtube_link';
        } else if (/facebook\.com|fb\.watch|fb\.com/i.test(input)) {
          type = 'facebook_link';
        } else {
          type = LINK_TYPES[linkType].type;
        }
      } else {
        input = textInput.trim();
        type = 'messenger_message';
      }
      const result = await analyzeContent(input, type);
      addToHistory(result, type, input.slice(0, 80));
      // Store result for result page
      sessionStorage.setItem('latest_result', JSON.stringify(result));
      router.push('/verify/result');
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-app flex flex-col">
        <TopBar title="Verify Content" titleKm="ពិនិត្យមាតិកា" />
        <div className="flex-1 flex items-center justify-center">
          <AnalyzingOverlay
            message="Analyzing content..."
            messageKm="កំពុងវិភាគ..."
            lang={lang}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <TopBar title={t('verify.title', lang)} titleKm="ពិនិត្យមាតិកា" />

      <div className="page-content space-y-5">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-[var(--color-border)] rounded-2xl">
          {(['upload', 'link', 'text'] as Tab[]).map(tabId => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === tabId
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                  : 'text-[var(--color-text-muted)]'
              }`}
              style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', fontSize: khmer ? '13px' : '14px' }}
            >
              {tabId === 'upload' ? t('verify.upload_tab', lang) :
               tabId === 'link' ? t('verify.link_tab', lang) :
               t('verify.text_tab', lang)}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {tab === 'upload' && (
          <div className="space-y-4">
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
            {!uploadedFile ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-3 border-dashed border-[var(--color-primary)] rounded-2xl p-10 flex flex-col items-center gap-4 transition-all hover:bg-[var(--color-primary-light)] active:scale-95"
                style={{ borderWidth: 3 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
                  <Upload size={36} color="var(--color-primary)" />
                </div>
                <p className="text-base font-bold text-[var(--color-primary)] text-center" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {t('verify.upload_hint', lang)}
                </p>
                <div className="flex gap-3 text-muted text-sm">
                  <span className="flex items-center gap-1"><Image size={14} />{lang === 'km' ? 'រូបភាព' : 'Image'}</span>
                  <span className="flex items-center gap-1"><Video size={14} />{lang === 'km' ? 'វីដេអូ' : 'Video'}</span>
                  <span className="flex items-center gap-1"><FileText size={14} />Screenshot</span>
                </div>
              </button>
            ) : (
              <div className="card p-4 space-y-3">
                {uploadPreview && (
                  <img src={uploadPreview} alt="Preview" className="w-full rounded-xl max-h-64 object-cover" />
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
                    {uploadedFile.type.startsWith('video/') ? <Video size={20} color="var(--color-primary)" /> : <Image size={20} color="var(--color-primary)" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-muted">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => { setUploadedFile(null); setUploadPreview(''); }} className="text-[var(--color-danger)] text-sm font-medium">
                    {t('common.cancel', lang)}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Link Tab */}
        {tab === 'link' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {LINK_TYPES.map((lt, i) => (
                <button
                  key={i}
                  onClick={() => setLinkType(i)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    linkType === i
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-muted'
                  }`}
                >
                  {lt.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="url"
                value={linkInput}
                onChange={e => setLinkInput(e.target.value)}
                placeholder={LINK_TYPES[linkType].placeholder}
                className="input-field pl-11"
                style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
              />
            </div>
          </div>
        )}

        {/* Text Tab */}
        {tab === 'text' && (
          <div className="space-y-3">
            <div className="relative">
              <MessageSquare size={18} className="absolute left-4 top-4 text-muted" />
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder={t('verify.placeholder_text', lang)}
                rows={6}
                className="input-field pl-11 resize-none"
                style={{ minHeight: 140, fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.6 }}
              />
            </div>
            <p className="text-xs text-muted text-right">{textInput.length} chars</p>
          </div>
        )}

        {/* Info & Guide banner */}
        <div className="flex items-center justify-between card p-4 bg-[var(--color-primary-light)]" style={{ border: '1.5px solid var(--color-primary)' }}>
          <p className="text-sm font-medium text-[var(--color-primary)] flex-1 mr-2" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
            {lang === 'km'
              ? '🔒 AI របស់យើងនឹងមិននិយាយថាមាតិការ 100% ក្លែងក្លាយ។ វានឹងជួយអ្នករកឃើញសញ្ញាព្រមានប៉ុណ្ណោះ។'
              : '🔒 Our AI will never say content is 100% fake. It helps you spot warning signs only.'}
          </p>
          <button
            onClick={() => {
              setGuideDefaultTab(tab === 'link' ? 'link' : 'screenshot');
              setGuideOpen(true);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 shrink-0"
            style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
          >
            💡 {lang === 'km' ? 'របៀបប្រើ?' : 'How to?'}
          </button>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze()}
          className="btn-primary text-lg"
        >
          🔍 {t('verify.analyze_btn', lang)}
        </button>
      </div>

      <GuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        defaultTab={guideDefaultTab}
      />

      <BottomNav />
    </div>
  );
}
