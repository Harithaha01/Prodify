import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  Play, 
  Square, 
  Timer, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Flame, 
  Info, 
  Zap, 
  RefreshCw,
  TrendingUp,
  Brain,
  Coffee,
  CheckSquare
} from 'lucide-react';
import { Task, RiskAlert, DailyBriefing, ProductivityStats } from '../types';

interface DashboardProps {
  tasks: Task[];
  riskAlerts: RiskAlert[];
  dailyBriefing: DailyBriefing | null;
  loadingBriefing: boolean;
  refreshBriefing: () => void;
  stats: ProductivityStats;
  darkMode: boolean;
  onAddTaskClick: () => void;
  onTriggerRescue: () => void;
  onToggleTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onStartFocusSprint: (task: Task) => void;
}

export default function Dashboard({
  tasks,
  riskAlerts,
  dailyBriefing,
  loadingBriefing,
  refreshBriefing,
  stats,
  darkMode,
  onAddTaskClick,
  onTriggerRescue,
  onToggleTask,
  onToggleSubtask,
  onStartFocusSprint,
}: DashboardProps) {
  // Focus sprint timer local state
  const [activeTimerTask, setActiveTimerTask] = useState<Task | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(1500); // 25 mins default
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [timerTotalDuration, setTimerTotalDuration] = useState<number>(1500);

  // Sound generator using Web Audio API for timer completion chime
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("Chime failed to play due to audio permissions.", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerIsRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && timerIsRunning) {
      playChime();
      setTimerIsRunning(false);
      if (timerMode === 'work') {
        setTimerMode('break');
        setTimerSecondsLeft(300); // 5 mins break
        setTimerTotalDuration(300);
      } else {
        setTimerMode('work');
        setTimerSecondsLeft(1500); // 25 mins work
        setTimerTotalDuration(1500);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning, timerSecondsLeft, timerMode]);

  const startQuickSprint = (task: Task | null) => {
    setActiveTimerTask(task);
    setTimerSecondsLeft(1500);
    setTimerTotalDuration(1500);
    setTimerMode('work');
    setTimerIsRunning(true);
  };

  const stopSprint = () => {
    setTimerIsRunning(false);
    setActiveTimerTask(null);
    setTimerSecondsLeft(1500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter out completed tasks for today's priority view
  const activeTasks = tasks.filter(t => t.status !== 'Completed');
  const todayFocusTasks = activeTasks.slice(0, 3); // top 3 tasks

  // Count active risk levels
  const criticalCount = riskAlerts.filter(r => r.severity === 'critical').length;
  const warningCount = riskAlerts.filter(r => r.severity === 'warning').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-2xl relative overflow-hidden shadow-md border ${
        darkMode 
          ? 'bg-gradient-to-br from-indigo-950/45 via-purple-950/45 to-slate-950/45 border-white/10 backdrop-blur-xl' 
          : 'bg-white border-slate-200/80'
      }`}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-40 h-40 text-indigo-500 animate-pulse" />
        </div>
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/15">
              Control Center
            </span>
            {criticalCount > 0 && (
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/15 animate-bounce">
                {criticalCount} Critical Alerts!
              </span>
            )}
          </div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight">
            Stop Procrastinating, <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent animate-pulse">Start Executing.</span>
          </h2>
          <p className="text-sm opacity-80 leading-relaxed font-sans">
            Your high-performance AI companion analyzes deadlines, predicts failure points, and structures emergency schedules to rescue your deliverables.
          </p>
        </div>
      </div>

      {/* Top Grid: Daily Briefing + Productivity Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Briefing Card */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between shadow-md transition-all ${
          darkMode 
            ? 'bg-slate-900/40 backdrop-blur-md border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base tracking-tight">Today's AI Tactical Briefing</h3>
              </div>
              <button 
                onClick={refreshBriefing}
                disabled={loadingBriefing}
                id="refresh-briefing-btn"
                className={`p-1.5 rounded-lg hover:bg-slate-500/10 transition-all ${loadingBriefing ? 'animate-spin' : ''}`}
                title="Regenerate Briefing"
              >
                <RefreshCw className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {loadingBriefing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-t-2 border-r-2 border-indigo-500 rounded-full animate-spin"></div>
                <span className="text-xs font-mono opacity-50">Drafting personalized recommendations with Gemini...</span>
              </div>
            ) : dailyBriefing ? (
              <div className="space-y-4">
                <p className="text-sm italic leading-relaxed opacity-90 border-l-2 border-indigo-500 pl-3">
                  "{dailyBriefing.summary}"
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">Identified Vulnerabilities</span>
                    <ul className="space-y-1 text-xs opacity-80 list-disc pl-4">
                      {dailyBriefing.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Proactive Recommendations</span>
                    <ul className="space-y-1 text-xs opacity-80 list-disc pl-4">
                      {dailyBriefing.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-2">
                <p className="text-xs opacity-50">No daily briefing generated yet.</p>
                <button 
                  onClick={refreshBriefing}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20 hover:bg-indigo-600/30 transition-all"
                >
                  Generate AI Briefing
                </button>
              </div>
            )}
          </div>

          {dailyBriefing && (
            <div className={`mt-4 pt-3 border-t border-slate-700/10 flex items-center gap-2 text-xs font-sans opacity-85 ${
              darkMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span><strong>Coach says:</strong> {dailyBriefing.motivation}</span>
            </div>
          )}
        </div>

        {/* Productivity Score Dial & Quick Timer */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between shadow-md ${
          darkMode 
            ? 'bg-slate-900/40 backdrop-blur-md border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 border-b border-slate-700/20 pb-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
                <Timer className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-sans font-bold text-base tracking-tight">Focus Sprint Timer</h3>
            </div>

            {/* Dial + Countdown View */}
            <div className="flex flex-col items-center space-y-4 py-1">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Visual Circle Meter */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke={darkMode ? '#1e293b' : '#f1f5f9'}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="url(#timerGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - timerSecondsLeft / timerTotalDuration)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Text Timer readout */}
                <div className="text-center z-10">
                  <span className="text-2xl font-mono font-bold leading-none block">
                    {formatTime(timerSecondsLeft)}
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mt-1 ${
                    timerMode === 'work' ? 'text-indigo-400' : 'text-emerald-400'
                  }`}>
                    {timerMode === 'work' ? 'FOCUS BLOCK' : 'REST BREAK'}
                  </span>
                </div>
              </div>

              {/* Active task title under timer */}
              {activeTimerTask && (
                <div className="text-center max-w-xs px-2">
                  <span className="text-[10px] font-mono opacity-50 block uppercase tracking-wider">Targeting:</span>
                  <span className="text-xs font-sans font-semibold truncate block">{activeTimerTask.title}</span>
                </div>
              )}

              {/* Timer Controls */}
              <div className="flex items-center gap-3">
                <button
                  id="timer-start-stop"
                  onClick={() => setTimerIsRunning(!timerIsRunning)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    timerIsRunning
                      ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20 hover:bg-amber-600/30'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/10'
                  }`}
                >
                  {timerIsRunning ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Resume
                    </>
                  )}
                </button>

                {activeTimerTask && (
                  <button
                    id="timer-stop"
                    onClick={stopSprint}
                    className="p-2 rounded-xl border border-slate-700/50 hover:bg-rose-500/10 text-rose-500 transition-colors"
                    title="Stop & Reset Timer"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Focus Tasks + Deadline Risk Predictor Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Focus Tasks */}
        <div className={`p-6 rounded-2xl border shadow-md flex flex-col justify-between ${
          darkMode 
            ? 'bg-slate-900/40 backdrop-blur-md border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/20 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                  <CheckSquare className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base tracking-tight">Today's Focus Core</h3>
              </div>
              <button
                onClick={onAddTaskClick}
                className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/15 hover:bg-indigo-500/20 transition-all"
              >
                <Plus className="w-3 h-3" /> Add Task
              </button>
            </div>

            {todayFocusTasks.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-xs opacity-50">No active tasks remaining for today!</p>
                <button
                  onClick={onAddTaskClick}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Schedule Something Now
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {todayFocusTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      darkMode 
                        ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700' 
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-1 h-5 w-5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          task.status === 'Completed'
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : darkMode
                              ? 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                              : 'border-slate-300 hover:border-indigo-400 bg-white'
                        }`}
                      >
                        {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3px]" />}
                      </button>
                      <div className="min-w-0">
                        <span className={`text-sm font-sans font-semibold tracking-tight truncate block ${
                          task.status === 'Completed' ? 'line-through opacity-45' : ''
                        }`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-500' :
                            task.priority === 'High' ? 'bg-amber-500/10 text-amber-500' :
                            task.priority === 'Medium' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] font-mono opacity-50">
                            ⏱️ {task.timeEstimated} mins
                          </span>
                          <span className="text-[10px] font-mono opacity-50">
                            📅 {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => startQuickSprint(task)}
                        className="p-1.5 rounded-lg border border-slate-700/50 text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        title="Start Pomodoro Focus"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-700/10 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 opacity-80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Completed velocity is <span className="font-bold text-emerald-400">{stats.completionRate}%</span>
              </span>
              <span className="opacity-55">Focus time today: {stats.focusHours} hrs</span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden border ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-200/60 border-slate-300/40'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
              />
            </div>
          </div>
        </div>

        {/* Deadline Risk Predictor Alerts */}
        <div className={`p-6 rounded-2xl border shadow-md flex flex-col justify-between ${
          darkMode 
            ? 'bg-slate-900/40 backdrop-blur-md border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/20 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/10">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base tracking-tight">AI Deadline Risk Predictor</h3>
              </div>
              <span className="text-xs font-mono opacity-50">7 Active Risks</span>
            </div>

            {riskAlerts.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <p className="text-xs font-sans opacity-70">Perfect Score! No pending deadlines under threat.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {riskAlerts.map((alert) => {
                  const isCritical = alert.severity === 'critical';
                  return (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                        isCritical
                          ? darkMode
                            ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700'
                            : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                          : darkMode
                            ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-700'
                            : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      {/* Left status vertical color bar */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                        isCritical ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />

                      <div className="pl-2 space-y-2">
                        {/* Title & Risk % Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-sans font-bold truncate block flex-1">
                            {alert.taskTitle}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isCritical ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            ⚠️ {alert.riskPercentage}% Risk
                          </span>
                        </div>

                        {/* Description / Threat reason */}
                        <p className="text-xs opacity-75 font-sans leading-relaxed">
                          <strong>Threat:</strong> {alert.reason}
                        </p>

                        {/* Action suggestion bubble */}
                        <div className={`p-2.5 rounded-lg text-xs font-sans leading-relaxed flex gap-2 border ${
                          isCritical
                            ? darkMode ? 'bg-rose-950/40 border-rose-900/30 text-rose-300' : 'bg-rose-100/50 border-rose-200/50 text-rose-800'
                            : darkMode ? 'bg-amber-950/40 border-amber-900/30 text-amber-300' : 'bg-amber-100/50 border-amber-200/50 text-amber-800'
                        }`}>
                          <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
                          <span><strong>AI Mitigation:</strong> {alert.suggestion}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {criticalCount > 0 && (
            <div className="pt-4 border-t border-slate-700/10 flex items-center justify-between">
              <span className="text-xs font-mono opacity-50">Critical bottlenecks detected</span>
              <button
                onClick={onTriggerRescue}
                className="text-xs font-sans font-bold text-rose-500 hover:text-rose-600 animate-pulse flex items-center gap-1 cursor-pointer"
              >
                Deploy Rescue Plan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Timelines Grid */}
      <div className={`p-6 rounded-2xl border shadow-md ${
        darkMode 
          ? 'bg-slate-900/40 backdrop-blur-md border-slate-800/80' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b border-slate-700/20 pb-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-sans font-bold text-base tracking-tight">Active Deliverable Timeline</h3>
        </div>

        {tasks.filter(t => t.status !== 'Completed').length === 0 ? (
          <p className="text-xs opacity-50 py-6 text-center">No pending deliverables. Grab a coffee!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks
              .filter(t => t.status !== 'Completed')
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 6)
              .map(t => {
                const daysLeft = Math.ceil((new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                      darkMode ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono opacity-50 tracking-wider uppercase block">{t.category}</span>
                      <span className="text-sm font-sans font-bold truncate block">{t.title}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-700/10 pt-2 text-xs font-mono">
                      <span className={daysLeft <= 1 ? 'text-rose-500 font-bold animate-pulse' : 'opacity-70'}>
                        {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? '📅 Due Today' : daysLeft === 1 ? '📅 Due Tomorrow' : `📅 ${daysLeft} days left`}
                      </span>
                      <span className="opacity-60">{t.timeEstimated} mins</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
