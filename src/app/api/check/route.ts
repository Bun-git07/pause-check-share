export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Initialize Google AI provider with GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const google = apiKey ? createGoogleGenerativeAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `# ROLE & PURPOSE
You are "Chas Checker AI" (ឈប់ ពិនិត្យ ចែករំលែក) — an elite digital safety assistant specializing in identifying online scams, phishing links, malicious downloads, fake bank receipts, social media impersonation, and misleading text messages across Cambodian and Southeast Asian digital ecosystems.

You analyze PASTED TEXT, SUBMITTED URLS, and MULTIMODAL SCREENSHOTS across two primary workflows:
1. VERIFY: Authenticity and domain checking.
2. SCAM CHECK: Fraud detection, threat scoring, and risk breakdown.

---

# CORE GUIDELINES & ABSOLUTE RULES
1. **Executable File Rule (CRITICAL):** Any input (pasted text, link, or screenshot) containing or prompting the download of executable/installer files (e.g., .exe, .dmg, .apk, .iso, .bat, .scr, .zip/.rar containing executables) MUST be instantly classified as 🔴 **HIGH RISK / DANGEROUS DOWNLOAD**.
2. **Never Guarantee Absolute Safety:** Unless a link or text matches an official, whitelisted primary domain (e.g., official .gov.kh or official bank domain), NEVER label something "100% Safe." Use "Likely Safe" with caution.
3. **Handle Multi-Format Inputs:** Accept and analyze pasted plain text, chat logs, social media URLs, website links, or image uploads seamlessly.
4. **Prioritize Speed & Scannability:** Users checking potential scams need instant clarity. Use strict bolding, bullet points, and high-visibility emojis.
5. **Adapt Language:** Output the report in the SAME language used in the prompt/screenshot (Khmer or English). If mixed, default to the user's primary text language.

---

# SPECIALIZED ANALYSIS MATRIX

### 1. File Download & Direct Link Threat Detection
- 🔴 **Automatic High-Risk Trigger:** Links or texts referencing download files ending in .exe (Windows), .dmg (Mac), .apk (Android), .bat, .vbs, or archived .zip/.rar files from non-official sources.
- **Shortened & Typosquatted URLs:** Detect deceptive domains mimicking legitimate entities (e.g., facebook-login-check.com, telegram-reward.net, aba-bank.online).

### 2. Social Media Verification Rules
- **Facebook:** Detect fake Blue Verification Badges manually edited onto cover/profile pictures. Flag pages with mismatched categories/names vs. content offered.
- **Telegram:** Check for fake "Admin" or "Official Support" badges added to profile photos. Verify handle mismatches (Display name says "Bank Support" but handle is @user_x9812). Flag unsolicited private messages offering remote jobs, giveaways, or crypto schemes.
- **TikTok:** Flag videos redirecting users off-platform to external bio links (Telegram channels, Google Forms, external APK download sites).

### 3. Text & Chat Pattern Detection
- **Pasted SMS / Chat Texts:** Analyze for high-pressure language ("Account blocked in 1 hour"), unverified financial claims, or advance-fee requirements ("Pay $10 to claim $1,000").
- **Payment Receipts (ABA, Wing, etc.):** Check for inconsistent fonts, misaligned transaction IDs, or blurry editing overlays on uploaded screenshot receipts.

### 4. Deepfake & AI-Generated Media Detection
- **Visual Artifacts:** Analyze screenshots for unnatural lighting, distorted backgrounds, mangled text/fingers, facial asymmetry, or inconsistent shadows typical of AI generators (Midjourney, DALL-E, etc.).
- **Audio/Video Claims:** If the post claims to be a video/audio recording of a public figure saying something controversial, flag it for potential voice-cloning or deepfake verification.

### 5. False Information & Fake News Checking
- **Sensationalism:** Flag highly emotional, polarizing, or clickbait headlines lacking verifiable sources or official news links.
- **Hoax Patterns:** Identify common rumor templates, unverified medical claims, or unsourced political announcements.

---

# REQUIRED OUTPUT FORMAT

Always format your response strictly using the following structure:

### 1. VERDICT & RISK LEVEL
Display ONE of the following badges at the top:
- 🔴 **HIGH RISK / CONFIRMED SCAM OR DANGEROUS FILE**
- 🟡 **CAUTION / SUSPICIOUS**
- 🟢 **LIKELY SAFE (EXERCISING CAUTION)**
- ⚪ **NEEDS MORE INFORMATION**

---

### 2. SIGNAL BREAKDOWN
Provide 2 to 4 bullet points detailing specific flags detected:
- 🚩 **[Flag Name]**: Specific element observed (e.g., "Executable File Detected: .exe download link", "Typosquatted Facebook Domain", or "Advance-Fee Pattern in Text").
- 🟢 **[Green Flag]**: Verified official indicator (if any).

---

### 3. WHAT TO DO NEXT (RECOMMENDATIONS)
Provide 2 to 3 immediate, numbered, actionable steps tailored to the situation:
1. **Immediate Defense**: (e.g., *Do NOT download or run the file*, *Do NOT click the bio link*, *Do NOT transfer any money*, or *Block the sender*).
2. **Official Verification**: How to cross-check (e.g., *Access the service directly via the official bank app or official website*).
3. **Reporting / Safety Action**: (e.g., *Report the account/channel on Facebook/Telegram/TikTok as a scam*).

---

### 4. SAFETY TIP
💡 **Pro Tip**: Provide a single, concise sentence helping the user spot this specific trick or threat in the future.`;

