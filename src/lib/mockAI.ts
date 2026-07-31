import {
  AnalysisResult,
  ClassificationLevel,
  ContentType,
  WarningSign,
  Recommendation,
} from '@/types';

export const CHASCHECKER_SYSTEM_PROMPT_V2 = `# SYSTEM PROMPT — CHASCHECKER AI v2

You are ChasChecker AI.

You are an expert digital safety analyst specializing in:

• Cybersecurity
• Malware detection
• Scam detection
• Misinformation
• Phishing
• Social engineering
• Fraud prevention
• Digital literacy

Your mission is to protect users by identifying potential online threats while remaining factual and evidence-based.

Never guess.
Never invent evidence.
Never label something malicious unless there are observable indicators.
When uncertain, clearly state the uncertainty.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYZE EVERYTHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For every uploaded screenshot, image, PDF, webpage, document, text, or URL:
Carefully inspect every visible element.
Extract and analyze:
• filenames
• file extensions
• links
• QR codes
• logos
• usernames
• profile names
• phone numbers
• email addresses
• download buttons
• warning messages
• timestamps
• advertisements
• attachments
• software names
• application windows
• browser tabs
• icons
• error messages
• payment requests

Never ignore small details.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTABLE FILE DETECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you detect:
.exe, .msi, .bat, .cmd, .scr, .ps1, .vbs, .jar, .apk, .iso, .dmg, .pkg

Immediately create a HIGH PRIORITY warning.
Example: 🚨 Executable File Detected

Explain:
Executable files can install or run software on a device. They are not automatically malicious, but users should only run them when they originate from trusted and verified sources.

Increase overall risk score when combined with suspicious context (unknown sender, messaging attachments, urgency, fake invoices, OTP requests, fake updates, etc.).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK SCORING & OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calculate overall score from 0–100:
0–20: 🟢 Safe
21–40: 🟡 Low Risk
41–60: 🟠 Suspicious
61–80: 🔴 High Risk
81–100: 🚨 Critical

Return Markdown in this structure:
# Analysis Summary
Risk Level: ...
Risk Score: 0–100
---
## Summary
...
---
## Detected Red Flags
- 🚩 ...
---
## Detailed Findings
Severity: / Reason: / Evidence:
---
## Recommendations
...
---
## Confidence
High / Medium / Low
`;

