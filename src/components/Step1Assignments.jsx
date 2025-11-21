import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Plus, Zap } from 'lucide-react';
import AIChatSidebar from './AIChatSidebar';

const Step1Assignments = () => {
    const { assignments, addAssignment, removeAssignment } = useAppContext();
    const [newRow, setNewRow] = useState({ teacher: '', subject: '', class: '', periods: '' });

    // AI Chat Sidebar State
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRow({ ...newRow, [name]: value });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    const handleAdd = () => {
        if (newRow.teacher && newRow.subject && newRow.class && newRow.periods) {
            addAssignment({ ...newRow, periods: Number(newRow.periods) });
            setNewRow({ teacher: '', subject: '', class: '', periods: '' });
        }
    };

    const handleImportData = (data) => {
        data.forEach(item => {
            addAssignment({ ...item, periods: Number(item.periods) });
        });
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${isChatOpen ? 'mr-0' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Phân Công Chuyên Môn</h2>
                        <p className="text-gray-500 text-sm mt-1">Nhập dữ liệu thủ công hoặc dùng AI Trợ Lý.</p>
                    </div>
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Zap size={18} className="fill-yellow-300 text-yellow-300" />
                            AI Trợ Lý
                        </button>
                    )}
                </div>

                {/* Main Data Table */}
                <div className="flex-1 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Giáo viên</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Môn</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lớp</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Số tiết</th>
                                    <th className="p-4 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assignments.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 group transition-colors">
                                        <td className="p-4 font-medium text-gray-700">{item.teacher}</td>
                                        <td className="p-4 text-gray-600">{item.subject}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                                {item.class}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{item.periods}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => removeAssignment(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {assignments.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                            Chưa có dữ liệu. Hãy nhập bên dưới hoặc mở AI Trợ Lý.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Input Row */}
                    <div className="border-t border-gray-200 p-2 bg-gray-50">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            name="teacher"
                                            placeholder="Tên GV..."
                                            value={newRow.teacher}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Môn..."
                                            value={newRow.subject}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            name="class"
                                            placeholder="Lớp..."
                                            value={newRow.class}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </td>
                                    <td className="p-2 w-24">
                                        <input
                                            type="number"
                                            name="periods"
                                            placeholder="Tiết..."
                                            value={newRow.periods}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </td>
                                    <td className="p-2 w-16 text-center">
                                        <button
                                            onClick={handleAdd}
                                            className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AI Chat Sidebar */}
            <AIChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onImportData={handleImportData}
            />
        </div>
    );
};

export default Step1Assignments;
