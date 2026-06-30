export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'ToDo' | 'InProgress' | 'Review' | 'Completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  timeEstimated?: number; // in minutes
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:MM)
  timeEstimated: number; // in minutes
  category: string;
  subtasks: SubTask[];
  createdAt: string;
}

export interface RiskAlert {
  id: string;
  taskId: string;
  taskTitle: string;
  riskPercentage: number;
  reason: string;
  suggestion: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ScheduleBlock {
  id: string;
  taskId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAIGenerated: boolean;
  category?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DailyBriefing {
  summary: string;
  risks: string[];
  recommendations: string[];
  motivation: string;
}

export interface ProductivityInsight {
  id: string;
  category: 'efficiency' | 'consistency' | 'warning' | 'milestone';
  title: string;
  description: string;
  icon: string;
}

export interface ProductivityStats {
  score: number; // 0 to 100
  completionRate: number; // percentage
  focusHours: number;
  onTimeRate: number;
  missedDeadlines: number;
  totalCompleted: number;
}
