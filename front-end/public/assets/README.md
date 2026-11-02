# Đại Nghiệp – 3D Asset Directory (`public/assets`)

Thư mục này lưu trữ toàn bộ tài nguyên 3D (`.glb` / `.gltf`) và texture của game theo cấu trúc chuẩn:

```text
public/assets/
├── characters/   # Model nhân vật Chibi Big Head (.glb)
├── buildings/    # Cấu kiện kiến trúc Chính điện, mái ngói, cửa gỗ (.glb)
├── props/        # Long ngai, bàn ghế quan viên, đèn lồng, lư hương, bình sứ (.glb)
├── animations/   # Animation clips tách rời nếu dùng chung rig (.glb)
└── textures/     # PBR / Stylized textures (.webp / .png / .ktx2)
```

## Trạng thái Asset hiện tại (Phase 1)

Theo quy tắc mục 9 & 14 của tài liệu thiết kế:
- **Không giả vờ đã tải model `.glb` khi chưa có file thực tế trong repo.**
- Hiện tại ở **Phase 1**, hệ thống sử dụng **Procedural Stylized Geometry kết hợp `InstancedMesh` và Canvas Texture họa tiết cung đình** để dựng Chính điện hoàn chỉnh với hiệu năng cao (~60 FPS, draw calls thấp).
- Mọi thành phần đều được khai báo đường dẫn `.glb` chuẩn trong `src/game/assets/assetManifest.ts` để sẵn sàng thay thế bằng file `.glb` thực tế từ **Sketchfab / Kenney / Poly Haven / Mixamo**.
