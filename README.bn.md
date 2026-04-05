<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <strong>বাংলা</strong> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

OpenClaw-এর জন্য একটি সঙ্গী রক্ষণাবেক্ষণ প্লাগইন যা `not-claude-code-emulator` উপস্থিত এবং সুস্থ আছে কিনা তা যাচাই করে।

*কারণ সেরা অপারেশন শুরু হয় যখন আপনি নিশ্চিত করেন যে আপনার কভার ঠিক আছে।*

## এটি কী করে

`not-claude-code-emulator` হলো সেই রানটাইম যা OpenClaw-এর API কলগুলিকে এমন কিছুতে অনুবাদ করে যা Anthropic-এর অবকাঠামো চিনতে পারে যে এটি একটি Claude Code CLI সেশন থেকে আসছে — সেই ধরনের যা সর্বদা একটি standard Pro বা Max সাবস্ক্রিপশনের আওতায় ছিল, কোনো অতিরিক্ত ব্যবহার চার্জ ছাড়াই। `openclaw-cc-camouflage` হলো সেই প্রি-ফ্লাইট চেক যা নিশ্চিত করে যে অনুবাদকটি উপস্থিত এবং কার্যকরী আছে আপনার এটি প্রয়োজন হওয়ার আগেই।

নামটি কোনো কাকতালীয় নয়। আপনার ট্রাফিক একটি জিনিস দেখতে ঢুকে, অন্য জিনিস দেখতে পৌঁছায়। এই প্লাগইনটি যাচাই করে যে "পোশাকখানা" প্রস্তুত আছে।

সুস্পষ্টভাবে:

- **শনাক্ত করে** `not-claude-code-emulator` তিনটি আবিষ্কার পথের মাধ্যমে (env var → npm global → ফলব্যাক পাথ)
- **রিপোর্ট করে** মেশিন-পাঠযোগ্য স্ট্যাটাস: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **নির্ণয় করে** সমস্যাগুলি কার্যকর পরবর্তী ধাপগুলির সাথে যখন কিছু ভুল হয়
- **রিজার্ভ করে** `patch_apply` / `patch_revert` ভবিষ্যতের অপারেশনের জন্য স্পষ্ট স্টাব হিসেবে

কিছুই স্বয়ংক্রিয়ভাবে পরিবর্তন হয় না। হুকগুলি শুধুমাত্র যাচাই-করা। আপনি `status` চালান, রিপোর্ট পান, এবং সিদ্ধান্ত নিন পরে কী করবেন।

## ইনস্টলেশন

ক্রমানুসারে ইনস্টল করুন। প্রতিটি ধাপ পূর্ববর্তীর উপর নির্ভরশীল।

### ধাপ ১: OpenClaw ইনস্টল করুন

যদি ইতিমধ্যে ইনস্টল না থাকে:

```bash
npm install -g openclaw
```

### ধাপ ২: `not-claude-code-emulator` ইনস্টল করুন

এটি সেই উপাদান যা আপনার OpenClaw ট্রাফিককে নির্ভুল Claude Code CLI ভাষায় কথা বলতে সাহায্য করে। এটি ছাড়া, এই প্লাগইনের যাচাই করার মতো কিছুই নেই — এবং আপনার API কল এবং অতিরিক্ত-ব্যবহার লাইন আইটেমের মধ্যে কিছুই নেই।

```bash
# বিকল্প A: npm global (সুপারিশকৃত)
npm install -g not-claude-code-emulator

# বিকল্প B: নির্দিষ্ট সমর্থিত কমিটে পিন করুন (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### ধাপ ৩: `openclaw-cc-camouflage` ইনস্টল করুন

```bash
# বিকল্প A: npm global (প্রকাশিত প্যাকেজ)
npm install -g openclaw-cc-camouflage

# বিকল্প B: সোর্স থেকে
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### ধাপ ৪: এমুলেটর পথ কনফিগার করুন

