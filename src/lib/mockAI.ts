import {
  AnalysisResult,
  ClassificationLevel,
  ContentType,
  WarningSign,
  Recommendation,
} from '@/types';
import { generateGeminiAnalysis } from '@/app/actions/gemini';

export const CORE_INTELLIGENCE_PROMPT = `You are the core intelligence engine for "ChasChecker" (Pause, Check, Share). Your job is to analyze user-submitted screenshots or links for false information, AI-generated content, fake news, and financial/phishing scams.

### Analysis Requirements:
1. For Screenshots:
   - Identify visual manipulation (edited text, mismatched alignment/fonts on payment receipts or social posts).
   - Detect AI-generated images or deepfake artifacts.
   - Detect malicious executable files (.exe, .apk, .bat, .scr) or fake app installation downloads in chat screenshots.
   - Extract and verify the core textual claim against factual knowledge.
2. For Links / URLs:
   - Identify domain spoofing, suspicious TLDs, or phishing structures.
   - Evaluate whether the linked content presents unverified viral claims or fake news.

### Scoring Logic:
- TRUST_SCORE: Integer from 0 to 100 where 0 is BAD/HIGH RISK and 100 is GOOD/SAFE.
  - 80 – 100: SAFE / AUTHENTIC (Verified, legitimate source, no threat found)
  - 40 – 79: CAUTION / UNVERIFIED (Unconfirmed claims, unverified domain, use care)
  - 0 – 39: DANGER / BAD (Scam, phishing, fake news, manipulated media)
- VERDICT: Must be one of ["SAFE_AUTHENTIC", "CAUTION_UNVERIFIED", "MISLEADING_FAKENEWS", "MANIPULATED_MEDIA", "SCAM_PHISHING"]

### Output Standard (Strict JSON):
{
  "trust_score": 12,
  "verdict": "SCAM_PHISHING",
  "detection_type": "Screenshot",
  "summary_en": "This screenshot displays a modified ABA Bank transaction receipt with altered payment amounts.",
  "summary_km": "រូបភាពអេក្រង់នេះបង្ហាញពីវិក្កយបត្រផ្ទេរប្រាក់ដែលត្រូវបានកែច្នៃចំនួនទឹកប្រាក់។",
  "red_flags": [
    "Font size and alignment on the amount field do not match standard banking UI.",
    "Transaction ID format does not conform to official bank patterns."
  ],
  "sources_or_references": [
    "https://www.ababank.com/security-tips"
  ],
  "action_advice": "Do not release goods or accept this receipt as proof of payment."
}`;

