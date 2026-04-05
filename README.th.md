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

ปลั๊กอินบำรุงรักษาคู่หูสำหรับ OpenClaw ที่ตรวจสอบว่า `not-claude-code-emulator` มีอยู่และทำงานได้ดี

*เพราะการดำเนินการที่ดีที่สุดเริ่มต้นด้วยการยืนยันว่าที่บังของคุณอยู่ในตำแหน่ง*

## สิ่งที่สิ่งนี้ทำ

`not-claude-code-emulator` คือรันไทม์ที่แปลงการเรียก API ของ OpenClaw เป็นสิ่งที่โครงสร้างพื้นฐานของ Anthropic จดจำได้ว่ามาจากเซสชัน Claude Code CLI — ประเภทที่ได้รับความคุ้มครองจากการสมัครสมาชิก Pro หรือ Max มาตรฐานเสมอ โดยไม่ต้องเสียค่าธรรมเนียมการใช้งานเพิ่มเติม `openclaw-cc-camouflage` คือการตรวจสอบก่อนบินที่ยืนยันว่าตัวแปลมีอยู่และทำงานได้ก่อนที่คุณจะต้องการมัน

ชื่อไม่ใช่เรื่องบังเอิญ การรับส่งข้อมูลของคุณเข้าไปดูเหมือนสิ่งหนึ่ง มาถึงดูเหมือนอีกสิ่งหนึ่ง ปลั๊กอินนี้ตรวจสอบว่า "ตู้เสื้อผ้า" พร้อมหรือไม่

โดยเฉพาะ:

- **ตรวจจับ** `not-claude-code-emulator` ผ่านสามเส้นทางการค้นพบ (ตัวแปรสภาพแวดล้อม → npm global → เส้นทางสำรอง)
- **รายงาน** สถานะที่เครื่องอ่านได้: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **วินิจฉัย** ปัญหาด้วยขั้นตอนถัดไปที่ปฏิบัติได้เมื่อมีบางอย่างผิดปกติ
- **สำรอง** `patch_apply` / `patch_revert` เป็นสตับที่ชัดเจนสำหรับการดำเนินการในอนาคต

ไม่มีอะไรเปลี่ยนแปลงโดยอัตโนมัติ ฮุคเป็นเฉพาะการตรวจสอบเท่านั้น คุณรัน `status` รับรายงาน และตัดสินใจว่าจะทำอะไรต่อไป

## การติดตั้ง

ติดตั้งตามลำดับ แต่ละขั้นตอนขึ้นอยู่กับขั้นตอนก่อนหน้า

### ขั้นตอนที่ 1: ติดตั้ง OpenClaw

หากยังไม่ได้ติดตั้ง:

```bash
npm install -g openclaw
```

### ขั้นตอนที่ 2: ติดตั้ง `not-claude-code-emulator`

นี่คือส่วนประกอบที่ทำให้การรับส่งข้อมูล OpenClaw ของคุณพูด CLI ของ Claude Code ได้อย่างคล่องแคล่ว หากไม่มีมัน จะไม่มีอะไรให้ปลั๊กอินนี้ตรวจสอบ — และไม่มีอะไรอยู่ระหว่างการเรียก API ของคุณกับรายการการใช้งานเพิ่มเติม

```bash
# ตัวเลือก A: npm global (แนะนำ)
npm install -g not-claude-code-emulator

# ตัวเลือก B: ปักหมุดไปยังคอมมิตที่รองรับอย่างแม่นยำ (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### ขั้นตอนที่ 3: ติดตั้ง `openclaw-cc-camouflage`

```bash
# ตัวเลือก A: npm global (แพ็คเกจที่เผยแพร่)
npm install -g openclaw-cc-camouflage

# ตัวเลือก B: จากซอร์ส
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### ขั้นตอนที่ 4: กำหนดค่าเส้นทางเอมูเลเตอร์

บอกปลั๊กอินว่าจะหา `not-claude-code-emulator` ได้ที่ไหน:

```bash
# หากคุณใช้การติดตั้ง npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# หากคุณโคลนด้วยตนเอง:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

เพิ่มในโปรไฟล์เชลล์ของคุณเพื่อความคงทน:

```bash
# ~/.zshrc หรือ ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

