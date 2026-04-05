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
  <a href="README.th.md">ไทย</a> |
  <strong>Türkçe</strong> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

`not-claude-code-emulator`'ın mevcut ve sağlıklı olduğunu doğrulayan OpenClaw için bir eşlikçi bakım eklentisi.

*Çünkü en iyi operasyon, kapsamanızın yerinde olduğunu doğrulayarak başlar.*

## Bu Ne Yapar

`not-claude-code-emulator`, OpenClaw'ın API çağrılarını Anthropic altyapısının Claude Code CLI oturumundan geliyormuş gibi tanıyacağı bir şeye çeviren çalışma zamanıdır — ek kullanım ücreti gerektirmeyen, standart Pro veya Max aboneliğiyle her zaman kapsanan türden. `openclaw-cc-camouflage`, ihtiyacınız olmadan önce çevirmenin mevcut ve çalışır durumda olduğunu doğrulayan uçuş öncesi kontroldür.

İsim tesadüf değil. Trafiğiniz bir şey gibi görünerek girer, başka bir şey gibi görünerek varır. Bu eklenti "gardırobun" hazır olup olmadığını doğrular.

Somut olarak:

- Üç keşif yolu (ortam değişkeni → npm global → yedek yollar) üzerinden `not-claude-code-emulator`'ı **Algılar**
- Makine tarafından okunabilir durum **Raporlar**: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- Bir şeyler yanlış gittiğinde eyleme geçirilebilir sonraki adımlarla sorunları **Tanılar**
- Gelecekteki işlemler için `patch_apply` / `patch_revert`'i açık saplamalar olarak **Ayırır**

Hiçbir şey otomatik olarak değişmez. Kancalar yalnızca doğrulama içindir. `status`'ü çalıştırır, raporu alır ve bundan sonra ne yapacağınıza karar verirsiniz.

## Kurulum

Sırayla kurun. Her adım öncekine bağlıdır.

### Adım 1: OpenClaw'ı Kurun

Henüz kurulu değilse:

```bash
npm install -g openclaw
```

### Adım 2: `not-claude-code-emulator`'ı Kurun

Bu, OpenClaw trafiğinizin akıcı Claude Code CLI konuşmasını sağlayan bileşendir. Onsuz, bu eklentinin doğrulayacağı bir şey yoktur — ve API çağrılarınızla ek kullanım kalemi arasında hiçbir şey yoktur.

```bash
# Seçenek A: npm global (önerilir)
npm install -g not-claude-code-emulator

# Seçenek B: tam desteklenen commite sabitleyin (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Adım 3: `openclaw-cc-camouflage`'ı Kurun

```bash
# Seçenek A: npm global (yayınlanmış paket)
npm install -g openclaw-cc-camouflage

# Seçenek B: kaynaktan
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Adım 4: Emülatör Yolunu Yapılandırın

Eklentiye `not-claude-code-emulator`'ı nerede bulacağını söyleyin:

```bash
# npm global kurulumu kullandıysanız:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Manuel olarak klonladıysanız:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Kalıcılık için kabuk profilinize ekleyin:

```bash
# ~/.zshrc veya ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

İsteğe bağlı — ek yedekleme arama yollarını yapılandırın (macOS/Linux'ta iki nokta üst üste, Windows'ta noktalı virgülle ayrılmış):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Adım 5: Eklentiyi OpenClaw'da Kaydedin

`openclaw.json` veya `openclaw.jsonc`'nize ekleyin:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Kaynaktan kurduysanız, yerel yolu kullanın:

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

### Adım 6: Kurulumu Doğrulayın

```bash
bun run status
```

Sağlıklı bir kurulum şunu raporlar:

```
emulator=present
patch=none
support=supported
```

Çıkış kodu 0, her şeyin yolunda olduğu anlamına gelir. Çıkış kodu 1, bir şeyin dikkat gerektirdiği anlamına gelir.