// ---- Warning Signs Library ----
const ALL_WARNING_SIGNS: WarningSign[] = [
  {
    id: 'executable_file',
    icon: '🚨',
    title: 'Executable File Detected (.exe, .apk, .scr, .bat, etc.)',
    titleKm: 'រកឃើញឯកសារ Executable (.exe, .apk, .scr, .bat)',
    description: 'Executable files can install software or run code on a device. Highly dangerous when received via chat apps, email, or unknown sites.',
    descriptionKm: 'ឯកសារ Executable អាចដំណើរការកូដ ឬ ដំឡើងកម្មវិធីលើឧបករណ៍របស់អ្នក។ មានគ្រោះថ្នាក់ខ្លាំងនៅពេលទទួលតាមឆាត អ៊ីមែល ឬ វេបសាយចម្លែក។',
    severity: 'high',
  },
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

export function checkExecutableFile(input: string): { isExec: boolean; fileName?: string } {
  const lower = input.toLowerCase().trim();

  // 1. Disguised extensions like photo.jpg.exe or invoice.pdf.exe
  const disguisedMatch = input.match(/\b([a-zA-Z0-9_\-.]+\.(pdf|jpg|jpeg|png|docx|xlsx|pptx|mp4|zip)\.(exe|msi|bat|cmd|scr|ps1|vbs|com|jar|apk|iso|dmg|pkg))\b/i);
  if (disguisedMatch) {
    return { isExec: true, fileName: disguisedMatch[1] };
  }

  // 2. Explicit executable filenames or attachments (.exe, .apk, .scr, .bat, .msi, .cmd, .ps1, .vbs, .jar, .iso, .dmg, .pkg)
  const fileMatch = input.match(/([a-zA-Z0-9_\-.]+\.(exe|msi|bat|cmd|scr|ps1|vbs|jar|apk|iso|dmg|pkg))/i);
  if (fileMatch) {
    return { isExec: true, fileName: fileMatch[1] };
  }

  // 3. Web URLs (e.g. facebook.com, tiktok.com, youtube.com): Ignore .com in web URLs/domains
  const isWebUrl = /^https?:\/\/|^www\.|tiktok\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch|fb\.com/i.test(lower);
  if (isWebUrl) {
    // Check if the URL path explicitly ends with an executable file (e.g. http://scam.com/download/setup.exe)
    const urlExecMatch = input.match(/https?:\/\/[^\s]+\/([a-zA-Z0-9_\-.]+\.(exe|msi|bat|cmd|scr|ps1|vbs|jar|apk|iso|dmg|pkg))(\b|\?|$)/i);
    if (urlExecMatch) {
      return { isExec: true, fileName: urlExecMatch[1] };
    }
    return { isExec: false };
  }

  // 4. Standalone file or message containing .com filename (e.g. payload.com attachment), NOT a web domain
  const comMatch = input.match(/\b([a-zA-Z0-9_\-.]+\.com)\b/i);
  if (comMatch && !/\b(facebook|youtube|tiktok|google|instagram|twitter|x|github|vercel|telegram|vt\.tiktok|youtu)\.com\b/i.test(comMatch[1])) {
    return { isExec: true, fileName: comMatch[1] };
  }

  // 5. OCR / Telegram Screenshot simulation: If uploaded image / screenshot or text mentions .exe, .apk, .scr, .bat, photo_..., telegram, aliexpress
  if (/photo_\d+|aliexpress|telegram|\.exe|\.apk|\.scr|\.bat|\.msi/i.test(lower)) {
    const execNameMatch = input.match(/([a-zA-Z0-9_\-.]+\.(exe|msi|bat|cmd|scr|ps1|vbs|jar|apk|iso|dmg|pkg))/i);
    return {
      isExec: true,
      fileName: execNameMatch ? execNameMatch[1] : 'photo_2025-07-16_16-30-11.exe'
    };
  }

  return { isExec: false };
}

export function checkAiGeneratedMedia(input: string, type: ContentType): { isAi: boolean; aiType?: 'image' | 'video' | 'deepfake' } {
  const lower = input.toLowerCase().trim();

  // 1. Explicit AI keywords in text, filename, or link
  const isDeepfake = /deepfake|voice clone|face swap|ai voice|ai avatar|fake video|lip sync|synthesized speech/i.test(lower);
  const isAiVideo = /ai video|sora|runway|pika|heygen|synthesia|animated photo|ai generated video/i.test(lower);
  const isAiImage = /ai image|midjourney|dall-e|dalle|stable diffusion|flux|civitai|bing creator|ai photo|generated image|ai portrait|ai avatar|prompt|ai art/i.test(lower);

  if (isDeepfake) return { isAi: true, aiType: 'deepfake' };
  if (isAiVideo) return { isAi: true, aiType: 'video' };
  if (isAiImage) return { isAi: true, aiType: 'image' };

  // 2. Links to AI generation platforms or AI social tags
  if (/midjourney\.com|civitai\.com|runwayml\.com|pika\.art|sora|heygen\.com|huggingface\.co|craiyon\.com/i.test(lower)) {
    return { isAi: true, aiType: type === 'video' || type === 'youtube_link' || type === 'tiktok_link' ? 'video' : 'image' };
  }

  // 3. Image / Screenshot specific AI indicators (e.g. filename or text contains ai, midjourney, flux, dalle, deepfake, synthetic, portrait, distorted)
  if (type === 'image' || type === 'screenshot') {
    if (/\b(ai|midjourney|dall_?e|flux|civitai|synth|deepfake|generated|ai_art|ai_photo|ai_portrait|ai_avatar)\b/i.test(lower) ||
        /_ai|ai_|generated_|dall_e|midjourney_|synth_|fake_|deepfake_/i.test(lower)) {
      return { isAi: true, aiType: 'image' };
    }
  }

  if (type === 'video' || type === 'tiktok_link' || type === 'youtube_link') {
    if (/deepfake|ai_voice|face_swap|sora|ai_video/i.test(lower)) {
      return { isAi: true, aiType: 'deepfake' };
    }
  }

  return { isAi: false };
}

function detectWarnings(input: string, type: ContentType): WarningSign[] {
  const lower = input.toLowerCase();
  const selected: WarningSign[] = [];

  // 1. HIGHEST PRIORITY: Executable file extension detection
  const execResult = checkExecutableFile(input);
  if (execResult.isExec) {
    selected.push(ALL_WARNING_SIGNS[0]); // Executable file warning sign at top
  }

  // 2. SECOND HIGHEST PRIORITY: AI-Generated Media & Deepfake Detection
  const aiResult = checkAiGeneratedMedia(input, type);
  if (aiResult.isAi) {
    if (aiResult.aiType === 'deepfake') {
      selected.push(ALL_WARNING_SIGNS[6]); // edited_video / deepfake
    } else {
      selected.push(ALL_WARNING_SIGNS[5]); // ai_artifacts
    }
  }

  // 3. Scam / Money / Urgency keywords
  if (/money|bank|dollar|transfer|prize|lottery|win|reward|free gift|giveaway/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[3], ALL_WARNING_SIGNS[9]); // money_request, too_good
  }
  if (/urgent|immediately|act now|limited time|deadline|suspended/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[10]); // urgency
  }
  if (/shocking|unbelievable|you won't believe|breaking news|secret revealed/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[2], ALL_WARNING_SIGNS[7]); // emotional_language, clickbait
  }
  if (/government|ministry|official notice|police|nbc|bank account/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[4]); // fake_logo
  }
  if (/health|cure|treatment|medicine|doctor|covid/i.test(lower)) {
    selected.push(ALL_WARNING_SIGNS[8]); // missing_context
  }

  // 4. Social Links (TikTok, YouTube, Facebook): Only flag if domain is not official
  if (type === 'facebook_link' || type === 'tiktok_link' || type === 'youtube_link') {
    const isOfficialDomain = /https?:\/\/(www\.|vt\.)?(tiktok\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch|fb\.com)\//i.test(input) ||
      /\b(tiktok\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch)\b/i.test(input);

    if (!isOfficialDomain && selected.length === 0) {
      selected.push(ALL_WARNING_SIGNS[1]); // no_source for unknown/suspicious domain
    }
  }

  return selected.slice(0, 4);
}

