import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Bot, User, Plus, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { sendMessageToGemini } from '../services/apiService';

const AIChatSidebar = ({ isOpen, onClose, onImportData }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'model',
            text: '🤖 Trợ lý AI đã sẵn sàng!\n\nVui lòng:\n• Tải lên ảnh phân công giảng dạy\n• Hoặc nhập/dán nội dung văn bản\n\nTôi sẽ trích xuất và giúp bạn chỉnh sửa dữ liệu.',
            data: []
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if ((!inputValue.trim() && !selectedFile) || isLoading) return;

        const userText = inputValue.trim().toLowerCase();

        // Auto-import logic: ONLY accept exact "OK" (case insensitive)
        const isAgreement = userText === 'ok';

        // Find the last AI message with data
        const lastAiMsgWithData = [...messages].reverse().find(m => m.role === 'model' && m.data && m.data.length > 0);

        if (isAgreement && lastAiMsgWithData) {
            // Auto import and show confirmation
            onImportData(lastAiMsgWithData.data);
            setMessages(prev => [...prev,
            {
                id: Date.now(),
                role: 'user',
                text: inputValue
            },
            {
                id: Date.now() + 1,
                role: 'system',
                text: `✓ Đã tự động nhập ${lastAiMsgWithData.data.length} mục vào bảng!`
            }
            ]);
            setInputValue('');
            return;
        }

        const userMsgId = Date.now();
        const newUserMsg = {
            id: userMsgId,
            role: 'user',
            text: inputValue,
            file: selectedFile
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setSelectedFile(null);
        setIsLoading(true);

        // Call API
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const response = await sendMessageToGemini(history, newUserMsg.text, newUserMsg.file);

        const aiMsg = {
            id: Date.now() + 1,
            role: 'model',
            text: response.text,
            data: response.data
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    const handleConfirmData = (data) => {
        onImportData(data);
        // Optional: Add a system message confirming import
        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'system',
            text: 'Đã nhập dữ liệu vào bảng thành công!'
        }]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
                <div className="flex items-center gap-2">
                    <Bot size={20} className="text-white" />
                    <h3 className="font-bold text-md">AI Trợ Lý</h3>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Message Bubble */}
                        <div className={`max-w-[90%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : msg.role === 'system'
                                ? 'bg-green-100 text-green-700 w-full text-center italic'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                            }`}>
                            {msg.file && (
                                <div className="mb-2 rounded overflow-hidden border border-white/20">
                                    <img src={URL.createObjectURL(msg.file)} alt="Upload" className="max-w-full h-auto" />
                                </div>
                            )}
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>

                        {/* Data Preview & Confirm Button */}
                        {msg.role === 'model' && msg.data && msg.data.length > 0 && (
                            <div className="mt-2 w-full bg-white rounded-lg border border-indigo-100 shadow-sm overflow-hidden">
                                <div className="bg-indigo-50 px-3 py-2 border-b border-indigo-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-indigo-700">Tìm thấy {msg.data.length} mục</span>
                                </div>
                                <div className="max-h-32 overflow-y-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="p-1 text-gray-500">GV</th>
                                                <th className="p-1 text-gray-500">Môn</th>
                                                <th className="p-1 text-gray-500">Lớp</th>
                                                <th className="p-1 text-gray-500">Tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {msg.data.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-1 font-medium">{row.teacher}</td>
                                                    <td className="p-1 text-gray-600">{row.subject}</td>
                                                    <td className="p-1 text-gray-600">{row.class}</td>
                                                    <td className="p-1 text-gray-600">{row.periods}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-2 bg-gray-50 border-t border-gray-100">
                                    <button
                                        onClick={() => handleConfirmData(msg.data)}
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
                                    >
                                        <CheckCircle size={16} />
                                        Chốt (Thêm vào bảng)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs ml-2">
                        <Loader2 size={14} className="animate-spin" />
                        Đang xử lý...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
                {selectedFile && (
                    <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-gray-100 rounded text-xs w-fit">
                        <ImageIcon size={12} />
                        <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                        <button onClick={() => setSelectedFile(null)}><X size={12} /></button>
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Paperclip size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        rows="1"
                        className="flex-1 px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-0 rounded-lg resize-none text-sm max-h-24"
                    />

                    <button onClick={handleSend} disabled={(!inputValue.trim() && !selectedFile) || isLoading} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatSidebar;
