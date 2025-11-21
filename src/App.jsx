import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Save, LayoutDashboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import ScheduleSettings from './components/ScheduleSettings';
import SmartImport from './components/SmartImport';
import DataMatrix from './components/DataMatrix';
import ConstraintManager from './components/ConstraintManager';

function App() {
  // 1. State Management
  const [assignments, setAssignments] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [settings, setSettings] = useState({
    days: 5,
    slotsPerDay: 8,
    fixedSlots: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // 2. Handlers
  const handleImportSuccess = (data) => {
    // Validate and sanitize imported data
    const sanitizedData = data.map((item, index) => ({
      id: Date.now() + index,
      teacher: item.teacher || '',
      subject: item.subject || '',
      class: item.class || '',
      sessions: parseInt(item.sessions) || 1
    }));
    setAssignments(prev => [...prev, ...sanitizedData]);
  };

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    setGenerationStatus(null);

    const payload = {
      assignments,
      constraints,
      settings
    };

    console.log('Generating Schedule with Payload:', payload);

    try {
      // Requirement: POST to https://n8n.genz-ai.click/webhook/solve-schedule
      const response = await axios.post('https://n8n.genz-ai.click/webhook/solve-schedule', payload);

      console.log('API Response:', response.data);
      setGenerationStatus({
        type: 'success',
        message: 'Schedule generation started successfully! Check your email or dashboard for results.'
      });
    } catch (error) {
      console.error('Generation Error:', error);
      setGenerationStatus({
        type: 'error',
        message: error.message || 'Failed to start schedule generation. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">School Scheduler</h1>
              <p className="text-slate-500 font-medium">Intelligent Timetable Management</p>
            </div>
          </div>

          <button
            onClick={handleGenerateSchedule}
            disabled={isGenerating || assignments.length === 0}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all
              ${isGenerating || assignments.length === 0
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95'
              }
            `}
          >
            {isGenerating ? (
              <>Processing...</>
            ) : (
              <>
                <LayoutDashboard className="w-5 h-5" />
                Generate Schedule
              </>
            )}
          </button>
        </header>

        {/* Status Alert */}
        {generationStatus && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${generationStatus.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-100'
            : 'bg-red-50 text-red-800 border border-red-100'
            }`}>
            {generationStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium">{generationStatus.message}</p>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Settings & Import (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <ScheduleSettings settings={settings} setSettings={setSettings} />
            <SmartImport onImportSuccess={handleImportSuccess} />
          </div>

          {/* Right Column: Data Matrix (8 cols) */}
          <div className="lg:col-span-8">
            <DataMatrix assignments={assignments} setAssignments={setAssignments} />
          </div>

          {/* Bottom Full Width: Constraints */}
          <div className="lg:col-span-12">
            <ConstraintManager constraints={constraints} setConstraints={setConstraints} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;