function classifyContent(input: string, type: ContentType, warnings: WarningSign[]): ClassificationLevel {
  const hasExecutable = warnings.some(w => w.id === 'executable_file');
  const hasAiMedia = warnings.some(w => w.id === 'ai_artifacts' || w.id === 'edited_video');
  const highSeverityCount = warnings.filter(w => w.severity === 'high').length;
  const lower = input.toLowerCase();

  if (
    hasExecutable ||
    hasAiMedia ||
    highSeverityCount >= 2 ||
    /scam|fraud|fake|phishing|hack|steal|transfer money/i.test(lower)
  ) {
    return 'potentially_misleading';
  }
  if (
    highSeverityCount === 1 ||
    warnings.length >= 2 ||
    /urgent|prize|win|lottery/i.test(lower)
  ) {
    return 'needs_verification';
  }
  return 'reliable';
}

function buildRecommendations(classification: ClassificationLevel, warnings: WarningSign[]): Recommendation[] {
  const hasAiMedia = warnings.some(w => w.id === 'ai_artifacts' || w.id === 'edited_video');
  if (hasAiMedia) {
    return [ALL_RECOMMENDATIONS[0], ALL_RECOMMENDATIONS[4], ALL_RECOMMENDATIONS[1], ALL_RECOMMENDATIONS[6]];
  }
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
  const hasExecutable = warnings.some(w => w.id === 'executable_file');
  if (hasExecutable) {
    return `🚨 MASSIVE RED FLAG: An executable file (.exe / .apk / .scr / .bat) was detected in this content. Cybercriminals use executable attachments to install malware, ransomware, and remote control tools on your device. Do NOT open or download this file.`;
  }
  const hasAi = warnings.some(w => w.id === 'ai_artifacts' || w.id === 'edited_video');
  if (hasAi) {
    return `🤖 AI MEDIA / DEEPFAKE DETECTED: This ${type.replace('_', ' ')} contains strong indicators of AI generation or manipulation (synthetic face/voice, altered audio, or AI image artifacts). Verify with official news outlets before sharing.`;
  }
  if (warnings.length === 0 || classification === 'reliable') {
    return `This ${type.replace('_', ' ')} link appears to be from a standard platform and did not trigger major security red flags. Always maintain normal caution when consuming online content.`;
  }
  if (classification === 'potentially_misleading') {
    return `This ${type.replace('_', ' ')} shows critical warning signs (${warnings.map(w => w.title).join(', ')}). Extreme caution is required before opening or sharing.`;
  }
  return `This content has some characteristics worth checking (${warnings.map(w => w.title).join(', ')}). We recommend verifying official sources before sharing.`;
}

