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
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <strong>Tiếng Việt</strong> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

Một plugin bảo trì đồng hành cho OpenClaw xác minh rằng `not-claude-code-emulator` có mặt và khỏe mạnh.

*Bởi vì hoạt động tốt nhất bắt đầu bằng việc xác nhận lớp che phủ của bạn đã sẵn sàng.*

## Điều này làm gì

`not-claude-code-emulator` là runtime dịch các lệnh gọi API của OpenClaw thành thứ mà cơ sở hạ tầng Anthropic nhận ra là đến từ phiên Claude Code CLI — loại luôn được bao phủ bởi đăng ký Pro hoặc Max tiêu chuẩn, không yêu cầu phí sử dụng bổ sung. `openclaw-cc-camouflage` là kiểm tra trước chuyến bay xác nhận rằng trình dịch hiện diện và đang hoạt động trước khi bạn cần nó.

Tên không phải ngẫu nhiên. Lưu lượng của bạn đi vào trông giống một thứ, đến nơi trông giống thứ khác. Plugin này xác minh rằng "tủ quần áo" đã sẵn sàng.

Cụ thể:

- **Phát hiện** `not-claude-code-emulator` qua ba đường dẫn khám phá (biến môi trường → npm global → đường dẫn dự phòng)
- **Báo cáo** trạng thái có thể đọc được bằng máy: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Chẩn đoán** vấn đề với các bước tiếp theo có thể thực hiện khi có điều gì đó sai
- **Dự trữ** `patch_apply` / `patch_revert` là các stub rõ ràng cho các hoạt động tương lai

Không có gì thay đổi tự động. Các hook chỉ để xác minh. Bạn chạy `status`, nhận báo cáo và quyết định làm gì tiếp theo.

## Cài đặt

Cài đặt theo thứ tự. Mỗi bước phụ thuộc vào bước trước.

### Bước 1: Cài đặt OpenClaw

Nếu chưa được cài đặt:

```bash
npm install -g openclaw
```

### Bước 2: Cài đặt `not-claude-code-emulator`

Đây là thành phần làm cho lưu lượng OpenClaw của bạn nói trôi chảy CLI Claude Code. Không có nó, không có gì để plugin này xác minh — và không có gì đứng giữa các lệnh gọi API của bạn và một mục sử dụng bổ sung.

```bash
# Tùy chọn A: npm global (khuyến nghị)
npm install -g not-claude-code-emulator

# Tùy chọn B: ghim vào commit được hỗ trợ chính xác (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Bước 3: Cài đặt `openclaw-cc-camouflage`

```bash
# Tùy chọn A: npm global (gói đã xuất bản)
npm install -g openclaw-cc-camouflage

# Tùy chọn B: từ nguồn
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Bước 4: Cấu hình đường dẫn trình giả lập

Nói với plugin nơi tìm `not-claude-code-emulator`:

```bash
# Nếu bạn đã sử dụng cài đặt npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Nếu bạn đã clone thủ công:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Thêm vào hồ sơ shell của bạn để duy trì:

```bash
# ~/.zshrc hoặc ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Tùy chọn — cấu hình các đường dẫn tìm kiếm dự phòng bổ sung (phân tách bằng dấu hai chấm trên macOS/Linux, dấu chấm phẩy trên Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Bước 5: Đăng ký plugin trong OpenClaw

Thêm vào `openclaw.json` hoặc `openclaw.jsonc` của bạn:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Nếu bạn đã cài đặt từ nguồn, hãy sử dụng đường dẫn cục bộ:

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

### Bước 6: Xác minh cài đặt

```bash
bun run status
```

Một cài đặt khỏe mạnh báo cáo:

```
emulator=present
patch=none
support=supported
```

Mã thoát 0 có nghĩa là mọi thứ đều ổn. Mã thoát 1 có nghĩa là có điều gì đó cần chú ý.

