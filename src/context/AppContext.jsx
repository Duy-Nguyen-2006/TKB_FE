import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Step 1: Assignments
    const [assignments, setAssignments] = useState([
        // Example initial data (optional, can be empty)
        // { id: 1, teacher: 'Nguyễn Văn A', subject: 'Toán', class: '10A1', periods: 3 },
    ]);

    // Step 2: Time Frame (Default: Mon-Sat, 5 morning, 0 afternoon)
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

    // Actions
    const addAssignment = (assignment) => {
        setAssignments((prev) => [...prev, { ...assignment, id: Date.now() + Math.random() }]);
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
        setCurrentStep(1);
    };

    return (
        <AppContext.Provider
            value={{
                assignments,
                addAssignment,
                removeAssignment,
                setAssignments, // Exposed for bulk add (AI)
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
