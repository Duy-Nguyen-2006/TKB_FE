import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Step 1: Assignments
    const [assignments, setAssignments] = useState([]);

    // Step 2: Time Frame
    const defaultTimeFrame = [
        { day: 'Thứ 2', morning: 5, afternoon: 0 },
        { day: 'Thứ 3', morning: 5, afternoon: 0 },
        { day: 'Thứ 4', morning: 5, afternoon: 0 },
        { day: 'Thứ 5', morning: 5, afternoon: 0 },
        { day: 'Thứ 6', morning: 5, afternoon: 0 },
        { day: 'Thứ 7', morning: 5, afternoon: 0 },
        { day: 'Chủ Nhật', morning: 0, afternoon: 0 },
    ];
    const [timeFrame, setTimeFrame] = useState(defaultTimeFrame);

    // Step 3: Constraints
    const [constraints, setConstraints] = useState([]);

    // Wizard Navigation
    const [currentStep, setCurrentStep] = useState(1);

    // === LOGIC XỬ LÝ GỘP & SẮP XẾP ===

    // Hàm chuẩn hóa text để so sánh (xóa khoảng trắng thừa, lowercase)
    const normalize = (str) => String(str || '').trim().toLowerCase();

    // Hàm sắp xếp danh sách theo tên giáo viên
    const sortAssignments = (list) => {
        return list.sort((a, b) => a.teacher.localeCompare(b.teacher));
    };

    // Hàm gộp logic (Dùng chung cho cả thêm lẻ và thêm nhiều)
    // currentList: Danh sách hiện tại
    // newItems: Mảng các mục mới cần thêm/sửa
    const mergeAssignmentsLogic = (currentList, newItems) => {
        let updatedList = [...currentList];

        newItems.forEach(newItem => {
            // Tìm xem đã có dòng nào trùng (Giáo viên + Môn + Lớp) chưa
            const existingIndex = updatedList.findIndex(item =>
                normalize(item.teacher) === normalize(newItem.teacher) &&
                normalize(item.subject) === normalize(newItem.subject) &&
                normalize(item.class) === normalize(newItem.class)
            );

            if (existingIndex >= 0) {
                // NẾU CÓ RỒI: Cập nhật số tiết (Ghi đè)
                updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    periods: Number(newItem.periods)
                };
            } else {
                // NẾU CHƯA CÓ: Thêm mới
                updatedList.push({
                    ...newItem,
                    id: Date.now() + Math.random(), // ID ngẫu nhiên
                    periods: Number(newItem.periods)
                });
            }
        });

        return sortAssignments(updatedList);
    };

    // 1. Thêm lẻ (Nhập tay) - Giờ sẽ tự gộp nếu trùng
    const addAssignment = (assignment) => {
        setAssignments(prev => mergeAssignmentsLogic(prev, [assignment]));
    };

    // 2. Thêm nhiều (Import từ AI/Excel) - Xử lý 1 cục rồi mới setState
    const importData = (dataArray) => {
        setAssignments(prev => mergeAssignmentsLogic(prev, dataArray));
    };

    const removeAssignment = (id) => {
        setAssignments((prev) => prev.filter((item) => item.id !== id));
    };

    // ... (Các phần khác giữ nguyên) ...
    const updateTimeFrame = (index, field, value) => {
        const newTimeFrame = [...timeFrame];
        newTimeFrame[index][field] = Number(value);
        setTimeFrame(newTimeFrame);
    };

    const resetTimeFrame = () => {
        setTimeFrame(defaultTimeFrame);
    };

    const addConstraint = (constraint) => {
        setConstraints((prev) => [...prev, { ...constraint, id: Date.now() + Math.random() }]);
    };

    const removeConstraint = (id) => {
        setConstraints((prev) => prev.filter((item) => item.id !== id));
    };

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    const resetAll = () => {
        setAssignments([]);
        setTimeFrame(defaultTimeFrame);
        setConstraints([]);
        setCurrentStep(1);
    };

    return (
        <AppContext.Provider
            value={{
                assignments,
                addAssignment,
                importData, // <-- MỚI: Dùng cái này cho AI
                removeAssignment,
                setAssignments,
                timeFrame,
                updateTimeFrame,
                resetTimeFrame,
                constraints,
                addConstraint,
                removeConstraint,
                currentStep,
                goToStep,
                resetAll,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);