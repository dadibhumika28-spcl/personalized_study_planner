export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // YYYY-MM-DD
  status: 'todo' | 'in_progress' | 'completed';
}

export interface Goal {
  id: string;
  title: string;
  category: 'daily' | 'weekly' | 'monthly' | 'semester';
  targetValue: number; // e.g., 5 hours, or 10 tasks
  currentValue: number;
  unit: string; // e.g., "hrs", "tasks", "%"
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Rich inline text (rendered beautifully)
  subject: string;
  tags: string[];
  favorite: boolean;
  updatedAt: string; // ISO string
}

export interface StudySession {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: 'pomodoro' | 'custom' | 'break';
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  countdownDays?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Name of lucide icon
  unlocked: boolean;
  requirement: string;
}

export interface UserProfile {
  name: string;
  avatar: string; // Emoji or asset URL
  major: string;
  year: string;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  xp: number; // Experience points
  level: number;
  studyGoalHoursPerWeek: number;
  focusTimeMinutes: number;
  breakTimeMinutes: number;
  longBreakTimeMinutes: number;
  soundEnabled: boolean;
}

// Map subjects to premium HEX colors for tag chips and charts
export const SUBJECT_COLORS: Record<string, string> = {
  'Computer Science': '#4F46E5', // Indigo
  'Mathematics': '#7C3AED', // Purple
  'Physics': '#06B6D4', // Cyan
  'Chemistry': '#10B981', // Emerald
  'Literature': '#F59E0B', // Amber
  'Biology': '#EF4444', // Rose
  'General': '#64748B', // Slate
};

export const SUBJECT_LIST = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'General',
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Mercer',
  avatar: '🎓',
  major: 'Software Engineering',
  year: 'Junior Year',
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  xp: 750,
  level: 3,
  studyGoalHoursPerWeek: 20,
  focusTimeMinutes: 25,
  breakTimeMinutes: 5,
  longBreakTimeMinutes: 15,
  soundEnabled: true,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Data Structures Big-O Homework',
    description: 'Solve complexity questions for graphs and red-black tree operations.',
    subject: 'Computer Science',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    status: 'todo',
  },
  {
    id: 't2',
    title: 'Linear Algebra Problem Set 5',
    description: 'Calculate eigenvectors and work on matrix diagonalizations.',
    subject: 'Mathematics',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // 1 day from now
    status: 'in_progress',
  },
  {
    id: 't3',
    title: 'Quantum Physics Lab Report',
    description: 'Draft the analysis section of the double-slit simulation experiment.',
    subject: 'Physics',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 days from now
    status: 'todo',
  },
  {
    id: 't4',
    title: 'Organic Chemistry Prep',
    description: 'Review reaction mechanisms for alkanes and ethers.',
    subject: 'Chemistry',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
    status: 'completed',
  },
  {
    id: 't5',
    title: 'Shakespeare Essay Outline',
    description: 'Create tentative thesis statements comparing Hamlet and Macbeth.',
    subject: 'Literature',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    status: 'todo',
  },
];

export const INITIAL_GOAL_LIST: Goal[] = [
  {
    id: 'g1',
    title: 'Daily Study Session',
    category: 'daily',
    targetValue: 4,
    currentValue: 3,
    unit: 'hrs',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 'g2',
    title: 'Weekly Study Target',
    category: 'weekly',
    targetValue: 20,
    currentValue: 16.5,
    unit: 'hrs',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 'g3',
    title: 'Finish 12 Tasks This Month',
    category: 'monthly',
    targetValue: 12,
    currentValue: 9,
    unit: 'tasks',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 'g4',
    title: 'Maintain 4.0 Semester GPA',
    category: 'semester',
    targetValue: 100,
    currentValue: 95,
    unit: '%',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
  },
];

