# Pause, Check, Share — Implementation Plan

A mobile-first AI-powered misinformation verification companion for Cambodian adults aged 55–70.

---

## Overview

This Next.js + TailwindCSS + TypeScript + Firebase application will serve as a trustworthy, accessible digital companion helping users identify warning signs before sharing online content. The UI follows a calm healthcare/education aesthetic with large fonts, high contrast, Khmer+English bilingual support, and full voice narration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v3 |
| Backend/Auth | Firebase (Firestore + Storage + Auth) |
| Icons | Lucide React |
| Animations | Framer Motion |
| Fonts | Google Fonts: Noto Sans Khmer + Inter |
| Voice | Web Speech API (SpeechSynthesis) |

---

## Project Structure

```
/app
  /layout.tsx              # Root layout with fonts, providers
  /page.tsx                # Home page
  /verify/page.tsx         # Verify content
  /verify/result/page.tsx  # Analysis result
  /learn/page.tsx          # Lessons list
  /learn/[slug]/page.tsx   # Individual lesson
  /scam-checker/page.tsx   # Scam checker
  /history/page.tsx        # History
  /profile/page.tsx        # Settings/Profile
  /onboarding/page.tsx     # First-time onboarding

/components
  /ui                      # Reusable primitives
    Button.tsx
    Card.tsx
    Badge.tsx
    Modal.tsx
    LoadingSpinner.tsx
    EmptyState.tsx
    Toast.tsx
  /layout
    BottomNav.tsx           # Mobile bottom navigation
    TopBar.tsx              # Page headers
    VoiceButton.tsx         # Voice narration toggle
  /home
    ScamAlert.tsx
    SafetyTip.tsx
    WelcomeBanner.tsx
  /verify
    UploadZone.tsx
    LinkInput.tsx
    AnalysisResult.tsx
    WarningSignCard.tsx
    ClassificationBadge.tsx
  /learn
    LessonCard.tsx
    LessonProgress.tsx
    QuizQuestion.tsx
  /scam-checker
    ScamInputArea.tsx
    ScamResult.tsx

/lib
  firebase.ts              # Firebase config
  firestore.ts             # Firestore helpers
  storage.ts               # Storage helpers
  mockAI.ts                # Simulated AI analysis
  voiceNarration.ts        # Speech synthesis helper
  i18n.ts                  # Khmer/English translations

/types
  index.ts                 # Shared TypeScript types

/hooks
  useVoice.ts              # Voice narration hook
  useLanguage.ts           # i18n hook
  useAnalysis.ts           # Analysis state hook
  useHistory.ts            # History state hook
  useProfile.ts            # Profile/settings hook

/public
  /icons                   # App icons
  /images                  # Mock images
```

---

## Pages & Features

### 1. Onboarding (3 swipeable screens)
- Welcome screen with app mascot/logo
- "What we do" explanation
- Language selection (Khmer/English)
- Accessibility quick setup

### 2. Home
- Welcome banner with user greeting
- Large "Verify Content" CTA button
- Recent scam alerts carousel (mock data)
- Quick safety tips grid

### 3. Verify
- Tab switcher: Upload / Paste Link / Type Message
- Drag-and-drop upload zone (images, videos, screenshots)
- URL input for FB/TikTok/YouTube links
- Text area for Messenger messages
- Animated loading state during "AI analysis"
- Result page with classification badge + detailed breakdown

### 4. Verify Result
- 🟢🟡🔴 classification with large visual
- Warning signs list with icons
- Explanation of why it's suspicious
- "What to do next" action list
- Share / Save / Report buttons

### 5. Learn (6 lessons)
- Spot fake Facebook posts
- Recognize scams
- Detect AI-generated images
- Detect deepfake videos
- Identify official government pages
- Verify health information
- Think before sharing

Each lesson has: intro screen → 3-4 visual slides → interactive quiz → completion badge

### 6. Scam Checker
- Upload photo of SMS/email/chat
- Or type/paste suspicious text
- AI analysis result with red flag explanations
- Action recommendations

### 7. History
- List of past analyses (mock data + Firebase)
- Filter by date / result type
- Tap to view full result again

### 8. Profile
- Language toggle (KH/EN)
- Large Text Mode toggle
- Voice Reading toggle
- Dark Mode toggle
- About / Help

---

## Mock AI Analysis System

The `mockAI.ts` module will:
- Accept content type + input
- Run keyword/heuristic detection
- Assign classification: Likely Reliable / Needs Verification / Potentially Misleading
- Return structured warning signs, explanation, and recommendations
- Add artificial delay (2-3s) to simulate real AI

---

## Color Palette & Design Tokens

```css
Primary:    #1E88E5  (blue — trust)
Secondary:  #43A047  (green — safe)
Warning:    #F9A825  (amber — caution)
Danger:     #E53935  (red — alert)
Background: #F8FAFC
Surface:    #FFFFFF
Text:       #1A202C
Muted:      #718096
```

---

## Accessibility Features

- Minimum font size: 18px base (large text mode: 22px)
- Minimum tap target: 48×48px
- ARIA labels on all interactive elements
- Voice narration via Web Speech API
- High contrast mode
- Bottom navigation (thumb-friendly)
- Simple 1-2 word labels everywhere

---

## Firebase Setup

- **Auth**: Anonymous sign-in (no account required)
- **Firestore**: Store analysis history, user preferences
- **Storage**: Store uploaded content for analysis

> [!NOTE]
> Firebase will be configured with environment variables. The app will work fully in offline/mock mode without a live Firebase project for demo purposes.

---

## Proposed Build Order

1. Project scaffolding (Next.js + Tailwind + TS + Firebase)
2. Design system: colors, typography, base components
3. Layout: BottomNav, TopBar, fonts
4. Home page
5. Verify flow (upload → loading → result)
6. Learn page + one full lesson
7. Scam Checker
8. History page
9. Profile page
10. Onboarding screens
11. i18n (Khmer/English)
12. Voice narration
13. Animations polish
14. Mock data + empty states

---

## Verification Plan

- Run `npm run build` to confirm no TypeScript errors
- Manually verify all navigation routes work
- Test on mobile viewport (375px)
- Verify Khmer font renders correctly
- Test voice narration in browser
