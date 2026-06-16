import React, { useState } from 'react';
import { Task, SUBJECT_COLORS, SUBJECT_LIST } from '../types';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  ArrowRightLeft, 
  Calendar, 
  ChevronRight,
  List,
  Columns,
  BadgeAlert,
  FolderOpen
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  incrementXP: (xp: number) => void;
  searchQuery: string;
}

export default function TasksView({
  tasks,
  setTasks,
  incrementXP,
  searchQuery,
}: TasksViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Filters state
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  // Input states for Add/Edit
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'completed'>('todo');

  // Clear inputs helper
  const resetFormFields = () => {
    setTitle('');
    setDescription('');
    setSubject('Computer Science');
    setPriority('medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setStatus('todo');
    setTaskToEdit(null);
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setTitle(task.title);
    setDescription(task.description);
    setSubject(task.subject);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setShowAddForm(true);
  };

  // Create or Update task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      // Editing
      setTasks(prev => prev.map(t => t.id === taskToEdit.id ? {
        ...t,
        title,
        description,
        subject,
        priority,
        dueDate,
        status,
      } : t));
      resetFormFields();
      setShowAddForm(false);
    } else {
      // Adding new task
      const newTask: Task = {
        id: 't_' + Date.now(),
        title,
        description,
        subject,
        priority,
        dueDate,
        status,
      };
      setTasks(prev => [newTask, ...prev]);
      incrementXP(50); // XP for mapping a new task!
      resetFormFields();
      setShowAddForm(false);
    }
  };

  // Toggle status completed/todo
  const toggleComplete = (id: string, currentStatus: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: 'todo' | 'in_progress' | 'completed' = currentStatus === 'completed' ? 'todo' : 'completed';
        if (nextStatus === 'completed') {
          incrementXP(150); // Reward for completing a task!
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Cycle status
  const cycleStatus = (id: string, currentStatus: 'todo' | 'in_progress' | 'completed') => {
    const nextStates: Record<'todo' | 'in_progress' | 'completed', 'todo' | 'in_progress' | 'completed'> = {
      'todo': 'in_progress',
      'in_progress': 'completed',
      'completed': 'todo'
    };
    const next = nextStates[currentStatus];
    if (next === 'completed') {
      incrementXP(150);
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
  };

  // Filtering + Sorting
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || task.subject === subjectFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesSubject && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Upper Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-800/40 shadow-sm">
        {/* Toggle list/kanban */}
        <div className="flex bg-white/50 dark:bg-slate-850/40 p-1 rounded-xl w-fit border border-white/40 dark:border-slate-800/15">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
              viewMode === 'list' 
                ? 'bg-white/90 dark:bg-slate-800/90 text-[#4F46E5] dark:text-indigo-400 shadow-xs border border-white/60 dark:border-slate-700/60' 
                : 'text-slate-505 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
              viewMode === 'kanban' 
                ? 'bg-white/90 dark:bg-slate-800/90 text-[#4F46E5] dark:text-indigo-400 shadow-xs border border-white/60 dark:border-slate-700/60' 
                : 'text-slate-505 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Columns className="h-4 w-4" />
            <span>Kanban Board</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-0 text-xs font-semibold px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">📚 All Subjects</option>
            {SUBJECT_LIST.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-0 text-xs font-semibold px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">⚡ All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sort Toggles */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border-0 text-xs font-semibold px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="dueDate">📅 Sort: Due Date</option>
            <option value="priority">🔥 Sort: Priority</option>
            <option value="title">✏️ Sort: Title</option>
          </select>

          {/* Add Task Button */}
          <button
            onClick={() => { resetFormFields(); setShowAddForm(true); }}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-100 dark:shadow-none"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {/* Task Creation & Editing Drawer Dropdown / Overlay Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/25 pb-3">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {taskToEdit ? 'Edit Academic Task' : 'Draft New Study Task'}
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read Physics textbook Chapter 4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Description / Objectives</label>
                <textarea
                  rows={2}
                  placeholder="Review formulas, solve practice set page 102..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {/* Subject Category Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-250 focus:outline-none"
                  >
                    {SUBJECT_LIST.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Priority level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-250 focus:outline-none"
                  >
                    <option value="low">🟡 Low</option>
                    <option value="medium">🟠 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Starting status */}
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-250 focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold transition-all shadow-sm"
                >
                  {taskToEdit ? 'Save Changes' : 'Confirm & Log (+50XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main rendering block */}
      {viewMode === 'list' ? (
        /* List View rendering */
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm overflow-hidden space-y-4">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-150/30 dark:border-slate-800/20">
            <span className="font-bold text-slate-400 dark:text-slate-500 uppercase">Academic Tasks ({sortedTasks.length})</span>
            <span className="text-slate-400 font-mono">Completed items grant 150XP!</span>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <FolderOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-slate-400 dark:text-slate-500 text-sm">No tasks match your filter criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 space-y-1/2">
              {sortedTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const subColor = SUBJECT_COLORS[task.subject] || '#4F46E5';

                return (
                  <div 
                    key={task.id} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-transparent rounded-2xl gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors ${
                      isCompleted ? 'opacity-65' : ''
                    }`}
                  >
                    {/* Checkbox and title block */}
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      <button 
                        onClick={() => toggleComplete(task.id, task.status)}
                        className="mt-1 text-indigo-500 dark:text-indigo-400 hover:scale-110 transition-transform"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 fill-indigo-100 text-indigo-600 dark:fill-slate-800" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-350 dark:text-slate-650" />
                        )}
                      </button>

                      <div className="space-y-1 block min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span 
                            style={{ backgroundColor: subColor }}
                            className="w-2 h-2 rounded-full" 
                          />
                          <span 
                            style={{ color: subColor }}
                            className="text-[10px] font-bold uppercase tracking-wider truncate"
                          >
                            {task.subject}
                          </span>
                          <span className={`text-[9px] text-white font-black px-1.5 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <h4 className={`text-sm font-bold text-slate-800 dark:text-slate-200 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">{task.description}</p>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-x-6 sm:shrink-0">
                      {/* Due date badge */}
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-750">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{task.dueDate}</span>
                      </div>

                      {/* Status cycle badge */}
                      <button
                        onClick={() => cycleStatus(task.id, task.status)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl uppercase border text-center min-w-[90px] hover:border-indigo-500 transition-colors ${
                          task.status === 'completed' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 text-emerald-700'
                            : task.status === 'in_progress'
                            ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200/50 text-purple-700'
                            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 text-amber-700'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </button>

                      {/* Edit & delete btns */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditModal(task)}
                          title="Edit Task"
                          className="p-1.5 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          title="Delete Task"
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Kanban Board rendering */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columns configuration */}
          {([
            { key: 'todo', title: '📚 To Do', bg: 'bg-amber-50/50 dark:bg-slate-900/40 text-amber-700 border-amber-200/40' },
            { key: 'in_progress', title: '⚡ In Progress', bg: 'bg-purple-50/50 dark:bg-slate-900/40 text-purple-700 border-purple-200/40' },
            { key: 'completed', title: '✅ Completed', bg: 'bg-emerald-50/50 dark:bg-slate-900/40 text-emerald-700 border-emerald-200/40' },
          ] as const).map((col) => {
            const colTasks = sortedTasks.filter(t => t.status === col.key);

            return (
              <div 
                key={col.key} 
                className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-5 flex flex-col h-[600px] shadow-sm space-y-4"
              >
                {/* Column details */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center">
                    <span className="mr-2">{col.title}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </h3>
                </div>

                {/* Task card list inside column */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1.5">
                  {colTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">No tasks in this lane</p>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const subColor = SUBJECT_COLORS[task.subject] || '#4F46E5';

                      return (
                        <div 
                          key={task.id}
                          className="bg-white/70 dark:bg-slate-850/30 p-4 rounded-2xl border border-white/55 dark:border-slate-800/35 group hover:bg-white/95 dark:hover:bg-slate-850/50 hover:border-indigo-150 dark:hover:border-indigo-900 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-default"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span 
                                style={{ color: subColor }}
                                className="text-[9px] uppercase font-bold tracking-wider"
                              >
                                {task.subject}
                              </span>
                              <span className={`text-[9px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-205 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Footer with date and lane shifting control */}
                          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center text-[10px]">
                            <span className="font-mono text-slate-400 dark:text-slate-550">{task.dueDate}</span>
                            
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => cycleStatus(task.id, task.status)}
                                title="Move Column Lane"
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => openEditModal(task)}
                                title="Edit Task"
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                title="Delete Task"
                                className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
