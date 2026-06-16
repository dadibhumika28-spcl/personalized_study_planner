import React from 'react';
import { 
  Task, 
  Goal, 
  StudySession, 
  Exam, 
  Badge, 
  UserProfile, 
  SUBJECT_COLORS 
} from '../types';
import { 
  Flame, 
  CheckCircle, 
  Clock, 
  Inbox, 
  Calendar, 
  Award, 
  Sparkles, 
  Hourglass, 
  Activity,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  tasks: Task[];
  goals: Goal[];
  sessions: StudySession[];
  exams: Exam[];
  badges: Badge[];
  setTab: (tab: string) => void;
}

export default function DashboardView({
  user,
  tasks,
  goals,
  sessions,
  exams,
  badges,
  setTab,
}: DashboardViewProps) {
  // 1. Time-based Greeting
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // 2. Statistics Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const totalTasks = tasks.length;
  
  // Calculate total study hours this week
  const studyMinutesThisWeek = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const studyHoursThisWeek = (studyMinutesThisWeek / 60).toFixed(1);

  // 3. Semester Progress Calculations
  // Let's assume a standard 16-week semester (e.g. Sept 1 to Dec 20, or current custom 120 days)
  const totalSemesterDays = 120;
  const elapsedDays = 45; // Simulated elapsed
  const semesterProgressPercent = Math.min((elapsedDays / totalSemesterDays) * 100, 100);

  // 4. Heatmap Contribution Grid
  // Render a grid representing the last 49 days (7 weeks) grouped by day of the week
  // Sunday is Row 0, Monday is Row 1, etc.
  // We'll compute total study minutes on each day
  const getStudyMinutesForDateOffset = (daysAgo: number) => {
    const targetDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const daySessions = sessions.filter(s => s.date === targetDate);
    return daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  };

  const heatmapGrid = Array.from({ length: 49 }, (_, i) => {
    const daysAgo = 48 - i;
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split('T')[0];
    const minutes = getStudyMinutesForDateOffset(daysAgo);
    
    // Choose color intensity
    let colorClass = 'bg-white/40 dark:bg-slate-800/35 hover:bg-white/60 dark:hover:bg-slate-700/60 border border-white/30 dark:border-slate-850/30'; // No study
    if (minutes > 0 && minutes <= 30) colorClass = 'bg-indigo-500/20 dark:bg-indigo-500/25 text-[#4F46E5] dark:text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/10 dark:border-indigo-500/20';
    else if (minutes > 30 && minutes <= 90) colorClass = 'bg-indigo-500/40 dark:bg-indigo-500/45 text-slate-800 dark:text-indigo-300 hover:bg-indigo-500/50 border border-indigo-500/20 dark:border-indigo-500/30';
    else if (minutes > 90 && minutes <= 150) colorClass = 'bg-[#4F46E5]/70 dark:bg-[#4F46E5]/75 text-white hover:bg-[#4F46E5]/80 border border-[#4F46E5]/30';
    else if (minutes > 150) colorClass = 'bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white hover:opacity-90 shadow-xs border border-white/20';

    return {
      id: i,
      dateString,
      minutes,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      colorClass
    };
  });

  // Today's Date representation in human readable format
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Filters for displaying items in Dashboard
  const todayDateString = new Date().toISOString().split('T')[0];
  const todaysSessions = sessions.filter(s => s.date === todayDateString);
  const incompleteDeadlinesSorted = [...tasks]
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const activeExamsSorted = [...exams]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Header Hero Welcome Panel */}
      <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-slate-800/40 relative overflow-hidden shadow-sm">
        {/* Floating background blur blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-24 right-44 w-32 h-32 bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#4F46E5]/10 dark:bg-indigo-950/40 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-white/45 dark:border-indigo-900/30 text-[#4F46E5] dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>STREAK MULTIPLIER ACTIVE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-850 dark:text-white">
              {getGreeting()}, {user.name}! 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-350 italic text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family." — Kofi Annan
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0 bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-white/60 dark:border-slate-705 shadow-xs">
            <div className="bg-amber-400/10 dark:bg-amber-550/20 p-3 rounded-xl text-amber-600 dark:text-amber-400">
              <Flame className="h-6 w-6 stroke-[2.5] fill-current" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-850 dark:text-white">{user.streak} Days</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 leading-none">Daily Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid for Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Tasks */}
        <div id="stat-total-tasks" className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm hover:bg-white/60 dark:hover:bg-slate-900/45 hover:shadow-md transition-all flex items-center space-x-4 cursor-pointer">
          <div className="p-4 bg-white/80 dark:bg-slate-800 rounded-2xl text-[#4F46E5] dark:text-indigo-400 border border-white/60 dark:border-slate-700 shadow-xs">
            <Inbox className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Tasks</p>
            <h4 className="text-2xl font-black text-slate-850 dark:text-white">{totalTasks}</h4>
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div id="stat-completed-tasks" className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm hover:bg-white/60 dark:hover:bg-slate-900/45 hover:shadow-md transition-all flex items-center space-x-4 cursor-pointer">
          <div className="p-4 bg-white/80 dark:bg-slate-800 rounded-2xl text-emerald-500 dark:text-emerald-400 border border-white/60 dark:border-slate-700 shadow-xs">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed</p>
            <h4 className="text-2xl font-black text-slate-850 dark:text-white">
              {completedTasks} <span className="text-xs text-slate-400 dark:text-slate-550 font-normal">({totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}%)</span>
            </h4>
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div id="stat-pending-tasks" className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm hover:bg-white/60 dark:hover:bg-slate-900/45 hover:shadow-md transition-all flex items-center space-x-4 cursor-pointer">
          <div className="p-4 bg-white/80 dark:bg-slate-800 rounded-2xl text-rose-500 border border-white/60 dark:border-slate-700 shadow-xs">
            <Hourglass className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</p>
            <h4 className="text-2xl font-black text-slate-850 dark:text-white">{pendingTasks}</h4>
          </div>
        </div>

        {/* Card 4: Study Hours This Week */}
        <div id="stat-study-hours" className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm hover:bg-white/60 dark:hover:bg-slate-900/45 hover:shadow-md transition-all flex items-center space-x-4 cursor-pointer">
          <div className="p-4 bg-white/80 dark:bg-slate-800 rounded-2xl text-[#7C3AED] dark:text-purple-400 border border-white/60 dark:border-slate-700 shadow-xs">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hours Studied</p>
            <h4 className="text-2xl font-black text-slate-850 dark:text-white">{studyHoursThisWeek} hr</h4>
          </div>
        </div>
      </div>

      {/* 3. Midsection: Heatmap Panel and Semester Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Study Heatmap Container - Takes 2 cols */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
            <div className="flex items-center space-x-2.5">
              <Activity className="h-5 w-5 text-indigo-505" />
              <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Study Frequency Map</h3>
            </div>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-mono">{formattedToday}</span>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Active sessions are graphed over the past 7 weeks. Darker blocks mean longer study intervals.
            </p>
            
            {/* Heatmap Layout Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[420px] flex gap-1.5 items-center justify-center py-4">
                {/* Visual grid layout */}
                <span className="text-[10px] text-slate-400 dark:text-slate-500 select-none mr-2">Study Heat:</span>
                <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                  {heatmapGrid.map((block) => (
                    <div
                      key={block.id}
                      className={`w-4 h-4 rounded-xs transition-colors relative group cursor-pointer ${block.colorClass}`}
                    >
                      {/* Interactive Tooltip representation */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 bg-slate-950 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20 text-center shadow-lg font-mono">
                        {block.dateString} <br />
                        <span className="font-bold text-amber-400">{block.minutes} mins studied</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex items-center justify-end space-x-2 text-[10px] text-slate-400 dark:text-slate-500">
              <span>Less</span>
              <div className="w-2.5 h-2.5 bg-white/40 dark:bg-slate-800/35 rounded-xs border border-white/20 dark:border-slate-800/30" />
              <div className="w-2.5 h-2.5 bg-indigo-500/20 rounded-xs border border-indigo-400/20" />
              <div className="w-2.5 h-2.5 bg-indigo-550/40 rounded-xs border border-indigo-400/20" />
              <div className="w-2.5 h-2.5 bg-[#4F46E5]/70 rounded-xs border border-white/20" />
              <div className="w-2.5 h-2.5 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-xs" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Semester Progress Tracker Card */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <span>Semester Arc</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We are currently in Week 7 of the academic term. Steady study intervals keep exams organized.
            </p>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Days Elapsed</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{elapsedDays} / {totalSemesterDays} Days</span>
              </div>
              <div className="w-full bg-white/50 dark:bg-slate-800/50 h-3 rounded-full overflow-hidden border border-white/30 dark:border-slate-850/20">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${semesterProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3 bg-white/70 dark:bg-slate-800/30 rounded-2xl border border-white/50 dark:border-slate-800/30 shadow-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Productivity Score</span>
                <span className="font-black text-slate-800 dark:text-slate-100 text-base">88 / 100</span>
              </div>
              <div className="p-3 bg-white/70 dark:bg-slate-800/30 rounded-2xl border border-white/50 dark:border-slate-800/30 shadow-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Focus Score</span>
                <span className="font-black text-indigo-650 dark:text-indigo-400 text-base">92%</span>
              </div>
            </div>
          </div>

          <div id="countdown-banner" className="bg-[#4F46E5]/10 dark:bg-indigo-950/20 px-4 py-3 rounded-2xl border border-[#4F46E5]/20 dark:border-indigo-900/15 flex items-center justify-between text-xs font-semibold text-indigo-755 dark:text-indigo-300 mt-6 shadow-xs">
            <span>Next Goal Accomplishment:</span>
            <span className="bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/50 dark:border-slate-700 text-[10px] font-bold">3.5 hrs left</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Today's Schedule + Upcoming Deadlines + Exam Countdown & Achievements Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Today's Schedule Timeline & Recent activity */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
            <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Today's Schedule</h3>
            <button 
              onClick={() => setTab('calendar')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center hover:underline"
            >
              Calendar <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>

          {todaysSessions.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <Calendar className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">No study sessions scheduled for today.</p>
              <button 
                onClick={() => setTab('calendar')} 
                className="text-xs bg-indigo-500 hover:bg-indigo-650 text-white px-3.5 py-2 rounded-xl font-bold tracking-wide transition-colors shadow-xs"
              >
                Schedule Session
              </button>
            </div>
          ) : (
            <div className="relative pl-4 border-l-2 border-indigo-150/45 dark:border-indigo-950/45 space-y-6">
              {todaysSessions.map((session) => (
                <div key={session.id} className="relative">
                  {/* Timeline dot */}
                  <span 
                    style={{ backgroundColor: SUBJECT_COLORS[session.subject] || '#4F46E5' }}
                    className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ring-4 ring-[#F1F5F9] dark:ring-[#0F172A]" 
                  />
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{session.time}</span>
                      <span className="text-slate-450 dark:text-slate-500 font-semibold">{session.durationMinutes} mins</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">{session.title}</h4>
                    <span 
                      style={{ color: SUBJECT_COLORS[session.subject] }}
                      className="text-[10px] uppercase font-bold tracking-wider"
                    >
                      {session.subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Col: Assignments / Upcoming Deadlines */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
            <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Study Deadlines</h3>
            <button 
              onClick={() => setTab('tasks')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center hover:underline"
            >
              Task Board <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {incompleteDeadlinesSorted.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                You're in the clear! No pending tasks left to complete.
              </div>
            ) : (
              incompleteDeadlinesSorted.map((task) => {
                const subColor = SUBJECT_COLORS[task.subject] || '#4F46E5';
                return (
                  <div 
                    key={task.id} 
                    className="p-4 bg-white/70 dark:bg-slate-800/30 rounded-2xl border border-white/50 dark:border-slate-800/30 flex items-start justify-between gap-4 group hover:bg-white/95 dark:hover:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all cursor-pointer shadow-xs"
                    onClick={() => setTab('tasks')}
                  >
                    <div className="space-y-1 bg-transparent">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: subColor }}
                        />
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold truncate uppercase tracking-wider">
                          {task.subject}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200 leading-tight block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">Due date:</span>
                      <span className="text-xs text-slate-700 dark:text-slate-350 font-extrabold block">{task.dueDate}</span>
                      <span className={`text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-1 ${
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Exams Countdowns & Badges Achievements */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 dark:border-slate-800/40 shadow-sm space-y-6">
          <div className="pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
            <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Exams & Milestones</h3>
          </div>

          {/* Exams list with countdown */}
          <div className="space-y-4">
            {activeExamsSorted.map((exam) => {
              const diffTime = new Date(exam.date).getTime() - Date.now();
              const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isUrgent = daysLeft <= 5;

              return (
                <div key={exam.id} className="p-4 bg-white/70 dark:bg-slate-800/30 rounded-2xl border border-white/50 dark:border-slate-800/30 space-y-2 shadow-xs">
                  <div className="flex justify-between items-center text-xs">
                    <span 
                      style={{ color: SUBJECT_COLORS[exam.subject] }}
                      className="font-bold text-[10px] uppercase tracking-wider"
                    >
                      {exam.subject}
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                      isUrgent ? 'bg-red-400/10 text-red-500' : 'bg-indigo-400/10 text-indigo-500'
                    }`}>
                      {daysLeft < 0 ? 'Concluded' : daysLeft === 0 ? 'TODAY!' : `${daysLeft} days left`}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-200">{exam.title}</h4>
                  <div className="flex justify-between text-xs text-slate-450 dark:text-slate-500 font-mono">
                    <span>📅 {exam.date}</span>
                    <span>⏰ {exam.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Showcase latest achievements */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Locked / Unlocked Badges</h4>
            <div className="flex flex-wrap gap-2">
              {badges.slice(0, 4).map((badge) => (
                <div 
                  key={badge.id}
                  title={`${badge.title}: ${badge.description}`}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-default transition-all ${
                    badge.unlocked 
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-800 dark:text-amber-400 dark:bg-amber-500/10' 
                      : 'bg-white/40 dark:bg-slate-800/20 border-white/40 dark:border-slate-800/20 text-slate-400'
                  }`}
                >
                  <Award className={`h-3.5 w-3.5 ${badge.unlocked ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-300'}`} />
                  <span className="line-clamp-1">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