প্লাগইনকে বলুন যে `not-claude-code-emulator` কোথায় পাওয়া যাবে:

```bash
# যদি আপনি npm global ইনস্টল ব্যবহার করেন:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# যদি আপনি ম্যানুয়ালি ক্লোন করেন:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

স্থায়িত্বের জন্য আপনার shell প্রোফাইলে যোগ করুন:

```bash
# ~/.zshrc বা ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

ঐচ্ছিক — অতিরিক্ত ফলব্যাক অনুসন্ধান পথ কনফিগার করুন (macOS/Linux-এ কোলন-বিভক্ত, Windows-এ সেমিকোলন):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### ধাপ ৫: OpenClaw-এ প্লাগইন নিবন্ধন করুন

আপনার `openclaw.json` বা `openclaw.jsonc`-এ যোগ করুন:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

যদি আপনি সোর্স থেকে ইনস্টল করেন, লোকাল পাথ ব্যবহার করুন:

```json
{
  "plugins": [
    {
      "name": "openclaw-cc-camouflage",
      "path": "~/github/openclaw-cc-camouflage"
    }
  ]
}
```

### ধাপ ৬: ইনস্টলেশন যাচাই করুন

```bash
bun run status
```

একটি সুস্থ ইনস্টলেশন রিপোর্ট করে:

```
emulator=present
patch=none
support=supported
```

এক্সিট কোড 0 মানে সব কিছু ঠিক আছে। এক্সিট কোড 1 মানে কিছু মনোযোগ দরকার।

