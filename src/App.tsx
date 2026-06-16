import React, { useState, useEffect } from 'react';
import { 
  Task, 
  Goal, 
  Note, 
  StudySession, 
  Exam, 
  Badge, 
  UserProfile, 
  INITIAL_USER_PROFILE, 
  INITIAL_TASKS, 
  INITIAL_GOAL_LIST, 
  INITIAL_NOTE_LIST, 
  INITIAL_STUDY_SESSIONS, 
  INITIAL_EXAMS, 
  INITIAL_BADGES 
} from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import GoalsView from './components/GoalsView';
import NotesView from './components/NotesView';
import AnalyticsView from './components/AnalyticsView';
import PomodoroView from './components/PomodoroView';
import SettingsView from './components/SettingsView';

import { 
  Plus, 
  Flame, 
  Sparkles, 
  X,
  PlusCircle, 
  Compass,
  Menu,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar drawer

  // 1. Core State managed through Local Storage hooks
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // 2. Load all states from storage on mount
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('studypulse_theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // Load states
    try {
      const storedUser = localStorage.getItem('studypulse_user');
      const storedTasks = localStorage.getItem('studypulse_tasks');
      const storedGoals = localStorage.getItem('studypulse_goals');
      const storedNotes = localStorage.getItem('studypulse_notes');
      const storedSessions = localStorage.getItem('studypulse_sessions');
      const storedExams = localStorage.getItem('studypulse_exams');
      const storedBadges = localStorage.getItem('studypulse_badges');

      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(INITIAL_USER_PROFILE);

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      else setTasks(INITIAL_TASKS);

      if (storedGoals) setGoals(JSON.parse(storedGoals));
      else setGoals(INITIAL_GOAL_LIST);

      if (storedNotes) setNotes(JSON.parse(storedNotes));
      else setNotes(INITIAL_NOTE_LIST);

      if (storedSessions) setSessions(JSON.parse(storedSessions));
      else setSessions(INITIAL_STUDY_SESSIONS);

      if (storedExams) setExams(JSON.parse(storedExams));
      else setExams(INITIAL_EXAMS);

      if (storedBadges) setBadges(JSON.parse(storedBadges));
      else setBadges(INITIAL_BADGES);
    } catch (e) {
      console.error("Failed to parse local storage cache: ", e);
      // fallback seeds
      handleSeedStateReset();
    }
  }, []);

  // 3. Sync states to Local Storage whenever updated
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('studypulse_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (goals.length > 0) localStorage.setItem('studypulse_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (notes.length > 0) localStorage.setItem('studypulse_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('studypulse_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (exams.length > 0) localStorage.setItem('studypulse_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    if (badges.length > 0) localStorage.setItem('studypulse_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('studypulse_user', JSON.stringify(user));
  }, [user]);

  // Handle HTML document theme classes
  const handleThemeSwitch = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    localStorage.setItem('studypulse_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 4. Rewards, Experience, Progression system
  const incrementXP = (xpGain: number) => {
    setUser(prev => {
      let nextXP = prev.xp + xpGain;
      let nextLevel = prev.level;
      
      if (nextXP >= 1000) {
        nextLevel += 1;
        nextXP = nextXP - 1000;
        // congratulate level up
        triggerLevelUpOverlay(nextLevel);
      }

      return {
        ...prev,
        xp: nextXP,
        level: nextLevel,
      };
    });
  };

  const incrementStreak = () => {
    setUser(prev => ({
      ...prev,
      streak: prev.streak + 1,
    }));
  };

  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);
  const triggerLevelUpOverlay = (levelNum: number) => {
    setLevelUpMessage(`Level up! You are now Level ${levelNum} Scholar!`);
    setTimeout(() => {
      setLevelUpMessage(null);
    }, 4500);
  };

  // 5. Global seed state restore option
  const handleSeedStateReset = () => {
    localStorage.clear();
    setUser(INITIAL_USER_PROFILE);
    setTasks(INITIAL_TASKS);
    setGoals(INITIAL_GOAL_LIST);
    setNotes(INITIAL_NOTE_LIST);
    setSessions(INITIAL_STUDY_SESSIONS);
    setExams(INITIAL_EXAMS);
    setBadges(INITIAL_BADGES);
    localStorage.setItem('studypulse_user', JSON.stringify(INITIAL_USER_PROFILE));
    localStorage.setItem('studypulse_tasks', JSON.stringify(INITIAL_TASKS));
    localStorage.setItem('studypulse_goals', JSON.stringify(INITIAL_GOAL_LIST));
    localStorage.setItem('studypulse_notes', JSON.stringify(INITIAL_NOTE_LIST));
    localStorage.setItem('studypulse_sessions', JSON.stringify(INITIAL_STUDY_SESSIONS));
    localStorage.setItem('studypulse_exams', JSON.stringify(INITIAL_EXAMS));
    localStorage.setItem('studypulse_badges', JSON.stringify(INITIAL_BADGES));
  };

  // 6. State Export to JSON File
  const handleExportJSON = () => {
    const dataObj = {
      user,
      tasks,
      goals,
      notes,
      sessions,
      exams,
      badges,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "studypulse-backup.json");
    dlAnchorElem.click();
  };

  // Achievement unlock auditor
  // Triggers checking unlocked conditions dynamically
  useEffect(() => {
    // Early Bird: Checked on pomodoros
    // Deep work: checked if session > 120
    const checkBadges = () => {
      let updated = false;
      const nextBadges = badges.map(badge => {
        if (badge.unlocked) return badge;

        // Challenge check
        if (badge.id === 'b5') {
          // Polymath: Schedule sessions in at least 4 different subjects
          const uniqueSubjects = new Set(sessions.map(s => s.subject));
          if (uniqueSubjects.size >= 4) {
            updated = true;
            incrementXP(350);
            return { ...badge, unlocked: true };
          }
        }
        return badge;
      });

      if (updated) {
        setBadges(nextBadges);
      }
    };
    if (sessions.length > 0 && badges.length > 0) {
      checkBadges();
    }
  }, [sessions, badges]);

  // Quick FAB Form overlays
  const [showFABQuickAction, setShowFABQuickAction] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  const handleQuickTaskAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    const newTask: Task = {
      id: 'quick_' + Date.now(),
      title: quickTaskTitle,
      description: 'Quickly drafted task from dashboard panel.',
      subject: 'General',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo',
    };

    setTasks(prev => [newTask, ...prev]);
    incrementXP(30);
    setQuickTaskTitle('');
    setShowFABQuickAction(false);
  };

  return (
    <div className={`min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A] font-sans tracking-tight transition-colors duration-300 relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* Background decoration circles for Frosted Glass theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#4F46E5]/10 dark:bg-[#4F46E5]/15 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 blur-[120px]" />
      </div>

      {/* Level Up Notification Ribbon */}
      {levelUpMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-300 flex items-center space-x-3 z-50 animate-bounce">
          <Sparkles className="h-5 w-5 text-amber-200 fill-current animate-spin" />
          <span className="text-sm">{levelUpMessage}</span>
          <X className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" onClick={() => setLevelUpMessage(null)} />
        </div>
      )}

      {/* Main Structural Layout Grid */}
      <div className="flex">
        
        {/* DESKTOP SIDEBAR: Visible on large grids */}
        <div className="hidden lg:block shrink-0">
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={(tab) => { setCurrentTab(tab); setSidebarOpen(false); }} 
            user={user} 
          />
        </div>

        {/* MOBILE SIDEBAR PANEL OVERLAY DRAWER */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex lg:hidden">
            <div className="relative w-64 bg-white dark:bg-slate-900 flex flex-col h-full z-50">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-650"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar 
                currentTab={currentTab} 
                setCurrentTab={(tab) => { setCurrentTab(tab); setSidebarOpen(false); }} 
                user={user} 
              />
            </div>
            {/* Click outer to close */}
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* RIGHT MASTER CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          
          {/* TOP HEADER */}
          <div className="flex items-center px-4 lg:px-0">
            {/* Mobile Sidebar open trigger btn */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 hover:bg-slate-10 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl block lg:hidden mr-4 transition-all"
            >
              <Menu className="h-5 h-5" />
            </button>

            <div className="flex-1">
              <Navbar 
                currentTab={currentTab} 
                user={user}
                tasks={tasks}
                exams={exams}
                theme={theme}
                setTheme={handleThemeSwitch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>

          {/* ACTIVE TAB DASHBOARD SCREEN WINDOW */}
          <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {currentTab === 'dashboard' && (
              <DashboardView 
                user={user}
                tasks={tasks}
                goals={goals}
                sessions={sessions}
                exams={exams}
                badges={badges}
                setTab={setCurrentTab}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksView 
                tasks={tasks}
                setTasks={setTasks}
                incrementXP={incrementXP}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView 
                sessions={sessions}
                setSessions={setSessions}
                tasks={tasks}
                incrementXP={incrementXP}
              />
            )}

            {currentTab === 'goals' && (
              <GoalsView 
                goals={goals}
                setGoals={setGoals}
                incrementXP={incrementXP}
              />
            )}

            {currentTab === 'pomodoro' && (
              <PomodoroView 
                sessions={sessions}
                setSessions={setSessions}
                incrementXP={incrementXP}
                incrementStreak={incrementStreak}
              />
            )}

            {currentTab === 'notes' && (
              <NotesView 
                notes={notes}
                setNotes={setNotes}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView 
                sessions={sessions}
                tasks={tasks}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView 
                user={user}
                setUser={setUser}
                onResetApp={handleSeedStateReset}
                onExportJSON={handleExportJSON}
              />
            )}
          </main>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON (FAB) FOR QUICK COMPILATION ACTIONS */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFABQuickAction(!showFABQuickAction)}
          id="fab-trigger"
          title="Quick Action"
          className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform stroke-[2.5]"
        >
          <Plus className={`w-7 h-7 transition-all ${showFABQuickAction ? 'rotate-45' : ''}`} />
        </button>

        {showFABQuickAction && (
          <>
            {/* overlay backdrop */}
            <div className="fixed inset-0 z-30" onClick={() => setShowFABQuickAction(false)} />
            
            {/* FAB Options Drawer card */}
            <div className="absolute right-0 bottom-16 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 z-40 transform origin-bottom-right transition-all animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Compass className="h-4.5 w-4.5 text-indigo-500" />
                  <span>Speedy Actions Hub</span>
                </h4>
              </div>

              {/* Quick task form */}
              <form onSubmit={handleQuickTaskAdd} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500">Fast Memo Task</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule literature draft submission..."
                    value={quickTaskTitle}
                    onChange={(e) => setQuickTaskTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-3.5 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-705 focus:outline-none placeholder-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Confirm Quick Task (+30 XP)
                </button>
              </form>

              {/* Speedy page shortcut buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={() => { setCurrentTab('pomodoro'); setShowFABQuickAction(false); }}
                  className="p-2.5 text-center text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:hover:bg-slate-755 rounded-xl block truncate"
                >
                  ⚡ Start Focus
                </button>
                <button
                  onClick={() => { handleSeedStateReset(); setShowFABQuickAction(false); }}
                  className="p-2.5 text-center text-[10px] font-bold bg-rose-50 hover:bg-rose-100/50 dark:bg-slate-800 text-rose-600 dark:hover:bg-slate-755 rounded-xl block truncate"
                >
                  🔄 Reset Seeds
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
