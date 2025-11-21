import axios from 'axios';

const API_KEY = 'AIzaSyBHbQhRcfertDKCNQwcvAM55WUXnEo36ls';

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

export const sendMessageToGemini = async (history, newMessage, fileObject = null) => {
    try {
        const newParts = [{ text: newMessage }];

        if (fileObject) {
            const base64Image = await fileToBase64(fileObject);
            newParts.push({
                inline_data: {
                    mime_type: fileObject.type,
                    data: base64Image,
                },
            });
        }

        const contents = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        contents.push({
            role: 'user',
            parts: newParts
        });

        const systemPrompt = `CHỈ TRÍCH XUẤT DỮ LIỆU PHÂN CÔNG. CẤM CHAT, CẤM HỎI HAN, CẤM NÓI GÌ THÊM.

CÁCH TRẢ LỜI DUY NHẤT:

Bước 1: Liệt kê dữ liệu dạng văn bản
An - Toán - 10A1 - 5
Bình - Lý - 10B2 - 3

Bước 2: JSON cho hệ thống
\`\`\`json
[{"teacher":"An","subject":"Toán","class":"10A1","periods":5},{"teacher":"Bình","subject":"Lý","class":"10B2","periods":3}]
\`\`\`

Bước 3: Câu hỏi duy nhất
Dữ liệu đã đúng chưa?

QUY TẮC:
- teacher: CHỈ TÊN (Nguyễn Văn An → An)
- subject: Đầy đủ (Toán, Vật Lý, Hóa Học, Ngữ Văn, Tiếng Anh, Sinh Học, Lịch Sử, Địa Lý, GDCD, Tin Học, Công Nghệ, Thể Dục, Quốc Phòng)
- class: Tên lớp (10A1, 11B2)
- periods: Số nguyên

CẤM TUYỆT ĐỐI: KHÔNG ĐƯỢC NÓI "Tuyệt vời", "Rất vui", "cảm ơn", KHÔNG ĐƯỢC CHAT.`;

        if (contents.length === 1) {
            contents[0].parts[0].text = systemPrompt + "\n\n" + contents[0].parts[0].text;
        }

        let model = 'gemini-2.5-flash';
        let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        const requestBody = { contents };

        try {
            const response = await axios.post(url, requestBody);
            return parseResponse(response.data);
        } catch (error) {
            console.error('Error calling Gemini API:', error.response?.data || error.message);
            return { text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI.", data: [] };
        }
    } catch (error) {
        console.error('Error sending message to Gemini:', error);
        return { text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI.", data: [] };
    }
};

const parseResponse = (data) => {
    try {
        const candidate = data.candidates[0].content;
        const text = candidate.parts[0].text;

        const jsonMatch = text.match(/```json([\s\S]*?)```/);
        let extractedData = [];

        if (jsonMatch && jsonMatch[1]) {
            try {
                extractedData = JSON.parse(jsonMatch[1].trim());
            } catch (e) {
                console.error("Failed to parse JSON block", e);
            }
        }

        return {
            text: text,
            data: extractedData
        };
    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        return { text: "Không thể đọc phản hồi từ AI.", data: [] };
    }
};
