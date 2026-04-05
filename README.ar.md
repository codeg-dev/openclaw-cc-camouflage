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

ملحق صيانة مرافق لـ OpenClaw يساعد في التحقق من حالة not-claude-code-emulator. هذه الحزمة ليست شوكة من المشاريع الرئيسية. توفر أدوات صريحة بدون خطافات تلقائية.

## ما هذا

`openclaw-cc-camouflage` هو ملحق صيانة يقوم بما يلي:

- التحقق من وجود المحاكي وصحته قبل أي عمليات
- الإبلاغ عن الحالة وتقديم إرشادات تشخيصية
- توفير تنفيذات وهمية للعمليات الترقيعية المستقبلية

لا يقوم بتطبيق الترقيع تلقائياً أثناء التثبيت. يتطلب كل تغيير استدعاء أداة صريح.

## المتطلبات المسبقة وترتيب التثبيت

ترتيب التثبيت مهم. يجب أن تتوفر لديك ما يلي قبل أن يعمل هذا الملحق:

1. **`not-claude-code-emulator`** (الإصدار `5541e5c`)
   - بيئة تشغيل الرسائل التي توفر واجهات متوافقة مع Anthropic
   - التثبيت عبر npm: `npm install -g not-claude-code-emulator`
   - أو استنساخ إلى `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (هذه الحزمة)
   - التثبيت آخراً، بعد وجود المحاكي

قم بتهيئة متغير البيئة:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

أو استخدم مسارات احتياطية:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## الأدوات المتاحة

يعرض هذا الملحق أربع أدوات صريحة. إنها ليست خطافات تلقائية.

### `status`

يبلغ عن الحالة الحالية لتثبيت المحاكي.

```bash
bun run status
```

تنسيق الإخراج قابل للقراءة آلياً:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

رمز الخروج 0 يعني صحيح. رمز الخروج 1 يعني وجود شيء يحتاج الانتباه.

### `doctor`

يوفر إرشادات تشخيصية بناءً على الحالة الحالية.

```bash
bun run doctor
```

يفحص هذا الملفات ويبلغ عن خطوات قابلة للتنفيذ. لا يثبت أو يرقع أو يعدل أي شيء. يقرأ فقط ويبلغ.

### `patch_apply`

يطبع ترقيعات على الهدف (حاليًا وهمي للتوسع المستقبلي).

```bash
bun run patch:apply
```

في الإصدار الحالي، يتحقق هذا من البيئة ولكنه لا يعدل أي حالة نظير. قد تنفذ الإصدارات المستقبلية ترقيعاً فعلياً مع علامات استرجاع.

### `patch_revert`

يعكس الترقيعات المطبقة سابقاً (حاليًا وهمي للتوسع المستقبلي).

```bash
bun run patch:revert
```

في الإصدار الحالي، يتحقق هذا من البيئة ولكنه لا يعدل أي حالة نظير. قد تنفذ الإصدارات المستقبلية استرجاعاً فعلياً باستخدام علامات الاسترجاع.

## لماذا الخطافات التلقائية للتحقق فقط

الخطافات التلقائية في هذا الملحق محدودة بالتحقق والبيانات الوصفية فقط. لا تقوم بتطبيق الترقيعات تلقائياً لأن:

1. تغيير النظير دون نية مستخدم صريحة ينتهك مبدأ المفاجأة الأقل
2. فشل الترقيع يحتاج إلى مراجعة بشرية، وليس إعادة محاولة صامتة
3. الاسترجاع يتطلب موافقة صريحة لاستعادة الحالة

تحذر الخطافات عند اكتشاف الانحراف. أنت تقرر ما إذا كنت تريد التطبيق أو الاسترجاع أو ترك البيئة دون تغيير.

## دعم المنصة

| المنصة | الحالة | الملاحظات |
|----------|--------|-------|
| macOS    | مدعوم | بيئة سطح المكتب الأساسية |
| Linux    | مدعوم | نفس التركيبات الرئيسية المثبتة |
| Windows  | مدعوم | يدعم اكتشاف الملحقات المستندة إلى حرف القرص والشرطة المائلة للخلف |

## كناري التوافق

للتحقق من الانحراف الرئيسي مقابل الأهداف المثبتة:

```bash
bun run compat:canary
```

هذا فحص للقراءة فقط يتحقق من سلامة التركيب والمراجع الرئيسية دون تعديل أي شيء. يخرج 0 على الأهداف المثبتة المدعومة.

## الوثائق

- `docs/install.md` - المتطلبات المسبقة وخطوات التثبيت
- `docs/compatibility.md` - حدود التوافق
- `docs/support-matrix.md` - إصدارات التركيب المقفلة
- `docs/non-goals.md` - العناصر الصريحة خارج النطاق

## التطوير

```bash
# تثبيت التبعيات
bun install

# فحص النوع
bun run typecheck

# تشغيل الاختبارات
bun run test:unit
bun run test:integration

# التحقق من الترقيعات مقابل التركيبات
bun run verify:patches

# التحقق من سلامة النشر
bun run check:publish-safety
```

## الترخيص

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->