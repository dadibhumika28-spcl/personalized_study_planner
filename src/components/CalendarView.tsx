import React, { useState } from 'react';
import { StudySession, Task, SUBJECT_COLORS, SUBJECT_LIST } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Trash2,
  BellRing
} from 'lucide-react';

interface CalendarViewProps {
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  tasks: Task[];
  incrementXP: (xp: number) => void;
}

export default function CalendarView({
  sessions,
  setSessions,
  tasks,
  incrementXP,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 16)); // Initiated to June 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showAddSession, setShowAddSession] = useState(false);
  
  // Selected date indicator
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 16));

  // Form Fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [duration, setDuration] = useState(60);
  const [time, setTime] = useState('14:30');
  const [sessionDate, setSessionDate] = useState('2026-06-16');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper date generators for Monthly View
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Generate Month Grid Days array (with prefix padding days from previous month)
  const calendarSlots: Array<{ day: number; dateString: string; isCurrentMonth: boolean }> = [];
  
  // Padding from previous month
  const prevMonthDaysCount = getDaysInMonth(year, month - 1);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDay = prevMonthDaysCount - i;
    const prevDate = new Date(year, month - 1, prevDay);
    calendarSlots.push({
      day: prevDay,
      dateString: prevDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    calendarSlots.push({
      day: d,
      dateString: currDate.toISOString().split('T')[0],
      isCurrentMonth: true,
    });
  }

  // Padding for next month to round out to 42 cells (6 rows of 7)
  const remainingSlots = 42 - calendarSlots.length;
  for (let n = 1; n <= remainingSlots; n++) {
    const nextDate = new Date(year, month + 1, n);
    calendarSlots.push({
      day: n,
      dateString: nextDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    });
  }

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSession: StudySession = {
      id: 'session_' + Date.now(),
      title,
      subject,
      durationMinutes: Number(duration),
      date: sessionDate,
      time,
      type: 'custom',
    };

    setSessions(prev => [newSession, ...prev]);
    incrementXP(100); // 100XP on logging calendar study plans!
    
    // reset fields
    setTitle('');
    setShowAddSession(false);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Label dates for month
  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Weekly structure elements (7 days of selected date week)
  const getDaysOfCurrentWeek = (baseDate: Date) => {
    const dayOfWeek = baseDate.getDay();
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - dayOfWeek); // Go back to Sunday

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };
  const weekDays = getDaysOfCurrentWeek(selectedDate);

  // Daily structures
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const daySessions = sessions
    .filter(s => s.date === selectedDateString)
    .sort((a, b) => a.time.localeCompare(b.time));
  const dayTasks = tasks.filter(t => t.dueDate === selectedDateString);

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Calendar Header with toggles and Month Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-800/40 shadow-sm">
        
        {/* Navigation & Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <span>{viewMode === 'month' ? monthLabel : viewMode === 'week' ? `Week of ${weekDays[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })}` : selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </h2>
          
          {viewMode === 'month' && (
            <div className="flex bg-white/50 dark:bg-slate-800/35 rounded-lg p-0.5 border border-white/40 dark:border-slate-800/20">
              <button onClick={prevMonth} className="p-1.5 hover:text-indigo-650 dark:hover:text-indigo-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextMonth} className="p-1.5 hover:text-indigo-650 dark:hover:text-indigo-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action controllers */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Day / Week / Month tab toggles */}
          <div className="flex bg-white/50 dark:bg-slate-850/40 p-1 rounded-xl border border-white/45 dark:border-slate-800/20">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`text-xs px-3.5 py-2 font-bold capitalize rounded-lg transition-all ${
                  viewMode === mode 
                    ? 'bg-white/85 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/50 dark:border-slate-700/50' 
                    : 'text-slate-505 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Quick Schedule Trigger */}
          <button
            onClick={() => {
              setSessionDate(selectedDate.toISOString().split('T')[0]);
              setShowAddSession(true);
            }}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Log Study</span>
          </button>
        </div>
      </div>

      {/* Add Study Session Modal Form overlay */}
      {showAddSession && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/40 dark:border-slate-800/25 pb-3">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-505" />
                <span>Schedule New Study Block</span>
              </h3>
              <button onClick={() => setShowAddSession(false)} className="text-slate-400 dark:text-slate-500 font-bold text-xs hover:text-slate-700 dark:hover:text-slate-300">Close</button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Session Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eigenvectors Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-705 focus:outline-none"
                  >
                    {SUBJECT_LIST.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Duration (Mins)</label>
                  <input
                    type="number"
                    min={10}
                    max={300}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Scheduled Date</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-205 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Scheduled Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-205 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 dark:shadow-none"
              >
                Log Study session (+100 XP)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER MODAL ACCORDING TO CURRENT TAB MODE */}
      {viewMode === 'month' && (
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm overflow-hidden">
          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-2 text-center pb-3 border-b border-slate-150/30 dark:border-slate-800/20 font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="uppercase tracking-wider">{d}</span>
            ))}
          </div>

          {/* Monthly grid */}
          <div className="grid grid-cols-7 gap-2 pt-3">
            {calendarSlots.map((slot, index) => {
              const belongsToSelected = selectedDateString === slot.dateString;
              const dateSessions = sessions.filter(s => s.date === slot.dateString);
              const dateTasks = tasks.filter(t => t.dueDate === slot.dateString);

              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDate(new Date(slot.dateString + 'T00:00:00'));
                  }}
                  className={`min-h-[100px] p-2.5 flex flex-col justify-between rounded-2xl border transition-all cursor-pointer ${
                    slot.isCurrentMonth 
                      ? 'bg-white/55 dark:bg-slate-850/20 hover:bg-white/85 dark:hover:bg-slate-800/35 border-white/40 dark:border-slate-800/10' 
                      : 'bg-transparent border-transparent text-slate-350 dark:text-slate-700 opacity-30'
                  } ${
                    belongsToSelected 
                      ? 'ring-2 ring-indigo-505 border-indigo-400 dark:ring-indigo-400 dark:bg-indigo-500/10 bg-[#4F46E5]/5' 
                      : ''
                  }`}
                >
                  {/* Day number & deadlines flag */}
                  <div className="flex justify-between items-center bg-transparent">
                    <span className={`text-xs font-extrabold ${belongsToSelected ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{slot.day}</span>
                    {dateTasks.length > 0 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" title={`${dateTasks.length} Homework Homework`} />
                    )}
                  </div>

                  {/* Visual micro indicators for sessions */}
                  <div className="space-y-1 overflow-hidden pointer-events-none mt-2">
                    {dateSessions.slice(0, 2).map((s) => (
                      <div 
                        key={s.id}
                        style={{ backgroundColor: `${SUBJECT_COLORS[s.subject] || '#4F46E5'}15`, color: SUBJECT_COLORS[s.subject] }}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-lg truncate block"
                      >
                        {s.title}
                      </div>
                    ))}
                    {dateSessions.length > 2 && (
                      <span className="text-[8px] text-slate-400 font-semibold block text-center">+{dateSessions.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const ds = day.toISOString().split('T')[0];
              const weekSessions = sessions.filter(s => s.date === ds);
              const weekTasks = tasks.filter(t => t.dueDate === ds);
              const isSelected = selectedDateString === ds;

              return (
                <div 
                  key={ds}
                  onClick={() => setSelectedDate(day)}
                  className={`p-4 rounded-2xl border flex flex-col h-[320px] transition-all cursor-pointer ${
                    isSelected 
                      ? 'ring-2 ring-indigo-505 border-indigo-400 bg-indigo-505/10 dark:bg-indigo-950/30' 
                      : 'bg-white/50 dark:bg-slate-850/25 border-white/40 dark:border-slate-800/15 hover:bg-white/85 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="border-b border-slate-150/30 dark:border-slate-700/55 pb-2 mb-2 text-center">
                    <span className="text-[10px] text-slate-405 dark:text-slate-500 font-bold block uppercase tracking-wide">
                      {day.toLocaleDateString('default', { weekday: 'short' })}
                    </span>
                    <span className="text-sm font-extrabold text-slate-850 dark:text-slate-100">
                      {day.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 pointer-events-none">
                    {/* Render task alert */}
                    {weekTasks.map(t => (
                      <div key={t.id} className="bg-red-500/10 border border-red-500/20 text-red-550 text-[9px] px-1.5 py-1 rounded-lg flex items-center gap-1 font-bold truncate">
                        <BellRing className="w-2.5 h-2.5 shrink-0" />
                        <span>Task: {t.title}</span>
                      </div>
                    ))}

                    {/* Render study sessions */}
                    {weekSessions.map(s => (
                      <div 
                        key={s.id}
                        style={{ borderLeftColor: SUBJECT_COLORS[s.subject] }}
                        className="bg-white/80 dark:bg-slate-800/80 border-l-4 border-y border-r border-white/60 dark:border-slate-800/20 text-slate-850 dark:text-slate-300 p-1.5 rounded-r-lg text-[9px] leading-tight flex flex-col space-y-0.5 shadow-xs"
                      >
                        <span className="font-extrabold truncate">{s.title}</span>
                        <span className="text-slate-405 font-mono text-[8px]">{s.time} ({s.durationMinutes}m)</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Day list schedule */}
          <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm md:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100 uppercase tracking-widest pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
              Study Schedule for {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
            </h3>

            {daySessions.length === 0 ? (
              <div className="py-20 text-center text-slate-400 dark:text-slate-500 text-xs font-mono space-y-2">
                <Clock className="w-8 h-8 text-slate-350 mx-auto" />
                <p>No study blocks locked in for this day.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {daySessions.map((session) => (
                  <div 
                    key={session.id}
                    className="p-4 bg-white/70 dark:bg-slate-850/30 rounded-2xl border border-white/55 dark:border-slate-800/35 flex justify-between items-center group hover:bg-white/95 dark:hover:bg-slate-800/50 hover:border-indigo-150 dark:hover:border-indigo-900 transition-colors shadow-xs"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Subject Color Block */}
                      <span 
                        style={{ backgroundColor: SUBJECT_COLORS[session.subject] || '#4F46E5' }}
                        className="w-3.5 h-3.5 rounded-full" 
                      />
                      
                      <div className="space-y-0.5">
                        <span 
                          style={{ color: SUBJECT_COLORS[session.subject] }}
                          className="text-[10px] font-bold uppercase tracking-wider"
                        >
                          {session.subject}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-150">{session.title}</h4>
                        <div className="flex gap-3 text-xs text-slate-450 dark:text-slate-500 font-mono">
                          <span>⏰ Start: {session.time}</span>
                          <span>⏳ Span: {session.durationMinutes} Minutes</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Day tasks sidebar */}
          <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 uppercase pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
              Task Deadlines ({dayTasks.length})
            </h3>

            {dayTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
                No assignment dues.
              </div>
            ) : (
              <div className="space-y-3">
                {dayTasks.map(task => (
                  <div key={task.id} className="p-3 bg-red-500/10 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-900/30">
                    <span className="text-[10px] font-bold text-red-500 uppercase">{task.subject}</span>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight block">{task.title}</h5>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
