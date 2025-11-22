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

    // Step 4: Result Storage
    const [scheduleResult, setScheduleResult] = useState(null);

    // Wizard Navigation
    const [currentStep, setCurrentStep] = useState(1);

    // === LOGIC GỘP & SẮP XẾP ===
    const normalize = (str) => String(str || '').trim().toLowerCase();

    const sortAssignments = (list) => {
        return list.sort((a, b) => a.teacher.localeCompare(b.teacher));
    };

    const mergeAssignmentsLogic = (currentList, newItems) => {
        let updatedList = [...currentList];
        newItems.forEach(newItem => {
            const existingIndex = updatedList.findIndex(item =>
                normalize(item.teacher) === normalize(newItem.teacher) &&
                normalize(item.subject) === normalize(newItem.subject) &&
                normalize(item.class) === normalize(newItem.class)
            );

            if (existingIndex >= 0) {
                updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    periods: Number(newItem.periods)
                };
            } else {
                updatedList.push({
                    ...newItem,
                    id: Date.now() + Math.random(),
                    periods: Number(newItem.periods)
                });
            }
        });
        return sortAssignments(updatedList);
    };

    // Actions
    const addAssignment = (assignment) => {
        setAssignments(prev => mergeAssignmentsLogic(prev, [assignment]));
    };

    const importData = (dataArray) => {
        setAssignments(prev => mergeAssignmentsLogic(prev, dataArray));
    };

    const removeAssignment = (id) => {
        setAssignments((prev) => prev.filter((item) => item.id !== id));
    };

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
        setScheduleResult(null);
        setCurrentStep(1);
    };

    return (
        <AppContext.Provider
            value={{
                assignments,
                addAssignment,
                importData,
                removeAssignment,
                setAssignments,
                timeFrame,
                updateTimeFrame,
                resetTimeFrame,
                constraints,
                addConstraint,
                removeConstraint,
                scheduleResult,
                setScheduleResult,
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