function generateFallbackAnalysis(inputText: string, hasImage: boolean): string {
  const lower = inputText.toLowerCase();

  // 1. Executable file rule
  const isExec = /\.(exe|dmg|apk|iso|bat|scr|vbs|zip|rar)/i.test(inputText) || /setup|installer|download/i.test(inputText);
  if (isExec) {
    return `### 1. VERDICT & RISK LEVEL
🔴 **HIGH RISK / DANGEROUS DOWNLOAD**

---

### 2. SIGNAL BREAKDOWN
- 🚩 **Executable File Download**: Input contains or references executable software (.exe, .apk, .dmg, etc.), which is a primary vector for malware and device compromise.
- 🚩 **Unverified File Source**: The file or download link originates from an unverified third-party platform.
- 🚩 **High-Risk Vector**: Software installers sent via chat or third-party links bypass standard app store security checks.

---

### 3. WHAT TO DO NEXT
1. **Do NOT Click or Download**: Do not open the link or run the installer file. Delete it immediately if downloaded.
2. **Do NOT Grant Permissions**: Never grant administrative permissions or install APKs from untrusted sources.
3. **Run Antivirus Scan**: If you launched the executable file, immediately disconnect Wi-Fi and run a full security scan.

---

### 4. SAFETY TIP
💡 **Pro Tip**: Legitimate services and software developers never distribute .exe or .apk installers via unverified chat links or free giveaway sites.`;
  }

  // 2. Social Media Scam / Telegram Impersonation Rule
  const isSocialScam = (/telegram|@|\$500|gift card|prize|reward|winner|claim/i.test(lower) && /admin|contact|message/i.test(lower)) || /@FB_Reward_Kh/i.test(inputText);
  if (isSocialScam) {
    return `### 1. VERDICT & RISK LEVEL
🔴 **HIGH RISK / CONFIRMED SCAM**

---

### 2. SIGNAL BREAKDOWN
- 🚩 **Off-Platform Redirection**: Official platforms will NEVER instruct you to contact private Telegram handles to claim prizes or support.
- 🚩 **Unsolicited Reward Scheme**: Promises of random gift cards or cash prizes requiring direct messaging are classic advance-fee scams.
- 🚩 **Impersonation Risk**: Display names claiming to be "Admin" or "Support" on chat apps are unverified and easily faked.

---

### 3. WHAT TO DO NEXT
1. **Do NOT Message the Handle**: Do not reach out to private handles or share any banking/personal details.
2. **Ignore & Block**: Block the sender immediately and report the profile on the platform.
3. **Verify Official Promotions**: Check the official website directly for genuine contest announcements.

---

### 4. SAFETY TIP
💡 **Pro Tip**: Real organizations never conduct official prize distributions or customer support through private Telegram handles.`;
  }

  // 3. Typosquatted domain / Bank phishing rule
  const isFakeBank = /aba-bank|online-bank|login-check|verify-account|bank-update/i.test(lower) || (hasImage && /receipt|aba|bank|wing/i.test(lower));
  if (isFakeBank) {
    return `### 1. VERDICT & RISK LEVEL
🔴 **HIGH RISK / CONFIRMED SCAM OR DANGEROUS FILE**

---

### 2. SIGNAL BREAKDOWN
- 🚩 **Suspicious Domain / Media**: The URL uses typosquatting or an unofficial domain extension to mimic a legitimate financial institution.
- 🚩 **High-Pressure Urgency**: Prompts demanding immediate action to avoid account suspension are designed to bypass critical thinking.

---

### 3. WHAT TO DO NEXT
1. **Do NOT Enter Credentials**: Never type your bank passwords, OTPs, or credit card details into unverified links.
2. **Use Official Banking App**: Always access your financial account directly through the official bank mobile application.
3. **Contact Official Support**: If in doubt, call the official customer service hotline listed on your physical bank card.

---

### 4. SAFETY TIP
💡 **Pro Tip**: Banks will never send links requiring you to enter your login password or OTP via SMS or social messaging.`;
  }

  // 4. Fake News & Deepfake Checking Rule
  const isFakeNews = /deepfake|ai generated|midjourney|dall-e|fake news|hoax|rumor|unverified|shocking truth/i.test(lower);
  if (isFakeNews) {
    return `### 1. VERDICT & RISK LEVEL
🟡 **CAUTION / SUSPICIOUS (POTENTIAL FALSE INFO OR AI)**

---

### 2. SIGNAL BREAKDOWN
- 🚩 **Unverified Sensationalism**: The content contains keywords heavily associated with clickbait, unverified rumors, or AI-generated media.
- 🚩 **Potential AI Manipulation**: Be extremely skeptical of shocking images or voice clips lacking official news coverage.

---

### 3. WHAT TO DO NEXT
1. **Reverse Image Search**: Run the image through Google Lens or TinEye to see if it has been fact-checked.
2. **Check Official News Outlets**: Verify the claim on credible national news websites (e.g., local mainstream media).
3. **Do Not Share Yet**: Stop the spread of misinformation by waiting for official verification before forwarding.

---

### 4. SAFETY TIP
💡 **Pro Tip**: AI-generated images often have telltale signs like blurry backgrounds, unnatural lighting, or distorted hands/text.`;
  }

  // Default Caution / Suspicious fallback
  return `### 1. VERDICT & RISK LEVEL
🟡 **CAUTION / SUSPICIOUS**

---

### 2. SIGNAL BREAKDOWN
- 🚩 **Unverified Information Source**: The submitted text or link could not be automatically matched against whitelisted official domains.
- 🚩 **Requires Manual Verification**: Be cautious before clicking links, sharing media, or responding to unsolicited messages.

---

### 3. WHAT TO DO NEXT
1. **Exercise Caution**: Do not share personal data, financial details, or click on unverified external links.
2. **Cross-Check Official Channels**: Search for the official government (.gov.kh) or organization portal directly.
3. **Report Suspicious Behavior**: Flag unsolicited messages to platform administrators.

---

### 4. SAFETY TIP
💡 **Pro Tip**: Always verify the primary domain name in your browser's address bar before trusting online content.`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const contentParts: any[] = [];
    let accumulatedText = '';
    let hasImage = false;

    if (contentType.includes('application/json')) {
      try {
        const json = await req.json();
        
        if (Array.isArray(json.messages) && json.messages.length > 0) {
          for (const msg of json.messages) {
            if (typeof msg.content === 'string') {
              accumulatedText += ' ' + msg.content;
              contentParts.push({ type: 'text', text: msg.content });
            } else if (Array.isArray(msg.content)) {
              for (const part of msg.content) {
                if (part.type === 'text') {
                  accumulatedText += ' ' + part.text;
                  contentParts.push(part);
                } else if (part.type === 'image') {
                  hasImage = true;
                  contentParts.push(part);
                }
              }
            }
          }
        }

        const promptText = json.prompt || json.text || json.content || json.url || '';
        if (promptText) {
          accumulatedText += ' ' + promptText;
          contentParts.push({ type: 'text', text: promptText });
        }

        if (json.imageUrl) {
          hasImage = true;
          contentParts.push({ type: 'image', image: json.imageUrl });
        }
      } catch (jsonErr) {
        console.warn('Could not parse JSON body:', jsonErr);
      }
    } else {
      const formData = await req.formData();
      
      for (const [key, value] of Array.from(formData.entries())) {
        if (value instanceof Blob) {
          hasImage = true;
          const arrayBuffer = await value.arrayBuffer();
          contentParts.push({
            type: 'image',
            image: new Uint8Array(arrayBuffer),
            mimeType: value.type,
          });
        } else if (typeof value === 'string' && value.trim() !== '') {
          accumulatedText += ' ' + value;
          const textContent = (key === 'text' || key === 'content') ? value : `${key}: ${value}`;
          contentParts.push({
            type: 'text',
            text: textContent,
          });
        }
      }
    }

    if (contentParts.length === 0) {
      return NextResponse.json(
        { error: 'No input provided for analysis' },
        { status: 400 }
      );
    }

    // Call Gemini 2.5 Flash via Vercel AI SDK if provider is available
    if (google) {
      try {
        const { text: responseText } = await generateText({
          model: google('gemini-2.5-flash'),
          system: SYSTEM_INSTRUCTION,
          messages: [
            {
              role: 'user',
              content: contentParts,
            },
          ],
        });

        return NextResponse.json({ result: responseText });
      } catch (geminiError) {
        console.warn('Vercel AI SDK (Gemini 2.5 Flash) call failed, falling back to rule engine:', geminiError);
      }
    }

    // Rule engine fallback when API key is missing or API call fails
    const fallbackResponse = generateFallbackAnalysis(accumulatedText.trim(), hasImage);
    return NextResponse.json({ result: fallbackResponse });

  } catch (error) {
    console.error('Error in check API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
