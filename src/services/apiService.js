/**
 * API Service - Backend Webhook Integration
 * Handles ALL AI processing through n8n webhook ONLY
 * NO FALLBACK - Webhook must be configured and running
 */

// Backend webhook URL for AI processing
const WEBHOOK_URL = "https://7jk103q70xnk.ezbase.vn/webhook/phan-cong";

/**
 * Scans document/text input using backend AI webhook
 * Maintains conversation context for better AI responses
 *
 * @param {Array} history - Conversation history [{role: 'user'|'model', text: '...'}, ...]
 * @param {string} newMessage - The new user message
 * @param {File|null} fileObject - Optional file object (image) to process
 * @returns {Promise<{text: string, data: Array}>} - Returns AI response text and extracted data
 */
export const scanDocumentWithGemini = async (history = [], newMessage = '', fileObject = null) => {
    if (!newMessage && !fileObject) {
        return {
            text: "Vui lòng nhập nội dung hoặc tải lên ảnh.",
            data: []
        };
    }

    try {
        console.log('🚀 Attempting to call webhook:', WEBHOOK_URL);

        // Build conversation context for the webhook
        // Format: "User: ...\nAI: ...\nUser: ..."
        let conversationContext = '';
        if (history && history.length > 0) {
            conversationContext = history.map(msg => {
                const role = msg.role === 'user' ? 'Người dùng' : 'AI';
                return `${role}: ${msg.text}`;
            }).join('\n');
            conversationContext += '\n';
        }

        // Append new message
        const fullText = conversationContext + `Người dùng: ${newMessage}`;

        // Prepare request body
        const requestBody = {
            text: fullText,
        };

        // If file is provided, convert to base64 and include in request
        if (fileObject) {
            console.log('📷 Converting image to base64...');
            const base64Image = await fileToBase64(fileObject);
            requestBody.image = base64Image;
            requestBody.mimeType = fileObject.type;
        }

        console.log('📤 Sending request to webhook...');

        // Call backend webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log('📥 Webhook response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Webhook không trả về JSON. Kiểm tra "Respond to Webhook" node trong n8n.');
        }

        if (contentLength === '0') {
            throw new Error('Webhook trả về empty response. Thêm "Respond to Webhook" node và cấu hình response body.');
        }

        const result = await response.json();

        // Check if result has required fields
        if (!result || (!result.text && !result.data)) {
            throw new Error('Response thiếu fields "text" hoặc "data". Kiểm tra format trong workflow.');
        }

        // Backend returns: { data: [...], text: "..." } or { data: [...] }
        // Ensure we always return both text and data
        return {
            text: result.text || formatDataAsText(result.data),
            data: result.data || []
        };

    } catch (error) {
        console.error('❌ Webhook error:', error.message);

        // Return detailed error with setup instructions
        return {
            text: `❌ LỖI WEBHOOK BACKEND: ${error.message}\n\n` +
                  `📋 HƯỚNG DẪN FIX:\n\n` +
                  `1️⃣ THÊM "Respond to Webhook" NODE\n` +
                  `   • Kéo node "Respond to Webhook" vào workflow\n` +
                  `   • Nối từ node cuối → Respond to Webhook\n` +
                  `   • Response Body:\n` +
                  `     {\n` +
                  `       "text": "{{ $json.text }}",\n` +
                  `       "data": {{ $json.data }}\n` +
                  `     }\n\n` +
                  `2️⃣ CẤU HÌNH CORS\n` +
                  `   • Trong Respond to Webhook node\n` +
                  `   • Options → Response Headers:\n` +
                  `     {\n` +
                  `       "Access-Control-Allow-Origin": "*",\n` +
                  `       "Content-Type": "application/json"\n` +
                  `     }\n\n` +
                  `3️⃣ WORKFLOW PHẢI ACTIVE (màu xanh)\n\n` +
                  `4️⃣ Test webhook:\n` +
                  `   ${WEBHOOK_URL}\n\n` +
                  `📖 Chi tiết: WEBHOOK_SETUP.md`,
            data: []
        };
    }
};

/**
 * Converts file to base64 string
 * @param {File} file - File object to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
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

/**
 * Formats extracted data array as readable text
 * @param {Array} data - Array of assignment objects
 * @returns {string} - Formatted text representation
 */
const formatDataAsText = (data) => {
    if (!data || data.length === 0) {
        return "Không tìm thấy dữ liệu.";
    }

    let text = "Dữ liệu đã trích xuất:\n\n";
    data.forEach(item => {
        text += `${item.teacher} - ${item.subject} - ${item.class} - ${item.periods}\n`;
    });
    text += "\nBạn có cần chỉnh sửa gì không? (Nếu đã ổn, hãy trả lời 'OK')";

    return text;
};

/**
 * Alternative export name for backward compatibility
 */
export const sendMessageToGemini = scanDocumentWithGemini;