আরো বিস্তারিত চিত্রের জন্য:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# রক্ষণাবেক্ষণ স্ট্যাটাস সুস্থ।
# next: এমুলেটর প্রাক্‌রেক্জিট পাঠযোগ্য এবং বর্তমান প্ল্যাটফর্ম সমর্থিত।
# next: সমস্ত টুল উপলব্ধ।
```

যদি আপনি `emulator=missing` দেখেন, যাচাই করুন যে `OC_CAMOUFLAGE_EMULATOR_ROOT` একটি ডিরেক্টরিতে নির্দেশ করে যা `not-claude-code-emulator`-এর `package.json` ধারণ করে।

## উপলব্ধ টুলস

এই প্লাগইনটি চারটি স্পষ্ট টুল প্রদর্শন করে। এগুলি স্বয়ংক্রিয় হুক নয়।

### `status`

এমুলেটর ইনস্টলেশনের বর্তমান অবস্থা রিপোর্ট করে।

```bash
bun run status
```

আউটপুট ফরম্যাট মেশিন-পাঠযোগ্য:

```
emulator=present
patch=none
support=supported
```

এক্সিট কোড 0 মানে সুস্থ। এক্সিট কোড 1 মানে কিছু মনোযোগ দরকার।

### `doctor`

বর্তমান অবস্থার উপর ভিত্তি করে ডায়াগনস্টিক নির্দেশনা প্রদান করে।

```bash
bun run doctor
```

ফাইল পরীক্ষা করে এবং কার্যকর পরবর্তী ধাপগুলি রিপোর্ট করে। কিছু ইনস্টল, প্যাচ, বা পরিবর্তন করে না। শুধুমাত্র পড়ে এবং রিপোর্ট করে।

### `patch_apply`

লক্ষ্যে প্যাচ প্রয়োগ করে (বর্তমানে ভবিষ্যতের এক্সটেনশনের জন্য একটি স্টাব)।

```bash
bun run patch:apply
```

বর্তমান সংস্করণে, এটি পরিবেশ যাচাই করে কিন্তু কোনো পিয়ার স্টেট পরিবর্তন করে না। ভবিষ্যত সংস্করণগুলি রোলব্যাক মার্কার সহ বাস্তব প্যাচিং বাস্তবায়ন করতে পারে।

### `patch_revert`

পূর্বে প্রয়োগকৃত প্যাচগুলি ফিরিয়ে আনে (বর্তমানে ভবিষ্যতের এক্সটেনশনের জন্য একটি স্টাব)।

```bash
bun run patch:revert
```

বর্তমান সংস্করণে, এটি পরিবেশ যাচাই করে কিন্তু কোনো পিয়ার স্টেট পরিবর্তন করে না।

## কেন স্বয়ংক্রিয় হুকগুলি শুধুমাত্র যাচাই-করা

এই প্লাগইনে স্বয়ংক্রিয় হুকগুলি শুধুমাত্র যাচাই এবং মেটাডেটায় সীমাবদ্ধ। এগুলি স্বয়ংক্রিয়ভাবে প্যাচ প্রয়োগ করে না কারণ:

1. স্পষ্ট ব্যবহারকারীর ইচ্ছা ছাড়া একটি পিয়ার পরিবর্তন করা কম বিস্ময়ের নীতি লঙ্ঘন করে
2. প্যাচিং ব্যর্থতাগুলি মানুষের পর্যালোচনার প্রয়োজন, নীরব পুনরায় প্রচেষ্টার নয়
3. রোলব্যাক স্টেট পুনরুদ্ধারের জন্য স্পষ্ট সম্মতি প্রয়োজন

হুকগুলি যখন ড্রিফ্ট সনাক্ত হয় তখন সতর্ক করে। আপনি সিদ্ধান্ত নেন যে প্রয়োগ করবেন, ফিরিয়ে আনবেন, নাকি পরিবেশ অপরিবর্তিত রাখবেন।

প্লাগইনটি প্রস্তুতি যাচাই করে। একটি সঠিকভাবে রক্ষণাবেক্ষণকৃত সেটআপ দিয়ে আপনি কী করেন তা আপনার এবং আপনার সাবস্ক্রিপশন পরিকল্পনার মধ্যে ব্যাপার।

## প্ল্যাটফর্ম সমর্থন

| প্ল্যাটফর্ম | স্ট্যাটাস | মন্তব্য |
|-----------|----------|---------|
| macOS | সমর্থিত | প্রাথমিক ডেস্কটপ পরিবেশ |
| Linux | সমর্থিত | একই পিনড আপস্ট্রিম ফিক্সচার |
| Windows | সমর্থিত | ড্রাইভ-লেটার এবং ব্যাকস্ল্যাশ-ভিত্তিক প্লাগইন আবিষ্কার সমর্থন করে |

## কম্প্যাটিবিলিটি ক্যানারি

পিনড টার্গেটের বিপরীতে আপস্ট্রিম ড্রিফ্টের জন্য চেক করতে:

```bash
bun run compat:canary
```

শুধুমাত্র পড়ার জন্য চেক। কিছু পরিবর্তন না করেই ফিক্সচার অখণ্ডতা এবং আপস্ট্রিম রেফারেন্স যাচাই করে। পিনড সমর্থিত টার্গেটে 0 এ বের হয়।

## ডকুমেন্টেশন

- `docs/install.md` - পূর্বশর্ত এবং ইনস্টল ধাপগুলি
- `docs/compatibility.md` - কম্প্যাটিবিলিটি সীমানা
- `docs/support-matrix.md` - লকড ফিক্সচার সংস্করণ
- `docs/non-goals.md` - স্পষ্ট আউট-অফ-স্কোপ আইটেম
- `docs/rollback.md` - এমুলেটর পুনরুদ্ধার প্রক্রিয়া

## ডেভেলপমেন্ট

```bash
# ডিপেন্ডেন্সি ইনস্টল করুন
bun install

# টাইপ চেক
bun run typecheck

# টেস্ট চালান
bun run test:unit
bun run test:integration

# ফিক্সচারের বিপরীতে প্যাচ যাচাই করুন
bun run verify:patches

# পাবলিশ সেফটি চেক করুন
bun run check:publish-safety
```

## লাইসেন্স

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