// ---- Warning Signs Library ----
const ALL_WARNING_SIGNS: WarningSign[] = [
  {
    id: 'no_source',
    icon: '🔍',
    title: 'No Credible Source',
    titleKm: 'គ្មានប្រភពគួរអោយទុកចិត្ត',
    description: 'The content does not cite any verifiable news outlet or official organization.',
    descriptionKm: 'មាតិកានេះមិនបានដក្ស្រង់ពីប្រភពព័ត៌មានអាចផ្ទៀងផ្ទាត់បាន ឬ អង្គការផ្លូវការ។',
    severity: 'high',
  },
  {
    id: 'emotional_language',
    icon: '😱',
    title: 'Emotional or Alarming Language',
    titleKm: 'ភាសាទំទើប ឬ គួរអោយភ័យ',
    description: 'Words like "URGENT", "SHOCKING", or "You won\'t believe" are used to trigger emotional reactions.',
    descriptionKm: 'ពាក្យដូចជា "បន្ទាន់", "គួរអោយភ្ញាក់" ត្រូវបានប្រើដើម្បីបង្ក reaction អារម្មណ៍។',
    severity: 'medium',
  },
  {
    id: 'money_request',
    icon: '💰',
    title: 'Requests Money or Personal Info',
    titleKm: 'សូមប្រាក់ ឬ ព័ត៌មានផ្ទាល់ខ្លួន',
    description: 'The message asks you to send money, provide bank details, or share passwords.',
    descriptionKm: 'សារស្នើអ្នកផ្ញើប្រាក់ ផ្ដល់ព័ត៌មានធនាគារ ឬ ចែករំលែកពាក្យសម្ងាត់។',
    severity: 'high',
  },
  {
    id: 'fake_logo',
    icon: '🏛️',
    title: 'Fake Government or Official Logo',
    titleKm: 'ស្លាក/និមិត្តសញ្ញារដ្ឋាភិបាល ឬ ផ្លូវការក្លែងក្លាយ',
    description: 'The logo looks unofficial, pixelated, or slightly different from the real organization.',
    descriptionKm: 'ស្លាកមើលទៅអក្រក់ ឬ ខុសបន្តិចពីស្ថាប័នពិត។',
    severity: 'high',
  },
  {
    id: 'ai_artifacts',
    icon: '🤖',
    title: 'AI-Generated Image Artifacts',
    titleKm: 'សញ្ញានៃរូបភាពបង្កើតដោយ AI',
    description: 'The image shows unnatural skin texture, distorted hands, or blurry backgrounds typical of AI generation.',
    descriptionKm: 'រូបភាពបង្ហាញស្បែក ដៃ ឬ ផ្ទៃខាងក្រោយខុសធម្មតា ដែលជាលក្ខណៈរូបភាព AI។',
    severity: 'medium',
  },
  {
    id: 'edited_video',
    icon: '🎬',
    title: 'Possibly Edited Video',
    titleKm: 'វីដេអូអាចត្រូវបានកែសម្រួល',
    description: 'The video shows signs of editing, lip-sync mismatch, or unnatural movements.',
    descriptionKm: 'វីដេអូបង្ហាញសញ្ញានៃការកែ ការខុស sync បបូរមាត់ ឬ ចលនាមិនធម្មជាតិ។',
    severity: 'high',
  },
  {
    id: 'clickbait',
    icon: '📢',
    title: 'Clickbait Headline',
    titleKm: 'ចំណងជើងគួរអោយចុច (Clickbait)',
    description: 'The headline is designed to make you click without providing real information.',
    descriptionKm: 'ចំណងជើងត្រូវបានរចនាឡើងដើម្បីអោយអ្នកចុច ដោយមិនផ្ដល់ព័ត៌មានពិត។',
    severity: 'medium',
  },
  {
    id: 'missing_context',
    icon: '🔎',
    title: 'Missing Context',
    titleKm: 'ខ្វះបរិបទ',
    description: 'Important context is missing, which could change the meaning of the content completely.',
    descriptionKm: 'ខ្វះបរិបទសំខាន់ ដែលអាចប្ដូរអត្ថន័យទាំងស្រុងនៃមាតិកា។',
    severity: 'medium',
  },
  {
    id: 'too_good',
    icon: '🎁',
    title: 'Too Good to Be True',
    titleKm: 'ល្អហួសប្រមាណ',
    description: 'The offer or claim seems unrealistically beneficial — free gifts, lottery wins, or miracle cures.',
    descriptionKm: 'ការផ្ដល់ជូន ឬ ការអះអាង ហាក់ដូចជាល្អហួសប្រមាណ — អំណោយឥតគិតថ្លៃ ឈ្នះឆ្នោត ឬ ថ្នាំព្យាបាល។',
    severity: 'high',
  },
  {
    id: 'urgency',
    icon: '⚡',
    title: 'Creates False Urgency',
    titleKm: 'បង្កើតភាពបន្ទាន់ក្លែងក្លាយ',
    description: 'The content pressures you to act immediately without giving you time to think.',
    descriptionKm: 'មាតិកាជំរុញអ្នកអោយធ្វើសកម្មភាពភ្លាមៗ ដោយមិនផ្ដល់ពេលអ្នកគិត។',
    severity: 'medium',
  },
];

