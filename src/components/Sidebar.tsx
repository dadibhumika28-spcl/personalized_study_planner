import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Award, 
  Clock, 
  BookOpen, 
  BarChart2, 
  Settings as SettingsIcon,
  Flame,
  Zap,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
}

export default function Sidebar({ currentTab, setCurrentTab, user }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Kanban', icon: CheckSquare },
    { id: 'calendar', label: 'Study Calendar', icon: CalendarIcon },
    { id: 'goals', label: 'Goal Tracker', icon: Award },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Clock },
    { id: 'notes', label: 'Study Notes', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Preferences', icon: SettingsIcon },
  ];

  // Calculate XP percentage for level progress
  const nextLevelXP = 1000;
  const xpPercent = Math.min((user.xp / nextLevelXP) * 100, 100);

  return (
    <aside id="app-sidebar" className="w-64 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl border-r border-white/30 dark:border-slate-800/30 flex flex-col h-screen sticky top-0 transition-colors duration-300 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/20 dark:border-slate-800/20 flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] p-2.5 rounded-xl text-white shadow-lg">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1E293B] to-[#4F46E5] dark:from-white dark:to-indigo-300">
            StudyPulse
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-tight">Academic Architect</p>
        </div>
      </div>

      {/* Gamified Student Profile Widget */}
      <div className="p-4 mx-4 mt-6 bg-white/40 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-700/30 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-2xl bg-white/80 dark:bg-slate-800 p-2 rounded-xl shadow-xs border border-white/60 dark:border-slate-705">
            {user.avatar || '🎓'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {user.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {user.major}
            </p>
          </div>
        </div>

        {/* Level Progression */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Level {user.level}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
              {user.xp}/{nextLevelXP} XP
            </span>
          </div>
          <div className="w-full bg-white/50 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-white/30 dark:border-slate-750">
            <div 
              style={{ width: `${xpPercent}%` }}
              className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Study Streak Badge */}
        <div className="mt-3 pt-2.5 border-t border-white/30 dark:border-slate-800/30 flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Streak</span>
          <span id="streak-counter" className="flex items-center text-[10px] font-extrabold text-[#4F46E5] dark:text-[#06B6D4] bg-white/80 dark:bg-[#06B6D4]/10 px-2 py-0.5 rounded-full border border-white dark:border-[#06B6D4]/20 shadow-xs">
            <Flame className="h-3 w-3 text-rose-500 fill-rose-500 mr-1 animate-pulse" />
            {user.streak} Days
          </span>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-white/60 dark:bg-slate-800/60 text-[#4F46E5] dark:text-indigo-400 font-bold border border-white/50 dark:border-slate-700/40 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/45 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-100 font-medium'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#4F46E5] dark:text-indigo-400' : 'text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#4F46E5] dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/20 dark:border-slate-800/20 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
          StudyPulse v1.2 Premium
        </p>
      </div>
    </aside>
  );
}
