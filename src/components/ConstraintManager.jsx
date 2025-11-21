import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

const ConstraintManager = ({ constraints, setConstraints }) => {
  const [newConstraint, setNewConstraint] = useState({ text: '', priority: 'HARD' });

  const addConstraint = () => {
    if (!newConstraint.text.trim()) return;

    const constraint = {
      id: Date.now(),
      text: newConstraint.text,
      priority: newConstraint.priority
    };

    setConstraints([...constraints, constraint]);
    setNewConstraint({ text: '', priority: 'HARD' });
  };

  const removeConstraint = (id) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">Constraints</h2>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., Teacher A cannot have 1st period"
            value={newConstraint.text}
            onChange={(e) => setNewConstraint({ ...newConstraint, text: e.target.value })}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addConstraint()}
          />
          <button
            onClick={addConstraint}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setNewConstraint({ ...newConstraint, priority: 'HARD' })}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${newConstraint.priority === 'HARD'
                ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-1'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            HARD Priority
          </button>
          <button
            onClick={() => setNewConstraint({ ...newConstraint, priority: 'SOFT' })}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${newConstraint.priority === 'SOFT'
                ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 ring-offset-1'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
          >
            <AlertTriangle className="w-4 h-4" />
            SOFT Priority
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {constraints.map((constraint) => (
          <div
            key={constraint.id}
            className={`p-3 rounded-lg border flex items-start justify-between gap-3 group ${constraint.priority === 'HARD'
                ? 'bg-green-50/50 border-green-100'
                : 'bg-yellow-50/50 border-yellow-100'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${constraint.priority === 'HARD' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                {constraint.priority === 'HARD' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-700 leading-relaxed">{constraint.text}</p>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${constraint.priority === 'HARD' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                  {constraint.priority}
                </span>
              </div>
            </div>
            <button
              onClick={() => removeConstraint(constraint.id)}
              className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {constraints.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No constraints added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstraintManager;