import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, RotateCcw, Edit3 } from 'lucide-react';

const Step4Result = () => {
    const { goToStep, resetAll } = useAppContext();

    const handleAdjust = () => {
        goToStep(1);
    };

    const handleNew = () => {
        if (window.confirm('Bạn có chắc muốn xóa hết dữ liệu để xếp mới không?')) {
            resetAll();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                <CheckCircle size={48} />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đã xếp lịch thành công!</h2>
            <p className="text-gray-500 max-w-md mb-12">
                Hệ thống đã hoàn tất việc sắp xếp thời khóa biểu dựa trên các dữ liệu và ràng buộc bạn cung cấp.
            </p>

            <div className="flex gap-6">
                <button
                    onClick={handleAdjust}
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                >
                    <Edit3 size={20} />
                    Điều chỉnh lại
                </button>

                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    <RotateCcw size={20} />
                    Xếp mới
                </button>
            </div>
        </div>
    );
};

export default Step4Result;
