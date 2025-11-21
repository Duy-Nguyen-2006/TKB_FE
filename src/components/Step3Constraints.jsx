import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';

const Step3Constraints = () => {
    const { constraints, addConstraint, removeConstraint } = useAppContext();
    const [text, setText] = useState('');
    const [type, setType] = useState('hard'); // hard | soft

    const handleAdd = () => {
        if (text.trim()) {
            addConstraint({ text, type });
            setText('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Ràng Buộc & Yêu Cầu</h2>
                <p className="text-gray-500 text-sm mt-1">Thêm các yêu cầu đặc biệt cho thời khóa biểu.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                {/* Input Section */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung yêu cầu</label>
                        <textarea
                            rows="4"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Ví dụ: Thầy Tuấn nghỉ chiều thứ 2..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
                        />

                        <div className="flex gap-4 mb-6">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="hard"
                                    checked={type === 'hard'}
                                    onChange={() => setType('hard')}
                                    className="peer hidden"
                                />
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 transition-all">
                                    <ShieldAlert className="text-red-500 mb-1" size={24} />
                                    <span className="text-sm font-medium text-gray-700">Bắt buộc</span>
                                </div>
                            </label>

                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="soft"
                                    checked={type === 'soft'}
                                    onChange={() => setType('soft')}
                                    className="peer hidden"
                                />
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 transition-all">
                                    <ShieldCheck className="text-yellow-500 mb-1" size={24} />
                                    <span className="text-sm font-medium text-gray-700">Ưu tiên</span>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={!text.trim()}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                        >
                            <Plus size={20} />
                            Thêm yêu cầu
                        </button>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-700">Danh sách yêu cầu ({constraints.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {constraints.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-start justify-between p-4 rounded-lg border bg-white shadow-sm transition-all hover:shadow-md ${item.type === 'hard' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-yellow-400'
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${item.type === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {item.type === 'hard' ? 'Cứng' : 'Mềm'}
                                        </span>
                                    </div>
                                    <p className="text-gray-800">{item.text}</p>
                                </div>
                                <button
                                    onClick={() => removeConstraint(item.id)}
                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {constraints.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                                <ShieldCheck size={48} className="mb-2 opacity-20" />
                                <p>Chưa có ràng buộc nào được thêm.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3Constraints;
