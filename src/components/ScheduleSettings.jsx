import React, { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';

const ScheduleSettings = ({ settings, setSettings }) => {
    const [newFixedSlot, setNewFixedSlot] = useState({ day: 1, slot: 1, subject: '' });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    const addFixedSlot = () => {
        if (!newFixedSlot.subject) return;
        setSettings(prev => ({
            ...prev,
            fixedSlots: [...prev.fixedSlots, { ...newFixedSlot, day: parseInt(newFixedSlot.day), slot: parseInt(newFixedSlot.slot) }]
        }));
        setNewFixedSlot({ day: 1, slot: 1, subject: '' });
    };

    const removeFixedSlot = (index) => {
        setSettings(prev => ({
            ...prev,
            fixedSlots: prev.fixedSlots.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">Schedule Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Days per Week</label>
                    <select
                        value={settings.days}
                        onChange={(e) => handleSettingChange('days', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                        {[5, 6, 7].map(d => (
                            <option key={d} value={d}>{d} Days</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Slots per Day</label>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={settings.slotsPerDay}
                        onChange={(e) => handleSettingChange('slotsPerDay', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Fixed Slots</h3>

                <div className="flex flex-wrap gap-3 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Day</label>
                        <select
                            value={newFixedSlot.day}
                            onChange={(e) => setNewFixedSlot({ ...newFixedSlot, day: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm"
                        >
                            {Array.from({ length: settings.days }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>Day {d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Slot</label>
                        <select
                            value={newFixedSlot.slot}
                            onChange={(e) => setNewFixedSlot({ ...newFixedSlot, slot: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm"
                        >
                            {Array.from({ length: settings.slotsPerDay }, (_, i) => i + 1).map(s => (
                                <option key={s} value={s}>Slot {s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-[2] min-w-[200px]">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Subject/Activity</label>
                        <input
                            type="text"
                            placeholder="e.g., Flag Ceremony"
                            value={newFixedSlot.subject}
                            onChange={(e) => setNewFixedSlot({ ...newFixedSlot, subject: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={addFixedSlot}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {settings.fixedSlots.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                    Day {slot.day}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                    Slot {slot.slot}
                                </span>
                                <span className="font-medium text-slate-700">{slot.subject}</span>
                            </div>
                            <button
                                onClick={() => removeFixedSlot(index)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {settings.fixedSlots.length === 0 && (
                        <p className="text-center text-slate-400 py-4 text-sm italic">No fixed slots added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleSettings;
