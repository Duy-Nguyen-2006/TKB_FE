/**
 * API Service - Backend Webhook Integration
 * Handles all AI processing through n8n webhook instead of direct Gemini API calls
 * Falls back to direct Gemini API if webhook is unavailable
 */

import { sendMessageToGemini as geminiDirectCall } from './geminiService.js';

// Backend webhook URL for AI processing
const WEBHOOK_URL = "http://n8n.genz-ai.click:5678/webhook/phan-cong";

// Fallback to gemini if webhook fails
const USE_FALLBACK = true;

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

        const result = await response.json();

        // Backend returns: { data: [...], text: "..." } or { data: [...] }
        // Ensure we always return both text and data
        return {
            text: result.text || formatDataAsText(result.data),
            data: result.data || []
        };

    } catch (error) {
        console.error('❌ Webhook error:', error.message);

        // Fallback to direct Gemini API if webhook fails
        if (USE_FALLBACK) {
            console.log('🔄 Falling back to direct Gemini API...');
            console.log('⚠️  Webhook n8n chưa hoạt động. Đang dùng Gemini API trực tiếp.');
            try {
                const result = await geminiDirectCall(history, newMessage, fileObject);
                console.log('✅ Fallback succeeded!');
                // Add notice to the response
                if (result && result.text) {
                    result.text = `⚠️ [Đang dùng Gemini API trực tiếp do webhook chưa sẵn sàng]\n\n${result.text}`;
                }
                return result;
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                return {
                    text: `❌ Lỗi kết nối cả Webhook và Gemini API\n\nWebhook: ${error.message}\nGemini: ${fallbackError.message}`,
                    data: []
                };
            }
        }

        // Return user-friendly error message in Vietnamese
        return {
            text: `❌ Lỗi kết nối Backend: ${error.message}\n\nVui lòng kiểm tra:\n- Webhook n8n đang chạy (phải ACTIVE)\n- URL: ${WEBHOOK_URL}\n- Kết nối mạng\n- CORS configuration trong n8n`,
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