// ---- Recommendations Library ----
const ALL_RECOMMENDATIONS: Recommendation[] = [
  { id: 'dont_share', icon: '🚫', text: 'Do NOT share this content yet', textKm: 'កុំចែករំលែកមាតិកានេះ' },
  { id: 'check_source', icon: '🔍', text: 'Look for the original source', textKm: 'ស្វែងរកប្រភពដើម' },
  { id: 'check_official', icon: '🏛️', text: 'Visit the official government or organization website', textKm: 'ចូលទៅកាន់គេហទំព័ររដ្ឋាភិបាល ឬ ស្ថាប័នផ្លូវការ' },
  { id: 'ask_trusted', icon: '👥', text: 'Ask a trusted family member or friend', textKm: 'សួរសមាជិកគ្រួសារ ឬ មិត្តភ័ក្ដិដែលអាចទុកចិត្ត' },
  { id: 'reverse_search', icon: '🖼️', text: 'Reverse image search on Google', textKm: 'ស្វែងរករូបភាពដោយ Google' },
  { id: 'dont_click', icon: '⚠️', text: 'Do NOT click any links in this message', textKm: 'កុំចុចតំណណាក្នុងសារ' },
  { id: 'report', icon: '🚨', text: 'Report this to Facebook or the platform', textKm: 'រាយការណ៍ទៅ Facebook ឬ វេទិកា' },
  { id: 'protect_info', icon: '🔐', text: 'Never give out personal or banking info', textKm: 'មិនត្រូវផ្ដល់ព័ត៌មានផ្ទាល់ខ្លួន ឬ ធនាគារ' },
  { id: 'safe_to_share', icon: '✅', text: 'This appears safe to share, but always use your judgment', textKm: 'ហាក់ដូចជាអាចចែករំលែកបាន តែប្រើការវិនិច្ឆ័យផ្ទាល់ខ្លួនជានិច្ច' },
  { id: 'verify_health', icon: '💊', text: 'Verify health claims with a licensed doctor', textKm: 'ពិនិត្យការអះអាងសុខភាពជាមួយវេជ្ជបណ្ឌិត' },
];

// ---- Mock Analysis Logic ----
function detectWarnings(input: string, type: ContentType): WarningSign[] {
  const lower = input.toLowerCase();
  const selected: WarningSign[] = [];

  if (type === 'image' || type === 'screenshot') selected.push(ALL_WARNING_SIGNS[4]);
  if (type === 'video') selected.push(ALL_WARNING_SIGNS[5]);
  if (/money|bank|dollar|transfer|prize|lottery|win|reward|free/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[2], ALL_WARNING_SIGNS[8]);
  }
  if (/urgent|immediately|act now|limited time|deadline/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[9]);
  }
  if (/shocking|unbelievable|you won't believe|breaking|secret/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[1], ALL_WARNING_SIGNS[6]);
  }
  if (/government|ministry|official|police|nbc|cambodia/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[3]);
  }
  if (type === 'facebook_link' || type === 'tiktok_link' || type === 'youtube_link') {
    selected.push(ALL_WARNING_SIGNS[0], ALL_WARNING_SIGNS[7]);
  }
  if (/health|cure|treatment|medicine|doctor|covid/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[7]);
  }
  if (selected.length === 0) {
    selected.push(ALL_WARNING_SIGNS[0]);
  }
  return selected.slice(0, 4);
}

function classifyContent(input: string, type: ContentType, warnings: WarningSign[]): ClassificationLevel {
  const highSeverityCount = warnings.filter(w => w.severity === 'high').length;
  const lower = input.toLowerCase();

  if (
    highSeverityCount >= 2 ||
    /scam|fraud|fake|phishing|hack|steal|transfer money/i.test(lower)
  ) {
    return 'potentially_misleading';
  }
  if (
    highSeverityCount === 1 ||
    warnings.length >= 2 ||
    type === 'video' ||
    /urgent|prize|win|lottery/i.test(lower)
  ) {
    return 'needs_verification';
  }
  return 'reliable';
}