export const INITIAL_NOTE_LIST: Note[] = [
  {
    id: 'n1',
    title: 'Graph Traversals (BFS & DFS)',
    content: `## Depth-First Search (DFS)
- Uses a **Stack** data structure (or recursion stack)
- Time Complexity: O(V + E)
- Space Complexity: O(V)
- Perfect for detecting cycles or solving maze-routing problems.

## Breadth-First Search (BFS)
- Uses a **Queue** data structure
- Time Complexity: O(V + E)
- Best for finding the **shortest path** on unweighted graphs.`,
    subject: 'Computer Science',
    tags: ['Graph-Algorithms', 'Coding-Prep'],
    favorite: true,
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'n2',
    title: 'Eigenvalues and Eigenvectors notes',
    content: `### Formula
The core relationship is represented by:
$$A v = \\lambda v$$

Where:
- $A$ is a square matrix.
- $v$ is the eigenvector (non-zero target vector).
- $\\lambda$ is the scaler eigenvalue.

### Steps to solve:
1. Construct $A - \\lambda I$
2. Solve the characteristic equation: $\\det(A - \\lambda I) = 0$
3. Find eigenvalues, then substitute to find associated eigenvectors.`,
    subject: 'Mathematics',
    tags: ['Linear-Algebra', 'Summary-Sheet'],
    favorite: false,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  // Generates study sessions over the past 7 days to seed the heatmap and analytics!
  {
    id: 's1',
    title: 'Graph Algorithms session',
    subject: 'Computer Science',
    durationMinutes: 120,
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], // 4 days ago
    time: '14:00',
    type: 'pomodoro',
  },
  {
    id: 's2',
    title: 'Matrix transformations homework',
    subject: 'Mathematics',
    durationMinutes: 90,
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], // 3 days ago
    time: '10:30',
    type: 'custom',
  },
  {
    id: 's3',
    title: 'Wave functions reading',
    subject: 'Physics',
    durationMinutes: 60,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
    time: '16:00',
    type: 'pomodoro',
  },
  {
    id: 's4',
    title: 'Reaction energy profiles',
    subject: 'Chemistry',
    durationMinutes: 150,
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], // yesterday
    time: '09:00',
    type: 'pomodoro',
  },
  {
    id: 's5',
    title: 'Coding Practice (BST deletion)',
    subject: 'Computer Science',
    durationMinutes: 120,
    date: new Date().toISOString().split('T')[0], // Today!
    time: '11:00',
    type: 'pomodoro',
  },
  {
    id: 's6',
    title: 'Vector spaces study',
    subject: 'Mathematics',
    durationMinutes: 45,
    date: new Date().toISOString().split('T')[0], // Today!
    time: '15:15',
    type: 'custom',
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'e1',
    title: 'Midterm Exam - Graph Theory & Sorting',
    subject: 'Computer Science',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days
    time: '09:00',
  },
  {
    id: 'e2',
    title: 'Final Exam - Vector Spaces & Determinants',
    subject: 'Mathematics',
    date: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0], // 12 days
    time: '13:00',
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'Early Bird',
    description: 'Complete a study session before 10 AM.',
    icon: 'Sun',
    unlocked: true,
    requirement: 'Start any focus time early',
  },
  {
    id: 'b2',
    title: 'Deep Work Champion',
    description: 'Log a study session lasting 120 minutes or longer.',
    icon: 'Shield',
    unlocked: true,
    requirement: 'Single session > 120m',
  },
  {
    id: 'b3',
    title: 'Centurion',
    description: 'Accumulate over 500 XP points.',
    icon: 'Zap',
    unlocked: true,
    requirement: 'Get 500 total XP',
  },
  {
    id: 'b4',
    title: 'Streak Master',
    description: 'Maintain a 5-day study streak.',
    icon: 'Flame',
    unlocked: true,
    requirement: 'Reach a 5-day active session streak',
  },
  {
    id: 'b5',
    title: 'Polymath',
    description: 'Schedule sessions in at least 4 different subjects.',
    icon: 'Award',
    unlocked: false,
    requirement: 'Create study entries for 4 unique categories',
  },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Focus is a muscle, and you build it through consistent study sessions.", author: "Productivity Guide" },
];
