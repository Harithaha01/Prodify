import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Info,
  Flame,
  AlertTriangle,
  X
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import AnalyticsPage from './components/AnalyticsPage';
import AIAssistantPage from './components/AIAssistantPage';
import AuthPage from './components/AuthPage';
import { CelebrationConfetti } from './components/CelebrationConfetti';

import { Task, RiskAlert, DailyBriefing, ProductivityStats, ScheduleBlock, ChatMessage, ProductivityInsight } from './types';

// Initial high-fidelity demo tasks for outstanding direct visual loading
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '🚀 Pitch Deck Slide & Financial Slide Deck',
    description: 'Prepare high-impact structural slides detailing our target TAM, market strategy, and 3-year revenue forecast for pitch next Tuesday.',
    priority: 'High',
    status: 'InProgress',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Due tomorrow
    timeEstimated: 180,
    category: 'Startup',
    subtasks: [
      { id: 'sub-1-1', title: 'Synthesize TAM/SAM addressable market data', completed: true, timeEstimated: 45 },
      { id: 'sub-1-2', title: 'Build out financial model projection sheets', completed: false, timeEstimated: 90 },
      { id: 'sub-1-3', title: 'Assemble slide design & branding elements', completed: false, timeEstimated: 45 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: '🧪 Stereochemistry & Chiral Reaction Quiz Prep',
    description: 'Practice visual chiral centers, enantiomer configurations, and mechanisms ahead of the high-stakes biochemistry mid-term.',
    priority: 'Urgent',
    status: 'ToDo',
    dueDate: new Date(Date.now() + 28800000).toISOString().slice(0, 16), // Due in 8 hrs
    timeEstimated: 120,
    category: 'Academic',
    subtasks: [
      { id: 'sub-2-1', title: 'Complete visual stereochemistry textbook practice', completed: false, timeEstimated: 45 },
      { id: 'sub-2-2', title: 'Take chapter 4 diagnostic online test', completed: false, timeEstimated: 30 },
      { id: 'sub-2-3', title: 'Synthesize reaction cheat sheet notes', completed: false, timeEstimated: 45 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: '💼 Refactor Server API Database Queries',
    description: 'Optimize database indexes and streamline response serialization on core focus tracking endpoints to avoid bottleneck lags.',
    priority: 'Medium',
    status: 'ToDo',
    dueDate: new Date(Date.now() + 259200000).toISOString().slice(0, 16), // 3 days
    timeEstimated: 90,
    category: 'Work',
    subtasks: [
      { id: 'sub-3-1', title: 'Audit index structures & slow execution logs', completed: true, timeEstimated: 30 },
      { id: 'sub-3-2', title: 'Implement Redis memory proxy layer for quick read-offs', completed: false, timeEstimated: 60 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: '🎨 Prepare UI Design Token Templates',
    description: 'Export clean color palettes, shadows, and glassmorphic card Tailwind classes to share with the front-end core team.',
    priority: 'Low',
    status: 'Completed',
    dueDate: new Date(Date.now() + 432000000).toISOString().slice(0, 16), // 5 days
    timeEstimated: 45,
    category: 'Work',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_SCHEDULES: ScheduleBlock[] = [
  { id: 'sched-1', title: '📚 Stereochemistry Chiral Prep', date: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:30', isAIGenerated: true, category: 'AI Focus Session' },
  { id: 'sched-2', title: '☕ Strategic Hydration & Rest Break', date: new Date().toISOString().split('T')[0], startTime: '11:30', endTime: '11:45', isAIGenerated: true, category: 'Rest' },
  { id: 'sched-3', title: '🚀 Startup Slide TAM Layout', date: new Date().toISOString().split('T')[0], startTime: '13:00', endTime: '14:30', isAIGenerated: false, category: 'Deep Work' },
];

const INITIAL_INSIGHTS: ProductivityInsight[] = [
  { id: 'insight-1', category: 'efficiency', title: '90-Min Focus Golden Slot', description: 'Your focus cycles are 30% longer and more productive when initiated between 09:00 AM and 11:30 AM.', icon: 'Zap' },
  { id: 'insight-2', category: 'warning', title: 'Deadline Accumulation Threat', description: 'We detected 3 high-priority deadlines clustered over the next 48 hours. Protect your calendar immediately.', icon: 'ShieldAlert' },
  { id: 'insight-3', category: 'consistency', title: '5-Day Momentum Streak Active', description: 'You have completed at least one Urgent focus block daily. Keep this rolling to hit your target metrics.', icon: 'Flame' },
];

export default function App() {
  // User Session Authentication
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('saver_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('saver_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', text: '🚨 Biochemistry: Stereochemistry Quiz Prep is due in 8 hours! High failure probability detected.', type: 'alert', time: '8 hours ago', read: false },
      { id: 'notif-2', text: '🔥 Incredible performance! You are on a 5-day active execution streak.', type: 'streak', time: '1 day ago', read: false },
      { id: 'notif-3', text: '🚀 Welcome to Prodify. All system channels initialized.', type: 'success', time: 'Just now', read: false },
    ];
  });

  // Navigation & Theme
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true); // SaaS default is dark mode
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('saver_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (text: string, type: 'success' | 'alert' | 'info' | 'streak') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      text,
      type,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Core App States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('saver_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>(() => {
    const saved = localStorage.getItem('saver_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [insights, setInsights] = useState<ProductivityInsight[]>(INITIAL_INSIGHTS);
  
  // Daily AI briefing states
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState<boolean>(false);
  
  // Coach states
  const [coachNudge, setCoachNudge] = useState<string | null>(null);
  const [loadingNudge, setLoadingNudge] = useState<boolean>(false);

  // Chat Assistant states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('saver_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [loadingBreakdownId, setLoadingBreakdownId] = useState<string | null>(null);

  // Custom metadata stats
  const [streakDays, setStreakDays] = useState<number>(5);
  const [isRescueMode, setIsRescueMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('saver_tasks', JSON.stringify(tasks));
    calculateStatsAndPredictRisks();
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('saver_schedules', JSON.stringify(scheduleBlocks));
  }, [scheduleBlocks]);

  useEffect(() => {
    localStorage.setItem('saver_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Initial loads on mount
  useEffect(() => {
    triggerAIBriefing();
    triggerCoachNudge();
  }, []);

  // Calculate high-fidelity stats dynamically
  const getProductivityStats = (): ProductivityStats => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Sum of completed subtasks plus completed tasks
    let subtaskCompletedCount = 0;
    let subtaskTotalCount = 0;
    tasks.forEach(t => {
      subtaskTotalCount += t.subtasks.length;
      subtaskCompletedCount += t.subtasks.filter(s => s.completed).length;
    });

    const subtaskRate = subtaskTotalCount > 0 ? (subtaskCompletedCount / subtaskTotalCount) * 100 : 0;
    const baseScore = Math.round((completionRate * 0.6) + (subtaskRate * 0.2) + (streakDays * 4));
    const score = Math.min(100, Math.max(30, baseScore));

    const focusHours = Math.round((tasks.reduce((sum, t) => sum + (t.status === 'Completed' ? t.timeEstimated : 0), 0) + (subtaskCompletedCount * 15)) / 60);

    const missedDeadlines = tasks.filter(t => {
      if (t.status === 'Completed') return false;
      const dueTime = new Date(t.dueDate).getTime();
      return dueTime < Date.now();
    }).length;

    return {
      score,
      completionRate,
      focusHours: Math.max(1, focusHours),
      onTimeRate: 100 - (missedDeadlines * 15),
      missedDeadlines,
      totalCompleted: completed,
    };
  };

  // ----------------------------------------------------
  // API SERVICE CALLS - CALLING SERVER-SIDE GEMINI API Proxy
  // ----------------------------------------------------

  // 1. Predict Risks using high-fidelity local heuristics for instant reactive updates
  const calculateStatsAndPredictRisks = async () => {
    try {
      // Compute high-fidelity risk metrics instantly to avoid network delays & quota exhaustion
      const localAlerts: RiskAlert[] = tasks
        .filter(t => t.status !== 'Completed')
        .map((t, index) => {
          const diffDays = (new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
          let risk = 25;
          let severity: 'critical' | 'warning' | 'info' = 'info';
          let reason = 'Reasonable amount of buffer remaining.';
          let suggestion = 'Coordinate daily 20-min draft updates.';

          if (diffDays < 0) {
            risk = 100;
            severity = 'critical';
            reason = 'This item is already overdue! High vulnerability spot.';
            suggestion = 'Prioritize and execute immediately inside our next Pomodoro slot.';
          } else if (diffDays <= 1) {
            risk = t.priority === 'Urgent' ? 95 : 80;
            severity = 'critical';
            reason = `Deadline is due in less than 24 hours with ${t.timeEstimated} mins estimated time needed.`;
            suggestion = 'Establish an intense 50-minute Focus Sprint with zero tabs open.';
          } else if (diffDays <= 3) {
            risk = t.priority === 'Urgent' ? 70 : 50;
            severity = 'warning';
            reason = `Short horizon of ${Math.round(diffDays)} days. Action is required today to prevent panic.`;
            suggestion = 'Outline slides or gather files during a quick research sprint.';
          }

          return {
            id: `risk-alert-${t.id}`,
            taskId: t.id,
            taskTitle: t.title,
            riskPercentage: risk,
            reason,
            suggestion,
            severity,
          };
        })
        .filter(alert => alert.riskPercentage > 30);

      setRiskAlerts(localAlerts);
    } catch (err) {
      console.log("Evaluation metrics processed.");
    }
  };

  // 2. Daily Tactical Briefing
  const triggerAIBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const response = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, todayDate: new Date().toISOString().split('T')[0] }),
      });
      const data = await response.json();
      if (data.summary) {
        setDailyBriefing(data);
      } else {
        throw new Error('Malformed briefing output');
      }
    } catch (err) {
      // Local fallback simulation
      setDailyBriefing({
        summary: "Multiple high-leverage deliverables are approaching fast. Protect your morning focus hours to avoid stress overflows.",
        risks: ["Organic chemistry test preparation is due in less than 8 hours.", "Startup Slide Deck has a short tomorrow deadline."],
        recommendations: ["Trigger deep focus block for quiz questions right now.", "Dedicate 45 minutes to Slide Deck outlining.", "Launch AI Rescue mode if task list feels heavy."],
        motivation: "An hour of focus is worth ten hours of anxiety. Start small, finish fast, celebrate early!"
      });
    } finally {
      setLoadingBriefing(false);
    }
  };

  // 3. Accountability Coach nudge review
  const triggerCoachNudge = async () => {
    setLoadingNudge(true);
    try {
      const response = await fetch('/api/ai/coach-nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, score: getProductivityStats().score }),
      });
      const data = await response.json();
      if (data.nudge) {
        setCoachNudge(data.nudge);
      }
    } catch (err) {
      setCoachNudge("You are currently holding a solid focus rating. Pick your absolute highest priority item on the board and crush it in a 25-minute sprint!");
    } finally {
      setLoadingNudge(false);
    }
  };

  // 4. Natural language Chat Assistant message
  const handleSendChatMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: `chat-msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setChatMessages(prev => [...prev, newUserMsg]);
    setLoadingChat(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMsg],
          tasks,
          todayDate: new Date().toISOString().split('T')[0]
        }),
      });
      const data = await response.json();
      
      const newAssistantMsg: ChatMessage = {
        id: `chat-msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.response || "I've logged your request. Let me know how else I can help protect your deadlines.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages(prev => [...prev, newAssistantMsg]);
      setLoadingChat(false);
      return data;
    } catch (err) {
      // Offline mock fallback
      let fallbackText = "I've processed your message offline. Try starting a focus sprint on your high-risk targets to build some momentum!";
      let suggestedTask = null;

      if (text.toLowerCase().includes('add') || text.toLowerCase().includes('create') || text.toLowerCase().includes('schedule')) {
        fallbackText = "I parsed your instruction and generated a target task card ready for approval!";
        suggestedTask = {
          title: 'Review Deliverable Parameters',
          description: 'High-focus review extracted by AI Assistant',
          priority: 'High',
          dueDate: new Date().toISOString().split('T')[0],
          timeEstimated: 45,
          category: 'Academics',
        };
      }

      const newAssistantMsg: ChatMessage = {
        id: `chat-msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages(prev => [...prev, newAssistantMsg]);
      setLoadingChat(false);
      return { response: fallbackText, suggestedTask };
    }
  };

  // 5. Smart Task Breakdown: Convert goals to actionable subtasks
  const handleTriggerBreakdown = async (taskId: string, title: string, desc?: string) => {
    setLoadingBreakdownId(taskId);
    showToast(`AI is slicing up task "${title}" into atomic subtasks...`, 'success');

    try {
      const response = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc }),
      });
      const data = await response.json();
      if (data.subtasks && Array.isArray(data.subtasks)) {
        const parsedSubs = data.subtasks.map((s: any, idx: number) => ({
          id: `sub-${taskId}-${idx}-${Date.now()}`,
          title: s.title,
          completed: false,
          timeEstimated: s.timeEstimated || 15
        }));

        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...parsedSubs] } : t
        ));
        showToast("Task broken down successfully!", 'success');
      }
    } catch (err) {
      // Local backup mock breakdown
      const mocks = [
        { id: `sub-mock-1-${Date.now()}`, title: 'Research & outline initial core references', completed: false, timeEstimated: 15 },
        { id: `sub-mock-2-${Date.now()}`, title: 'Assemble structural blueprint frameworks', completed: false, timeEstimated: 25 },
        { id: `sub-mock-3-${Date.now()}`, title: 'Execute draft outline execution phase', completed: false, timeEstimated: 45 },
      ];
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...mocks] } : t
      ));
      showToast("Offline mode: Standard breakdown blocks loaded.", 'success');
    } finally {
      setLoadingBreakdownId(null);
    }
  };

  // 6. AI Rescue Mode: Reorganize schedules automatically
  const handleTriggerRescue = async () => {
    const nextRescueState = !isRescueMode;
    setIsRescueMode(nextRescueState);
    
    if (nextRescueState) {
      showToast("⚠️ AI Rescue Protocol Activated! Generating emergency schedule overrides...", 'alert');
      addNotification("⚠️ AI Rescue Protocol Engaged! Combat schedules calculated & calendar blocks overridden.", 'alert');
      try {
        const response = await fetch('/api/ai/rescue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks, todayDate: new Date().toISOString().split('T')[0] }),
        });
        const data = await response.json();
        if (data.scheduleBlocks) {
          // Overwrite active schedule blocks with AI Rescue blocks
          setScheduleBlocks(data.scheduleBlocks);
          showToast("Combat calendar generated! Focused slots deployed starting at 09:00 AM.", 'success');
        }
      } catch (err) {
        // Fallback
        const dateStr = new Date().toISOString().split('T')[0];
        const emergencyBlocks: ScheduleBlock[] = [
          { id: 'rescue-block-1', title: '🚨 Emergency Crisis Block: Chemistry Prep', date: dateStr, startTime: '09:00', endTime: '11:00', isAIGenerated: true, category: 'Rescue Focus' },
          { id: 'rescue-block-2', title: '☕ Re-energize Hydration Break', date: dateStr, startTime: '11:00', endTime: '11:15', isAIGenerated: true, category: 'Rescue Break' },
          { id: 'rescue-block-3', title: '⚡ Crisis Focus Block: Pitch Slide TAM Data', date: dateStr, startTime: '11:15', endTime: '13:00', isAIGenerated: true, category: 'Rescue Focus' },
        ];
        setScheduleBlocks(emergencyBlocks);
        showToast("Offline emergency calendar slots deployed.", 'success');
      }
    } else {
      setScheduleBlocks(INITIAL_SCHEDULES);
      showToast("AI Rescue Protocol disengaged. Normal scheduling blocks restored.", 'success');
      addNotification("ℹ️ AI Rescue Protocol disengaged. Re-synchronized default calendar slotting.", 'info');
    }
  };

  // State Mutators
  const handleAddTask = (newTaskFields: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskFields,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" added successfully!`, 'success');
    addNotification(`🚀 Task "${newTask.title}" added. AI has mapped priority index: ${newTask.priority}.`, 'info');
  };

  const triggerTaskCompletionCelebration = (taskTitle: string) => {
    setConfettiTrigger(prev => prev + 1);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
    addNotification(`🏆 Tactical Success! Completed high-focus milestone "${taskTitle}".`, 'success');
  };

  const handleUpdateTask = (updated: Task) => {
    const original = tasks.find(t => t.id === updated.id);
    if (original && original.status !== 'Completed' && updated.status === 'Completed') {
      triggerTaskCompletionCelebration(updated.title);
    }
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(`Task deleted.`, 'alert');
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'Completed' ? 'ToDo' : 'Completed';
        if (newStatus === 'Completed') {
          triggerTaskCompletionCelebration(t.title);
        } else {
          addNotification(`↩️ Reopened milestone "${t.title}". Scheduled back to To Do mode.`, 'info');
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleAddScheduleBlock = (blockFields: Omit<ScheduleBlock, 'id'>) => {
    const block: ScheduleBlock = {
      ...blockFields,
      id: `block-${Date.now()}`,
    };
    setScheduleBlocks(prev => [...prev, block]);
    showToast(`Focus slot scheduled.`, 'success');
  };

  // Toast message controller
  const showToast = (text: string, type: 'success' | 'alert') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-[#050508] text-slate-200 dark' : 'bg-slate-50 text-slate-800'
      }`}>
        <AuthPage 
          darkMode={darkMode} 
          onAuthSuccess={(userObj) => {
            setUser(userObj);
            localStorage.setItem('saver_user', JSON.stringify(userObj));
            showToast(`Welcome back, ${userObj.name}!`, 'success');
            addNotification(`🔒 Account Session Authorized: logged in as ${userObj.email}.`, 'success');
          }} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      darkMode ? 'bg-[#050508] text-slate-200 dark' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Majestic Particle Celebration Cannon */}
      <CelebrationConfetti trigger={confettiTrigger} />
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl bg-slate-900 border-indigo-500/35 text-xs text-indigo-300 backdrop-blur-md"
          >
            {toastMessage.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="p-1 rounded hover:bg-slate-800">
              <X className="w-3.5 h-3.5 opacity-60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sidebar Left */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        productivityScore={getProductivityStats().score}
        streakDays={streakDays}
        isRescueMode={isRescueMode}
        onTriggerRescue={handleTriggerRescue}
      />

      {/* Workspace Area Right */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen relative">
        {/* Decorative Background Glow */}
        {darkMode && (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          </>
        )}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          currentTab={currentTab}
          isRescueMode={isRescueMode}
          completedCount={tasks.filter(t => t.status === 'Completed').length}
          totalCount={tasks.length}
          user={user}
          onSignOut={() => {
            setUser(null);
            localStorage.removeItem('saver_user');
            showToast("Logged out of control center.", "alert");
          }}
          notifications={notifications}
          onMarkAllNotificationsRead={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            showToast("All alerts marked as read.", "success");
          }}
          onDismissNotification={(id) => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          }}
        />

        {/* Tab View Container */}
        <main className={`flex-1 overflow-y-auto px-8 py-6`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentTab === 'dashboard' && (
                <Dashboard
                  tasks={tasks}
                  riskAlerts={riskAlerts}
                  dailyBriefing={dailyBriefing}
                  loadingBriefing={loadingBriefing}
                  refreshBriefing={triggerAIBriefing}
                  stats={getProductivityStats()}
                  darkMode={darkMode}
                  onAddTaskClick={() => setCurrentTab('tasks')}
                  onTriggerRescue={handleTriggerRescue}
                  onToggleTask={handleToggleTaskStatus}
                  onToggleSubtask={() => {}}
                  onStartFocusSprint={() => {}}
                />
              )}

              {currentTab === 'tasks' && (
                <TasksPage
                  tasks={tasks}
                  darkMode={darkMode}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onTriggerBreakdown={handleTriggerBreakdown}
                  loadingBreakdownId={loadingBreakdownId}
                />
              )}

              {currentTab === 'calendar' && (
                <CalendarPage
                  tasks={tasks}
                  scheduleBlocks={scheduleBlocks}
                  darkMode={darkMode}
                  onAddScheduleBlock={handleAddScheduleBlock}
                  onTriggerRescue={handleTriggerRescue}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsPage
                  tasks={tasks}
                  stats={getProductivityStats()}
                  insights={insights}
                  darkMode={darkMode}
                  coachNudge={coachNudge}
                  loadingNudge={loadingNudge}
                  onRefreshNudge={triggerCoachNudge}
                />
              )}

              {currentTab === 'assistant' && (
                <AIAssistantPage
                  messages={chatMessages}
                  darkMode={darkMode}
                  onSendMessage={handleSendChatMessage}
                  onAddTask={handleAddTask}
                  loading={loadingChat}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
