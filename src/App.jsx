import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Step1Assignments from './components/Step1Assignments';
import Step2TimeFrame from './components/Step2TimeFrame';
import Step3Constraints from './components/Step3Constraints';
import Step4Result from './components/Step4Result';

const MainContent = () => {
  const { currentStep } = useAppContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Assignments />;
      case 2:
        return <Step2TimeFrame />;
      case 3:
        return <Step3Constraints />;
      case 4:
        return <Step4Result />;
      default:
        return <Step1Assignments />;
    }
  };

  return (
    <Layout>
      {renderStep()}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;