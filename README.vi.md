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

Một plugin bảo trì đồng hành cho OpenClaw giúp xác minh trạng thái not-claude-code-emulator. Gói này không phải là fork của các dự án upstream. Nó cung cấp các công cụ rõ ràng mà không có hooks tự động.

## Đây là gì

`openclaw-cc-camouflage` là một plugin bảo trì:

- Xác minh sự hiện diện và tình trạng của emulator trước bất kỳ thao tác nào
- Báo cáo trạng thái và cung cấp hướng dẫn chẩn đoán
- Cung cấp các triển khai stub cho các thao tác patch trong tương lai

Nó không tự động áp dụng patch trong quá trình cài đặt. Tất cả các thay đổi đều yêu cầu lệnh gọi công cụ rõ ràng.

## Điều kiện tiên quyết và thứ tự cài đặt

Thứ tự cài đặt quan trọng. Bạn phải có những thứ sau trước khi plugin này có thể hoạt động:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Runtime tin nhắn cung cấp các giao diện tương thích với Anthropic
   - Cài đặt qua npm: `npm install -g not-claude-code-emulator`
   - Hoặc clone vào `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (gói này)
   - Cài đặt cuối cùng, sau khi emulator đã có

Cấu hình biến môi trường:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Hoặc sử dụng đường dẫn dự phòng:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Các công cụ có sẵn

Plugin này cung cấp bốn công cụ rõ ràng. Chúng không phải là hooks tự động.

### `status`

Báo cáo trạng thái hiện tại của cài đặt emulator.

```bash
bun run status
```

Định dạng đầu ra có thể đọc được bằng máy:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Mã thoát 0 có nghĩa là bình thường. Mã thoát 1 có nghĩa là có điều gì đó cần chú ý.

### `doctor`

Cung cấp hướng dẫn chẩn đoán dựa trên trạng thái hiện tại.

```bash
bun run doctor
```

Công cụ này kiểm tra các tệp và báo cáo các bước tiếp theo có thể thực hiện. Nó không cài đặt, patch hoặc sửa đổi bất cứ điều gì. Chỉ đọc và báo cáo.

### `patch_apply`

Áp dụng các patch cho mục tiêu (hiện là stub cho phần mở rộng trong tương lai).

```bash
bun run patch:apply
```

Trong phiên bản hiện tại, công cụ này xác thực môi trường nhưng không sửa đổi trạng thái peer nào. Các phiên bản trong tương lai có thể triển khai patching thực tế với các đánh dấu rollback.

### `patch_revert`

Hoàn tác các patch đã áp dụng trước đó (hiện là stub cho phần mở rộng trong tương lai).

```bash
bun run patch:revert
```

Trong phiên bản hiện tại, công cụ này xác thực môi trường nhưng không sửa đổi trạng thái peer nào. Các phiên bản trong tương lai có thể triển khai hoàn tác thực tế bằng cách sử dụng các đánh dấu rollback.

## Tại sao các hooks tự động chỉ để xác minh

Các hooks tự động trong plugin này bị giới hạn ở xác minh và metadata. Chúng không tự động áp dụng patch vì:

1. Thay đổi một peer mà không có ý định rõ ràng của người dùng vi phạm nguyên tắc bất ngờ tối thiểu
2. Các lỗi patching cần được xem xét bởi con người, không phải thử lại âm thầm
3. Rollback cần có sự đồng ý rõ ràng để khôi phục trạng thái

Các hooks cảnh báo khi phát hiện sự khác biệt. Bạn quyết định áp dụng, hoàn tác, hoặc để môi trường không thay đổi.

## Hỗ trợ nền tảng

| Nền tảng | Trạng thái | Ghi chú |
|----------|--------|-------|
| macOS    | Được hỗ trợ | Môi trường desktop chính |
| Linux    | Được hỗ trợ | Các fixture upstream cố định tương tự |
| Windows  | Được hỗ trợ | Hỗ trợ phát hiện plugin dựa trên ký tự ổ đĩa và dấu gạch chéo ngược |

## Kiểm tra khả năng tương thích

Để kiểm tra sự khác biệt của upstream so với các mục tiêu cố định:

```bash
bun run compat:canary
```

Đây là kiểm tra chỉ đọc xác thực tính toàn vẹn của fixture và các tham chiếu upstream mà không sửa đổi bất cứ điều gì. Nó thoát với mã 0 trên các mục tiêu được hỗ trợ đã cố định.

## Tài liệu

- `docs/install.md` - Điều kiện tiên quyết và các bước cài đặt
- `docs/compatibility.md` - Giới hạn tương thích
- `docs/support-matrix.md` - Các phiên bản fixture đã khóa
- `docs/non-goals.md` - Các mục nằm ngoài phạm vi rõ ràng

## Phát triển

```bash
# Cài đặt các phụ thuộc
bun install

# Kiểm tra kiểu
bun run typecheck

# Chạy các bài kiểm tra
bun run test:unit
bun run test:integration

# Xác minh các patch so với các fixture
bun run verify:patches

# Kiểm tra an toàn khi xuất bản
bun run check:publish-safety
```

## Giấy phép

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->