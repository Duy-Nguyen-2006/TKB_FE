import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Bot, User, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { sendMessageToGemini } from '../services/apiService';

const AIChatModal = ({ isOpen, onClose, onImportData }) => {
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
            onImportData(lastAiMsgWithData.data);
            onClose(); // Close modal as requested "không hỏi lại gì nữa"
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
        // Filter history to only text for now to avoid complexity with sending back images
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Trợ lý AI</h3>
                            <p className="text-indigo-100 text-xs">Hỗ trợ trích xuất & xử lý dữ liệu</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-indigo-100 text-indigo-600'
                                }`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* Bubble */}
                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.file && (
                                        <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                                            <img
                                                src={URL.createObjectURL(msg.file)}
                                                alt="Upload"
                                                className="max-w-full h-auto max-h-48 object-cover"
                                            />
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                                </div>

                                {/* Data Preview Block (Only for AI) */}
                                {msg.data && msg.data.length > 0 && (
                                    <div className="mt-3 bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden w-full">
                                        <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-indigo-700 uppercase">Dữ liệu trích xuất ({msg.data.length})</span>
                                            <button
                                                onClick={() => onImportData(msg.data)}
                                                className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                                            >
                                                <Plus size={14} />
                                                Thêm vào lịch
                                            </button>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="p-2 font-medium text-gray-500">GV</th>
                                                        <th className="p-2 font-medium text-gray-500">Môn</th>
                                                        <th className="p-2 font-medium text-gray-500">Lớp</th>
                                                        <th className="p-2 font-medium text-gray-500">Tiết</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {msg.data.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="p-2 font-medium text-gray-700">{row.teacher}</td>
                                                            <td className="p-2 text-gray-600">{row.subject}</td>
                                                            <td className="p-2 text-gray-600">{row.class}</td>
                                                            <td className="p-2 text-gray-600">{row.periods}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-indigo-600" />
                                <span className="text-sm text-gray-500">Đang suy nghĩ...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {selectedFile && (
                        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-gray-50 rounded-lg w-fit border border-gray-200">
                            <ImageIcon size={16} className="text-indigo-600" />
                            <span className="text-xs text-gray-600 max-w-[200px] truncate">{selectedFile.name}</span>
                            <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500 ml-2">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            title="Gửi ảnh"
                        >
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn..."
                            rows="1"
                            className="flex-1 px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-0 rounded-xl resize-none max-h-32 min-h-[46px] transition-all"
                            style={{ height: 'auto', minHeight: '46px' }}
                        />

                        <button
                            onClick={handleSend}
                            disabled={(!inputValue.trim() && !selectedFile) || isLoading}
                            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatModal;
