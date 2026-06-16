import React, { useState } from 'react';
import { UserProfile, SUBJECT_LIST, SUBJECT_COLORS } from '../types';
import { 
  User, 
  Settings, 
  Download, 
  RotateCcw, 
  GraduationCap, 
  Target, 
  Volume2, 
  VolumeX,
  FileText,
  BadgeAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onResetApp: () => void;
  onExportJSON: () => void;
}

export default function SettingsView({
  user,
  setUser,
  onResetApp,
  onExportJSON,
}: SettingsViewProps) {
  // Local bindings to avoid laggy keystrokes
  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [year, setYear] = useState(user.year);
  const [weeklyGoal, setWeeklyGoal] = useState(user.studyGoalHoursPerWeek);
  const [sound, setSound] = useState(user.soundEnabled);

  const [notifSaved, setNotifSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      major,
      year,
      studyGoalHoursPerWeek: Number(weeklyGoal),
      soundEnabled: sound
    }));

    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 animate-fade-in">
      
      {/* Left Column: Profile edit (Span 8 cols) */}
      <form onSubmit={handleProfileSave} className="lg:col-span-8 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-105 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            <span>Profile & Study Settings</span>
          </h3>
          {notifSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-450 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Changes Saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-505 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* Academic major */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase">Academic Major</label>
            <input
              type="text"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-505 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* University Year */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase">University Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-505 text-slate-705 focus:outline-none"
            >
              <option value="Freshman Year">Freshman Year</option>
              <option value="Sophomore Year">Sophomore Year</option>
              <option value="Junior Year">Junior Year</option>
              <option value="Senior Year">Senior Year</option>
              <option value="Graduate Studies">Graduate Studies</option>
            </select>
          </div>

          {/* Weekly goal hours */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase">Weekly Study Goal (Hours)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-505 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Audio alerts preference toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 mt-4">
          <div className="space-y-0.5 max-w-md">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-205 flex items-center gap-1.5">
              {sound ? <Volume2 className="w-4 h-4 text-indigo-505" /> : <VolumeX className="w-4 h-4" />}
              <span>Enable Audio Completion Alerts</span>
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Synthesizes a pleasant academic chime once focus rounds finish.</p>
          </div>
          <button
            type="button"
            onClick={() => setSound(!sound)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors ${
              sound ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
              sound ? 'translate-x-6' : ''
            }`} />
          </button>
        </div>

        {/* Action Save Profiles options */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150/10 dark:shadow-none"
          >
            Save Profile Options
          </button>
        </div>
      </form>

      {/* Right Column: Database Utilities (Span 4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Category color legend widget */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-505" />
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-150 uppercase tracking-wide">Category Legend</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(SUBJECT_COLORS).map(([subj, valColor]) => (
              <div key={subj} className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-400">{subj}</span>
                <span 
                  style={{ backgroundColor: valColor }}
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-100 dark:ring-slate-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Database Export/Reset block */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-805 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-505" />
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-150 uppercase tracking-wide">Database Utilities</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Export study blocks as JSON backups, or restore seed tasks over current states.
          </p>

          <div className="space-y-3">
            {/* Export */}
            <button
              onClick={onExportJSON}
              className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-105 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-250 py-3 rounded-xl text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export App Backups</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetApp}
              className="w-full flex items-center justify-center space-x-2 bg-rose-50 hover:bg-rose-100/60 border border-rose-200/50 dark:bg-rose-950/20 dark:border-rose-900/30 text-rose-600 py-3 rounded-xl text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Database Seeds</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