Để có hình ảnh chi tiết hơn:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Trạng thái bảo trì là khỏe mạnh.
# next: Điều kiện tiên quyết của trình giả lập có thể đọc được và nền tảng hiện tại được hỗ trợ.
# next: Tất cả các công cụ đều có sẵn.
```

Nếu bạn thấy `emulator=missing`, hãy xác minh rằng `OC_CAMOUFLAGE_EMULATOR_ROOT` trỏ đến một thư mục chứa `package.json` của `not-claude-code-emulator`.

## Các công cụ có sẵn

Plugin này hiển thị bốn công cụ rõ ràng. Chúng không phải là các hook tự động.

### `status`

Báo cáo trạng thái hiện tại của cài đặt trình giả lập.

```bash
bun run status
```

Định dạng đầu ra có thể đọc được bằng máy:

```
emulator=present
patch=none
support=supported
```

Mã thoát 0 có nghĩa là khỏe mạnh. Mã thoát 1 có nghĩa là có điều gì đó cần chú ý.

### `doctor`

Cung cấp hướng dẫn chẩn đoán dựa trên trạng thái hiện tại.

```bash
bun run doctor
```

Kiểm tra các tệp và báo cáo các bước tiếp theo có thể thực hiện. Không cài đặt, không vá hoặc sửa đổi bất cứ điều gì. Chỉ đọc và báo cáo.

### `patch_apply`

Áp dụng các bản vá cho mục tiêu (hiện là stub cho phần mở rộng trong tương lai).

```bash
bun run patch:apply
```

Trong phiên bản hiện tại, điều này xác thực môi trường nhưng không sửa đổi bất kỳ trạng thái peer nào. Các phiên bản trong tương lai có thể triển khai vá thực tế với các điểm đánh dấu rollback.

### `patch_revert`

Hoàn tác các bản vá đã áp dụng trước đó (hiện là stub cho phần mở rộng trong tương lai).

```bash
bun run patch:revert
```

Trong phiên bản hiện tại, điều này xác thực môi trường nhưng không sửa đổi bất kỳ trạng thái peer nào.

## Tại sao các hook tự động chỉ để xác minh

Các hook tự động trong plugin này chỉ giới hạn ở xác minh và siêu dữ liệu. Chúng không tự động áp dụng các bản vá vì:

1. Thay đổi một peer mà không có ý định rõ ràng của người dùng vi phạm nguyên tắc ngạc nhiên ít nhất
2. Lỗi vá cần xem xét của con người, không phải thử lại âm thầm
3. Hoàn tác cần sự đồng ý rõ ràng để khôi phục trạng thái

Các hook cảnh báo khi phát hiện sự khác biệt. Bạn quyết định áp dụng, hoàn tác hoặc để môi trường không thay đổi.

Plugin xác minh sự sẵn sàng. Việc bạn làm gì với thiết lập được bảo trì đúng cách là giữa bạn và kế hoạch đăng ký của bạn.

## Hỗ trợ nền tảng

| Nền tảng | Trạng thái | Ghi chú |
|----------|------------|---------|
| macOS | Được hỗ trợ | Môi trường máy tính để bàn chính |
| Linux | Được hỗ trợ | Các fixtures upstream được ghim giống nhau |
| Windows | Được hỗ trợ | Hỗ trợ phát hiện plugin dựa trên ký tự ổ đĩa và dấu gạch chéo ngược |

## Kiểm tra tương thích canary

Để kiểm tra sự khác biệt của upstream so với các mục tiêu được ghim:

```bash
bun run compat:canary
```

Kiểm tra chỉ đọc. Xác thực tính toàn vẹn của fixtures và tham chiếu upstream mà không sửa đổi bất cứ điều gì. Thoát với 0 trên các mục tiêu được hỗ trợ được ghim.

## Tài liệu

- `docs/install.md` - Điều kiện tiên quyết và các bước cài đặt
- `docs/compatibility.md` - Ranh giới tương thích
- `docs/support-matrix.md` - Các phiên bản fixtures bị khóa
- `docs/non-goals.md` - Các mục ngoài phạm vi rõ ràng
- `docs/rollback.md` - Các thủ tục khôi phục trình giả lập

## Phát triển

```bash
# Cài đặt các phụ thuộc
bun install

# Kiểm tra kiểu
bun run typecheck

# Chạy thử nghiệm
bun run test:unit
bun run test:integration

# Xác minh các bản vá so với fixtures
bun run verify:patches

# Kiểm tra an toàn xuất bản
bun run check:publish-safety
```

## Giấy phép

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
