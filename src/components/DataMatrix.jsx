import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Grid } from 'lucide-react';

const DataMatrix = ({ assignments, setAssignments }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Helper to generate a unique ID if not present (for new rows)
  const ensureId = (item, index) => item.id || `temp-${index}`;

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      teacher: '',
      subject: '',
      class: '',
      sessions: 1
    };
    setAssignments([...assignments, newRow]);
    setEditingId(newRow.id);
    setEditForm(newRow);
  };

  const handleDeleteRow = (id) => {
    setAssignments(assignments.filter((a, i) => ensureId(a, i) !== id));
  };

  const startEditing = (assignment, index) => {
    const id = ensureId(assignment, index);
    setEditingId(id);
    setEditForm({ ...assignment, id });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    setAssignments(assignments.map((a, i) => {
      const currentId = ensureId(a, i);
      if (currentId === editingId) {
        return { ...editForm, sessions: parseInt(editForm.sessions) || 0 };
      }
      return a;
    }));
    setEditingId(null);
    setEditForm({});
  };

  const totalSessions = assignments.reduce((sum, a) => sum + (parseInt(a.sessions) || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">Data Matrix</h2>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <span className="text-sm text-slate-600 font-medium mr-2">Total Sessions:</span>
          <span className="text-lg font-bold text-blue-700">{totalSessions}</span>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Teacher</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Subject</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Class</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Sessions</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((assignment, index) => {
              const id = ensureId(assignment, index);
              const isEditing = editingId === id;

              return (
                <tr key={id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.teacher}
                        onChange={(e) => setEditForm({ ...editForm, teacher: e.target.value })}
                        className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Teacher Name"
                      />
                    ) : (
                      <span className="font-medium text-slate-700">{assignment.teacher}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Subject"
                      />
                    ) : (
                      <span className="text-slate-600">{assignment.subject}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.class}
                        onChange={(e) => setEditForm({ ...editForm, class: e.target.value })}
                        className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Class"
                      />
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                        {assignment.class}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        value={editForm.sessions}
                        onChange={(e) => setEditForm({ ...editForm, sessions: e.target.value })}
                        className="w-20 p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200 outline-none text-center mx-auto"
                      />
                    ) : (
                      <span className="font-bold text-slate-700">{assignment.sessions}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEditing}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(assignment, index)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {assignments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 italic">
                  No assignments data found. Import a file or add a row manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors px-2 py-1 rounded hover:bg-blue-50 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add New Assignment Row
        </button>
      </div>
    </div>
  );
};

export default DataMatrix;