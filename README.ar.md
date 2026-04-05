<p align="center">
  <a href="README.md">English</a> |
  <strong>العربية</strong> |
  <a href="README.bn.md">বাংলা</a> |
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

إضافة صيانة مرافقة لـ OpenClaw للتحقق من وجود `not-claude-code-emulator` وصحته.

*لأن أفضل عملية تبدأ بتأكيد أن غطاءك في مكانه.*

## ما الذي يفعله

`not-claude-code-emulator` هو بيئة التشغيل التي تترجم مكالمات واجهة برمجة تطبيقات OpenClaw إلى شيء تتعرف عليه بنية Anthropic على أنه قادم من جلسة Claude Code CLI — النوع الذي كان دائمًا مغطى باشتراك Pro أو Max قياسي، بدون رسوم استخدام إضافية مطلوبة. `openclaw-cc-camouflage` هي عملية التحقق المسبق التي تؤكد وجود المترجم وعمله قبل أن تحتاج إليه.

الاسم ليس صدفة. حركة المرور الخاصة بك تدخل بمظهر شيء وتصل بمظهر آخر. هذه الإضافة تتحقق من أن "الخزانة" جاهزة.

بشكل ملموس:

- **يكتشف** `not-claude-code-emulator` عبر ثلاثة مسارات اكتشاف (متغير بيئة → npm global → مسارات احتياطية)
- **يبلغ** عن الحالة المقروءة آليًا: `emulator=present|missing|unreachable`، `patch=none`، `support=supported|unsupported`
- **يشخص** المشاكل مع خطوات قابلة للتنفيذ عندما يكون هناك خطأ ما
- **يحتفظ** بـ `patch_apply` / `patch_revert` كأماكن محجوزة صريحة للعمليات المستقبلية

لا شيء يتغير تلقائيًا. الخطافات للتحقق فقط. تقوم بتشغيل `status`، تحصل على التقرير، وتقرر ما تفعله بعد ذلك.

## التثبيت

ثبت بالترتيب. كل خطوة تعتمد على السابقة.

### الخطوة 1: تثبيت OpenClaw

إذا لم يكن مثبتًا بالفعل:

```bash
npm install -g openclaw
```

### الخطوة 2: تثبيت `not-claude-code-emulator`

هذا هو المكون الذي يجعل حركة مرور OpenClaw تتحدث بلغة Claude Code CLI بطلاقة. بدونه، لا يوجد شيء لهذه الإضافة للتحقق منه — ولا شيء يقف بين مكالمات واجهة برمجة التطبيقات الخاصة بك وبند استخدام إضافي.

```bash
# الخيار أ: npm global (موصى به)
npm install -g not-claude-code-emulator

# الخيار ب: تثبيت الإصدار المدعوم بالضبط (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### الخطوة 3: تثبيت `openclaw-cc-camouflage`

```bash
# الخيار أ: npm global (الحزمة المنشورة)
npm install -g openclaw-cc-camouflage

# الخيار ب: من المصدر
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### الخطوة 4: تكوين مسار المحاكي

أخبر الإضافة بمكان العثور على `not-claude-code-emulator`:

```bash
# إذا استخدمت تثبيت npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# إذا قمت بالاستنساخ يدويًا:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

أضف إلى ملف تعريف shell الخاص بك للاستمرارية:

```bash
# ~/.zshrc أو ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

اختياري — قم بتكوين مسارات بحث احتياطية إضافية (مفصولة بنقطتين على macOS/Linux، ونقطة فاصلة على Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### الخطوة 5: تسجيل الإضافة في OpenClaw

أضف إلى `openclaw.json` أو `openclaw.jsonc` الخاص بك:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

إذا قمت بالتثبيت من المصدر، استخدم المسار المحلي:

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

### الخطوة 6: التحقق من التثبيت

```bash
bun run status
```

التثبيت الصحيح يبلغ عن:

```
emulator=present
patch=none
support=supported
```

رمز الخروج 0 يعني أن كل شيء على ما يرام. رمز الخروج 1 يعني أن هناك شيئًا يحتاج إلى اهتمام.

للحصول على صورة أكثر تفصيلاً:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# حالة الصيانة صحية.
# next: متطلب المحاكي قابل للقراءة والمنصة الحالية مدعومة.
# next: جميع الأدوات متاحة.
```

إذا رأيت `emulator=missing`، تحقق من أن `OC_CAMOUFLAGE_EMULATOR_ROOT` يشير إلى دليل يحتوي على `package.json` الخاص بـ `not-claude-code-emulator`.

## الأدوات المتاحة

تعرض هذه الإضافة أربعة أدوات صريحة. إنها ليست خطافات تلقائية.

### `status`

يبلغ عن الحالة الحالية لتثبيت المحاكي.

```bash
bun run status
```

تنسيق الإخراج مقروء آليًا:

```
emulator=present
patch=none
support=supported
```

رمز الخروج 0 يعني صحيح. رمز الخروج 1 يعني أن هناك شيئًا يحتاج إلى اهتمام.

### `doctor`

يوفر إرشادات تشخيصية بناءً على الحالة الحالية.

```bash
bun run doctor
```

يفحص الملفات ويبلغ عن خطوات قابلة للتنفيذ. لا يثبت، أو يرقع، أو يعدل أي شيء. يقرأ ويبلغ فقط.

### `patch_apply`

يطبق تصحيحات على الهدف (حاليًا مكان محجوز للتوسع المستقبلي).

```bash
bun run patch:apply
```

في الإصدار الحالي، هذا يتحقق من البيئة ولكن لا يعدل أي حالة نظير. قد تنفذ الإصدارات المستقبلية تصحيحًا فعليًا مع علامات استرجاع.

### `patch_revert`

يسترجع التصحيحات المطبقة مسبقًا (حاليًا مكان محجوز للتوسع المستقبلي).

```bash
bun run patch:revert
```

في الإصدار الحالي، هذا يتحقق من البيئة ولكن لا يعدل أي حالة نظير.

## لماذا الخطافات التلقائية للتحقق فقط

الخطافات التلقائية في هذه الإضافة محدودة بالتحقق والبيانات الوصفية فقط. إنها لا تطبق تصحيحات تلقائيًا لأن:

1. تغيير نظير بدون نية مستخدم صريحة ينتهك مبدأ المفاجأة الأقل
2. فشل التصحيحات يحتاج إلى مراجعة بشرية، وليس محاولات صامتة
3. الاسترجاع يتطلب موافقة صريحة لاستعادة الحالة

الخطافات تحذر عند اكتشاف انحراف. أنت تقرر ما إذا كنت تريد تطبيق، أو استرجاع، أو ترك البيئة دون تغيير.

الإضافة تتحقق من الجاهزية. ما تفعله بإعداد تم صيانته بشكل صحيح هو بينك وبين خطة اشتراكك.

## دعم المنصات

| المنصة | الحالة | ملاحظات |
|--------|--------|---------|
| macOS | مدعوم | بيئة سطح المكتب الأساسية |
| Linux | مدعوم | نفس الأهداف الثابتة upstream |
| Windows | مدعوم | يدعم اكتشاف الإضافات المستند إلى حرف محرك الأقراص والشرطة المائلة العكسية |

## فحص التوافق

للتحقق من الانحراف upstream مقابل الأهداف الثابتة:

```bash
bun run compat:canary
```

فحص للقراءة فقط. يتحقق من سلامة التثبيت ومراجع upstream دون تعديل أي شيء. يخرج 0 على الأهداف الثابتة المدعومة.

## التوثيق

- `docs/install.md` - المتطلبات الأساسية وخطوات التثبيت
- `docs/compatibility.md` - حدود التوافق
- `docs/support-matrix.md` - إصدارات التثبيت الثابتة
- `docs/non-goals.md` - عناصر خارج النطاق صريحة
- `docs/rollback.md` - إجراءات استرداد المحاكي

## التطوير

```bash
# تثبيت التبعيات
bun install

# فحص الأنواع
bun run typecheck

# تشغيل الاختبارات
bun run test:unit
bun run test:integration

# التحقق من التصحيحات مقابل التثبيتات
bun run verify:patches

# فحص سلامة النشر
bun run check:publish-safety
```

## الترخيص

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
