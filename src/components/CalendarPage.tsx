import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Plus, 
  Calendar, 
  ShieldAlert, 
  Grid, 
  List,
  Compass,
  CheckCircle,
  HelpCircle,
  Coffee,
  Activity,
  X
} from 'lucide-react';
import { Task, ScheduleBlock } from '../types';

interface CalendarPageProps {
  tasks: Task[];
  scheduleBlocks: ScheduleBlock[];
  darkMode: boolean;
  onAddScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  onTriggerRescue: () => void;
}

export default function CalendarPage({
  tasks,
  scheduleBlocks,
  darkMode,
  onAddScheduleBlock,
  onTriggerRescue,
}: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Local state for manual block creation
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockStart, setNewBlockStart] = useState('09:00');
  const [newBlockEnd, setNewBlockEnd] = useState('10:00');
  const [newBlockCategory, setNewBlockCategory] = useState('Deep Work');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days for current month/year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayIndex = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayIndex(currentMonth, currentYear);

  const calendarDays = [];
  // Empty padding days for previous month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Days of current month
  for (let d = 1; d <= totalDays; d++) {
    const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr: formattedDate });
  }

  // Filter schedules and deadlines for selected day
  const selectedDaySchedules = scheduleBlocks.filter(b => b.date === selectedDate);
  const selectedDayDeadlines = tasks.filter(t => t.dueDate.startsWith(selectedDate));

  const handleAddBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim()) return;

    onAddScheduleBlock({
      title: newBlockTitle.trim(),
      date: selectedDate,
      startTime: newBlockStart,
      endTime: newBlockEnd,
      isAIGenerated: false,
      category: newBlockCategory,
    });

    setNewBlockTitle('');
    setShowBlockModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-sans font-extrabold tracking-tight">Tactical Schedule Planner</h3>
          <p className="text-xs opacity-60">Visualize critical deliverables overlaid with optimized AI-generated slots.</p>
        </div>

        <button
          onClick={onTriggerRescue}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer animate-pulse"
        >
          <Sparkles className="w-4 h-4" /> Trigger AI Rescue Schedule
        </button>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Pane: Interactive Monthly Calendar Grid */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col shadow-sm justify-between ${
          darkMode 
            ? 'bg-slate-900/35 border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div>
            {/* Header Switcher */}
            <div className="flex items-center justify-between border-b border-slate-700/10 pb-4 mb-4">
              <span className="font-sans font-bold text-base tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-slate-700/20 hover:bg-slate-500/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-slate-700/20 hover:bg-slate-500/15"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] uppercase font-bold opacity-50 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((item, idx) => {
                if (!item) return <div key={`empty-${idx}`} className="h-16 rounded-xl opacity-20"></div>;

                const isSelected = item.dateStr === selectedDate;
                const dayDeadlines = tasks.filter(t => t.dueDate.startsWith(item.dateStr) && t.status !== 'Completed');
                const hasAIGenerated = scheduleBlocks.some(b => b.date === item.dateStr && b.isAIGenerated);

                return (
                  <button
                    key={`day-${item.day}`}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`h-16 p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 font-bold'
                        : darkMode
                          ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                          : 'bg-slate-50/50 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-mono">{item.day}</span>

                    {/* Deadline indicators / counts on calendar day */}
                    <div className="flex items-center gap-1 mt-1">
                      {dayDeadlines.length > 0 && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" title={`${dayDeadlines.length} Due`} />
                      )}
                      {hasAIGenerated && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500" title="AI Blocks Generated" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono opacity-50 border-t border-slate-700/10 pt-4 mt-4">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Pending Deadlines</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>AI Target Blocks</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Timeline Scheduler of Selected Day */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between shadow-sm min-h-[420px] ${
          darkMode 
            ? 'bg-slate-900/35 border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-sans font-bold text-sm tracking-tight">
                  Timeline: {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </h4>
              </div>
              <button
                onClick={() => setShowBlockModal(true)}
                className="p-1.5 rounded-lg border border-slate-700/20 text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                title="Add Custom Focus Block"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List Day Deliverables */}
            {selectedDayDeadlines.length > 0 && (
              <div className="mb-4 space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-500 block">Deliverables Due:</span>
                {selectedDayDeadlines.map(t => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-sans flex items-center justify-between">
                    <span className="font-semibold truncate">{t.title}</span>
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded uppercase">🚨 DEADLINE</span>
                  </div>
                ))}
              </div>
            )}

            {/* Visual list of scheduled sessions */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">Scheduled Focus Tracks:</span>
              
              {selectedDaySchedules.length === 0 ? (
                <div className="py-12 text-center opacity-45 border-2 border-dashed border-slate-700/10 rounded-xl space-y-2">
                  <span className="text-xs font-mono block">No sessions mapped yet.</span>
                  <button
                    onClick={() => {
                      onAddScheduleBlock({
                        title: '📚 Strategic Research Sprint',
                        date: selectedDate,
                        startTime: '09:00',
                        endTime: '10:30',
                        isAIGenerated: true,
                        category: 'AI Recommended Focus'
                      });
                    }}
                    className="text-[10px] font-mono font-bold text-indigo-400 hover:underline"
                  >
                    Quick Auto-Generate Block
                  </button>
                </div>
              ) : (
                selectedDaySchedules
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((b) => (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        b.isAIGenerated
                          ? darkMode
                            ? 'bg-indigo-950/20 border-indigo-900/50 text-indigo-300'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                          : darkMode
                            ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                            : 'bg-slate-50 border-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-sans font-bold truncate block">
                            {b.title}
                          </span>
                          {b.isAIGenerated && (
                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider bg-purple-500 text-white animate-pulse">
                              AI Slot
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
                          <span className="bg-slate-500/15 px-1 py-0.5 rounded">{b.category || 'Focus Session'}</span>
                          <span>{b.startTime} - {b.endTime}</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="p-3.5 mt-4 rounded-xl bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 border border-indigo-500/20 text-xs font-sans flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="leading-relaxed opacity-85">
              💡 <strong>AI scheduling trick:</strong> Completing work in targeted 90-minute focus slots before lunchtime avoids cognitive exhaustion and increases velocity by 40%.
            </p>
          </div>
        </div>
      </div>

      {/* BLOCK MANUAL ADD MODAL */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border p-6 shadow-xl relative ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button
              onClick={() => setShowBlockModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-sans font-bold text-base tracking-tight mb-4">Add Schedule Block</h3>

            <form onSubmit={handleAddBlockSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase tracking-wider opacity-60">Session Name</label>
                <input
                  type="text"
                  required
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  placeholder="e.g. Study Chemistry Chapter 4"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-60">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newBlockStart}
                    onChange={(e) => setNewBlockStart(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-60">End Time</label>
                  <input
                    type="time"
                    required
                    value={newBlockEnd}
                    onChange={(e) => setNewBlockEnd(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase tracking-wider opacity-60">Category</label>
                <select
                  value={newBlockCategory}
                  onChange={(e) => setNewBlockCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="Deep Work">🧠 Deep Work</option>
                  <option value="Research">📚 Research</option>
                  <option value="Revision">📝 Review & Proofing</option>
                  <option value="Break">☕ Strategic Break</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-3 py-2 rounded-lg font-semibold hover:bg-slate-500/10 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
