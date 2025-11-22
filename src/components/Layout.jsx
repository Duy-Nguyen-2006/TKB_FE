import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Check, Calendar, Settings, List, CheckCircle, Loader2 } from 'lucide-react';
import { generateSchedule } from '../services/apiService';

const steps = [
    { id: 1, title: 'Phân Công', icon: List },
    { id: 2, title: 'Khung Lịch', icon: Calendar },
    { id: 3, title: 'Ràng Buộc', icon: Settings },
    { id: 4, title: 'Kết Quả', icon: CheckCircle },
];

const Layout = ({ children }) => {
    const { currentStep, goToStep, assignments, timeFrame, constraints, setScheduleResult } = useAppContext();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleNext = async () => {
        if (currentStep === 3) {
            if (assignments.length === 0) {
                alert("Chưa có phân công nào! Quay lại bước 1 nhập liệu đi.");
                return;
            }

            setIsProcessing(true);
            try {
                const payload = {
                    assignments,
                    timeFrame,
                    constraints
                };

                console.log("🚀 Sending payload:", payload);
                const result = await generateSchedule(payload);
                console.log("✅ Result received:", result);

                setScheduleResult(result);
                goToStep(4);

            } catch (error) {
                alert("Lỗi khi xếp lịch: " + (error.response?.data?.text || error.message));
            } finally {
                setIsProcessing(false);
            }
        } else if (currentStep < 4) {
            goToStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg scale-110'
                                            : isCompleted
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                                    </div>
                                    <span
                                        className={`mt-2 text-xs font-medium uppercase tracking-wider ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-500' : 'text-gray-400'
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-100'
                                                }`}
                                            style={{ width: 'calc(100% + 2rem)', left: '50%' }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-4xl mx-auto h-full flex flex-col">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100 p-6">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1 || currentStep === 4 || isProcessing}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${currentStep === 1 || currentStep === 4 || isProcessing
                                ? 'opacity-0 pointer-events-none'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ArrowLeft size={18} />
                            Quay lại
                        </button>

                        {currentStep < 4 && (
                            <button
                                onClick={handleNext}
                                disabled={isProcessing}
                                className={`flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-md shadow-indigo-200 transition-all active:scale-95 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        {currentStep === 3 ? 'Xếp Lịch' : 'Tiếp tục'}
                                        {currentStep !== 3 && <ArrowRight size={18} />}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;