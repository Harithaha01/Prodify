import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Moon, 
  Sun,
  Flame,
  Activity
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  productivityScore: number;
  streakDays: number;
  isRescueMode: boolean;
  onTriggerRescue: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  darkMode,
  productivityScore,
  streakDays,
  isRescueMode,
  onTriggerRescue,
}: SidebarProps) {
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString(undefined, { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Board', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <aside className={`w-64 border-r flex flex-col h-full shrink-0 transition-all duration-300 ${
      darkMode 
        ? 'bg-black/40 border-white/10 backdrop-blur-xl text-slate-200' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-inherit mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
        <div>
          <h1 className={`font-sans font-bold text-sm leading-none tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Prod<span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-black">ify</span>
          </h1>
          <p className="text-[9px] font-mono opacity-50 uppercase tracking-wider mt-1">
            Accelerate Execution
          </p>
        </div>
      </div>

      {/* Streak and Mode Indicator Banner */}
      <div className={`p-4 mx-3 my-4 rounded-xl border transition-all ${
        darkMode 
          ? 'bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border-white/10' 
          : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            <span className="text-xs font-semibold font-sans">Streak Day</span>
          </div>
          <span className="text-sm font-mono font-bold text-orange-500">{streakDays}</span>
        </div>
        
        {/* Dynamic productivity status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold font-sans">Focus Score</span>
          </div>
          <span className="text-sm font-mono font-bold text-indigo-400">{productivityScore}%</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1">
        <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider opacity-45 block mb-2">Workspace</span>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-200 group border cursor-pointer ${
                isActive
                  ? darkMode
                    ? 'bg-white/5 text-white border-white/10 shadow-lg shadow-white/[0.02]'
                    : 'bg-indigo-50 text-indigo-600 shadow-sm border-indigo-100/50'
                  : darkMode
                    ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <IconComponent className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                isActive ? 'text-indigo-400' : 'opacity-75'
              }`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'assistant' && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500 text-white animate-pulse">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Area: Rescue Mode Button */}
      <div className="p-4 border-t border-inherit space-y-3">
        {/* Rescue Mode Mini Card */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border-indigo-500/30'
            : 'bg-indigo-50 border-indigo-200'
        }`}>
          <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">Rescue Mode</p>
          <p className="text-xs text-slate-300 mb-3 font-sans leading-tight">
            {isRescueMode ? 'Emergency protocol engaged. Calibrating schedule...' : '3 urgent deadlines detected for today.'}
          </p>
          <button
            id="btn-rescue-mode"
            onClick={onTriggerRescue}
            className={`w-full py-2 text-xs font-bold rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
              isRescueMode
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/20'
            }`}
          >
            {isRescueMode ? 'Optimize All Active!' : 'Optimize All'}
          </button>
        </div>

        {/* Time and Status Tracker */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 opacity-55 text-[10px] font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr || '00:00:00'}</span>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
