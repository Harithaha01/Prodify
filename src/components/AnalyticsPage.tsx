import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles,
  Zap,
  ChevronRight,
  TrendingDown,
  Activity,
  Award
} from 'lucide-react';
import { Task, ProductivityStats, ProductivityInsight } from '../types';

interface AnalyticsPageProps {
  tasks: Task[];
  stats: ProductivityStats;
  insights: ProductivityInsight[];
  darkMode: boolean;
  coachNudge: string | null;
  loadingNudge: boolean;
  onRefreshNudge: () => void;
}

export default function AnalyticsPage({
  tasks,
  stats,
  insights,
  darkMode,
  coachNudge,
  loadingNudge,
  onRefreshNudge,
}: AnalyticsPageProps) {
  // Weekly completions graph coordinates (mocked for visual premium vibe)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const focusMinutesData = [90, 120, 180, 45, 150, 60, 210]; // mock minutes
  const taskCompletionsData = [1, 2, 4, 0, 3, 1, 5]; // mock tasks

  const maxMinutes = Math.max(...focusMinutesData);

  return (
    <div className="space-y-6 pb-12">
      {/* Analytics Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-sans font-extrabold tracking-tight">Performance Intelligence Dashboard</h3>
          <p className="text-xs opacity-60">Objective tracking of focus blocks, task velocity, and accountability indices.</p>
        </div>

        <button
          onClick={onRefreshNudge}
          disabled={loadingNudge}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${loadingNudge ? 'animate-spin' : ''}`} />
          {loadingNudge ? 'Consulting Coach...' : 'Refresh Coach Review'}
        </button>
      </div>

      {/* Top Cards: Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Productivity Index */}
        <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
          darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider block">Productivity Index</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-3xl font-mono font-bold tracking-tight">{stats.score}%</h4>
          <span className="text-[10px] font-mono text-indigo-400 mt-2 block font-semibold">⚡ High efficiency bracket</span>
        </div>

        {/* Card 2: Focus Hours */}
        <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
          darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider block">Deep Focus Work</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-3xl font-mono font-bold tracking-tight">{stats.focusHours}h</h4>
          <span className="text-[10px] font-mono text-purple-400 mt-2 block font-semibold">📈 +12% over last week</span>
        </div>

        {/* Card 3: Completion Velocity */}
        <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
          darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider block">Deliverable Ratio</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-3xl font-mono font-bold tracking-tight">{stats.completionRate}%</h4>
          <span className="text-[10px] font-mono text-emerald-400 mt-2 block font-semibold">✨ {stats.totalCompleted} completed tasks</span>
        </div>

        {/* Card 4: Missed Deadlines */}
        <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden ${
          darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider block">Missed Deadlines</span>
            <div className={`p-1.5 rounded-lg ${stats.missedDeadlines > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <h4 className={`text-3xl font-mono font-bold tracking-tight ${stats.missedDeadlines > 0 ? 'text-rose-500' : ''}`}>
            {stats.missedDeadlines}
          </h4>
          <span className={`text-[10px] font-mono mt-2 block font-semibold ${
            stats.missedDeadlines > 0 ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {stats.missedDeadlines > 0 ? '⚠️ Critical action needed' : '🎯 Pristine target record!'}
          </span>
        </div>
      </div>

      {/* Visual Analytics Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Weekly Focus Volume Chart */}
        <div className={`lg:col-span-8 p-5 rounded-2xl border shadow-sm ${
          darkMode ? 'bg-slate-900/35 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-700/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-sm tracking-tight">Weekly Focus Minute Volume</h4>
            </div>
            <span className="text-xs font-mono opacity-40">Daily active focus blocks</span>
          </div>

          {/* SVG Custom Responsive Bar Chart */}
          <div className="h-64 flex flex-col justify-between">
            <div className="flex-1 flex items-end justify-between px-4 pb-2 border-b border-slate-700/20 gap-3">
              {focusMinutesData.map((mins, idx) => {
                const heightPercent = (mins / maxMinutes) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                    {/* Tooltip on hover */}
                    <span className="absolute -top-8 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {mins}m
                    </span>

                    {/* Completion bar indicator */}
                    <div className="w-full flex justify-center">
                      <div 
                        className="w-10 rounded-t-lg bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 hover:from-indigo-500 hover:to-purple-400 transition-all duration-500 shadow-lg shadow-indigo-500/10"
                        style={{ height: `${Math.max(12, heightPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Labels */}
            <div className="flex justify-between px-4 pt-2 font-mono text-[11px] opacity-50">
              {daysOfWeek.map((day, idx) => (
                <span key={idx} className="flex-1 text-center">{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Accountability Coach Review Nudge */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/35 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700/10 pb-3">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-sm tracking-tight">AI Coach Direct Review</h4>
            </div>

            {loadingNudge ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                <span className="text-xs font-mono opacity-50">Evaluating performance...</span>
              </div>
            ) : coachNudge ? (
              <p className="text-xs font-sans leading-relaxed italic opacity-85 border-l-2 border-purple-500 pl-3">
                "{coachNudge}"
              </p>
            ) : (
              <p className="text-xs opacity-50 py-4 italic text-center">
                Click "Refresh Coach Review" to receive dynamic motivational feedback tailored to your score.
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-[11px] font-sans opacity-85 flex gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse mt-0.5" />
            <span>
              <strong>Tip:</strong> Users with streaks higher than 5 days exhibit a 75% higher chance of completing tasks on schedule.
            </span>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations and Insights Feed */}
      <div className={`p-6 rounded-2xl border shadow-md ${
        darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 border-b border-slate-700/20 pb-3 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-sans font-bold text-base tracking-tight">AI Habit Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-300 ${
                darkMode ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                insight.category === 'efficiency' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10' :
                insight.category === 'warning' ? 'bg-rose-500/10 text-rose-400 border-rose-500/10' : 'bg-purple-500/10 text-purple-400 border-purple-500/10'
              }`}>
                <Zap className="w-4 h-4 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-sans font-bold">{insight.title}</h5>
                <p className="text-xs opacity-70 leading-relaxed font-sans">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
