import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const SmartImport = ({ onImportSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setStatus(null);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Requirement: "On success, validate response is an array and call onImportSuccess"
      const response = await axios.post('https://n8n.genz-ai.click/webhook/parse-schedule', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (Array.isArray(response.data)) {
        onImportSuccess(response.data);
        setStatus('success');
        setMessage(`Successfully imported ${response.data.length} assignments.`);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Import error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to upload file. Please try again.');

      // Fallback for demonstration purposes if the URL is unreachable (likely in this env)
      // Uncomment below to test "success" flow without a real backend
      /*
      setTimeout(() => {
        const mockData = [
          { teacher: 'John Doe', subject: 'Math', class: '10A', sessions: 5 },
          { teacher: 'Jane Smith', subject: 'English', class: '10A', sessions: 4 },
        ];
        onImportSuccess(mockData);
        setStatus('success');
        setMessage('Simulated import success (API unreachable).');
        setIsLoading(false);
      }, 1000);
      return; 
      */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">Smart Import</h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center gap-4 min-h-[200px]
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
          }
        `}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".csv,.xlsx,.json"
          onChange={handleFileInput}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-medium">Parsing schedule data...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-700">
                Drag & Drop your file here
              </p>
              <p className="text-sm text-slate-500 mt-1">
                or click to browse (CSV, Excel, JSON)
              </p>
            </div>
          </>
        )}
      </div>

      {status && (
        <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{status === 'success' ? 'Import Successful' : 'Import Failed'}</p>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartImport;