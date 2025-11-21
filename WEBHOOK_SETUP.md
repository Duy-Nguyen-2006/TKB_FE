# 🔧 Hướng Dẫn Cấu Hình n8n Webhook

## ⚠️ BẮT BUỘC PHẢI CẤU HÌNH WEBHOOK

Ứng dụng **CHỈ hoạt động với n8n webhook**. Không có fallback.

Nếu webhook chưa được cấu hình, bạn sẽ thấy lỗi:
```
❌ LỖI KẾT NỐI WEBHOOK BACKEND
```

**AI sẽ KHÔNG hoạt động** cho đến khi webhook được cấu hình đúng.

## ✅ Các Bước Kích Hoạt Webhook

### Bước 1: Kích hoạt Workflow trong n8n

1. Mở n8n workflow của bạn
2. Tìm nút **"Inactive"** ở góc trên bên phải
3. Click để chuyển thành **"Active"** (màu xanh)

![](https://i.imgur.com/example-activation.png)

### Bước 2: Kiểm Tra Webhook URL

Webhook URL phải khớp với URL trong code:

**Code hiện tại:**
```javascript
const WEBHOOK_URL = "http://n8n.genz-ai.click:5678/webhook/phan-cong";
```

**Trong n8n:**
- Mở Webhook node
- Chọn tab "Production URL"
- Đảm bảo URL là: `http://n8n.genz-ai.click:5678/webhook/phan-cong`
- Path: `phan-cong`

### Bước 3: Cấu Hình CORS (Quan Trọng!)

Frontend chạy trên browser sẽ gặp CORS error nếu n8n không cho phép.

**Trong n8n Webhook Settings:**
1. Mở Webhook node
2. Chọn tab **"Settings"**
3. Tìm **"Options"** → **"Add option"**
4. Chọn **"Response Headers"**
5. Thêm các headers sau:

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Bước 4: Test Webhook

#### Test từ Command Line (Linux/Mac):

```bash
curl -X POST http://n8n.genz-ai.click:5678/webhook/phan-cong \
  -H "Content-Type: application/json" \
  -d '{"text": "An dạy Toán lớp 10A1 5 tiết"}'
```

#### Test từ Browser Console:

```javascript
fetch('http://n8n.genz-ai.click:5678/webhook/phan-cong', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'An dạy Toán lớp 10A1 5 tiết'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Webhook works:', data))
.catch(err => console.error('❌ Error:', err));
```

**Kết quả mong đợi:**
```json
{
  "text": "An - Toán - 10A1 - 5\n\n```json\n[...]\n```\n\nBạn có cần chỉnh sửa gì không?",
  "data": [
    {"teacher": "An", "subject": "Toán", "class": "10A1", "periods": 5}
  ]
}
```

### Bước 5: Verify Hoạt Động

Khi webhook hoạt động, AI sẽ trả lời ngay lập tức không có lỗi.

## 🐛 Debugging

### Console Logs

Khi mở DevTools (F12), bạn sẽ thấy:

**Webhook thành công:**
```
🚀 Attempting to call webhook: http://n8n.genz-ai.click:5678/webhook/phan-cong
📤 Sending request to webhook...
📥 Webhook response status: 200
```

**Webhook lỗi:**
```
🚀 Attempting to call webhook: http://n8n.genz-ai.click:5678/webhook/phan-cong
📤 Sending request to webhook...
❌ Webhook error: Failed to fetch
```
→ AI sẽ hiển thị error message với hướng dẫn fix

### Các Lỗi Thường Gặp

#### 1. **Failed to fetch**
- **Nguyên nhân:** CORS không được cấu hình hoặc workflow chưa active
- **Giải pháp:** Xem Bước 3 (CORS) và Bước 1 (Activation)

#### 2. **403 Forbidden**
- **Nguyên nhân:** Webhook bị firewall/proxy chặn
- **Giải pháp:** Kiểm tra network settings hoặc dùng Production URL

#### 3. **404 Not Found**
- **Nguyên nhân:** Path không đúng
- **Giải pháp:** Kiểm tra path trong n8n phải là `phan-cong`

#### 4. **500 Internal Server Error**
- **Nguyên nhân:** Lỗi trong n8n workflow
- **Giải pháp:** Kiểm tra Executions tab trong n8n để xem lỗi chi tiết

## 📊 Kiến Trúc Bắt Buộc

```
Frontend
  → n8n Webhook (BẮT BUỘC)
  → Backend AI Processing
  → Return result
```

**Không có fallback. Webhook phải hoạt động.**

## 📝 Request/Response Format

### Request Body:
```json
{
  "text": "An dạy Toán lớp 10A1 5 tiết",
  "image": "base64_string_here",  // Optional
  "mimeType": "image/jpeg"         // Optional
}
```

### Response Body:
```json
{
  "text": "An - Toán - 10A1 - 5\n\n```json\n[{...}]\n```\n\nBạn có cần chỉnh sửa gì không?",
  "data": [
    {
      "teacher": "An",
      "subject": "Toán",
      "class": "10A1",
      "periods": 5
    }
  ]
}
```

## 🎯 Checklist (BẮT BUỘC)

- [ ] Workflow đã được ACTIVE trong n8n ⚠️ QUAN TRỌNG
- [ ] Webhook URL đúng: `http://n8n.genz-ai.click:5678/webhook/phan-cong`
- [ ] CORS headers đã được cấu hình ⚠️ QUAN TRỌNG
- [ ] Test webhook thành công từ curl
- [ ] Test webhook thành công từ browser console
- [ ] AI chat hoạt động không có lỗi

## 💡 Tips

1. **PHẢI cấu hình webhook trước khi sử dụng AI**
2. **Kiểm tra n8n workflow ACTIVE** (màu xanh)
3. **Monitoring:** Theo dõi console logs (F12) để debug
4. **Testing:** Test webhook thường xuyên để đảm bảo uptime

## 🆘 Cần Hỗ Trợ?

Nếu vẫn gặp vấn đề:
1. Kiểm tra console logs (F12)
2. Test webhook bằng curl
3. Kiểm tra n8n Executions để xem lỗi
4. Đảm bảo workflow đang ACTIVE

---

**⚠️ LƯU Ý QUAN TRỌNG:** Ứng dụng CHỈ hoạt động khi webhook được cấu hình đúng. Không có fallback mechanism. AI sẽ không thể trích xuất dữ liệu nếu webhook chưa sẵn sàng.
