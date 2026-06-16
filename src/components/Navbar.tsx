import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  RefreshCw, 
  Sparkles,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';
import { UserProfile, Task, Exam, MOTIVATIONAL_QUOTES } from '../types';

interface NavbarProps {
  currentTab: string;
  user: UserProfile;
  tasks: Task[];
  exams: Exam[];
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  currentTab,
  user,
  tasks,
  exams,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: 'warning' | 'info' | 'success'; text: string; date: string }>>([]);

  // Generate a quote
  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Run once to initialize dynamic notifications based on tasks/exams
  useEffect(() => {
    const list: Array<{ id: string; type: 'warning' | 'info' | 'success'; text: string; date: string }> = [];
    
    // Add dynamic task warnings
    tasks.filter(t => t.status !== 'completed').forEach(task => {
      const remainingTime = new Date(task.dueDate).getTime() - Date.now();
      const days = Math.ceil(remainingTime / 86450000);
      if (days > 0 && days <= 2) {
        list.push({
          id: `task-${task.id}`,
          type: 'warning',
          text: `Deadline Alert: "${task.title}" is due in ${days} day${days > 1 ? 's' : ''}!`,
          date: 'Immediate',
        });
      }
    });

    // Add dynamic exam notes
    exams.forEach(exam => {
      const remainingTime = new Date(exam.date).getTime() - Date.now();
      const days = Math.ceil(remainingTime / 86450000);
      if (days > 0 && days <= 5) {
        list.push({
          id: `exam-${exam.id}`,
          type: 'info',
          text: `Upcoming Exam: "${exam.title}" in ${days} days! Prep session recommended.`,
          date: 'Upcoming',
        });
      }
    });

    // Add generic welcoming triggers
    list.push({
      id: 'welcome',
      type: 'success',
      text: `Welcome back, ${user.name}! Your current study streak is ${user.streak} days. Keep it up!`,
      date: 'Today',
    });

    setNotifications(list);
  }, [tasks, exams, user.name, user.streak]);

  const activeQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <header className="h-20 bg-white/20 dark:bg-slate-900/25 backdrop-blur-md border-b border-white/30 dark:border-slate-800/30 px-8 flex items-center justify-between sticky top-0 transition-colors duration-300 z-30">
      {/* Search Bar / Greetings */}
      <div className="flex items-center space-x-6 w-1/3">
        {currentTab === 'tasks' || currentTab === 'notes' ? (
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder={`Search ${currentTab === 'tasks' ? 'tasks by title or subject...' : 'your study notes...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/40 focus:ring-2 focus:ring-[#4F46E5] rounded-xl py-2 pl-10 pr-4 text-sm text-slate-705 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-[#4F46E5] dark:from-white dark:to-indigo-300">
              Focus Hub Active
            </span>
          </div>
        )}
      </div>

      {/* Motivational Quote in Center */}
      <div className="hidden lg:flex items-center space-x-2 bg-white/50 dark:bg-slate-800/40 px-4 py-2 rounded-2xl max-w-lg border border-white/60 dark:border-slate-700/40 shadow-xs">
        <blockquote className="text-xs text-indigo-700 dark:text-indigo-300 italic text-center font-medium line-clamp-1">
          "{activeQuote.text}" — <span className="font-semibold">{activeQuote.author}</span>
        </blockquote>
        <button 
          onClick={cycleQuote}
          title="Change Motivation Quote"
          className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-700/60 text-indigo-500 transition-colors"
        >
          <RefreshCw className="h-3 w-3 hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* Settings, Alarms, and Theme Toggles */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-all"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5 text-amber-400" />
          )}
        </button>

        {/* Notifications Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl relative transition-all"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Overlay back to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Study Notifications</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 rounded">
                    {notifications.length} Alerts
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                      No current notifications. You're all caught up!
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-start space-x-3 transition-colors">
                        {notif.type === 'warning' && (
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        )}
                        {notif.type === 'info' && (
                          <Calendar className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                        )}
                        {notif.type === 'success' && (
                          <Award className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {notif.text}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {notif.date}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Quick Info */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
            {user.avatar || '🎓'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{user.year}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