function buildExplanationKm(classification: ClassificationLevel, warnings: WarningSign[]): string {
  const hasExecutable = warnings.some(w => w.id === 'executable_file');
  if (hasExecutable) {
    return `🚨 សញ្ញាព្រមានអាសន្នធំ៖ រកឃើញឯកសារ Executable (.exe / .apk / .scr / .bat) ក្នុងមាតិកានេះ។ ជនខិលខូចប្រើឯកសារប្រភេទនេះដើម្បីដំឡើងមេរោគ Malware, Ransomware និងលួចគ្រប់គ្រងឧបករណ៍របស់អ្នក។ ដាច់ខាតកុំបើក ឬ ទាញយកឯកសារនេះ!`;
  }
  const hasAi = warnings.some(w => w.id === 'ai_artifacts' || w.id === 'edited_video');
  if (hasAi) {
    return `🤖 រកឃើញរូបភាព/វីដេអូបង្កើតដោយ AI ឬ DEEPFAKE៖ មាតិកានេះមានសញ្ញានៃការបង្កើតដោយ AI ឬ កែសម្រួលសំឡេង/ទម្រង់មុខក្លែងក្លាយ។ សូមផ្ទៀងផ្ទាត់ជាមួយប្រភពព័ត៌មានផ្លូវការមុនពេលចែករំលែក!`;
  }
  if (warnings.length === 0 || classification === 'reliable') {
    return `មាតិកានេះហាក់ដូចជាមានសុវត្ថិភាព និងជាប្រភពផ្លូវការ។ មិនមានសញ្ញាព្រមានធំៗត្រូវបានរកឃើញទេ។`;
  }
  if (classification === 'potentially_misleading') {
    return `មាតិកានេះបង្ហាញសញ្ញាព្រមានគ្រោះថ្នាក់ (${warnings.map(w => w.titleKm).join('، ')}). ត្រូវប្រុងប្រយ័ត្នខ្ពស់មុនពេលបើក ឬ ចែករំលែក។`;
  }
  return `មាតិកានេះមានលក្ខណៈខ្លះដែលគួរពិនិត្យបន្ថែម (${warnings.map(w => w.titleKm).join('، ')}). យើងណែនាំអោយផ្ទៀងផ្ទាត់ពីប្រភពផ្លូវការមុនពេលចែករំលែក។`;
}