Daha ayrıntılı bir resim için:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Bakım durumu sağlıklı.
# next: Emülatör ön koşulu okunabilir ve mevcut platform destekleniyor.
# next: Tüm araçlar mevcut.
```

`emulator=missing` görürseniz, `OC_CAMOUFLAGE_EMULATOR_ROOT`'un `not-claude-code-emulator`'ın `package.json`'ını içeren bir dizine işaret ettiğini doğrulayın.

## Mevcut Araçlar

Bu eklenti dört açık araç sunar. Bunlar otomatik kanca değildir.

### `status`

Emülatör kurulumunun mevcut durumunu raporlar.

```bash
bun run status
```

Çıktı formatı makine tarafından okunabilirdir:

```
emulator=present
patch=none
support=supported
```

Çıkış kodu 0 sağlıklı anlamına gelir. Çıkış kodu 1 bir şeyin dikkat gerektirdiği anlamına gelir.

### `doctor`

Mevcut duruma dayalı tanı kılavuzu sağlar.

```bash
bun run doctor
```

Dosyaları inceler ve eyleme geçirilebilir sonraki adımları raporlar. Kurulum yapmaz, yama yapmaz veya bir şeyi değiştirmez. Sadece okur ve raporlar.

### `patch_apply`

Hedefe yamalar uygular (şu anda gelecekteki genişletme için bir saplama).

```bash
bun run patch:apply
```

Mevcut sürümde bu, ortamı doğrular ancak herhangi bir eş durumunu değiştirmez. Gelecekteki sürümler, geri alma işaretleyicileriyle gerçek yamayı uygulayabilir.

### `patch_revert`

Önceden uygulanan yamaları geri alır (şu anda gelecekteki genişletme için bir saplama).

```bash
bun run patch:revert
```

Mevcut sürümde bu, ortamı doğrular ancak herhangi bir eş durumunu değiştirmez.

## Otomatik Kancalar Neden Yalnızca Doğrulama İçindir

Bu eklentideki otomatik kancalar yalnızca doğrulama ve meta verilerle sınırlıdır. Otomatik olarak yama uygulamazlar çünkü:

1. Açık kullanıcı niyeti olmadan bir eşi değiştirmek, en az sürpriz ilkesini ihlal eder
2. Yama hataları sessiz yeniden denemeler değil, insan incelemesi gerektirir
3. Geri alma, durumu geri yüklemek için açık onay gerektirir

Kancalar, sapma algılandığında uyarır. Uygulamaya, geri almaya veya ortamı değiştirmeden bırakmaya karar verirsiniz.

Eklenti hazır olmayı doğrular. Düzgün bir şekilde bakımı yapılan bir kurulumla ne yapacağınız sizin ve abonelik planınız arasındaki meseledir.

## Platform Desteği

| Platform | Durum | Notlar |
|----------|-------|--------|
| macOS | Destekleniyor | Birincil masaüstü ortamı |
| Linux | Destekleniyor | Aynı sabit upstream fixtures |
| Windows | Destekleniyor | Sürücü harfi ve ters eğik çizgi tabanlı eklenti keşfini destekler |

## Uyumluluk Kanaryası

Sabitlenmiş hedeflere karşı upstream sapmayı kontrol etmek için:

```bash
bun run compat:canary
```

Salt okunur kontrol. Hiçbir şeyi değiştirmeden fixture bütünlüğünü ve upstream referanslarını doğrular. Sabitlenmiş desteklenen hedeflerde 0 ile çıkar.

## Belgeler

- `docs/install.md` - Ön koşullar ve kurulum adımları
- `docs/compatibility.md` - Uyumluluk sınırları
- `docs/support-matrix.md` - Kilitli fixture sürümleri
- `docs/non-goals.md` - Açık kapsam dışı öğeler
- `docs/rollback.md` - Emülatör kurtarma prosedürleri

## Geliştirme

```bash
# Bağımlılıkları kur
bun install

# Tip kontrolü
bun run typecheck

# Testleri çalıştır
bun run test:unit
bun run test:integration

# Yamaları fixtures'a karşı doğrula
bun run verify:patches

# Yayın güvenliğini kontrol et
bun run check:publish-safety
```

## Lisans

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
