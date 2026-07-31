import { Language } from '@/types';

type TranslationKey = string;

const translations: Record<TranslationKey, { en: string; km: string }> = {
  // App
  'app.name': { en: 'Pause, Check, Share', km: 'ឈប់, ពិនិត្យ, ចែករំលែក' },
  'app.tagline': { en: 'Think before you share', km: 'គិតមុននឹងចែករំលែក' },

  // Navigation
  'nav.home': { en: 'Home', km: 'ទំព័រដើម' },
  'nav.verify': { en: 'Verify', km: 'ពិនិត្យ' },
  'nav.learn': { en: 'Learn', km: 'រៀន' },
  'nav.scam': { en: 'Scam Check', km: 'ពិនិត្យការបោក' },
  'nav.history': { en: 'History', km: 'ប្រវត្តិ' },
  'nav.profile': { en: 'Profile', km: 'គណនី' },

  // Home
  'home.welcome': { en: 'Welcome!', km: 'សូមស្វាគមន៍!' },
  'home.subtitle': { en: 'Check Before You Share', km: 'ពិនិត្យមុននឹងចែករំលែក' },
  'home.verify_btn': { en: '🔍 Verify Content', km: '🔍 ពិនិត្យមាតិកា' },
  'home.recent_scams': { en: 'Recent Scam Alerts', km: 'ការព្រមានការបោកថ្មីៗ' },
  'home.safety_tips': { en: 'Safety Tips', km: 'គន្លឹះសុវត្ថិភាព' },
  'home.see_all': { en: 'See All', km: 'មើលទាំងអស់' },

  // Verify
  'verify.title': { en: 'Verify Content', km: 'ពិនិត្យមាតិកា' },
  'verify.upload_tab': { en: 'Upload', km: 'បង្ហោះ' },
  'verify.link_tab': { en: 'Paste Link', km: 'បិទភ្ជាប់តំណ' },
  'verify.text_tab': { en: 'Type Text', km: 'វាយអក្សរ' },
  'verify.upload_hint': { en: 'Tap to upload image, video or screenshot', km: 'ចុចដើម្បីបង្ហោះរូបភាព វីដេអូ ឬ Screenshot' },
  'verify.link_hint': { en: 'Paste Facebook, TikTok or YouTube link', km: 'បិទភ្ជាប់តំណ Facebook, TikTok ឬ YouTube' },
  'verify.text_hint': { en: 'Type or paste a suspicious message here', km: 'វាយ ឬ បិទភ្ជាប់សារគួរអោយសង្ស័យ' },
  'verify.analyze_btn': { en: 'Analyze Now', km: 'វិភាគឥឡូវ' },
  'verify.analyzing': { en: 'Analyzing content...', km: 'កំពុងវិភាគ...' },
  'verify.placeholder_link': { en: 'https://www.facebook.com/...', km: 'https://www.facebook.com/...' },
  'verify.placeholder_text': { en: 'Paste the suspicious message here...', km: 'បិទភ្ជាប់សារគួរអោយសង្ស័យនៅទីនេះ...' },

  // Result
  'result.title': { en: 'Analysis Result', km: 'លទ្ធផលវិភាគ' },
  'result.reliable': { en: '🟢 Likely Reliable', km: '🟢 ទំនងជាគួរអោយទុកចិត្ត' },
  'result.needs_verification': { en: '🟡 Needs Verification', km: '🟡 ត្រូវការពិនិត្យបន្ថែម' },
  'result.potentially_misleading': { en: '🔴 Potentially Misleading', km: '🔴 អាចបំភ្លើស' },
  'result.warning_signs': { en: 'Warning Signs Detected', km: 'សញ្ញាព្រមានដែលបានរកឃើញ' },
  'result.why_suspicious': { en: 'Why This May Be Suspicious', km: 'ហេតុអ្វីវាអាចជាការសង្ស័យ' },
  'result.what_to_do': { en: 'What To Do Next', km: 'អ្វីដែលត្រូវធ្វើបន្ទាប់' },
  'result.save': { en: 'Save Result', km: 'រក្សាទុក' },
  'result.share': { en: 'Share Warning', km: 'ចែករំលែកការព្រមាន' },
  'result.check_again': { en: 'Check Another', km: 'ពិនិត្យដូចគ្នាទៀត' },
  'result.disclaimer': { en: 'AI analysis is not 100% accurate. Always verify from official sources.', km: 'ការវិភាគ AI មិនត្រឹមត្រូវ 100%។ សូមមើលជានិច្ចពីប្រភពផ្លូវការ។' },

  // Learn
  'learn.title': { en: 'Learn', km: 'រៀន' },
  'learn.subtitle': { en: 'Short lessons to stay safe online', km: 'មេរៀនខ្លីដើម្បីការពារខ្លួននៅអនឡាញ' },
  'learn.min': { en: 'min', km: 'នាទី' },
  'learn.start': { en: 'Start Lesson', km: 'ចាប់ផ្ដើមមេរៀន' },
  'learn.continue': { en: 'Continue', km: 'បន្ត' },
  'learn.completed': { en: 'Completed', km: 'បានបញ្ចប់' },
  'learn.next': { en: 'Next', km: 'បន្ទាប់' },
  'learn.finish': { en: 'Finish', km: 'បញ្ចប់' },
  'learn.quiz_title': { en: 'Quick Quiz', km: 'សំណួរ' },
  'learn.correct': { en: '✅ Correct!', km: '✅ ត្រឹមត្រូវ!' },
  'learn.incorrect': { en: '❌ Not quite.', km: '❌ មិនត្រឹមត្រូវ។' },

  // Scam Checker
  'scam.title': { en: 'Scam Checker', km: 'ពិនិត្យការបោក' },
  'scam.subtitle': { en: 'Upload suspicious messages or chats', km: 'បង្ហោះសារ ឬ ការជជែកដែលគួរអោយសង្ស័យ' },
  'scam.upload_btn': { en: 'Upload Screenshot', km: 'បង្ហោះ Screenshot' },
  'scam.type_btn': { en: 'Type Message', km: 'វាយសារ' },
  'scam.analyze_btn': { en: 'Check for Scam', km: 'ពិនិត្យការបោក' },
  'scam.red_flags': { en: 'Red Flags Found', km: 'សញ្ញាគួរអោយប្រុងប្រយ័ត្ន' },
  'scam.recommendation': { en: 'Our Recommendation', km: 'ការណែនាំរបស់យើង' },

  // History
  'history.title': { en: 'History', km: 'ប្រវត្តិ' },
  'history.empty': { en: 'No checks yet', km: 'មិនទាន់មានការពិនិត្យ' },
  'history.empty_sub': { en: 'Start verifying content to see your history', km: 'ចាប់ផ្ដើមពិនិត្យមាតិកា ដើម្បីមើលប្រវត្តិ' },

  // Profile
  'profile.title': { en: 'Profile & Settings', km: 'ការកំណត់' },
  'profile.language': { en: 'Language', km: 'ភាសា' },
  'profile.large_text': { en: 'Large Text Mode', km: 'អក្សរធំ' },
  'profile.voice': { en: 'Voice Reading', km: 'អានជាសំឡេង' },
  'profile.dark_mode': { en: 'Dark Mode', km: 'របៀបងងឹត' },
  'profile.about': { en: 'About This App', km: 'អំពីកម្មវិធី' },
  'profile.help': { en: 'Help & Support', km: 'ជំនួយ' },
  'profile.version': { en: 'Version 1.0.0', km: 'កំណែ 1.0.0' },

  // Onboarding
  'onboarding.skip': { en: 'Skip', km: 'រំលង' },
  'onboarding.next': { en: 'Next', km: 'បន្ទាប់' },
  'onboarding.get_started': { en: "Let's Get Started", km: 'ចាប់ផ្ដើម' },
  'onboarding.slide1_title': { en: 'Pause Before You Share', km: 'ឈប់មុននឹងចែករំលែក' },
  'onboarding.slide1_body': { en: 'Fake news and scams spread fast on Facebook, TikTok and Messenger. We help you check first.', km: 'ព័ត៌មានក្លែងក្លាយ និងការបោក រីករាលដាលលឿននៅ Facebook, TikTok និង Messenger។ យើងជួយអ្នកពិនិត្យជាមុន។' },
  'onboarding.slide2_title': { en: 'Check Any Content', km: 'ពិនិត្យមាតិកាណាមួយ' },
  'onboarding.slide2_body': { en: 'Upload images, paste links, or type messages. Our AI spots warning signs instantly.', km: 'បង្ហោះរូបភាព បិទភ្ជាប់តំណ ឬ វាយសារ។ AI របស់យើងរកឃើញសញ្ញាព្រមានភ្លាមៗ។' },
  'onboarding.slide3_title': { en: 'Stay Safe Online', km: 'ប្រើប្រាស់ Internet ដោយសុវត្ថិភាព' },
  'onboarding.slide3_body': { en: 'Learn to spot fakes, protect your family, and share only trusted information.', km: 'រៀនស្គាល់ព័ត៌មានក្លែងក្លាយ ការពារក្រុមគ្រួសារ និងចែករំលែកតែព័ត៌មានដែលអាចទុកចិត្តបាន។' },

  // Common
  'common.loading': { en: 'Loading...', km: 'កំពុងផ្ទុក...' },
  'common.error': { en: 'Something went wrong', km: 'មានបញ្ហាកើតឡើង' },
  'common.retry': { en: 'Try Again', km: 'ព្យាយាមម្ដងទៀត' },
  'common.cancel': { en: 'Cancel', km: 'បោះបង់' },
  'common.done': { en: 'Got It!', km: 'យល់ហើយ!' },
  'common.today': { en: 'Today', km: 'ថ្ងៃនេះ' },
  'common.yesterday': { en: 'Yesterday', km: 'ម្សិលមិញ' },

  // Guide Modal
  'guide.title': { en: 'Quick Help Guide', km: 'ការណែនាំរហ័ស' },
  'guide.tab_link': { en: '🔗 Copy Link', km: '🔗 ចម្លងតំណ' },
  'guide.tab_screenshot': { en: '📸 Take Screenshot', km: '📸 ថតរូបអេក្រង់' },
  'guide.ios_link_s1': { en: '🔗 Tap and hold the link until a menu pops up.', km: '🔗 ចុចឱ្យជាប់លើតំណរហូតដល់ផ្ទាំងម៉ឺនុយបង្ហាញឡើង។' },
  'guide.ios_link_s2': { en: '✅ Tap "Copy Link" — then paste it into this app!', km: '✅ ចុចយក "ចម្លងតំណ" (Copy Link) — រួចបិទភ្ជាប់ក្នុងកម្មវិធីនេះ!' },
  'guide.android_link_s1': { en: '🔗 Tap and hold the link until a menu appears.', km: '🔗 ចុចឱ្យជាប់លើតំណរហូតដល់ផ្ទាំងម៉ឺនុយបង្ហាញឡើង។' },
  'guide.android_link_s2': { en: '✅ Tap "Copy link" — then paste it into this app!', km: '✅ ចុចយក "ចម្លងតំណ" (Copy Link) — រួចបិទភ្ជាប់ក្នុងកម្មវិធីនេះ!' },
  'guide.ios_ss_s1': { en: '⚡ Press Side button + Volume Up at the same time.', km: '⚡ ចុចប៊ូតុងចំហៀង + ប៊ូតុងបង្កើនសំឡេងក្នុងពេលតែមួយ។' },
  'guide.ios_ss_s2': { en: '📲 Tap the preview screenshot to save it.', km: '📲 ចុចលើរូបភាពតូចខាងក្រោមដើម្បីរក្សាទុក។' },
  'guide.android_ss_s1': { en: '⚡ Press Power + Volume Down buttons at the same time.', km: '⚡ ចុចប៊ូតុងបិទបើក + ប៊ូតុងបន្ថយសំឡេងក្នុងពេលតែមួយ។' },
  'guide.android_ss_s2': { en: '📲 Find your screenshot in your phone gallery.', km: '📲 ស្វែងរករូបភាព Screenshot របស់អ្នកក្នុងអាល់ប៊ុមរូបភាព។' },
};

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}

export function getLanguageLabel(lang: Language): string {
  return lang === 'km' ? 'ខ្មែរ' : 'English';
}