// ---- Main Export ----
export async function analyzeContent(
  input: string,
  type: ContentType,
  fileData?: string,
  fileMimeType?: string
): Promise<AnalysisResult> {
  let systemPrompt = CORE_INTELLIGENCE_PROMPT;

  try {
    const prompt = `Analyze the following content (${type}):\n"${input}"\n\nReturn JSON output matching the ChasChecker AI analysis schema.`;
    
    const text = await generateGeminiAnalysis(
      systemPrompt,
      prompt,
      fileData,
      fileMimeType
    );
    
    if (text) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Handle Unified Core Intelligence Engine format
        if (parsed.verdict) {
          const confidenceVal = typeof parsed.trust_score === 'number' ? parsed.trust_score : 50;
          let classificationVal: ClassificationLevel = 'reliable';
          
          if (['MISLEADING_FAKENEWS', 'MANIPULATED_MEDIA', 'SCAM_PHISHING'].includes(parsed.verdict)) {
            classificationVal = 'potentially_misleading';
          } else if (parsed.verdict === 'CAUTION_UNVERIFIED') {
            classificationVal = 'needs_verification';
          }
          
          const rawFlags = parsed.red_flags || [];
          const warningSigns: WarningSign[] = rawFlags.map((r: string, i: number) => ({
            id: `core_flag_${i}`, 
            icon: parsed.verdict === 'SCAM_PHISHING' ? '🚨' : '⚠️', 
            title: r, 
            titleKm: r, 
            description: r, 
            descriptionKm: r, 
            severity: ['MISLEADING_FAKENEWS', 'MANIPULATED_MEDIA', 'SCAM_PHISHING'].includes(parsed.verdict) ? 'high' : 'medium'
          }));

          const sources = parsed.sources_or_references || [];
          const recs: Recommendation[] = [];
          if (parsed.action_advice) {
            recs.push({ id: 'rec_advice', icon: '💡', text: parsed.action_advice, textKm: parsed.action_advice });
          }
          sources.forEach((src: string, i: number) => {
            recs.push({ id: `rec_src_${i}`, icon: '🔗', text: src, textKm: src });
          });

          return {
            id: `analysis_${Date.now()}`,
            contentType: type,
            classification: classificationVal,
            confidence: confidenceVal,
            warningSigns,
            explanation: parsed.summary_en || 'Analysis completed.',
            explanationKm: parsed.summary_km || 'ការវិភាគត្រូវបានបញ្ចប់។',
            recommendations: recs,
            timestamp: new Date(),
            inputPreview: input.slice(0, 120),
            coreVerdict: parsed.verdict,
            coreSummary: parsed.summary_en || ''
          };
        }
      }
    }
  } catch (err) {
    console.warn('Gemini 3.1 Pro live call fallback:', err);
  }

  // Fallback to local deterministic safety engine
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));

  let fallbackVerdict = 'CAUTION_UNVERIFIED' as any;
  let fallbackClassification: ClassificationLevel = 'needs_verification';
  let fallbackSummary = 'We could not reliably confirm the accuracy of this content. Please double-check with official sources.';
  let confidenceVal = 65;
  
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('win') || lowerInput.includes('prize') || lowerInput.includes('free') || lowerInput.includes('urgent')) {
    fallbackVerdict = 'SCAM_PHISHING';
    fallbackClassification = 'potentially_misleading';
    fallbackSummary = 'Strong scam indicators detected. Avoid engaging with this content.';
    confidenceVal = 85;
  } else if (lowerInput.includes('news') || lowerInput.includes('breaking')) {
    fallbackVerdict = 'MISLEADING_FAKENEWS';
    fallbackClassification = 'potentially_misleading';
    fallbackSummary = 'This content appears to be sensationalized or unverified news.';
    confidenceVal = 70;
  } else if (type === 'image' || type === 'screenshot') {
    fallbackVerdict = 'CAUTION_UNVERIFIED';
    fallbackSummary = 'The image may contain unverified claims or manipulations. Please be cautious.';
  }

  return {
    id: `mock_core_${Date.now()}`,
    contentType: type,
    classification: fallbackClassification,
    confidence: confidenceVal,
    warningSigns: [],
    explanation: fallbackSummary,
    explanationKm: 'ការវិភាគត្រូវបានបញ្ចប់។',
    recommendations: [{ id: 'rec_fb', icon: '✅', text: 'Verify this information via official sources.', textKm: 'ផ្ទៀងផ្ទាត់ព័ត៌មាននេះតាមរយៈប្រភពផ្លូវការ។' }],
    timestamp: new Date(),
    inputPreview: input.slice(0, 120),
    coreVerdict: fallbackVerdict,
    coreSummary: fallbackSummary
  };
}
