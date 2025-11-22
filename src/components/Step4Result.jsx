import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, RotateCcw, Edit3, FileJson } from 'lucide-react';

const Step4Result = () => {
    const { goToStep, resetAll, scheduleResult } = useAppContext();

    const handleAdjust = () => goToStep(1);

    const handleNew = () => {
        if (window.confirm('Bạn có chắc muốn xóa hết dữ liệu để xếp mới không?')) {
            resetAll();
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Kết quả Xếp Lịch</h2>
                <p className="text-gray-500">Dữ liệu nhận được từ Server:</p>
            </div>

            {/* KHUNG HIỂN THỊ KẾT QUẢ JSON */}
            <div className="flex-1 bg-slate-900 text-green-400 p-6 rounded-xl overflow-auto font-mono text-sm shadow-inner border border-slate-700 mb-6 text-left">
                {scheduleResult ? (
                    <pre>{JSON.stringify(scheduleResult, null, 2)}</pre>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <FileJson size={48} className="mb-2 opacity-50" />
                        <p>Chưa có dữ liệu nào (Hoặc API trả về rỗng).</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-6 mt-auto">
                <button
                    onClick={handleAdjust}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                    <Edit3 size={20} />
                    Điều chỉnh lại
                </button>

                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                    <RotateCcw size={20} />
                    Xếp mới
                </button>
            </div>
        </div>
    );
};

export default Step4Result;