ตัวเลือก — กำหนดค่าเส้นทางการค้นหาสำรองเพิ่มเติม (คั่นด้วยทวิภาคบน macOS/Linux, เครื่องหมายอัฒภาคบน Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### ขั้นตอนที่ 5: ลงทะเบียนปลั๊กอินใน OpenClaw

เพิ่มใน `openclaw.json` หรือ `openclaw.jsonc` ของคุณ:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

หากคุณติดตั้งจากซอร์ส ให้ใช้เส้นทางภายในเครื่อง:

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

### ขั้นตอนที่ 6: ตรวจสอบการติดตั้ง

```bash
bun run status
```

การติดตั้งที่ดีรายงาน:

```
emulator=present
patch=none
support=supported
```

รหัสออก 0 หมายความว่าทุกอย่างเรียบร้อย รหัสออก 1 หมายความว่ามีบางอย่างต้องได้รับความสนใจ

สำหรับภาพที่ละเอียดกว่า:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# สถานะการบำรุงรักษาอยู่ในสภาพดี
# next: ข้อกำหนดเบื้องต้นของเอมูเลเตอร์อ่านได้และแพลตฟอร์มปัจจุบันได้รับการสนับสนุน
# next: เครื่องมือทั้งหมดพร้อมใช้งาน
```

หากคุณเห็น `emulator=missing` ให้ตรวจสอบว่า `OC_CAMOUFLAGE_EMULATOR_ROOT` ชี้ไปยังไดเรกทอรีที่มี `package.json` ของ `not-claude-code-emulator`

## เครื่องมือที่ใช้ได้

ปลั๊กอินนี้เปิดเผยเครื่องมือชัดเจนสี่อย่าง มันไม่ใช่ฮุคอัตโนมัติ

### `status`

รายงานสถานะปัจจุบันของการติดตั้งเอมูเลเตอร์

```bash
bun run status
```

รูปแบบเอาต์พุตอ่านได้โดยเครื่อง:

```
emulator=present
patch=none
support=supported
```

รหัสออก 0 หมายความว่าอยู่ในสภาพดี รหัสออก 1 หมายความว่ามีบางอย่างต้องได้รับความสนใจ

### `doctor`

ให้คำแนะนำการวินิจฉัยตามสถานะปัจจุบัน

```bash
bun run doctor
```

ตรวจสอบไฟล์และรายงานขั้นตอนถัดไปที่ปฏิบัติได้ ไม่ติดตั้ง ไม่แพตช์ หรือแก้ไขอะไร อ่านและรายงานเท่านั้น

### `patch_apply`

ใช้แพตช์กับเป้าหมาย (ปัจจุบันเป็นสตับสำหรับการขยายในอนาคต)

```bash
bun run patch:apply
```

ในเวอร์ชันปัจจุบัน สิ่งนี้ตรวจสอบสภาพแวดล้อมแต่ไม่เปลี่ยนแปลงสถานะ peer ใดๆ เวอร์ชันในอนาคตอาจใช้การแพตช์จริงกับมาร์กเกอร์ rollback

### `patch_revert`

ย้อนกลับแพตช์ที่ใช้ก่อนหน้านี้ (ปัจจุบันเป็นสตับสำหรับการขยายในอนาคต)

```bash
bun run patch:revert
```

ในเวอร์ชันปัจจุบัน สิ่งนี้ตรวจสอบสภาพแวดล้อมแต่ไม่เปลี่ยนแปลงสถานะ peer ใดๆ

## ทำไมฮุคอัตโนมัติจึงเป็นเฉพาะการตรวจสอบ

ฮุคอัตโนมัติในปลั๊กอินนี้จำกัดเฉพาะการตรวจสอบและเมตาดาต้าเท่านั้น พวกเขาไม่ใช้แพตช์โดยอัตโนมัติเพราะ:

1. การเปลี่ยนแปลง peer โดยไม่มีเจตนาของผู้ใช้อย่างชัดเจนละเมิดหลักการเซอร์ไพรส์น้อยที่สุด
2. ความล้มเหลวในการแพตช์ต้องการการตรวจสอบของมนุษย์ ไม่ใช่การลองใหม่โดยเงียบ
3. การย้อนกลับต้องการความยินยอมอย่างชัดเจนเพื่อคืนค่าสถานะ

ฮุคเตือนเมื่อตรวจพบการเบี่ยงเบน คุณตัดสินใจว่าจะใช้ ย้อนกลับ หรือปล่อยสภาพแวดล้อมไว้ตามเดิม

ปลั๊กอินตรวจสอบความพร้อม สิ่งที่คุณทำกับการตั้งค่าที่ได้รับการบำรุงรักษาอย่างเหมาะสมเป็นสิ่งระหว่างคุณและแผนการสมัครสมาชิกของคุณ

## การสนับสนุนแพลตฟอร์ม

| แพลตฟอร์ม | สถานะ | หมายเหตุ |
|-----------|--------|----------|
| macOS | รองรับ | สภาพแวดล้อมเดสก์ท็อปหลัก |
| Linux | รองรับ | fixtures upstream ที่ปักหมุดเดียวกัน |
| Windows | รองรับ | รองรับการค้นพบปลั๊กอินตามตัวอักษรไดรฟ์และแบ็คสแลช |

## นกคีรีบูนความเข้ากันได้

หากต้องการตรวจสอบการเบี่ยงเบนของ upstream เทียบกับเป้าหมายที่ปักหมุด:

```bash
bun run compat:canary
```

การตรวจสอบแบบอ่านอย่างเดียว ตรวจสอบความสมบูรณ์ของ fixtures และการอ้างอิง upstream โดยไม่แก้ไขอะไร ออกด้วย 0 บนเป้าหมายที่รองรับที่ปักหมุด

## เอกสารประกอบ

- `docs/install.md` - ข้อกำหนดเบื้องต้นและขั้นตอนการติดตั้ง
- `docs/compatibility.md` - ขอบเขตความเข้ากันได้
- `docs/support-matrix.md` - เวอร์ชัน fixtures ที่ล็อกไว้
- `docs/non-goals.md` - รายการนอกขอบเขตอย่างชัดเจน
- `docs/rollback.md` - ขั้นตอนการกู้คืนเอมูเลเตอร์

## การพัฒนา

```bash
# ติดตั้ง dependencies
bun install

# ตรวจสอบชนิด
bun run typecheck

# รันการทดสอบ
bun run test:unit
bun run test:integration

# ตรวจสอบแพตช์กับ fixtures
bun run verify:patches

# ตรวจสอบความปลอดภัยในการเผยแพร่
bun run check:publish-safety
```

## ใบอนุญาต

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
