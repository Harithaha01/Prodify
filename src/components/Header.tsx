import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  HelpCircle, 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  Check, 
  Inbox,
  ChevronDown,
  Flame,
  AlertTriangle,
  Info
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  text: string;
  type: 'success' | 'alert' | 'info' | 'streak';
  time: string;
  read: boolean;
}

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentTab: string;
  isRescueMode: boolean;
  completedCount: number;
  totalCount: number;
  user: { email: string; name: string } | null;
  onSignOut: () => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onDismissNotification: (id: string) => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  currentTab,
  isRescueMode,
  completedCount,
  totalCount,
  user,
  onSignOut,
  notifications,
  onMarkAllNotificationsRead,
  onDismissNotification,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Command Center';
      case 'tasks': return 'Task Matrix';
      case 'calendar': return 'Time Block Planner';
      case 'analytics': return 'Performance Intelligence';
      case 'assistant': return 'Rescue Coach Chat';
      default: return 'Prodify';
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <header className={`h-16 border-b flex items-center justify-between px-8 shrink-0 z-40 transition-colors duration-300 relative ${
      darkMode 
        ? 'bg-black/30 border-white/10 backdrop-blur-md text-slate-100' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Tab Context / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono opacity-50 capitalize">Workspace</span>
        <span className="text-xs opacity-30">/</span>
        <h2 className="text-base font-sans font-semibold tracking-tight text-indigo-400">{getTabTitle()}</h2>
      </div>

      {/* Right-aligned utility actions */}
      <div className="flex items-center gap-4">
        {isRescueMode && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
            <span>AI EMERGENCY PROTOCOL ENGAGED</span>
          </div>
        )}

        {/* Completed percentage tracker with animated progress bar */}
        <div className="hidden md:flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono opacity-80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Velocity: <span className="font-bold text-emerald-400">{completedCount}</span>/{totalCount} complete</span>
          </div>
          <div className={`h-1.5 w-32 rounded-full overflow-hidden border ${
            darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-200/60 border-slate-300/40'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
            />
          </div>
        </div>

        {/* Theme Segmented Switcher */}
        <div className={`p-1 rounded-xl flex items-center gap-1 border transition-all duration-300 ${
          darkMode ? 'bg-[#0f0f16]/90 border-white/5' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-sans font-bold tracking-tight transition-all duration-200 cursor-pointer ${
              darkMode
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Dark Space Theme"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Space Dark</span>
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-sans font-bold tracking-tight transition-all duration-200 cursor-pointer ${
              !darkMode
                ? 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                : 'text-slate-400 hover:text-indigo-200'
            }`}
            title="Pure Light Theme"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Pure Light</span>
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-700/35"></div>

        {/* User profile dropdown and notification indicators */}
        <div className="flex items-center gap-3">
          
          {/* Notification Alert Popover Trigger */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl relative border transition-all duration-300 cursor-pointer ${
                darkMode 
                  ? 'border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10' 
                  : 'border-slate-200 bg-slate-100/50 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              } ${showNotifications ? 'ring-2 ring-indigo-500/40' : ''}`}
              title="View Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2.5 w-80 rounded-2xl border shadow-2xl p-4 z-50 animate-fade-in ${
                darkMode 
                  ? 'bg-[#0a0a0f] border-white/10 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans font-extrabold tracking-tight">System Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-mono font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        onMarkAllNotificationsRead();
                      }}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center opacity-50 flex flex-col items-center justify-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-500" />
                      <p className="text-[11px] font-mono leading-tight">No active system notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 relative group transition-all duration-200 ${
                          notif.read 
                            ? 'opacity-60 border-transparent bg-transparent' 
                            : darkMode 
                              ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' 
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'
                        }`}
                      >
                        {getNotificationIcon(notif.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-sans leading-tight font-medium">{notif.text}</p>
                          <span className="text-[9px] font-mono opacity-40 block mt-1">{notif.time}</span>
                        </div>
                        <button
                          onClick={() => onDismissNotification(notif.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                          title="Dismiss Alert"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Dropdown Trigger */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                darkMode 
                  ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm'
              } ${showProfileMenu ? 'ring-2 ring-indigo-500/40' : ''}`}
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-mono font-bold">
                {user ? user.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left leading-none shrink-0 max-w-[100px] truncate">
                <div className="text-[11px] font-sans font-bold">{user ? user.name : 'User Profile'}</div>
                <span className="text-[8px] font-mono opacity-50 truncate block">
                  {user ? user.email : 'demo-session'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2.5 w-64 rounded-2xl border shadow-2xl p-4 z-50 animate-fade-in ${
                darkMode 
                  ? 'bg-[#0a0a0f] border-white/10 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex flex-col items-center text-center pb-3 border-b border-white/5 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white text-lg font-mono font-extrabold mb-2 shadow-lg shadow-indigo-500/25">
                    {user ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <h4 className="text-xs font-sans font-extrabold">{user ? user.name : 'Guest User'}</h4>
                  <p className="text-[10px] font-mono opacity-50">{user ? user.email : 'guest@example.com'}</p>
                </div>

                <div className="space-y-1.5">
                  <div className={`p-2.5 rounded-xl text-[11px] font-sans leading-tight ${
                    darkMode ? 'bg-white/5' : 'bg-slate-50'
                  }`}>
                    <span className="font-bold text-indigo-400 block mb-0.5">Session Status</span>
                    <span className="opacity-80">Connected to local storage index pool. Ready for high-focus workloads.</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-sans font-bold bg-rose-500/15 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
