<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
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
  <strong>ไทย</strong> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

ปลั๊กอินบำรุงรักษาคู่หูสำหรับ OpenClaw ที่ช่วยตรวจสอบสถานะ not-claude-code-emulator แพ็คเกจนี้ไม่ใช่ fork ของโปรเจกต์ upstream มันให้เครื่องมือที่ชัดเจนโดยไม่มี hooks อัตโนมัติ

## นี่คืออะไร

`openclaw-cc-camouflage` เป็นปลั๊กอินบำรุงรักษาที่:

- ตรวจสอบการมีอยู่และสุขภาพของ emulator ก่อนการดำเนินการใดๆ
- รายงานสถานะและให้คำแนะนำการวินิจฉัย
- ให้การ implement stub สำหรับการดำเนินการ patch ในอนาคต

มันไม่ใช้ patch โดยอัตโนมัติระหว่างการติดตั้ง การเปลี่ยนแปลงทั้งหมดต้องการการเรียกใช้เครื่องมืออย่างชัดเจน

## ข้อกำหนดเบื้องต้นและลำดับการติดตั้ง

ลำดับการติดตั้งมีความสำคัญ คุณต้องมีสิ่งต่อไปนี้ก่อนที่ปลั๊กอินนี้จะทำงานได้:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Runtime ข้อความที่ให้ interface ที่เข้ากันได้กับ Anthropic
   - ติดตั้งผ่าน npm: `npm install -g not-claude-code-emulator`
   - หรือ clone ลงใน `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (แพ็คเกจนี้)
   - ติดตั้งเป็นครั้งสุดท้าย หลังจาก emulator มีอยู่

กำหนดค่าตัวแปรสภาพแวดล้อม:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

หรือใช้เส้นทาง fallback:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## เครื่องมือที่มีอยู่

ปลั๊กอินนี้เปิดเผยเครื่องมือที่ชัดเจนสี่อย่าง พวกมันไม่ใช่ hooks อัตโนมัติ

### `status`

รายงานสถานะปัจจุบันของการติดตั้ง emulator

```bash
bun run status
```

รูปแบบ output อ่านได้โดยเครื่อง:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

รหัส exit 0 หมายถึงปกติ รหัส exit 1 หมายถึงมีบางอย่างที่ต้องการความสนใจ

### `doctor`

ให้คำแนะนำการวินิจฉัยตามสถานะปัจจุบัน

```bash
bun run doctor
```

สิ่งนี้ตรวจสอบไฟล์และรายงานขั้นตอนถัดไปที่ดำเนินการได้ มันไม่ติดตั้ง patch หรือแก้ไขอะไรเลย มันอ่านและรายงานเท่านั้น

### `patch_apply`

ใช้ patches กับเป้าหมาย (ปัจจุบันเป็น stub สำหรับการขยายในอนาคต)

```bash
bun run patch:apply
```

ในเวอร์ชันปัจจุบัน สิ่งนี้ตรวจสอบสภาพแวดล้อมแต่ไม่แก้ไขสถานะ peer เวอร์ชันในอนาคตอาจ implement การ patching จริงด้วย rollback markers

### `patch_revert`

ย้อนกลับ patches ที่เคยใช้ไปแล้ว (ปัจจุบันเป็น stub สำหรับการขยายในอนาคต)

```bash
bun run patch:revert
```

ในเวอร์ชันปัจจุบัน สิ่งนี้ตรวจสอบสภาพแวดล้อมแต่ไม่แก้ไขสถานะ peer เวอร์ชันในอนาคตอาจ implement การย้อนกลับจริงโดยใช้ rollback markers

## ทำไม hooks อัตโนมัติจึงเป็นเพียงการตรวจสอบ

Hooks อัตโนมัติในปลั๊กอินนี้จำกัดเฉพาะการตรวจสอบและ metadata พวกมันไม่ใช้ patches โดยอัตโนมัติเพราะ:

1. การเปลี่ยนแปลง peer โดยไม่มีเจตนาของผู้ใช้อย่างชัดเจนละเมิดหลักการของความประหลาดใจน้อยที่สุด
2. ความล้มเหลวในการ patch ต้องการการตรวจสอบโดยมนุษย์ ไม่ใช่การลองใหม่โดยไม่มีเสียง
3. การย้อนกลับต้องการความยินยอมอย่างชัดเจนเพื่อคืนสถานะ

Hooks เตือนเมื่อตรวจพบ drift คุณตัดสินใจว่าจะใช้ ย้อนกลับ หรือปล่อยสภาพแวดล้อมไว้ตามเดิม

## การสนับสนุนแพลตฟอร์ม

| แพลตฟอร์ม | สถานะ | หมายเหตุ |
|----------|--------|-------|
| macOS    | รองรับ | สภาพแวดล้อม desktop หลัก |
| Linux    | รองรับ | Fixtures upstream ที่ pin เหมือนกัน |
| Windows  | รองรับ | รองรับการค้นหาปลั๊กอินบนพื้นฐานตัวอักษรไดรฟ์และ backslash |

## นกคั่นแคนารีความเข้ากันได้

เพื่อตรวจสอบ drift ของ upstream เทียบกับเป้าหมายที่ pin:

```bash
bun run compat:canary
```

นี่เป็นการตรวจสอบแบบอ่านอย่างเดียวที่ตรวจสอบความสมบูรณ์ของ fixture และ references ของ upstream โดยไม่แก้ไขอะไรเลย มัน exit ด้วย 0 บนเป้าหมายที่รองรับซึ่งถูก pin

## เอกสาร

- `docs/install.md` - ข้อกำหนดเบื้องต้นและขั้นตอนการติดตั้ง
- `docs/compatibility.md` - ขอบเขตความเข้ากันได้
- `docs/support-matrix.md` - เวอร์ชัน fixture ที่ถูกล็อก
- `docs/non-goals.md` - รายการนอกขอบเขตอย่างชัดเจน

## การพัฒนา

```bash
# ติดตั้ง dependencies
bun install

# ตรวจสอบ type
bun run typecheck

# รัน tests
bun run test:unit
bun run test:integration

# ตรวจสอบ patches เทียบกับ fixtures
bun run verify:patches

# ตรวจสอบความปลอดภัยในการ publish
bun run check:publish-safety
```

## สัญญาอนุญาต

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->