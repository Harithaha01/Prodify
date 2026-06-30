import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Clock, 
  Layers, 
  Edit3, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  X,
  CheckCircle,
  HelpCircle,
  Brain,
  ListTodo
} from 'lucide-react';
import { Task, TaskStatus, Priority, SubTask } from '../types';

interface TasksPageProps {
  tasks: Task[];
  darkMode: boolean;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onTriggerBreakdown: (taskId: string, title: string, desc?: string) => Promise<void>;
  loadingBreakdownId: string | null;
}

export default function TasksPage({
  tasks,
  darkMode,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onTriggerBreakdown,
  loadingBreakdownId,
}: TasksPageProps) {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Task | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [category, setCategory] = useState('Academic');
  const [dueDate, setDueDate] = useState('');
  const [timeEstimated, setTimeEstimated] = useState(60);

  // New subtask field for edit modal
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      priority,
      status: 'ToDo',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      timeEstimated: Number(timeEstimated),
      category,
      subtasks: [],
    });

    // Reset fields & close
    setTitle('');
    setDescription('');
    setPriority('High');
    setCategory('Academic');
    setDueDate('');
    setTimeEstimated(60);
    setShowCreateModal(false);
  };

  const handleUpdateTaskStatus = (task: Task, newStatus: TaskStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  const handleAddSubtaskManual = (task: Task) => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
      timeEstimated: 15
    };
    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, newSub],
    });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (task: Task, subId: string) => {
    const updatedSubs = task.subtasks.map(s => 
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask({ ...task, subtasks: updatedSubs });
  };

  const handleDeleteSubtask = (task: Task, subId: string) => {
    const updatedSubs = task.subtasks.filter(s => s.id !== subId);
    onUpdateTask({ ...task, subtasks: updatedSubs });
  };

  const [activeStatus, setActiveStatus] = useState<TaskStatus>('ToDo');

  const statuses: { id: TaskStatus; label: string; activeColor: string; inactiveColor: string; badgeColor: string; accentColor: string }[] = [
    { 
      id: 'ToDo', 
      label: 'To Do', 
      activeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/40 shadow-lg shadow-indigo-500/5', 
      inactiveColor: 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/10',
      accentColor: 'text-indigo-400'
    },
    { 
      id: 'InProgress', 
      label: 'In Progress', 
      activeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/5', 
      inactiveColor: 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/10',
      accentColor: 'text-amber-400'
    },
    { 
      id: 'Review', 
      label: 'Under Review', 
      activeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/40 shadow-lg shadow-purple-500/5', 
      inactiveColor: 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/10',
      accentColor: 'text-purple-400'
    },
    { 
      id: 'Completed', 
      label: 'Completed', 
      activeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/5', 
      inactiveColor: 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/10',
      accentColor: 'text-emerald-400'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-sans font-extrabold tracking-tight">Tactical Execution Matrix</h3>
          <p className="text-xs opacity-60">Access separate execution modes to inspect and organize your items.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          id="btn-trigger-add-task-modal"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Tactical Task
        </button>
      </div>

      {/* 4 Mode/Status Selector Tabs */}
      <div className={`p-1.5 rounded-2xl border grid grid-cols-2 md:grid-cols-4 gap-1.5 transition-all ${
        darkMode 
          ? 'bg-slate-950/60 border-white/5 backdrop-blur-md' 
          : 'bg-slate-100 border-slate-200'
      }`}>
        {statuses.map((tab) => {
          const colTasks = tasks.filter((t) => t.status === tab.id);
          const isActive = activeStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-sans font-bold transition-all duration-300 cursor-pointer ${
                isActive 
                  ? tab.activeColor + ' border-white/10'
                  : tab.inactiveColor + ' border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  tab.id === 'ToDo' ? 'bg-indigo-400 animate-pulse' :
                  tab.id === 'InProgress' ? 'bg-amber-400' :
                  tab.id === 'Review' ? 'bg-purple-400' : 'bg-emerald-400'
                } ${isActive ? 'ring-2 ring-white/15' : ''}`} />
                <span className="truncate">{tab.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                isActive ? tab.badgeColor : 'bg-slate-800/40 text-slate-400 border border-slate-700/10'
              }`}>
                {colTasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Mode Task Container */}
      <div className={`p-6 rounded-2xl border min-h-[450px] flex flex-col transition-all ${
        darkMode 
          ? 'bg-black/25 border-white/5 backdrop-blur-xl' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Active Title Indicator */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
              statuses.find(s => s.id === activeStatus)?.activeColor
            }`}>
              {statuses.find(s => s.id === activeStatus)?.label} Mode
            </span>
            <span className="text-xs font-mono opacity-50">
              {tasks.filter((t) => t.status === activeStatus).length} Tasks Active
            </span>
          </div>
        </div>

        {/* Task Cards Grid */}
        {tasks.filter((t) => t.status === activeStatus).length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-40 border-2 border-dashed border-slate-700/10 rounded-2xl">
            <ListTodo className="w-12 h-12 mb-3 text-slate-400" />
            <span className="text-sm font-sans font-bold">No tasks under this mode</span>
            <p className="text-xs font-mono mt-1 max-w-xs leading-normal">
              Get started by creating a task or moving an existing task into this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks
              .filter((t) => t.status === activeStatus)
              .map((task) => {
                const currentStatus = activeStatus;
                return (
                  <div
                    key={task.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative group transition-all duration-300 ${
                      darkMode 
                        ? 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-900/30' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Priority Tag & Quick Status Arrows */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.priority === 'Urgent' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' :
                        task.priority === 'High' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10' :
                        task.priority === 'Medium' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/10' : 
                        'bg-slate-500/15 text-slate-400 border border-slate-500/10'
                      }`}>
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        {currentStatus !== 'ToDo' && (
                          <button
                            onClick={() => {
                              const prevStat: Record<TaskStatus, TaskStatus> = {
                                ToDo: 'ToDo',
                                InProgress: 'ToDo',
                                Review: 'InProgress',
                                Completed: 'Review',
                              };
                              handleUpdateTaskStatus(task, prevStat[currentStatus]);
                            }}
                            className="p-1 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Move Back"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {currentStatus !== 'Completed' && (
                          <button
                            onClick={() => {
                              const nextStat: Record<TaskStatus, TaskStatus> = {
                                ToDo: 'InProgress',
                                InProgress: 'Review',
                                Review: 'Completed',
                                Completed: 'Completed',
                              };
                              handleUpdateTaskStatus(task, nextStat[currentStatus]);
                            }}
                            className="p-1 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Move Forward"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono opacity-50 block uppercase tracking-wider">{task.category}</span>
                      <h4 className="text-sm font-sans font-bold leading-tight group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs opacity-65 font-sans line-clamp-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Subtask Mini Count Tracker */}
                    {task.subtasks.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-mono opacity-50">
                          <span>Subtasks</span>
                          <span>
                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800/60' : 'bg-slate-200'}`}>
                          <motion.div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                            initial={{ width: 0 }}
                            animate={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer Metadata */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono opacity-60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {task.timeEstimated}m
                      </span>
                    </div>

                    {/* Edit hover utility tray */}
                    <div className="flex items-center gap-1.5 self-end pt-2">
                      <button
                        onClick={() => setShowEditModal(task)}
                        className="p-1.5 rounded-lg border border-slate-800 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all cursor-pointer"
                        title="Manage Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-lg border border-slate-800 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 1. CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-xl relative ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                <ListTodo className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-sans font-bold text-lg tracking-tight">Create Tactical Task</h3>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase tracking-wider opacity-60">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Draft Economics Thesis Outline"
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase tracking-wider opacity-60">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter high-level goals or prompt parameters"
                  rows={3}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-60">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="High">🔥 High</option>
                    <option value="Medium">⚡ Medium</option>
                    <option value="Low">💤 Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-60">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Academic">🎓 Academic</option>
                    <option value="Work">💼 Work</option>
                    <option value="Personal">🏠 Personal</option>
                    <option value="Entrepreneurial">🚀 Startup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-60">Due Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-60">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    required
                    value={timeEstimated}
                    onChange={(e) => setTimeEstimated(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-500/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Deploy Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT TASK & SUBTASK BREAKDOWN DETAILS MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-xl relative flex flex-col md:flex-row gap-6 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button
              onClick={() => setShowEditModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Core Fields */}
            <div className="flex-1 space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-700/10 pb-3">
                <h3 className="font-sans font-bold text-lg tracking-tight">Edit Task Details</h3>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase tracking-wider opacity-65">Title</label>
                <input
                  type="text"
                  value={showEditModal.title}
                  onChange={(e) => onUpdateTask({ ...showEditModal, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase tracking-wider opacity-65">Description</label>
                <textarea
                  value={showEditModal.description}
                  onChange={(e) => onUpdateTask({ ...showEditModal, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-65">Priority</label>
                  <select
                    value={showEditModal.priority}
                    onChange={(e) => onUpdateTask({ ...showEditModal, priority: e.target.value as Priority })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="High">🔥 High</option>
                    <option value="Medium">⚡ Medium</option>
                    <option value="Low">💤 Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-65">Status</label>
                  <select
                    value={showEditModal.status}
                    onChange={(e) => onUpdateTask({ ...showEditModal, status: e.target.value as TaskStatus })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="ToDo">📋 To Do</option>
                    <option value="InProgress">🚀 In Progress</option>
                    <option value="Review">👀 Under Review</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-65">Due Date</label>
                  <input
                    type="datetime-local"
                    value={showEditModal.dueDate}
                    onChange={(e) => onUpdateTask({ ...showEditModal, dueDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider opacity-65">Duration (mins)</label>
                  <input
                    type="number"
                    value={showEditModal.timeEstimated}
                    onChange={(e) => onUpdateTask({ ...showEditModal, timeEstimated: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: AI Subtask Breakdown & Subtask list */}
            <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-700/10 md:pl-6 pt-6 md:pt-0 max-h-[420px] md:max-h-none overflow-y-auto">
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs uppercase tracking-wider opacity-75">Milestone Checklist</span>
                  <button
                    type="button"
                    disabled={loadingBreakdownId === showEditModal.id}
                    onClick={async () => {
                      await onTriggerBreakdown(showEditModal.id, showEditModal.title, showEditModal.description);
                      // Force local state update after breakdown completes to show the new subtasks
                      const refreshedTask = tasks.find(t => t.id === showEditModal.id);
                      if (refreshedTask) setShowEditModal(refreshedTask);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    <Sparkles className={`w-3 h-3 ${loadingBreakdownId === showEditModal.id ? 'animate-spin' : ''}`} />
                    {loadingBreakdownId === showEditModal.id ? 'AI Slicing...' : 'AI Breakdown'}
                  </button>
                </div>

                {/* Subtask list */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {showEditModal.subtasks.length === 0 ? (
                    <p className="text-xs opacity-50 py-4 text-center italic">
                      No subtasks mapped yet. Click "AI Breakdown" to instantly split this task with Gemini.
                    </p>
                  ) : (
                    showEditModal.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                          darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleSubtask(showEditModal, sub.id)}
                            className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                              sub.completed
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {sub.completed && <CheckCircle className="w-3 h-3 stroke-[3px]" />}
                          </button>
                          <span className={`text-xs font-sans truncate ${sub.completed ? 'line-through opacity-45' : ''}`}>
                            {sub.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {sub.timeEstimated && (
                            <span className="text-[9px] font-mono opacity-50 bg-slate-500/10 px-1 py-0.5 rounded">
                              ⏱️ {sub.timeEstimated}m
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteSubtask(showEditModal, sub.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Manual Add Subtask */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/10">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add subtask manually..."
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSubtaskManual(showEditModal)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-700/10 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold rounded-lg text-xs cursor-pointer"
                >
                  Save & Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
