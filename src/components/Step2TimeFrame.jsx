import React from 'react';
import { useAppContext } from '../context/AppContext';
import { RotateCcw, Trash2 } from 'lucide-react';

const Step2TimeFrame = () => {
    const { timeFrame, updateTimeFrame, resetTimeFrame } = useAppContext();

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Cấu Hình Khung Lịch</h2>
                    <p className="text-gray-500 text-sm mt-1">Thiết lập số tiết dạy cho từng buổi trong tuần.</p>
                </div>
                <button
                    onClick={resetTimeFrame}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <RotateCcw size={16} />
                    Khôi phục mặc định
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Thứ</th>
                            <th className="p-4 font-semibold text-gray-600">Sáng (Tiết)</th>
                            <th className="p-4 font-semibold text-gray-600">Chiều (Tiết)</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {timeFrame.map((day, index) => (
                            <tr key={day.day} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{day.day}</td>
                                <td className="p-4">
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        value={day.morning}
                                        onChange={(e) => updateTimeFrame(index, 'morning', e.target.value)}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                    />
                                </td>
                                <td className="p-4">
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        value={day.afternoon}
                                        onChange={(e) => updateTimeFrame(index, 'afternoon', e.target.value)}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                    />
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => {
                                            updateTimeFrame(index, 'morning', 0);
                                            updateTimeFrame(index, 'afternoon', 0);
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                        title="Xóa ngày này (Set về 0)"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Step2TimeFrame;