function buildRecommendations(classification: ClassificationLevel, warnings: WarningSign[]): Recommendation[] {
  if (classification === 'potentially_misleading') {
    return [ALL_RECOMMENDATIONS[0], ALL_RECOMMENDATIONS[1], ALL_RECOMMENDATIONS[6], ALL_RECOMMENDATIONS[7]];
  }
  if (classification === 'needs_verification') {
    const hasMoneyWarning = warnings.some(w => w.id === 'money_request');
    const recs = [ALL_RECOMMENDATIONS[0], ALL_RECOMMENDATIONS[1], ALL_RECOMMENDATIONS[3]];
    if (hasMoneyWarning) recs.push(ALL_RECOMMENDATIONS[7]);
    return recs;
  }
  return [ALL_RECOMMENDATIONS[8], ALL_RECOMMENDATIONS[1]];
}

function buildExplanation(classification: ClassificationLevel, warnings: WarningSign[], type: ContentType): string {
  if (classification === 'potentially_misleading') {
    return `This ${type.replace('_', ' ')} shows multiple strong warning signs. The combination of ${warnings.map(w => w.title.toLowerCase()).join(', ')} suggests this content may be designed to mislead or deceive. However, our AI cannot determine with 100% certainty — please verify from official sources before drawing conclusions.`;
  }
  if (classification === 'needs_verification') {
    return `This content has some characteristics worth investigating. We found ${warnings.length} warning sign(s): ${warnings.map(w => w.title).join(', ')}. This does not mean it is definitely false — more verification is recommended before sharing.`;
  }
  return `This content did not trigger major warning signs in our analysis. It appears relatively safe, but remember that no AI tool is perfect. Always check official sources for important topics like health, finance, and government news.`;
}

function buildExplanationKm(classification: ClassificationLevel, warnings: WarningSign[]): string {
  if (classification === 'potentially_misleading') {
    return `មាតិកានេះបង្ហាញសញ្ញាព្រមានច្រើន។ ការរួមបញ្ចូល ${warnings.map(w => w.titleKm).join('، ')} ចង្អុលបង្ហាញថាមាតិកានេះអាចត្រូវបានរចនាដើម្បីបំភ្លើស។ AI របស់យើងមិនអាចកំណត់បាន 100% — សូមផ្ទៀងផ្ទាត់ពីប្រភពផ្លូវការ។`;
  }
  if (classification === 'needs_verification') {
    return `មាតិកានេះមានលក្ខណៈដែលត្រូវស៊ើបអង្កេតបន្ថែម។ យើងរកឃើញ ${warnings.length} សញ្ញាព្រមាន។ នេះមិនមានន័យថាវាក្លែងក្លាយ — ការផ្ទៀងផ្ទាត់បន្ថែមត្រូវបានណែនាំ។`;
  }
  return `មាតិកានេះមិនបង្ក trigger សញ្ញាព្រមានធំៗ។ វាហាក់ដូចជាសុវត្ថិភាព តែ AI គ្មានភាពល្អឥតខ្ចោះ។ ពិនិត្យប្រភពផ្លូវការជានិច្ចសម្រាប់ប្រធានបទដូចជា សុខភាព ហិរញ្ញវត្ថុ និង ព័ត៌មានរដ្ឋាភិបាល។`;
}

// ---- Main Export ----
export async function analyzeContent(
  input: string,
  type: ContentType
): Promise<AnalysisResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1000));

  const warnings = detectWarnings(input, type);
  const classification = classifyContent(input, type, warnings);
  const recommendations = buildRecommendations(classification, warnings);
  const confidence = classification === 'reliable' ? 72 + Math.floor(Math.random() * 15) :
    classification === 'needs_verification' ? 55 + Math.floor(Math.random() * 20) :
      75 + Math.floor(Math.random() * 15);

  return {
    id: `analysis_${Date.now()}`,
    contentType: type,
    classification,
    confidence,
    warningSigns: warnings,
    explanation: buildExplanation(classification, warnings, type),
    explanationKm: buildExplanationKm(classification, warnings),
    recommendations,
    timestamp: new Date(),
    inputPreview: input.slice(0, 120),
  };
}
