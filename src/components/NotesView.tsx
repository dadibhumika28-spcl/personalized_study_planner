import React, { useState } from 'react';
import { Note, SUBJECT_COLORS, SUBJECT_LIST } from '../types';
import { 
  Plus, 
  Search, 
  Trash2, 
  Heart, 
  Tag, 
  Clock, 
  FileText,
  Eye,
  PenTool,
  CheckCircle,
  HelpCircle,
  Hash
} from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  searchQuery: string;
}

export default function NotesView({
  notes,
  setNotes,
  searchQuery,
}: NotesViewProps) {
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Input bindings
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newTagsString, setNewTagsString] = useState('');
  const [newContent, setNewContent] = useState('');

  // Active note lookup
  const activeNote = notes.find(n => n.id === activeNoteId);

  const startNewNote = () => {
    const freshNote: Note = {
      id: 'note_' + Date.now(),
      title: 'Untitled Lecture Note',
      content: '## Enter lecture topic here\n\n- Point 1\n- Point 2\n- **Formula**: $E = mc^2$\n\n### Sub-heading\nWrite your critical study notes here for immediate memorization.',
      subject: 'Computer Science',
      tags: ['Syllabus', 'Core'],
      favorite: false,
      updatedAt: new Date().toISOString(),
    };

    setNotes(prev => [freshNote, ...prev]);
    setActiveNoteId(freshNote.id);
    setEditorMode('write');
  };

  const updateActiveNoteField = (field: keyof Note, value: any) => {
    setNotes(prev => prev.map(note => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          [field]: value,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };

  const handleTagsChange = (valString: string) => {
    const list = valString.split(',').map(tag => tag.trim()).filter(Boolean);
    updateActiveNoteField('tags', list);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remains = notes.filter(n => n.id !== id);
    setNotes(remains);
    if (activeNoteId === id && remains.length > 0) {
      setActiveNoteId(remains[0].id);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n));
  };

  // Safe client-side markdown interpreter to translate simple headers, bold, bullet points to pretty HTML
  const parseMarkdownToHTML = (text: string) => {
    if (!text) return '<p class="text-slate-400">Empty study note...</p>';
    
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings: #, ##, ###
    html = html.replace(/^### (.*?)$/gm, '<h4 class="text-md font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3 class="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-5 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">$1</h3>');
    html = html.replace(/^# (.*?)$/gm, '<h2 class="text-xl font-black text-slate-900 dark:text-white mt-6 mb-3">$1</h2>');

    // Bold tags **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');

    // Bullet Lists: - item or * item
    html = html.replace(/^[-\*] (.*?)$/gm, '<li class="list-disc ml-5 mb-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">$1</li>');

    // Paragraph wrappers for simple text lines
    const lines = html.split('\n');
    const grouped = lines.map(line => {
      if (!line.trim()) return '<div class="h-3"></div>';
      if (line.startsWith('<h') || line.startsWith('<li') || line.startsWith('<div')) return line;
      return `<p class="text-sm text-slate-650 dark:text-slate-300 leading-relaxed mb-2">${line}</p>`;
    });

    return grouped.join('\n');
  };

  // Searching and category filtration
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = subjectFilter === 'all' || n.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 animate-fade-in">
      
      {/* LEFT MODULE: Notes navigator (span 4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-800/40 shadow-sm flex flex-col gap-3">
          
          <div className="flex justify-between items-center bg-transparent">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-500">Subject Folder</span>
            
            <button
              onClick={startNewNote}
              className="flex items-center space-x-1 text-indigo-650 hover:text-indigo-700 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1.5 rounded-xl transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Note</span>
            </button>
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-0 text-xs font-bold px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-550 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">📂 All Folders</option>
            {SUBJECT_LIST.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Notes listing stack */}
        <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-4 rounded-3xl shadow-sm max-h-[500px] overflow-y-auto space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400 dark:text-slate-500 font-mono space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No lectures in folder.</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-2.5 ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100/10 dark:shadow-none' 
                      : 'bg-white/50 dark:bg-slate-850/20 border-white/40 dark:border-slate-800/10 hover:bg-white/75 dark:hover:bg-slate-800/35 text-slate-705'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-750 text-slate-505 shadow-2xs'
                      }`}>
                        {note.subject}
                      </span>
                      
                      <div className="flex items-center space-x-1 bg-transparent">
                        <button
                          onClick={(e) => toggleFavorite(note.id, e)}
                          className={`p-1 rounded-md transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${note.favorite ? 'fill-current text-red-500!' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => deleteNote(note.id, e)}
                          className={`p-1 rounded-md transition-colors ${
                            isActive ? 'text-white hover:text-red-100' : 'text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`text-sm font-bold truncate leading-snug ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                      {note.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                      {note.content.replace(/[#\*`\-\n]/g, ' ')}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] bg-transparent">
                    <span className={`font-mono flex items-center gap-1 ${isActive ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>
                      <Clock className="w-3 h-3" /> {formattedDate}
                    </span>
                    
                    {note.tags.length > 0 && (
                      <span className={`font-mono uppercase font-black tracking-widest text-[9px] ${isActive ? 'text-white/90' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        #{note.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MODULE: Note editor space (span 8 cols) */}
      <div className="lg:col-span-8">
        {!activeNote ? (
          <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl p-12 text-center h-[500px] flex flex-col justify-center items-center space-y-4 shadow-sm">
            <PenTool className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-400 dark:text-slate-500">Establish or select a note from the left shelf to begin studying.</p>
            <button 
              onClick={startNewNote}
              className="bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md"
            >
              Compose New Lecture Note
            </button>
          </div>
        ) : (
          <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px] justify-between">
            
            {/* Control Bar */}
            <div className="p-4 border-b border-white/40 dark:border-slate-800/20 flex justify-between items-center bg-white/70 dark:bg-slate-900/15">
              <div className="flex bg-white/40 dark:bg-slate-850/40 p-1 rounded-xl border border-white/40 dark:border-slate-800/20">
                <button
                  onClick={() => setEditorMode('write')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    editorMode === 'write' 
                      ? 'bg-white/90 dark:bg-slate-800/80 text-[#4F46E5] dark:text-indigo-400 font-bold border border-white/40 dark:border-slate-700/50 shadow-xs' 
                      : 'text-slate-505 dark:text-slate-400'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Drafting</span>
                </button>
                <button
                  onClick={() => setEditorMode('preview')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    editorMode === 'preview' 
                      ? 'bg-white/90 dark:bg-slate-800/80 text-[#4F46E5] dark:text-indigo-400 font-bold border border-white/40 dark:border-slate-700/50 shadow-xs' 
                      : 'text-slate-505 dark:text-slate-400'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Previsualization</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <span>Subject context:</span>
                <select
                  value={activeNote.subject}
                  onChange={(e) => updateActiveNoteField('subject', e.target.value)}
                  className="bg-transparent border-0 text-indigo-600 dark:text-indigo-400 font-bold focus:outline-none focus:ring-0 p-0"
                >
                  {SUBJECT_LIST.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editing / Preview Content space */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {editorMode === 'write' ? (
                <div className="space-y-6 h-full flex flex-col justify-start">
                  
                  {/* Title editor */}
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => updateActiveNoteField('title', e.target.value)}
                    placeholder="Enter gorgeous title..."
                    className="w-full text-xl md:text-2xl font-black text-slate-800 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-slate-350"
                  />

                  {/* Tags comma string editor */}
                  <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Hash className="h-4 w-4 text-indigo-505" />
                    <span>Comma split tags:</span>
                    <input
                      type="text"
                      value={activeNote.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="e.g. Graph-Theory, Exam-Preps"
                      className="flex-1 bg-transparent border-none text-slate-700 dark:text-slate-205 focus:outline-none focus:ring-0 p-0 min-w-0"
                    />
                  </div>

                  {/* Body content editor */}
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => updateActiveNoteField('content', e.target.value)}
                    placeholder="Compose study content here..."
                    className="w-full flex-1 min-h-[300px] text-sm text-slate-700 dark:text-slate-200 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none font-mono leading-relaxed"
                  />
                </div>
              ) : (
                /* Previsualizer style sheet */
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-indigo-500">
                      Folder: {activeNote.subject}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                      {activeNote.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {activeNote.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-550 border border-slate-200/40 dark:border-slate-750 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 prose dark:prose-invert max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(activeNote.content) }} 
                      className="space-y-4"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Note Editor info footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 select-none">
              <span className="font-mono">Rich formatting support active</span>
              <span className="font-mono">Saved {activeNote.content.length} characters</span>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
