import React, { useState } from 'react';
import { Goal } from '../types';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Target, 
  CheckCircle2, 
  Award, 
  Sparkles,
  Zap
} from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  incrementXP: (xp: number) => void;
}

export default function GoalsView({
  goals,
  setGoals,
  incrementXP,
}: GoalsViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'semester'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'daily' | 'weekly' | 'monthly' | 'semester'>('daily');
  const [targetValue, setTargetValue] = useState(5);
  const [unit, setUnit] = useState('hrs');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: 'g_' + Date.now(),
      title,
      category,
      targetValue: Number(targetValue),
      currentValue: 0,
      unit,
      dueDate,
      completed: false,
    };

    setGoals(prev => [newGoal, ...prev]);
    incrementXP(75); // Award XP on committing goals!
    
    setTitle('');
    setShowAddForm(false);
  };

  const incrementGoal = (id: string, step = 1) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const nextValue = Math.min(goal.currentValue + step, goal.targetValue);
        const wasCompleted = goal.completed;
        const isCompleted = nextValue >= goal.targetValue;
        
        if (isCompleted && !wasCompleted) {
          incrementXP(250); // Massive XP for finishing goals!
        }
        
        return {
          ...goal,
          currentValue: nextValue,
          completed: isCompleted,
        };
      }
      return goal;
    }));
  };

  const decrementGoal = (id: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const nextValue = Math.max(goal.currentValue - 1, 0);
        return {
          ...goal,
          currentValue: nextValue,
          completed: nextValue >= goal.targetValue,
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Filter categorization
  const filteredGoals = goals.filter(g => activeCategory === 'all' || g.category === activeCategory);

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Category selector and triggers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-800/40 shadow-sm">
        
        <div className="flex bg-white/50 dark:bg-slate-850/40 p-1 rounded-xl border border-white/40 dark:border-slate-800/15 overflow-x-auto max-w-full">
          {(['all', 'daily', 'weekly', 'monthly', 'semester'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 font-bold capitalize rounded-lg transition-all ${
                activeCategory === cat 
                  ? 'bg-white/85 dark:bg-slate-800/80 text-indigo-650 dark:text-indigo-400 shadow-xs border border-white/50 dark:border-slate-700/50' 
                  : 'text-slate-505 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              {cat} Goals
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-150/10 dark:shadow-none"
        >
          <Plus className="h-4 w-4" />
          <span>Formulate Academic Goal</span>
        </button>
      </div>

      {/* Goal add Dialog overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/40 dark:border-slate-800/25 pb-3">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-105 flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-505" />
                <span>Establish Study Goal</span>
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-405 dark:text-slate-400 text-xs font-bold hover:text-slate-600">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study 15 hours of CS this week"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-705 focus:outline-none"
                  >
                    <option value="daily">Daily Target</option>
                    <option value="weekly">Weekly Target</option>
                    <option value="monthly">Monthly Target</option>
                    <option value="semester">Semester Target</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Target Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Progress Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-705 focus:outline-none"
                  >
                    <option value="hrs">Hours (hrs)</option>
                    <option value="tasks">Completed Tasks (tasks)</option>
                    <option value="chapters">Chapters Read (chapters)</option>
                    <option value="sessions">Study Sessions (sessions)</option>
                    <option value="%">Success Ratio (%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">Deadline Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-205 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Log Target Milestone (+75 XP)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid for Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const ratio = Math.min(goal.currentValue / goal.targetValue, 1);
          const percent = Math.round(ratio * 100);
          
          // SVG Circular parameters
          const radius = 32;
          const stroke = 5;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - ratio * circumference;

          return (
            <div 
              key={goal.id} 
              className={`bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-5 rounded-3xl shadow-sm flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-indigo-150 dark:hover:border-indigo-900 ${
                goal.completed ? 'bg-gradient-to-br from-white/60 to-emerald-50/15 dark:to-emerald-950/5 border-emerald-300/30' : ''
              }`}
            >
              {/* Left Details */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="space-y-1 bg-transparent">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--color-cat)] bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded-md text-indigo-600 dark:text-indigo-400">
                      {goal.category}
                    </span>
                    {goal.completed && (
                      <span className="text-[9px] uppercase font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Full
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-105 leading-snug line-clamp-2">
                    {goal.title}
                  </h4>
                  <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    Target: <span className="font-bold text-slate-700 dark:text-slate-350">{goal.targetValue} {goal.unit}</span>
                  </p>
                </div>

                {/* Incremental progress logging panel */}
                {!goal.completed ? (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => incrementGoal(goal.id, 1)}
                      className="p-1 px-2.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-205 flex items-center gap-1 hover:bg-indigo-600 hover:text-white rounded-lg font-bold transition-all"
                    >
                      <span>+1 {goal.unit}</span>
                    </button>
                    {goal.currentValue > 0 && (
                      <button
                        onClick={() => decrementGoal(goal.id)}
                        className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded"
                      >
                        Reduce
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" /> Completed (+250XP)
                  </span>
                )}
              </div>

              {/* Right Graphical progress circle and delete controls */}
              <div className="shrink-0 flex flex-col items-center justify-between h-[110px]">
                {/* Visual SVG Completion Ring */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth={stroke}
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="40"
                      cy="40"
                    />
                    <circle
                      className="text-indigo-650 dark:text-indigo-400 transition-all duration-500"
                      strokeWidth={stroke}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={radius}
                      cx="40"
                      cy="40"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-black text-slate-770 dark:text-slate-105">{percent}%</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">
                    {goal.currentValue} / {goal.targetValue}
                  </span>
                  
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    title="Remove Goal"
                    className="text-slate-350 hover:text-red-500 p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
