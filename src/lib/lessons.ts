import { Lesson } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: '1', slug: 'spot-fake-facebook',
    title: 'Spot Fake Facebook Posts', titleKm: 'ស្គាល់ប្រកាស Facebook ក្លែងក្លាយ',
    description: 'Learn 5 signs that a Facebook post might be fake news.', descriptionKm: 'រៀនស្គាល់ 5 សញ្ញានៃប្រកាស Facebook ក្លែងក្លាយ។',
    icon: '📘', duration: 3, difficulty: 'beginner',
    slides: [
      { id: 's1', type: 'intro', title: 'Welcome to this Lesson', titleKm: 'សូមស្វាគមន៍', content: 'In this lesson, you will learn how to spot fake Facebook posts before you share them.', contentKm: 'ក្នុងមេរៀននេះ អ្នកនឹងរៀនរបៀបស្គាល់ប្រកាស Facebook ក្លែងក្លាយ មុននឹងចែករំលែក។' },
      { id: 's2', type: 'warning', title: 'Sign 1: No Official Source', titleKm: 'សញ្ញា ១: គ្មានប្រភពផ្លូវការ', content: 'Real news always cites where it came from — a news website, TV channel, or official page. If there is no source, be suspicious!', contentKm: 'ព័ត៌មានពិតតែងតែដក្ស្រង់ប្រភព — គេហទំព័រព័ត៌មាន ឬ ទំព័រផ្លូវការ។ ប្រសិនបើគ្មានប្រភព សូមប្រយ័ត្ន!', badExample: '❌ "BREAKING: Government bans all phones!" — No link, no source', badExampleKm: '❌ "ព្រឹត្តិការណ៍ : រដ្ឋាភិបាលហាមប្រើទូរស័ព្ទ!" — គ្មានតំណ គ្មានប្រភព' },
      { id: 's3', type: 'warning', title: 'Sign 2: Emotional Language', titleKm: 'សញ្ញា ២: ភាសាអារម្មណ៍', content: 'Fake posts often use SHOCKING, URGENT, or SCARY words to make you react before thinking.', contentKm: 'ប្រកាសក្លែងក្លាយច្រើនប្រើពាក្យ គួរអោយភ្ញាក់ ឬ បន្ទាន់ ដើម្បីអោយអ្នក react មុនគិត។', badExample: '❌ "YOU WON\'T BELIEVE WHAT THEY\'RE HIDING FROM YOU!!!"', badExampleKm: '❌ "អ្នកនឹងមិនជឿទេ!!!"' },
      { id: 's4', type: 'tip', title: 'Sign 3: Check the Page Name', titleKm: 'សញ្ញា ៣: ពិនិត្យឈ្មោះទំព័រ', content: 'Scammers create pages with names very similar to real ones. Look for spelling mistakes or extra words.', contentKm: 'ជនបោកប្រាស់បង្កើតទំព័រដែលឈ្មោះស្រដៀងគ្នា។ រកមើលអក្ខរាវិរុទ្ធ ឬ ពាក្យបន្ថែម។', goodExample: '✅ Real: "National Bank of Cambodia Official"\n❌ Fake: "National Bank Cambodia News"', goodExampleKm: '✅ ពិត: "ធនាគារជាតិ ផ្លូវការ"\n❌ ក្លែង: "ព័ត៌មានធនាគារជាតិ"' },
    ],
    quiz: [
      { id: 'q1', question: 'Which of these is a sign of a fake Facebook post?', questionKm: 'អ្វីជាសញ្ញានៃប្រកាស Facebook ក្លែងក្លាយ?', options: [ { id: 'a', text: 'Has a link to a news website', textKm: 'មានតំណទៅគេហទំព័រព័ត៌មាន' }, { id: 'b', text: 'Uses emotional, urgent language', textKm: 'ប្រើភាសាអារម្មណ៍ ឬ បន្ទាន់' }, { id: 'c', text: 'Posted by a verified page', textKm: 'ប្រកាសដោយទំព័របញ្ជាក់' }, { id: 'd', text: 'Has many thoughtful comments', textKm: 'មានមតិយោបល់ច្រើន' } ], correctOptionId: 'b', explanation: 'Emotional and urgent language is a key warning sign of fake news.', explanationKm: 'ភាសាអារម្មណ៍ ឬ បន្ទាន់ជាសញ្ញាចម្បងនៃព័ត៌មានក្លែងក្លាយ។' },
    ],
  },
  {
    id: '2', slug: 'recognize-scams',
    title: 'Recognize Scams', titleKm: 'ស្គាល់ការបោក',
    description: 'Common scam patterns targeting Cambodian adults on social media.', descriptionKm: 'គំរូការបោកទូទៅដែលកំណត់គោលដៅចំពោះជនជាតិខ្មែរ។',
    icon: '🚨', duration: 3, difficulty: 'beginner',
    slides: [
      { id: 's1', type: 'intro', title: 'What Is a Scam?', titleKm: 'អ្វីជាការបោក?', content: 'Scams are tricks designed to steal your money or personal information. They look like real opportunities.', contentKm: 'ការបោកគឺជាល្បិចដើម្បីលួចប្រាក់ ឬ ព័ត៌មានផ្ទាល់ខ្លួន។ វាមើលទៅដូចជាឱកាសពិត។' },
      { id: 's2', type: 'warning', title: 'The Lottery Scam', titleKm: 'ការបោកឆ្នោត', content: 'You receive a message: "Congratulations! You won 5000 USD!" But to claim it, you must pay a fee first. This is ALWAYS a scam.', contentKm: 'អ្នកទទួលសារ: "អបអរសាទរ! អ្នកឈ្នះ ៥០០០ ដុល្លារ!" ប៉ុន្តែដើម្បីទទួល អ្នកត្រូវបង់ប្រាក់ជាមុន។ នេះជាការបោកជានិច្ច។', badExample: '❌ "Pay $50 processing fee to receive your $5,000 prize"', badExampleKm: '❌ "បង់ $50 ថ្លៃដំណើរការ ដើម្បីទទួល $5,000"' },
      { id: 's3', type: 'warning', title: 'The Romance Scam', titleKm: 'ការបោករឿងស្នេហា', content: 'Someone very attractive contacts you online. After weeks of chatting, they ask for money for an emergency. They disappear once paid.', contentKm: 'នរណាម្នាក់ស្អាត ឬ ប្រឡូកជាមួយអ្នកអនឡាញ។ បន្ទាប់ពីពីរបីសប្ដាហ៍ ពួកគេស្នើប្រាក់ ហើយបាត់ទៅ។' },
    ],
    quiz: [
      { id: 'q1', question: 'You receive a message saying you won $10,000. What should you do?', questionKm: 'អ្នកទទួលសារថាឈ្នះ $10,000។ អ្វីដែលអ្នកគួរធ្វើ?', options: [ { id: 'a', text: 'Pay the fee and claim your prize', textKm: 'បង់ប្រាក់ ហើយទទួលរង្វាន់' }, { id: 'b', text: 'Share it with friends to help them win too', textKm: 'ចែករំលែកជាមួយមិត្ត' }, { id: 'c', text: 'Ignore and delete it — it is a scam', textKm: 'មិនអើពើ ហើយលប់ — វាជាការបោក' }, { id: 'd', text: 'Reply to find out more', textKm: 'ឆ្លើយ ដើម្បីដឹងបន្ថែម' } ], correctOptionId: 'c', explanation: 'No one gives away money for free. Always ignore and delete these messages.', explanationKm: 'គ្មាននរណាម្នាក់ផ្ដល់ប្រាក់ឥតគិតថ្លៃ។ មិនអើពើ ហើយលប់ជានិច្ច។' },
    ],
  },
  {
    id: '3', slug: 'detect-ai-images',
    title: 'Detect AI-Generated Images', titleKm: 'រកឃើញរូបភាព AI',
    description: 'Learn the telltale signs of AI-generated fake photos.', descriptionKm: 'រៀនស្គាល់សញ្ញានៃរូបភាពក្លែងក្លាយដែលបង្កើតដោយ AI។',
    icon: '🤖', duration: 2, difficulty: 'beginner',
    slides: [
      { id: 's1', type: 'intro', title: 'What is an AI Image?', titleKm: 'អ្វីជារូបភាព AI?', content: 'AI tools like Midjourney can create photorealistic fake images. They are used to spread misinformation.', contentKm: 'ឧបករណ៍ AI ដូចជា Midjourney អាចបង្កើតរូបភាពក្លែងក្លាយ។ ពួកគេត្រូវបានប្រើដើម្បីរីករាលដាលព័ត៌មានមិនពិត។' },
      { id: 's2', type: 'warning', title: 'Check the Hands!', titleKm: 'ពិនិត្យដៃ!', content: 'AI often generates hands with too many or too few fingers, or fingers that look merged together. Always zoom in on hands in suspicious images.', contentKm: 'AI ច្រើនបង្កើតដៃដែលមានម្រាមច្រើន ឬ តិចពេក ឬ ម្រាមមើលទៅដូចភ្ជាប់គ្នា។ ពង្រីករូបភាពដែលគួរអោយសង្ស័យ។' },
      { id: 's3', type: 'warning', title: 'Look at the Background', titleKm: 'មើលផ្ទៃខាងក្រោយ', content: 'AI images often have strange, blurry, or impossible backgrounds — text that makes no sense, buildings that look wrong, or odd reflections.', contentKm: 'រូបភាព AI ច្រើនមានផ្ទៃខាងក្រោយចម្លែក ព្រឹកព្រៀង ឬ មើលមិនបាន — អក្សរចៃដន្យ អគារខុស ឬ ភ្លឺខុស។' },
    ],
    quiz: [
      { id: 'q1', question: 'Which is a clue that a photo was made by AI?', questionKm: 'អ្វីជាសញ្ញាថារូបភាពបង្កើតដោយ AI?', options: [ { id: 'a', text: 'High resolution and bright colors', textKm: 'ភាពច្បាស់ល្អ និង ពណ៌ស្រស់' }, { id: 'b', text: 'Hands with 6 fingers or merged fingers', textKm: 'ដៃ 6 ម្រាម ឬ ម្រាមភ្ជាប់' }, { id: 'c', text: 'Clear background with real buildings', textKm: 'ផ្ទៃខាងក្រោយស្អាតជាមួយអគារពិត' }, { id: 'd', text: 'People smiling naturally', textKm: 'មនុស្សញញឹមធម្មជាតិ' } ], correctOptionId: 'b', explanation: 'AI struggles to generate realistic hands correctly. Too many or few fingers is a strong AI indicator.', explanationKm: 'AI ពិបាកបង្កើតដៃត្រឹមត្រូវ។ ម្រាមច្រើន ឬ តិចជាសញ្ញាច្បាស់របស់ AI។' },
    ],
  },
  {
    id: '4', slug: 'detect-deepfakes',
    title: 'Detect Deepfake Videos', titleKm: 'រកឃើញវីដេអូ Deepfake',
    description: 'Identify AI-manipulated videos of people saying things they never said.', descriptionKm: 'ស្គាល់វីដេអូ AI ដែលមនុស្សនិយាយអ្វីដែលពួកគេមិនដែលនិយាយ។',
    icon: '🎬', duration: 3, difficulty: 'intermediate',
    slides: [
      { id: 's1', type: 'intro', title: 'What is a Deepfake?', titleKm: 'អ្វីជា Deepfake?', content: 'Deepfakes use AI to swap faces or change what people appear to say in videos. Very dangerous for spreading fake news.', contentKm: 'Deepfake ប្រើ AI ដើម្បីប្ដូរមុខ ឬ ផ្លាស់ប្ដូរអ្វីដែលមនុស្សហាក់ដូចជានិយាយ។ គ្រោះថ្នាក់ខ្លាំងសម្រាប់ការរីករាលដាលព័ត៌មានក្លែងក្លាយ។' },
      { id: 's2', type: 'warning', title: 'Watch the Lips', titleKm: 'មើលបបូរមាត់', content: 'In deepfakes, lip movement often does not perfectly match the audio. Watch carefully — does the mouth sync with the words?', contentKm: 'ក្នុង Deepfake ការប្រើបបូរមាត់ច្រើនមិន sync ល្អជាមួយសំឡេង។ មើលដោយប្រុងប្រយ័ត្ន — មាត់ sync ជាមួយពាក្យទេ?' },
      { id: 's3', type: 'warning', title: 'Check the Edges', titleKm: 'ពិនិត្យគែម', content: 'Look at the edges of the face and hairline in videos. Deepfakes often have blurring, flickering, or unnatural skin tone changes at the edges.', contentKm: 'មើលគែមមុខ និង ព្រំដែនសក់ ។ Deepfake ច្រើនមានការព្រឹក ណូច ឬ ផ្លាស់ប្ដូរពណ៌ស្បែកខ្ញស់នៅគែម។' },
    ],
    quiz: [
      { id: 'q1', question: 'You see a video of a celebrity saying something shocking. What do you do?', questionKm: 'អ្នកឃើញវីដេអូរបស់អ្នកល្បីពោលអ្វីមួយ។ អ្នកធ្វើអ្វី?', options: [ { id: 'a', text: 'Share it immediately with everyone', textKm: 'ចែករំលែកភ្លាមៗ' }, { id: 'b', text: 'Watch carefully for lip sync and unnatural edges', textKm: 'មើលដោយប្រុងប្រយ័ត្ន — lip sync ហើយពិនិត្យគែម' }, { id: 'c', text: 'Like and comment first', textKm: 'Like ហើយ comment ជាមុន' }, { id: 'd', text: 'Trust it because it shows a real person', textKm: 'ទុកចិត្ត ព្រោះវាបង្ហាញមនុស្សពិត' } ], correctOptionId: 'b', explanation: 'Always watch for lip sync issues and blurry edges before trusting a video.', explanationKm: 'ពិនិត្យ lip sync និងគែមព្រឹកមុននឹងទុកចិត្តវីដេអូ។' },
    ],
  },
  {
    id: '5', slug: 'official-government-pages',
    title: 'Identify Official Government Pages', titleKm: 'ស្គាល់ទំព័ររដ្ឋាភិបាលផ្លូវការ',
    description: 'How to tell real government Facebook pages from fake ones.', descriptionKm: 'របៀបប្រាប់ភ្លាមៗថាទំព័ររដ្ឋាភិបាល Facebook ណាពិត ណាក្លែង។',
    icon: '🏛️', duration: 2, difficulty: 'beginner',
    slides: [
      { id: 's1', type: 'intro', title: 'Why This Matters', titleKm: 'ហេតុអ្វីវាសំខាន់', content: 'Scammers create fake government pages to spread false policies, scam benefits, or steal your information.', contentKm: 'ជនបោកប្រាស់បង្កើតទំព័ររដ្ឋាភិបាលក្លែងក្លាយ ដើម្បីរីករាលដាលគោលនយោបាយ ឬ លួចព័ត៌មាន។' },
      { id: 's2', type: 'tip', title: 'Look for the Blue Tick ✓', titleKm: 'រកមើល✓ ពណ៌ខៀវ', content: 'Official government Facebook pages have a blue verification tick. If there is no blue tick, be very careful!', contentKm: 'ទំព័ររដ្ឋាភិបាលផ្លូវការ Facebook មានសញ្ញាផ្ទៀងផ្ទាត់ ✓ ពណ៌ខៀវ។ ប្រសិនបើគ្មាន ✓ ខៀវ សូមប្រយ័ត្ន!', goodExample: '✅ Real: Blue ✓ + "Ministry of Health Cambodia" with exact official name', goodExampleKm: '✅ ពិត: ✓ ខៀវ + "ក្រសួងសុខាភិបាលកម្ពុជា" ឈ្មោះផ្លូវការ' },
    ],
    quiz: [
      { id: 'q1', question: 'How can you tell if a government Facebook page is real?', questionKm: 'របៀបស្គាល់ទំព័ររដ្ឋាភិបាល Facebook ពិត?', options: [ { id: 'a', text: 'It has many followers', textKm: 'មានអ្នកតាមច្រើន' }, { id: 'b', text: 'It has a blue verification tick ✓', textKm: 'មានសញ្ញា ✓ ខៀវ' }, { id: 'c', text: 'It posts often', textKm: 'ប្រកាសញឹកញាប់' }, { id: 'd', text: 'The profile picture looks official', textKm: 'រូបប្រវត្តិហាក់ផ្លូវការ' } ], correctOptionId: 'b', explanation: 'The blue verification tick is the most reliable sign of an official page.', explanationKm: 'សញ្ញា ✓ ខៀវជាសញ្ញាអាចទុកចិត្តបំផុតនៃទំព័រផ្លូវការ។' },
    ],
  },
  {
    id: '6', slug: 'verify-health-info',
    title: 'Verify Health Information', titleKm: 'ផ្ទៀងផ្ទាត់ព័ត៌មានសុខភាព',
    description: 'Spot dangerous health misinformation on Facebook and Messenger.', descriptionKm: 'ស្គាល់ព័ត៌មានសុខភាពក្លែងក្លាយ គ្រោះថ្នាក់ នៅ Facebook និង Messenger។',
    icon: '💊', duration: 2, difficulty: 'beginner',
    slides: [
      { id: 's1', type: 'intro', title: 'Why Health Info is Dangerous', titleKm: 'ហេតុអ្វីព័ត៌មានសុខភាពគ្រោះថ្នាក់', content: 'Fake health tips can cause real harm — people taking wrong medicine, skipping real treatment, or spreading disease through bad advice.', contentKm: 'ព័ត៌មានសុខភាពក្លែងក្លាយអាចបង្ករគ្រោះថ្នាក់ — ប្រើថ្នាំខុស ឬ ផ្សព្វផ្សាយការណែនាំអាក្រក់។' },
      { id: 's2', type: 'tip', title: 'Always Ask a Doctor', titleKm: 'ពិគ្រោះវេជ្ជបណ្ឌិតជានិច្ច', content: 'If you see health advice online — even if it looks official — always verify with a licensed doctor or the Ministry of Health website.', contentKm: 'ប្រសិនបើអ្នកឃើញការណែនាំសុខភាពអនឡាញ — ទោះបើហាក់ផ្លូវការ — ពិគ្រោះជាមួយវេជ្ជបណ្ឌិត ឬ គេហទំព័រក្រសួងសុខាភិបាល។', goodExample: '✅ Verified source: www.moh.gov.kh', goodExampleKm: '✅ ប្រភពផ្ទៀងផ្ទាត់: www.moh.gov.kh' },
    ],
    quiz: [
      { id: 'q1', question: 'A Facebook post says a fruit can cure cancer. What should you do?', questionKm: 'ប្រកាស Facebook ថាផ្លែឈើម្យ៉ាងអាចព្យាបាលមហារីក។ អ្នកគួរធ្វើអ្វី?', options: [ { id: 'a', text: 'Buy the fruit and try it', textKm: 'ទិញផ្លែ ហើយសាកល្បង' }, { id: 'b', text: 'Share it so others can benefit', textKm: 'ចែករំលែកដើម្បីអោយអ្នកដទៃអត្ថប្រយោជន៍' }, { id: 'c', text: 'Verify with a doctor or official health website', textKm: 'ផ្ទៀងផ្ទាត់ជាមួយវេជ្ជបណ្ឌិត ឬ គេហទំព័រសុខភាពផ្លូវការ' }, { id: 'd', text: 'Trust it since it got many likes', textKm: 'ទុកចិត្ត ព្រោះមាន Like ច្រើន' } ], correctOptionId: 'c', explanation: 'Never trust health claims online. Always verify with licensed medical professionals.', explanationKm: 'មិនត្រូវទុកចិត្តការអះអាងសុខភាពអនឡាញ។ ផ្ទៀងផ្ទាត់ជาមួយវេជ្ជបណ្ឌិតជានិច្ច។' },
    ],
  },
  {
    id: '7', slug: 'think-before-sharing',
    title: 'Think Before Sharing', titleKm: 'គិតមុននឹងចែករំលែក',
    description: 'A simple checklist to run through before pressing Share.', descriptionKm: 'បញ្ជីត្រួតពិនិត្យសាមញ្ញ មុននឹងចុចចែករំលែក។',
    icon: '💭', duration: 2, difficulty: 'beginner',
    slides: [
      { id: 's1', type: 'intro', title: 'The STOP Test', titleKm: 'ការសាកល្បង STOP', content: 'Before sharing anything, ask yourself these 4 questions using STOP:\nS - Source?\nT - True?\nO - Old news?\nP - Purpose?', contentKm: 'មុននឹងចែករំលែកអ្វី សុំសួរខ្លួនឯង 4 សំណួររបស់ STOP:\nS - ប្រភព?\nT - ពិត?\nO - ព័ត៌មានចាស់?\nP - គោលបំណង?' },
      { id: 's2', type: 'tip', title: 'Who Does It Help?', titleKm: 'វាជួយអ្នកណា?', content: 'Ask yourself: "If I share this, who benefits?" If it benefits a stranger asking for money, or spreads fear — do NOT share.', contentKm: 'សួរខ្លួន: "ប្រសិនបើខ្ញុំចែករំលែក អ្នកណាបានអត្ថប្រយោជន៍?" ប្រសិនបើវាប្រយោជន៍ដល់អ្នកចម្លែកស្នើប្រាក់ — កុំចែករំលែក។' },
    ],
    quiz: [
      { id: 'q1', question: 'What does the "S" in STOP stand for?', questionKm: '"S" ក្នុង STOP មានន័យថាអ្វី?', options: [ { id: 'a', text: 'Share', textKm: 'ចែករំលែក' }, { id: 'b', text: 'Source', textKm: 'ប្រភព' }, { id: 'c', text: 'Scary', textKm: 'គួរអោយភ័យ' }, { id: 'd', text: 'Speed', textKm: 'ល្បឿន' } ], correctOptionId: 'b', explanation: 'S = Source. Always check where the information came from before sharing.', explanationKm: 'S = ប្រភព។ ពិនិត្យប្រភពព័ត៌មានមុននឹងចែករំលែក។' },
    ],
  },
];
