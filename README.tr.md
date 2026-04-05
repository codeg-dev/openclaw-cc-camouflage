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

OpenClaw için not-claude-code-emulator durumunu doğrulamaya yardımcı olan bir yardımcı bakım eklentisi. Bu paket upstream projelerinin bir fork'u değildir. Otomatik hook'lar olmadan açık araçlar sağlar.

## Bu nedir

`openclaw-cc-camouflage` şunları yapan bir bakım eklentisidir:

- Herhangi bir işlemden önce emulator varlığını ve sağlığını doğrular
- Durumu raporlar ve tanısal kılavuz sağlar
- Gelecekteki yama işlemleri için stub uygulamaları sağlar

Kurulum sırasında otomatik olarak yama uygulamaz. Tüm mutasyonlar açık araç çağrısı gerektirir.

## Ön koşullar ve kurulum sırası

Kurulum sırası önemlidir. Bu eklenti çalışmadan önce aşağıdakilerin yerinde olması gerekir:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Anthropic uyumlu arayüzler sağlayan mesaj çalışma zamanı
   - npm ile kurulum: `npm install -g not-claude-code-emulator`
   - Veya `~/github/not-claude-code-emulator` içine klonlayın

2. **`openclaw-cc-camouflage`** (bu paket)
   - Emulator mevcut olduktan sonra son olarak kurun

Ortam değişkenini yapılandırın:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Veya yedek yolları kullanın:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Mevcut araçlar

Bu eklenti dört açık araç sunar. Bunlar otomatik hook'lar değildir.

### `status`

Emulator kurulumunun mevcut durumunu raporlar.

```bash
bun run status
```

Çıktı formatı makine tarafından okunabilir:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Çıkış kodu 0 sağlıklı anlamına gelir. Çıkış kodu 1 bir şeyin dikkat gerektirdiği anlamına gelir.

### `doctor`

Mevcut duruma dayalı tanısal kılavuz sağlar.

```bash
bun run doctor
```

Bu dosyaları inceler ve uygulanabilir sonraki adımları raporlar. Kurulum, yama veya değişiklik yapmaz. Sadece okur ve raporlar.

### `patch_apply`

Hedefe yama uygular (şu anda gelecekteki genişletme için bir stub).

```bash
bun run patch:apply
```

Mevcut sürümde bu ortamı doğrular ancak herhangi bir eş durumunu değiştirmez. Gelecekteki sürümler geri alma işaretleyicileriyle gerçek yama uygulaması yapabilir.

### `patch_revert`

Daha önce uygulanan yamaları geri alır (şu anda gelecekteki genişletme için bir stub).

```bash
bun run patch:revert
```

Mevcut sürümde bu ortamı doğrular ancak herhangi bir eş durumunu değiştirmez. Gelecekteki sürümler geri alma işaretleyicilerini kullanarak gerçek geri alma uygulaması yapabilir.

## Otomatik hook'lar neden sadece doğrulamadır

Bu eklentideki otomatik hook'lar yalnızca doğrulama ve meta verilerle sınırlıdır. Otomatik olarak yama uygulamazlar çünkü:

1. Açık kullanıcı niyeti olmadan bir eşi değiştirmek en az sürpriz ilkesini ihlal eder
2. Yama hataları sessiz tekrar denemeler değil, insan incelemesi gerektirir
3. Geri alma, durumu geri yüklemek için açık onay gerektirir

Hook'lar sürüklenme algılandığında uyarır. Uygulamak, geri almak veya ortamı değiştirmeden bırakmak size kalmıştır.

## Platform desteği

| Platform | Durum | Notlar |
|----------|--------|-------|
| macOS    | Desteklenen | Birincil masaüstü ortamı |
| Linux    | Desteklenen | Aynı sabit upstream fixture'ları |
| Windows  | Desteklenen | Sürücü harfi ve ters eğik çizgi tabanlı eklenti keşfini destekler |

## Uyumluluk kanaryası

Sabitlenmiş hedeflere karşı upstream sapmasını kontrol etmek için:

```bash
bun run compat:canary
```

Bu, fixture bütünlüğünü ve upstream referanslarını hiçbir şeyi değiştirmeden doğrulayan salt okunur bir kontroldür. Sabitlenmiş desteklenen hedeflerde 0 ile çıkar.

## Dokümantasyon

- `docs/install.md` - Ön koşullar ve kurulum adımları
- `docs/compatibility.md` - Uyumluluk sınırları
- `docs/support-matrix.md` - Kilitli fixture sürümleri
- `docs/non-goals.md` - Açık kapsam dışı öğeler

## Geliştirme

```bash
# Bağımlılıkları kur
bun install

# Tür kontrolü
bun run typecheck

# Testleri çalıştır
bun run test:unit
bun run test:integration

# Fixture'lara karşı yamaları doğrula
bun run verify:patches

# Yayın güvenliğini kontrol et
bun run check:publish-safety
```

## Lisans

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->