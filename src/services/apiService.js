import axios from 'axios'; // QUAN TRỌNG: Dòng này phải ở đầu file

// Backend webhook URL for AI processing (Chat)
const CHAT_WEBHOOK_URL = "https://7jk103q70xnk.ezbase.vn/webhook/phan-cong";

/**
 * Scans document/text input using backend AI webhook
 */
export const scanDocumentWithGemini = async (history = [], newMessage = '', fileObject = null) => {
    if (!newMessage && !fileObject) {
        return { text: "Vui lòng nhập nội dung hoặc tải lên ảnh.", data: [] };
    }

    try {
        let conversationContext = '';
        if (history && history.length > 0) {
            conversationContext = history.map(msg => {
                const role = msg.role === 'user' ? 'Người dùng' : 'AI';
                return `${role}: ${msg.text}`;
            }).join('\n');
            conversationContext += '\n';
        }

        const fullText = conversationContext + `Người dùng: ${newMessage}`;
        const requestBody = { text: fullText };

        if (fileObject) {
            const base64Image = await fileToBase64(fileObject);
            requestBody.image = base64Image;
            requestBody.mimeType = fileObject.type;
        }

        const response = await axios.post(CHAT_WEBHOOK_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        const result = response.data;
        let extractedData = [];
        let responseText = '';

        if (Array.isArray(result)) {
            extractedData = result;
            responseText = formatDataAsText(result);
        } else if (result && typeof result === 'object') {
            extractedData = result.data || [];
            responseText = result.text || formatDataAsText(result.data);
        } else {
            throw new Error('Response format không hợp lệ.');
        }

        return { text: responseText, data: extractedData };

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return {
            text: `❌ Lỗi: ${error.message}. Kiểm tra Console (F12) để biết chi tiết.`,
            data: []
        };
    }
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
    });
};

const formatDataAsText = (data) => {
    if (!data || data.length === 0) return "Không tìm thấy dữ liệu.";
    let text = "Dữ liệu đã trích xuất:\n\n";
    data.forEach(item => {
        text += `${item.teacher} - ${item.subject} - ${item.class} - ${item.periods}\n`;
    });
    text += "\nBạn có cần chỉnh sửa gì không? (Nếu đã ổn, hãy trả lời 'OK')";
    return text;
};

export const sendMessageToGemini = scanDocumentWithGemini;

// === HÀM GỌI API XẾP LỊCH (New) ===
export const generateSchedule = async (payload) => {
    try {
        // THAY URL NÀY BẰNG PRODUCTION URL CỦA NODE WEBHOOK (N8N)
        // Dựa trên ảnh của mày: https://7jk103q70xnk.ezbase.vn/webhook/constraint
        // Hoặc URL Backend nodejs nếu mày dựng server riêng
        const URL = "https://7jk103q70xnk.ezbase.vn/webhook/constraint";

        const response = await axios.post(URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi xếp lịch:", error);
        throw error;
    }
};