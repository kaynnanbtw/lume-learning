import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  Calculator,
  FlaskConical,
  Globe,
  PenTool,
  Code,
  Music,
  Briefcase,
  Gavel,
  Stethoscope,
  Microscope,
  Play,
  Pause,
  RotateCcw,
  ListTodo,
  HelpCircle,
  FileText,
  Award,
  TrendingUp,
  Sun,
  Moon,
  Palette,
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
  Check,
  X,
  Edit3,
  FolderPlus,
  Sparkles,
  BarChart3,
  Target,
  Timer,
  LayoutGrid,
  LogOut,
  Lock,
  User,
  Mail,
  ShieldCheck,
} from 'lucide-react';

// ==========================================
// INICIALIZAÇÃO DO FIREBASE (CLOUD STORAGE)
// ==========================================
// PARA PUBLICAR NO GITHUB PAGES:
// Crie um projeto gratuito em https://console.firebase.google.com
// Ative "Authentication" (Anônimo) e "Firestore Database" e cole os dados abaixo:
const MY_PRODUCTION_FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const firebaseConfig =
  typeof __firebase_config !== 'undefined' && __firebase_config
    ? JSON.parse(__firebase_config)
    : MY_PRODUCTION_FIREBASE_CONFIG;

const hasValidFirebaseConfig = Boolean(
  firebaseConfig && (firebaseConfig.apiKey || firebaseConfig.projectId)
);

const app = hasValidFirebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'studyflix-pro-app';

// ==========================================
// CONSTANTES DE DESIGN, CORES E ÍCONES
// ==========================================

const SUBJECT_COLORS = [
  { id: 'lume-amber', hex: '#A67522', name: 'Ocre Lume' },
  { id: 'lume-sand', hex: '#D8B979', name: 'Areia Dourada' },
  { id: 'lume-slate', hex: '#36423B', name: 'Ardósia Lume' },
  { id: 'red', hex: '#ef4444', name: 'Vermelho' },
  { id: 'orange', hex: '#f97316', name: 'Laranja' },
  { id: 'emerald', hex: '#10b981', name: 'Verde' },
  { id: 'teal', hex: '#14b8a6', name: 'Turquesa' },
  { id: 'cyan', hex: '#06b6d4', name: 'Ciano' },
  { id: 'blue', hex: '#3b82f6', name: 'Azul' },
  { id: 'purple', hex: '#a855f7', name: 'Roxo' },
];

const THEME_ACCENTS = [
  {
    id: 'lume',
    name: 'Lume Oficial (Ocre & Creme)',
    hex: '#A67522',
    brightHex: '#B88428',
    btnBg: '#36423B',
    btnText: '#F3E8CA',
    border: '#A67522',
  },
  {
    id: 'lume-sand',
    name: 'Lume Areia Dourada',
    hex: '#D8B979',
    brightHex: '#C5A35E',
    btnBg: '#2b2417',
    btnText: '#F3E8CA',
    border: '#D8B979',
  },
  { id: 'violet', name: 'Roxo (Print 4)', hex: '#6d28d9', brightHex: '#6229f6', btnBg: '#3b1d7a', btnText: '#c4b5fd', border: '#6d28d9' },
  { id: 'cyan', name: 'Oceano (Print 1)', hex: '#0ea5e9', brightHex: '#06b6d4', btnBg: '#164e63', btnText: '#38bdf8', border: '#0284c7' },
  { id: 'emerald', name: 'Esmeralda', hex: '#10b981', brightHex: '#10b981', btnBg: '#064e3b', btnText: '#34d399', border: '#059669' },
  { id: 'rose', name: 'Rubi', hex: '#f43f5e', brightHex: '#f43f5e', btnBg: '#881337', btnText: '#fb7185', border: '#e11d48' },
];

const SUBJECT_ICONS = [
  { id: 'az', label: 'AZ', component: null },
  { id: 'book', label: 'Livro', component: BookOpen },
  { id: 'calc', label: 'Exatas', component: Calculator },
  { id: 'flask', label: 'Química', component: FlaskConical },
  { id: 'globe', label: 'Geografia', component: Globe },
  { id: 'pen', label: 'Redação', component: PenTool },
  { id: 'code', label: 'Código', component: Code },
  { id: 'music', label: 'Artes', component: Music },
  { id: 'briefcase', label: 'Carreira', component: Briefcase },
  { id: 'gavel', label: 'Direito', component: Gavel },
  { id: 'stethoscope', label: 'Saúde', component: Stethoscope },
  { id: 'microscope', label: 'Biologia', component: Microscope },
];

const COURSE_GRADIENTS = [
  { id: 'lume-gold', label: 'Lume Ocre & Ardósia', gradient: 'from-[#A67522] via-[#36423B] to-[#0c0e0d]', color: '#D8B979' },
  { id: 'lume-slate', label: 'Lume Floresta & Areia', gradient: 'from-[#36423B] via-[#1c231f] to-[#0a0b0a]', color: '#F3E8CA' },
  { id: 'violet', label: 'Nebulosa Violeta', gradient: 'from-violet-900 via-indigo-950 to-zinc-950', color: '#8b5cf6' },
  { id: 'cyan', label: 'Oceano Profundo', gradient: 'from-cyan-900 via-slate-900 to-zinc-950', color: '#06b6d4' },
  { id: 'emerald', label: 'Floresta Esmeralda', gradient: 'from-emerald-900 via-teal-950 to-zinc-950', color: '#10b981' },
];

// ==========================================
// COMPONENTE DA LOGO OFICIAL LUME LEARNING
// ==========================================
const LUME_FAVICON_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#F3E8CA"/>
    <circle cx="32" cy="32" r="10" fill="none" stroke="#A67522" stroke-width="4.5"/>
    <path d="M32 10v6M32 48v6M10 32h6M48 32h6M16.4 16.4l4.2 4.2M43.4 43.4l4.2 4.2M47.6 16.4l-4.2 4.2M20.6 43.4l-4.2 4.2" stroke="#A67522" stroke-width="4.5" stroke-linecap="round"/>
  </svg>`
)}`;

function applyLumeBrowserBranding(pageTitle = 'lume learning — Organize. Aprenda. Evolua.') {
  if (typeof document === 'undefined') return;
  document.title = pageTitle;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = LUME_FAVICON_SVG;
}

function LumeBrandMark({ size = 'md', showTagline = true, collapsed = false }) {
  const boxSizes = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
  };
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`${boxSizes[size]} bg-[#F3E8CA] flex items-center justify-center shadow-lg border border-[#D8B979]/60 shrink-0`}
      >
        <Sun className={`${iconSizes[size]} text-[#A67522] stroke-[2.2]`} />
      </div>

      {!collapsed && (
        <div className="text-left leading-none">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-normal tracking-tight text-[#B88228] ${
                size === 'lg' ? 'text-4xl' : 'text-2xl'
              }`}
            >
              lume
            </span>
            <span
              className={`font-semibold tracking-tight text-[#D8B979] ${
                size === 'lg' ? 'text-lg' : 'text-xs'
              }`}
            >
              learning
            </span>
          </div>
          {showTagline && (
            <p
              className={`uppercase tracking-[0.16em] text-[#9ca39f] font-medium ${
                size === 'lg' ? 'text-[11px] mt-1.5' : 'text-[9px] mt-1'
              }`}
            >
              ORGANIZE. APRENDA. EVOLUA.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ESTRUTURA LIMPA (DO ZERO) PARA NOVOS USUÁRIOS
// ==========================================
function createBlankUserWorkspace(displayName) {
  return {
    displayName: displayName || 'Estudante',
    darkMode: true,
    accentId: 'lume',
    courses: [],
    activeCourseId: '',
    studyLogs: [],
    taskLists: [
      { id: 'list-1', name: 'Tarefas da Semana' },
      { id: 'list-2', name: 'Revisões Pendentes' },
    ],
    tasks: [],
    questions: [],
    questionLogs: [],
    simulados: [],
    essays: [],
  };
}

function getMondayOfCurrentWeek(referenceDate = new Date()) {
  const d = new Date(referenceDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateISO(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatMinutesToHoursLabel(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return '0min';
  const hrs = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hrs === 0) return `${mins}min`;
  return `${hrs}h${String(mins).padStart(2, '0')}`;
}

function normalizeAccountKey(usernameOrEmail) {
  return usernameOrEmail
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_');
}

function SubjectIconRender({ iconId, className = 'w-4 h-4' }) {
  const found = SUBJECT_ICONS.find((i) => i.id === iconId);
  if (!found || found.id === 'az' || !found.component) {
    return <span className="font-bold text-xs tracking-tighter">AZ</span>;
  }
  const IconComp = found.component;
  return <IconComp className={className} />;
}

// ==========================================
// COMPONENTE PRINCIPAL DA APLICAÇÃO
// ==========================================
export default function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [accentId, setAccentId] = useState('lume');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState('');
  const [studyLogs, setStudyLogs] = useState([]);
  const [autoLogBoxClick, setAutoLogBoxClick] = useState(true);
  const [liveSession, setLiveSession] = useState(null);

  const [taskLists, setTaskLists] = useState([
    { id: 'list-1', name: 'Tarefas da Semana' },
    { id: 'list-2', name: 'Revisões Pendentes' },
  ]);
  const [tasks, setTasks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionLogs, setQuestionLogs] = useState([]);
  const [simulados, setSimulados] = useState([]);
  const [essays, setEssays] = useState([]);

  const [toast, setToast] = useState(null);
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    applyLumeBrowserBranding('lume learning — Organize. Aprenda. Evolua.');
  }, []);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Erro ao conectar autenticação:', err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !firebaseUser || !currentAccount || !dataLoaded) return;

    const saveTimer = setTimeout(async () => {
      try {
        setIsSyncing(true);
        const userDocRef = doc(
          db,
          'artifacts',
          appId,
          'public',
          'data',
          'studyflix_accounts',
          currentAccount.accountKey
        );
        await setDoc(
          userDocRef,
          {
            accountKey: currentAccount.accountKey,
            username: currentAccount.username,
            passwordHash: currentAccount.passwordHash,
            updatedAt: new Date().toISOString(),
            workspace: JSON.stringify({
              displayName: userName,
              darkMode,
              accentId,
              courses,
              activeCourseId,
              studyLogs,
              taskLists,
              tasks,
              questions,
              questionLogs,
              simulados,
              essays,
            }),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Erro ao salvar dados da conta:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [
    firebaseUser,
    currentAccount,
    dataLoaded,
    userName,
    darkMode,
    accentId,
    courses,
    activeCourseId,
    studyLogs,
    taskLists,
    tasks,
    questions,
    questionLogs,
    simulados,
    essays,
  ]);

  const applyWorkspaceToState = (ws) => {
    setUserName(ws.displayName || 'Estudante');
    setDarkMode(ws.darkMode !== undefined ? ws.darkMode : true);
    setAccentId(ws.accentId || 'lume');
    setCourses(Array.isArray(ws.courses) ? ws.courses : []);
    setActiveCourseId(ws.activeCourseId || (ws.courses?.[0]?.id ?? ''));
    setStudyLogs(Array.isArray(ws.studyLogs) ? ws.studyLogs : []);
    setTaskLists(
      Array.isArray(ws.taskLists) && ws.taskLists.length > 0
        ? ws.taskLists
        : [
            { id: 'list-1', name: 'Tarefas da Semana' },
            { id: 'list-2', name: 'Revisões Pendentes' },
          ]
    );
    setTasks(Array.isArray(ws.tasks) ? ws.tasks : []);
    setQuestions(Array.isArray(ws.questions) ? ws.questions : []);
    setQuestionLogs(Array.isArray(ws.questionLogs) ? ws.questionLogs : []);
    setSimulados(Array.isArray(ws.simulados) ? ws.simulados : []);
    setEssays(Array.isArray(ws.essays) ? ws.essays : []);
  };

  const handleLogout = () => {
    setLiveSession(null);
    setDataLoaded(false);
    setCurrentAccount(null);
    setActiveTab('home');
    showToast('Você saiu da sua conta com segurança.');
  };

  useEffect(() => {
    if (!liveSession || !liveSession.isRunning) return;
    const timer = setInterval(() => {
      setLiveSession((prev) =>
        prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [liveSession?.isRunning]);

  const activeCourse = useMemo(() => {
    if (!courses.length) return null;
    return courses.find((c) => c.id === activeCourseId) || courses[0];
  }, [courses, activeCourseId]);

  const currentAccent = useMemo(() => {
    return THEME_ACCENTS.find((a) => a.id === accentId) || THEME_ACCENTS[0];
  }, [accentId]);

  const subjectsWithCalculatedSessions = useMemo(() => {
    if (!activeCourse || !activeCourse.subjects?.length) return [];
    const totalHours = activeCourse.totalHours || 60;
    const rawScores = activeCourse.subjects.map((sub) => ({
      ...sub,
      score: (Number(sub.difficulty) + Number(sub.content)) * Number(sub.weight),
    }));

    const totalScore = rawScores.reduce((acc, s) => acc + s.score, 0) || 1;

    let allocated = 0;
    const calculated = rawScores.map((sub, idx) => {
      if (idx === rawScores.length - 1) {
        const remaining = Math.max(1, totalHours - allocated);
        return { ...sub, totalSessions: remaining };
      }
      const sessions = Math.max(1, Math.round((sub.score / totalScore) * totalHours));
      allocated += sessions;
      return { ...sub, totalSessions: sessions };
    });

    return calculated;
  }, [activeCourse]);

  const cycleStats = useMemo(() => {
    const totalSessions = subjectsWithCalculatedSessions.reduce((acc, s) => acc + s.totalSessions, 0);
    const completedCount = subjectsWithCalculatedSessions.reduce(
      (acc, s) => acc + s.completedSessions.filter((idx) => idx < s.totalSessions).length,
      0
    );
    const percentage = totalSessions > 0 ? ((completedCount / totalSessions) * 100).toFixed(1) : '0.0';
    return { totalSessions, completedCount, percentage };
  }, [subjectsWithCalculatedSessions]);

  const [subName, setSubName] = useState('');
  const [subDifficulty, setSubDifficulty] = useState(1);
  const [subContent, setSubContent] = useState(1);
  const [subColor, setSubColor] = useState(SUBJECT_COLORS[0].hex);
  const [subIcon, setSubIcon] = useState('az');
  const [subWeight, setSubWeight] = useState(1);

  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Concursos & Vestibulares');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseGradient, setNewCourseGradient] = useState(COURSE_GRADIENTS[0]);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    const newCourse = {
      id: `course-${Date.now()}`,
      name: newCourseName.trim(),
      category: newCourseCategory.trim() || 'Trilha Personalizada',
      description:
        newCourseDesc.trim() ||
        'Trilha de estudos personalizada com distribuição proporcional de carga horária e ciclos.',
      gradient: newCourseGradient.gradient,
      accentColor: newCourseGradient.color,
      badge: 'MEU CURSO',
      totalHours: 60,
      subjects: [],
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    setActiveCourseId(newCourse.id);
    setNewCourseName('');
    setNewCourseDesc('');
    setShowNewCourseModal(false);
    showToast(`Curso "${newCourse.name}" criado! Agora adicione suas matérias.`);
  };

  const handleSelectCourseFromCatalog = (courseId, targetTab = 'cycle') => {
    setActiveCourseId(courseId);
    setActiveTab(targetTab);
    const chosen = courses.find((c) => c.id === courseId);
    if (chosen) {
      showToast(`Curso selecionado: ${chosen.name}`);
    }
  };

  const handleDeleteCourseById = (courseId) => {
    const filtered = courses.filter((c) => c.id !== courseId);
    setCourses(filtered);
    if (activeCourseId === courseId) {
      setActiveCourseId(filtered[0]?.id || '');
    }
    showToast('Curso removido do seu catálogo.');
  };

  const handleUpdateTotalHours = (newHours) => {
    if (!activeCourse) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === activeCourse.id ? { ...c, totalHours: Number(newHours) } : c))
    );
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!activeCourse) {
      setShowNewCourseModal(true);
      showToast('Crie primeiro um curso para adicionar matérias!');
      return;
    }
    if (!subName.trim()) {
      showToast('Digite o nome da matéria para adicionar.');
      return;
    }
    const newSubject = {
      id: `sub-${Date.now()}`,
      name: subName.trim(),
      difficulty: subDifficulty,
      content: subContent,
      weight: Math.max(1, Number(subWeight) || 1),
      color: subColor,
      icon: subIcon,
      completedSessions: [],
    };

    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeCourse.id ? { ...c, subjects: [...c.subjects, newSubject] } : c
      )
    );
    setSubName('');
    setSubDifficulty(1);
    setSubContent(1);
    setSubWeight(1);
    showToast(`Matéria "${newSubject.name}" adicionada ao ciclo!`);
  };

  const handleDeleteSubject = (subjectId) => {
    if (!activeCourse) return;
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeCourse.id
          ? { ...c, subjects: c.subjects.filter((s) => s.id !== subjectId) }
          : c
      )
    );
    showToast('Matéria removida do ciclo.');
  };

  const handleToggleSessionBox = (subjectId, boxIndex) => {
    if (!activeCourse) return;
    const targetSub = subjectsWithCalculatedSessions.find((s) => s.id === subjectId);
    const wasCompleted = targetSub?.completedSessions.includes(boxIndex);

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== activeCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== subjectId) return s;
            const exists = s.completedSessions.includes(boxIndex);
            const updated = exists
              ? s.completedSessions.filter((i) => i !== boxIndex)
              : [...s.completedSessions, boxIndex];
            return { ...s, completedSessions: updated };
          }),
        };
      })
    );

    if (!wasCompleted && autoLogBoxClick && targetSub) {
      const todayISO = formatDateISO(new Date());
      const newLog = {
        id: `slog-${Date.now()}`,
        date: todayISO,
        subjectId: targetSub.id,
        subjectName: targetSub.name,
        subjectColor: targetSub.color,
        minutes: 60,
        tag: 'Ciclo',
        courseId: activeCourse.id,
      };
      setStudyLogs((prev) => [newLog, ...prev]);
      showToast(`+1h00 de ${targetSub.name} contabilizada no Gráfico de Estudo de hoje!`);
    }
  };

  const recordStudyTimeLog = ({ subjectId, minutes, tag = 'Ciclo', markCycleBox = true }) => {
    const targetSub =
      subjectsWithCalculatedSessions.find((s) => s.id === subjectId) ||
      subjectsWithCalculatedSessions[0];
    if (!targetSub || !activeCourse) {
      showToast('Adicione pelo menos 1 matéria no seu curso primeiro.');
      return;
    }

    const validMinutes = Math.max(1, Math.round(Number(minutes) || 1));
    const todayISO = formatDateISO(new Date());

    const newLog = {
      id: `slog-${Date.now()}`,
      date: todayISO,
      subjectId: targetSub.id,
      subjectName: targetSub.name,
      subjectColor: targetSub.color,
      minutes: validMinutes,
      tag,
      courseId: activeCourse.id,
    };

    setStudyLogs((prev) => [newLog, ...prev]);

    if (markCycleBox) {
      let nextIndex = -1;
      for (let i = 0; i < targetSub.totalSessions; i++) {
        if (!targetSub.completedSessions.includes(i)) {
          nextIndex = i;
          break;
        }
      }
      if (nextIndex !== -1) {
        setCourses((prev) =>
          prev.map((c) => {
            if (c.id !== activeCourse.id) return c;
            return {
              ...c,
              subjects: c.subjects.map((s) =>
                s.id === targetSub.id
                  ? { ...s, completedSessions: [...s.completedSessions, nextIndex] }
                  : s
              ),
            };
          })
        );
      }
    }

    showToast(
      `+${formatMinutesToHoursLabel(validMinutes)} em ${targetSub.name} salvo no Gráfico e Ciclo!`
    );
  };

  const handleStartSubjectStudy = (subject) => {
    setLiveSession({
      subjectId: subject.id,
      subjectName: subject.name,
      subjectColor: subject.color,
      tag: 'Ciclo',
      elapsedSeconds: 0,
      isRunning: true,
    });
    showToast(`Estudo de ${subject.name} iniciado! O tempo será salvo no gráfico.`);
  };

  const handleFinishLiveSession = () => {
    if (!liveSession) return;
    const minutesCalculated =
      liveSession.elapsedSeconds >= 60 ? Math.round(liveSession.elapsedSeconds / 60) : 60;

    recordStudyTimeLog({
      subjectId: liveSession.subjectId,
      minutes: minutesCalculated,
      tag: liveSession.tag || 'Ciclo',
      markCycleBox: true,
    });
    setLiveSession(null);
  };

  const markNextSessionForSubject = (subjectId, minutesStudied = 60, tag = 'Pomodoro') => {
    recordStudyTimeLog({
      subjectId,
      minutes: minutesStudied,
      tag,
      markCycleBox: true,
    });
  };

  const handleResetCycle = () => {
    if (!activeCourse) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== activeCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => ({ ...s, completedSessions: [] })),
        };
      })
    );
    showToast('Ciclo de estudos resetado para 0%!');
  };

  const theme = {
    bgMain: darkMode ? 'bg-[#080908] text-[#F5F5F0]' : 'bg-[#F5F5F0] text-[#232b26]',
    bgCard: darkMode
      ? 'bg-[#111513] border-[#26302a] text-[#F5F5F0]'
      : 'bg-white border-[#e2dccd] text-[#232b26] shadow-sm',
    bgInput: darkMode
      ? 'bg-[#171c19] border-[#2d3832] text-[#F5F5F0] placeholder-zinc-500'
      : 'bg-[#F5F5F0] border-[#d5ccb8] text-[#232b26] placeholder-stone-400',
    bgSubtle: darkMode ? 'bg-[#181f1b] border-[#2b3630]' : 'bg-[#EFECE4] border-[#ded6c6]',
    textMuted: darkMode ? 'text-[#9ca6a0]' : 'text-[#5c6660]',
    border: darkMode ? 'border-[#26302a]' : 'border-[#e2dccd]',
  };

  if (!currentAccount) {
    return (
      <AuthLoginScreen
        authReady={authReady}
        firebaseUser={firebaseUser}
        onLoginSuccess={(accountInfo, workspaceData) => {
          applyWorkspaceToState(workspaceData);
          setCurrentAccount(accountInfo);
          setDataLoaded(true);
          showToast(`Bem-vindo(a), ${workspaceData.displayName}!`);
        }}
      />
    );
  }

  const sidebarSections = [
    {
      group: 'Início & Catálogo',
      items: [
        { id: 'home', label: 'Catálogo de Cursos', icon: LayoutGrid, badge: courses.length },
        { id: 'dashboard', label: 'Dashboard & Gráfico', icon: BarChart3 },
      ],
    },
    {
      group: 'Planejamento & Foco',
      items: [
        { id: 'cycle', label: 'Ciclo de Estudos', icon: CheckCircle2, badge: `${cycleStats.percentage}%` },
        { id: 'pomodoro', label: 'Pomodoro & Cronômetro', icon: Timer },
        { id: 'tasks', label: 'Lista de Tarefas', icon: ListTodo, badge: tasks.filter((t) => !t.completed).length },
      ],
    },
    {
      group: 'Prática & Evolução',
      items: [
        { id: 'questions', label: 'Banco de Questões', icon: HelpCircle, badge: questions.length },
        { id: 'essays', label: 'Central de Redações', icon: PenTool, badge: essays.length },
        { id: 'journal', label: 'Diário de Simulados', icon: Award, badge: simulados.length },
      ],
    },
  ];

  const currentTabTitle = (() => {
    for (const sec of sidebarSections) {
      const found = sec.items.find((i) => i.id === activeTab);
      if (found) return found.label;
    }
    return 'Catálogo de Cursos';
  })();

  return (
    <div className={`min-h-screen flex transition-colors duration-200 font-sans ${theme.bgMain}`}>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 text-white border border-zinc-700 shadow-2xl animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {liveSession && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl rounded-2xl border border-violet-500/50 bg-[#13131a]/95 text-white backdrop-blur-md px-5 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full animate-ping"
              style={{ backgroundColor: liveSession.subjectColor }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-violet-400">
                  Estudando Agora (Ciclo)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                  {liveSession.tag}
                </span>
              </div>
              <p className="font-bold text-sm sm:text-base">{liveSession.subjectName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-2xl font-extrabold tracking-wider px-3 py-1 rounded-xl bg-black/50 border border-white/10">
              {(() => {
                const hrs = Math.floor(liveSession.elapsedSeconds / 3600);
                const mins = Math.floor((liveSession.elapsedSeconds % 3600) / 60);
                const secs = liveSession.elapsedSeconds % 60;
                return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
              })()}
            </div>

            <button
              onClick={() =>
                setLiveSession((prev) => ({ ...prev, isRunning: !prev.isRunning }))
              }
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
              title={liveSession.isRunning ? 'Pausar' : 'Retomar'}
            >
              {liveSession.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleFinishLiveSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar & Contabilizar no Gráfico
            </button>

            <button
              onClick={() => setLiveSession(null)}
              className="p-2 rounded-xl text-zinc-400 hover:text-red-400 transition"
              title="Cancelar sessão"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${darkMode ? 'bg-[#0c0f0d] border-[#222a25]' : 'bg-[#F3E8CA]/40 border-[#dfd5be]'}`}
      >
        <div className={`h-20 px-4 flex items-center justify-between border-b ${theme.border}`}>
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left overflow-hidden"
          >
            <LumeBrandMark size="sm" showTagline={!sidebarCollapsed} collapsed={sidebarCollapsed} />
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`hidden lg:flex p-2 rounded-xl border transition hover:scale-105 ${theme.bgSubtle}`}
            title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          {activeCourse ? (
            <div
              onClick={() => setActiveTab('home')}
              title="Clique para trocar de curso no catálogo"
              className={`cursor-pointer rounded-2xl p-3 border transition hover:border-[#D8B979]/60 bg-gradient-to-br ${
                activeCourse.gradient || 'from-[#A67522] via-[#36423B] to-[#0c0e0d]'
              } text-[#F5F5F0] border-[#D8B979]/25 shadow-md`}
            >
              {sidebarCollapsed ? (
                <div className="flex flex-col items-center justify-center py-1">
                  <BookOpen className="w-5 h-5 text-[#F3E8CA]" />
                  <span className="text-[10px] font-bold mt-1">{cycleStats.percentage}%</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#F3E8CA]/80 mb-1">
                    <span>Curso Ativo</span>
                    <span className="px-1.5 py-0.5 rounded bg-black/30 text-[#F3E8CA]">Catálogo</span>
                  </div>
                  <p className="font-bold text-sm truncate">{activeCourse.name}</p>
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[11px] text-[#F3E8CA]/90 mb-1">
                      <span>Progresso do Ciclo</span>
                      <span className="font-mono font-bold">{cycleStats.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F3E8CA] transition-all duration-500"
                        style={{ width: `${cycleStats.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowNewCourseModal(true)}
              className={`w-full rounded-2xl p-3 border border-dashed text-left transition hover:border-[#D8B979] ${theme.border}`}
            >
              {sidebarCollapsed ? (
                <Plus className="w-5 h-5 mx-auto text-[#D8B979]" />
              ) : (
                <div>
                  <p className="text-xs font-bold text-[#D8B979]">+ Criar 1º Curso</p>
                  <p className={`text-[11px] mt-0.5 ${theme.textMuted}`}>
                    Comece sua jornada na LumeLearning
                  </p>
                </div>
              )}
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 no-scrollbar">
          {sidebarSections.map((section) => (
            <div key={section.group}>
              {!sidebarCollapsed && (
                <p
                  className={`px-3 mb-2 text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}
                >
                  {section.group}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      title={sidebarCollapsed ? item.label : ''}
                      className={`w-full flex items-center ${
                        sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                      } py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-white shadow-md'
                          : `${theme.textMuted} hover:bg-zinc-800/40 hover:text-zinc-200`
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: currentAccent.brightHex || currentAccent.hex,
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.badge !== undefined && (
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-black/25 text-white'
                              : darkMode
                              ? 'bg-zinc-800 text-zinc-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`p-3 border-t space-y-2.5 ${theme.border}`}>
          {!sidebarCollapsed && (
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${theme.bgSubtle}`}>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${theme.textMuted}`}>
                <Palette className="w-3.5 h-3.5" /> Cor
              </span>
              <div className="flex items-center gap-1.5">
                {THEME_ACCENTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setAccentId(acc.id)}
                    title={acc.name}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      accentId === acc.id
                        ? 'scale-125 ring-2 ring-white/90'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: acc.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${theme.bgSubtle}`}
              title="Alternar tema claro/escuro"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  {!sidebarCollapsed && <span>Claro</span>}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
                  {!sidebarCollapsed && <span>Escuro</span>}
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition"
              title="Sair da conta / Trocar usuário"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-md ${
            darkMode ? 'bg-[#080908]/90 border-[#222a25]' : 'bg-[#F5F5F0]/90 border-[#e2dccd]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-xl border ${theme.bgSubtle}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base sm:text-lg tracking-tight">
                    {currentTabTitle}
                  </h2>
                  {activeCourse && (
                    <span
                      className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: currentAccent.brightHex || currentAccent.hex }}
                    >
                      {activeCourse.name}
                    </span>
                  )}
                  <span className={`text-[11px] hidden md:inline ${theme.textMuted}`}>
                    {isSyncing ? '• Salvando na nuvem...' : `• @${currentAccount.username}`}
                  </span>
                </div>
                <p className={`text-xs hidden sm:block ${theme.textMuted}`}>
                  {activeCourse
                    ? `${activeCourse.subjects.length} matérias no curso • ${activeCourse.totalHours}h planejadas no ciclo`
                    : 'LumeLearning — Organize. Aprenda. Evolua.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeTab !== 'home' && (
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition hover:border-violet-500 ${theme.bgSubtle}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-violet-400" />
                  <span>Catálogo</span>
                </button>
              )}

              {courses.length > 0 && (
                <select
                  value={activeCourse?.id || ''}
                  onChange={(e) => setActiveCourseId(e.target.value)}
                  className={`text-xs font-semibold rounded-xl px-3 py-2 border outline-none transition ${theme.bgInput}`}
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      🎬 {course.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => setShowNewCourseModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow transition hover:brightness-110"
                style={{ backgroundColor: currentAccent.brightHex || currentAccent.hex }}
              >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Curso</span>
              </button>
            </div>
          </div>
        </header>

        {showNewCourseModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-lg rounded-2xl border p-6 ${theme.bgCard}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-amber-400" />
                  Criar Novo Curso no Catálogo
                </h3>
                <button onClick={() => setShowNewCourseModal(false)} className={theme.textMuted}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Título do Curso / Objetivo
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Ex: ENEM 2026, Medicina, Concurso Polícia Federal, Faculdade..."
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${theme.bgInput}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Categoria / Área
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Pré-Vestibular, Concursos, Tecnologia..."
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${theme.bgInput}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Descrição / Meta Pessoal
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Descreva sua meta principal neste curso..."
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border text-xs outline-none ${theme.bgInput}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Cor da Capa no Catálogo
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {COURSE_GRADIENTS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setNewCourseGradient(g)}
                        className={`h-12 rounded-xl bg-gradient-to-br ${g.gradient} border flex items-center justify-center transition ${
                          newCourseGradient.id === g.id
                            ? 'ring-2 ring-white scale-105 border-white'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                        title={g.label}
                      >
                        {newCourseGradient.id === g.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewCourseModal(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border ${theme.bgSubtle}`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: currentAccent.brightHex || currentAccent.hex }}
                  >
                    Criar Curso
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
          {activeTab === 'home' && (
            <NetflixCatalogHome
              theme={theme}
              currentAccent={currentAccent}
              userName={userName}
              courses={courses}
              activeCourse={activeCourse}
              cycleStats={cycleStats}
              subjectsWithCalculatedSessions={subjectsWithCalculatedSessions}
              onSelectCourse={handleSelectCourseFromCatalog}
              onOpenNewCourse={() => setShowNewCourseModal(true)}
              onDeleteCourse={handleDeleteCourseById}
              onStartSubjectStudy={handleStartSubjectStudy}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'dashboard' && (
            <PerformanceDashboardModule
              theme={theme}
              darkMode={darkMode}
              currentAccent={currentAccent}
              userName={userName}
              setUserName={setUserName}
              subjects={subjectsWithCalculatedSessions}
              studyLogs={studyLogs}
              setStudyLogs={setStudyLogs}
              simulados={simulados}
              setSimulados={setSimulados}
              essays={essays}
              setEssays={setEssays}
              onStartSubjectStudy={handleStartSubjectStudy}
              recordStudyTimeLog={recordStudyTimeLog}
              showToast={showToast}
            />
          )}

          {activeTab === 'cycle' && (
            <div className="space-y-6">
              {!activeCourse ? (
                <div className={`rounded-3xl border p-10 text-center space-y-4 ${theme.bgCard}`}>
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/15 text-violet-400 flex items-center justify-center mx-auto">
                    <FolderPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Você ainda não criou nenhum curso</h3>
                  <p className={`text-xs sm:text-sm max-w-md mx-auto ${theme.textMuted}`}>
                    Crie seu primeiro curso (ex: ENEM, Concurso, Faculdade) para começar a adicionar suas matérias e montar seu ciclo proporcional.
                  </p>
                  <button
                    onClick={() => setShowNewCourseModal(true)}
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-lg"
                    style={{ backgroundColor: currentAccent.brightHex || currentAccent.hex }}
                  >
                    + Criar Meu Primeiro Curso
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className={`lg:col-span-7 rounded-2xl border p-6 ${theme.bgCard}`}>
                      <div className="flex items-center gap-2.5 mb-6">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-bold tracking-tight">Adicionar Matéria</h2>
                      </div>

                      <form onSubmit={handleAddSubject} className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Nome da Matéria
                          </label>
                          <input
                            type="text"
                            placeholder="Exemplo: Matemática"
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:border-amber-400 ${theme.bgInput}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold mb-2.5">Dificuldade</label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const active = subDifficulty === num;
                                return (
                                  <button
                                    key={num}
                                    type="button"
                                    onClick={() => setSubDifficulty(num)}
                                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all border ${
                                      active
                                        ? 'bg-[#f97316] text-white border-[#fb923c] shadow-lg shadow-orange-500/20 scale-105'
                                        : `${theme.bgInput} hover:border-zinc-500 opacity-75`
                                    }`}
                                  >
                                    {num}
                                  </button>
                                );
                              })}
                            </div>
                            <p className={`text-xs mt-2 ${theme.textMuted}`}>
                              1 = Fácil, 5 = Muito difícil
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2.5">
                              Quantidade de Conteúdo
                            </label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const active = subContent === num;
                                return (
                                  <button
                                    key={num}
                                    type="button"
                                    onClick={() => setSubContent(num)}
                                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all border ${
                                      active
                                        ? 'bg-[#6366f1] text-white border-[#818cf8] shadow-lg shadow-indigo-500/20 scale-105'
                                        : `${theme.bgInput} hover:border-zinc-500 opacity-75`
                                    }`}
                                  >
                                    {num}
                                  </button>
                                );
                              })}
                            </div>
                            <p className={`text-xs mt-2 ${theme.textMuted}`}>
                              1 = Pouco conteúdo, 5 = Muito conteúdo
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2.5">Cor</label>
                          <div className="flex items-center flex-wrap gap-3">
                            {SUBJECT_COLORS.map((c) => {
                              const selected = subColor === c.hex;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setSubColor(c.hex)}
                                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                    selected
                                      ? 'ring-2 ring-offset-2 ring-zinc-300 ring-offset-[#121215] scale-110'
                                      : 'opacity-85 hover:opacity-100 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                >
                                  {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2.5">Ícone</label>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {SUBJECT_ICONS.map((ic) => {
                              const selected = subIcon === ic.id;
                              return (
                                <button
                                  key={ic.id}
                                  type="button"
                                  onClick={() => setSubIcon(ic.id)}
                                  title={ic.label}
                                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border transition-all ${
                                    selected
                                      ? 'bg-zinc-100 text-amber-600 border-amber-400 ring-2 ring-amber-400/50 font-bold'
                                      : `${theme.bgInput} hover:border-zinc-500 opacity-75`
                                  }`}
                                >
                                  <SubjectIconRender iconId={ic.id} className="w-4 h-4" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Peso / Prioridade</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={subWeight}
                            onChange={(e) => setSubWeight(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${theme.bgInput}`}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition hover:brightness-110 shadow-md"
                          style={{
                            backgroundColor: currentAccent.btnBg,
                            color: currentAccent.btnText,
                            border: `1px solid ${currentAccent.border}`,
                          }}
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          Adicionar Matéria
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                      <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
                        <div className="flex items-center gap-2.5 mb-6">
                          <Clock className="w-5 h-5 text-amber-400" />
                          <h2 className="text-xl font-bold tracking-tight">Tempo Total do Ciclo</h2>
                        </div>

                        <div className="flex items-baseline justify-between mb-3">
                          <span className={`text-sm font-medium ${theme.textMuted}`}>
                            Total de Horas
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold tracking-tight">
                              {activeCourse?.totalHours || 60}
                            </span>
                            <span className={`text-lg font-medium ${theme.textMuted}`}>h</span>
                          </div>
                        </div>

                        <div className="my-4">
                          <input
                            type="range"
                            min={10}
                            max={120}
                            step={2}
                            value={activeCourse?.totalHours || 60}
                            onChange={(e) => handleUpdateTotalHours(e.target.value)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-800 accent-white"
                          />
                          <div className={`flex justify-between text-xs font-mono mt-2 ${theme.textMuted}`}>
                            <span>10h</span>
                            <span>20h</span>
                            <span>60h</span>
                            <span>100h+</span>
                          </div>
                        </div>

                        <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${theme.bgSubtle}`}>
                          <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                            i
                          </div>
                          <div className="text-xs leading-relaxed">
                            <p className="font-bold mb-1">Como funciona o cálculo?</p>
                            <p className={theme.textMuted}>
                              O algoritmo distribui o tempo proporcionalmente com base na dificuldade,
                              quantidade de conteúdo e peso de cada matéria cadastrada no curso.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-cyan-400" />
                          Distribuição Proporcional do Ciclo
                        </h3>
                        {subjectsWithCalculatedSessions.length === 0 ? (
                          <p className={`text-xs ${theme.textMuted}`}>
                            Nenhuma matéria cadastrada neste curso ainda.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {subjectsWithCalculatedSessions.map((s) => {
                              const share = Math.round(
                                (s.totalSessions / (cycleStats.totalSessions || 1)) * 100
                              );
                              return (
                                <div key={s.id} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-semibold flex items-center gap-2">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full inline-block"
                                        style={{ backgroundColor: s.color }}
                                      />
                                      {s.name}
                                    </span>
                                    <span className={theme.textMuted}>
                                      {s.totalSessions}h ({share}%)
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-300"
                                      style={{
                                        width: `${share}%`,
                                        backgroundColor: s.color,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                          <h2 className="text-xl font-bold tracking-tight">Seu Ciclo de Estudos</h2>
                        </div>
                        <p className={`text-xs sm:text-sm mt-1 ${theme.textMuted}`}>
                          Clique em <strong>"Iniciar Estudo"</strong> na matéria para cronometrar ou clique nos blocos para marcar 1h concluída.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <label className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border cursor-pointer ${theme.bgSubtle}`}>
                          <input
                            type="checkbox"
                            checked={autoLogBoxClick}
                            onChange={(e) => setAutoLogBoxClick(e.target.checked)}
                            className="rounded accent-violet-600"
                          />
                          <span>Somar 1h no Gráfico ao marcar bloco</span>
                        </label>

                        <button
                          onClick={handleResetCycle}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Resetar Ciclo
                        </button>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 mb-6 ${theme.bgSubtle}`}>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <span className={`text-xs font-extrabold uppercase tracking-wider block mb-1 ${theme.textMuted}`}>
                            PROGRESSO TOTAL
                          </span>
                          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            {cycleStats.percentage}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs block mb-1 ${theme.textMuted}`}>
                            Sessões Concluídas
                          </span>
                          <span className="text-sm font-bold font-mono">
                            {cycleStats.completedCount} / {cycleStats.totalSessions}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 rounded-full bg-zinc-800/90 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cycleStats.percentage}%`,
                            backgroundColor: currentAccent.brightHex || currentAccent.hex,
                          }}
                        />
                      </div>
                    </div>

                    {subjectsWithCalculatedSessions.length === 0 ? (
                      <div className={`text-center py-12 rounded-2xl border border-dashed ${theme.border}`}>
                        <p className="font-bold text-base mb-1">Nenhuma matéria no ciclo ainda</p>
                        <p className={`text-xs ${theme.textMuted}`}>
                          Use o formulário "Adicionar Matéria" acima para criar seu ciclo de estudos.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {subjectsWithCalculatedSessions.map((sub) => {
                          const doneCount = sub.completedSessions.filter(
                            (idx) => idx < sub.totalSessions
                          ).length;
                          const subPercent =
                            sub.totalSessions > 0
                              ? Math.round((doneCount / sub.totalSessions) * 100)
                              : 0;

                          const rowsOfFive = [];
                          for (let i = 0; i < sub.totalSessions; i += 5) {
                            rowsOfFive.push(
                              Array.from(
                                { length: Math.min(5, sub.totalSessions - i) },
                                (_, k) => i + k
                              )
                            );
                          }

                          return (
                            <div
                              key={sub.id}
                              className={`rounded-2xl border p-5 flex flex-col justify-between ${theme.bgSubtle}`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-4">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                                      style={{ backgroundColor: sub.color }}
                                    >
                                      <SubjectIconRender iconId={sub.icon} className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-base leading-snug">{sub.name}</h3>
                                      <span className={`text-[11px] font-mono uppercase tracking-wider ${theme.textMuted}`}>
                                        {sub.totalSessions} SESSÕES
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${theme.bgCard}`}
                                    >
                                      {subPercent}%
                                    </span>
                                    <button
                                      onClick={() => handleDeleteSubject(sub.id)}
                                      title="Remover matéria"
                                      className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:text-red-400 transition"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                  {rowsOfFive.map((row, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className={`inline-flex items-center gap-1.5 p-1.5 rounded-xl border w-full justify-start ${theme.bgCard}`}
                                    >
                                      {row.map((boxIdx) => {
                                        const isDone = sub.completedSessions.includes(boxIdx);
                                        return (
                                          <button
                                            key={boxIdx}
                                            type="button"
                                            onClick={() => handleToggleSessionBox(sub.id, boxIdx)}
                                            title={`Sessão ${boxIdx + 1} (${isDone ? 'Concluída' : 'Pendente'})`}
                                            className={`w-7 h-7 rounded-md border transition-all flex items-center justify-center ${
                                              isDone
                                                ? 'scale-95 shadow-sm'
                                                : 'bg-[#1a1a1f] border-[#2b2b33] hover:border-zinc-500'
                                            }`}
                                            style={
                                              isDone
                                                ? {
                                                    backgroundColor: sub.color,
                                                    borderColor: sub.color,
                                                  }
                                                : {}
                                            }
                                          >
                                            {isDone && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className={`mt-4 pt-3 border-t space-y-3 ${theme.border}`}>
                                <div className={`flex items-center justify-between text-[11px] ${theme.textMuted}`}>
                                  <span>Dif: {sub.difficulty}/5 • Cont: {sub.content}/5</span>
                                  <span>Peso {sub.weight}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleStartSubjectStudy(sub)}
                                    className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow transition hover:brightness-110"
                                    style={{ backgroundColor: currentAccent.brightHex || currentAccent.hex }}
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    Iniciar Estudo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      recordStudyTimeLog({
                                        subjectId: sub.id,
                                        minutes: 60,
                                        tag: 'Ciclo',
                                        markCycleBox: true,
                                      })
                                    }
                                    title="Registrar +1h rapidamente no gráfico de hoje e marcar 1 bloco"
                                    className={`py-2.5 px-2.5 rounded-xl border text-xs font-bold transition hover:border-violet-400 ${theme.bgCard}`}
                                  >
                                    +1h Gráfico
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'pomodoro' && (
            <PomodoroModule
              theme={theme}
              currentAccent={currentAccent}
              subjects={subjectsWithCalculatedSessions}
              onCompleteSession={markNextSessionForSubject}
              showToast={showToast}
            />
          )}

          {activeTab === 'essays' && (
            <DedicatedEssaysModule
              theme={theme}
              currentAccent={currentAccent}
              essays={essays}
              setEssays={setEssays}
              showToast={showToast}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionBankModule
              theme={theme}
              currentAccent={currentAccent}
              subjects={subjectsWithCalculatedSessions}
              questions={questions}
              setQuestions={setQuestions}
              questionLogs={questionLogs}
              setQuestionLogs={setQuestionLogs}
              showToast={showToast}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksModule
              theme={theme}
              currentAccent={currentAccent}
              subjects={subjectsWithCalculatedSessions}
              taskLists={taskLists}
              setTaskLists={setTaskLists}
              tasks={tasks}
              setTasks={setTasks}
              showToast={showToast}
            />
          )}

          {activeTab === 'journal' && (
            <JournalModule
              theme={theme}
              currentAccent={currentAccent}
              simulados={simulados}
              setSimulados={setSimulados}
              essays={essays}
              setEssays={setEssays}
              questionLogs={questionLogs}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// TELA DE LOGIN & CRIAR CONTA COM IDENTIDADE VISUAL LUME LEARNING
// ============================================================================
function AuthLoginScreen({ authReady, firebaseUser, onLoginSuccess }) {
  useEffect(() => {
    applyLumeBrowserBranding('lume learning — Organize. Aprenda. Evolua.');
  }, []);

  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setErrorMsg('Informe um nome de usuário ou e-mail válido (mínimo 3 caracteres).');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (!db || !auth) {
      setErrorMsg(
        'Para salvar contas no seu site publicado (GitHub Pages), cole suas chaves gratuitas do Firebase em MY_PRODUCTION_FIREBASE_CONFIG no topo do arquivo App.jsx.'
      );
      return;
    }
    if (!authReady || !firebaseUser) {
      setErrorMsg('Conectando ao servidor seguro, tente novamente em 1 segundo...');
      return;
    }

    const accountKey = normalizeAccountKey(cleanUser);
    setLoading(true);

    try {
      const accountRef = doc(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'studyflix_accounts',
        accountKey
      );
      const snap = await getDoc(accountRef);

      if (mode === 'register') {
        if (snap.exists()) {
          setErrorMsg('Este usuário/e-mail já está cadastrado. Mude para "Entrar na Conta".');
          setLoading(false);
          return;
        }

        const finalName = displayName.trim() || cleanUser.split('@')[0];
        const blankWorkspace = createBlankUserWorkspace(finalName);

        await setDoc(accountRef, {
          accountKey,
          username: cleanUser,
          passwordHash: btoa(unescape(encodeURIComponent(password))),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workspace: JSON.stringify(blankWorkspace),
        });

        onLoginSuccess(
          {
            accountKey,
            username: cleanUser,
            passwordHash: btoa(unescape(encodeURIComponent(password))),
          },
          blankWorkspace
        );
      } else {
        if (!snap.exists()) {
          setErrorMsg('Conta não encontrada. Clique em "Criar Conta do Zero" para se cadastrar.');
          setLoading(false);
          return;
        }

        const data = snap.data();
        const encodedPass = btoa(unescape(encodeURIComponent(password)));
        if (data.passwordHash !== encodedPass) {
          setErrorMsg('Senha incorreta para este usuário.');
          setLoading(false);
          return;
        }

        const parsedWorkspace = data.workspace
          ? JSON.parse(data.workspace)
          : createBlankUserWorkspace(cleanUser);

        onLoginSuccess(
          {
            accountKey,
            username: data.username || cleanUser,
            passwordHash: data.passwordHash,
          },
          parsedWorkspace
        );
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setErrorMsg('Não foi possível acessar o banco de dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070807] text-[#F5F5F0] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#A67522]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#36423B]/35 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-[#2a332e] bg-[#111513]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-6">
          <LumeBrandMark size="lg" showTagline={true} />
        </div>

        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#171c19] border border-[#2a332e] mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              mode === 'login'
                ? 'bg-[#A67522] text-[#F5F5F0] shadow'
                : 'text-[#9ca6a0] hover:text-[#F3E8CA]'
            }`}
          >
            Entrar na Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              mode === 'register'
                ? 'bg-[#A67522] text-[#F5F5F0] shadow'
                : 'text-[#9ca6a0] hover:text-[#F3E8CA]'
            }`}
          >
            Criar Conta do Zero
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#F3E8CA] mb-1.5">
                Como você quer ser chamado(a)?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D8B979] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Ex: leminhos, Maria, João..."
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#2d3832] bg-[#171c19] text-sm outline-none focus:border-[#D8B979]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#F3E8CA] mb-1.5">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D8B979] absolute left-3.5 top-3.5" />
              <input
                type="text"
                autoFocus
                placeholder="Ex: leminhos ou seuemail@dominio.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#2d3832] bg-[#171c19] text-sm outline-none focus:border-[#D8B979]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F3E8CA] mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D8B979] absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="Mínimo 4 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#2d3832] bg-[#171c19] text-sm outline-none focus:border-[#D8B979]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#F3E8CA] hover:bg-[#D8B979] text-[#232b26] shadow-lg transition disabled:opacity-50"
          >
            {loading
              ? 'Carregando seu espaço Lume...'
              : mode === 'register'
              ? 'Criar Conta Limpa (Do Zero) & Entrar'
              : 'Acessar LumeLearning'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#26302a] flex items-start gap-2.5 text-[11px] text-[#9ca6a0]">
          <ShieldCheck className="w-4 h-4 text-[#D8B979] shrink-0 mt-0.5" />
          <p>
            Bem-vindo à <strong>LumeLearning</strong>: seus cursos, ciclos de estudo, gráficos e redações ficam salvos individualmente na sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HOMEPAGE CATÁLOGO ESTILO NETFLIX PARA SELECIONAR OU CRIAR CURSOS DO ZERO
// ============================================================================
function NetflixCatalogHome({
  theme,
  currentAccent,
  userName,
  courses,
  activeCourse,
  cycleStats,
  subjectsWithCalculatedSessions,
  onSelectCourse,
  onOpenNewCourse,
  onDeleteCourse,
  onStartSubjectStudy,
  setActiveTab,
}) {
  const activePurple = currentAccent.brightHex || currentAccent.hex;

  const getCourseMetrics = (course) => {
    const totalHours = course.totalHours || 60;
    const rawScores = (course.subjects || []).map((sub) => ({
      ...sub,
      score: (Number(sub.difficulty) + Number(sub.content)) * Number(sub.weight),
    }));
    const totalScore = rawScores.reduce((acc, s) => acc + s.score, 0) || 1;
    let allocated = 0;
    const calcSubs = rawScores.map((sub, idx) => {
      if (idx === rawScores.length - 1) {
        return { ...sub, totalSessions: Math.max(1, totalHours - allocated) };
      }
      const sessions = Math.max(1, Math.round((sub.score / totalScore) * totalHours));
      allocated += sessions;
      return { ...sub, totalSessions: sessions };
    });

    const totalSessions = calcSubs.reduce((acc, s) => acc + s.totalSessions, 0);
    const completed = calcSubs.reduce(
      (acc, s) => acc + s.completedSessions.filter((i) => i < s.totalSessions).length,
      0
    );
    const pct = totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0;
    return { totalSessions, completed, pct };
  };

  return (
    <div className="space-y-8 pb-8">
      {activeCourse ? (
        <div
          className={`relative rounded-3xl overflow-hidden border border-[#D8B979]/25 bg-gradient-to-r ${
            activeCourse.gradient || 'from-[#A67522] via-[#36423B] to-[#0c0e0d]'
          } text-[#F5F5F0] p-6 sm:p-10 shadow-2xl`}
        >
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: activeCourse.accentColor || activePurple }}
          />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-widest uppercase bg-[#F3E8CA] text-[#232b26] shadow">
                TRILHA EM DESTAQUE • LUME
              </span>
              <span className="text-xs font-bold text-[#F3E8CA]">
                {cycleStats.percentage}% concluído deste ciclo
              </span>
              <span className="text-xs text-white/75">
                • {activeCourse.totalHours || 60} Horas no Ciclo • {activeCourse.subjects.length || 0} Matérias
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {activeCourse.name}
            </h1>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              {activeCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeCourse.subjects.length === 0 ? (
                <span className="text-xs text-[#F3E8CA] font-semibold">
                  Nenhuma matéria cadastrada ainda — clique em "Gerenciar Ciclo & Matérias" abaixo!
                </span>
              ) : (
                activeCourse.subjects.map((sub) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/40 border border-white/15 backdrop-blur-sm"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                    {sub.name}
                  </span>
                ))
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => {
                  if (subjectsWithCalculatedSessions.length > 0) {
                    onStartSubjectStudy(subjectsWithCalculatedSessions[0]);
                  } else {
                    setActiveTab('cycle');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm bg-[#F3E8CA] text-[#232b26] hover:bg-[#D8B979] transition shadow-xl"
              >
                <Play className="w-4 h-4 fill-current" />
                {subjectsWithCalculatedSessions.length > 0
                  ? 'Iniciar Sessão Agora'
                  : 'Adicionar Matérias ao Curso'}
              </button>

              <button
                onClick={() => setActiveTab('cycle')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Gerenciar Ciclo & Matérias
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-black/40 hover:bg-black/60 text-white border border-white/15 transition"
              >
                <BarChart3 className="w-4 h-4 text-[#D8B979]" />
                Ver Gráfico da Semana
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border border-[#D8B979]/30 bg-gradient-to-r from-[#36423B] via-[#1b221e] to-[#0c0f0d] text-[#F5F5F0] p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-md text-[11px] font-black tracking-widest uppercase bg-[#F3E8CA] text-[#232b26]">
              LUME LEARNING • ORGANIZE. APRENDA. EVOLUA.
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F3E8CA]">
              Olá, {userName}! Crie seu primeiro Curso de Estudos
            </h1>
            <p className="text-sm sm:text-base text-[#F5F5F0]/80 leading-relaxed">
              Seu espaço na <strong>LumeLearning</strong> está 100% limpo e pronto. Crie quantos cursos quiser no seu catálogo (Vestibular, ENEM, Concurso, Idiomas ou Faculdade), adicione suas matérias e acompanhe seu ciclo e gráficos!
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenNewCourse}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm bg-[#F3E8CA] text-[#232b26] hover:bg-[#D8B979] transition shadow-xl"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Criar Meu Primeiro Curso Agora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              🎬 Catálogo de Cursos de {userName}
            </h2>
            <p className={`text-xs ${theme.textMuted}`}>
              Selecione o curso que deseja estudar agora ou adicione uma nova trilha personalizada.
            </p>
          </div>

          <button
            onClick={onOpenNewCourse}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition hover:scale-105"
            style={{ backgroundColor: activePurple }}
          >
            <Plus className="w-4 h-4" />
            Adicionar Curso
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isSelected = course.id === activeCourse?.id;
            const metrics = getCourseMetrics(course);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id, 'cycle')}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-violet-500 border-violet-500'
                    : theme.bgCard
                }`}
              >
                <div
                  className={`relative h-44 p-5 flex flex-col justify-between bg-gradient-to-br ${
                    course.gradient || 'from-violet-900 via-indigo-950 to-zinc-950'
                  } text-white`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-black/50 backdrop-blur-sm border border-white/15">
                      {course.badge || 'MEU CURSO'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-black">
                          ✓ ATIVO
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCourse(course.id);
                        }}
                        title="Excluir este curso"
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-red-500/80 text-white/80 hover:text-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-white/75 block">
                      {course.category || 'Objetivo Principal'}
                    </span>
                    <h3 className="text-xl font-black tracking-tight leading-snug group-hover:text-amber-300 transition">
                      {course.name}
                    </h3>
                  </div>

                  <div className="absolute right-4 bottom-4 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 transition">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${theme.textMuted}`}>
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {course.subjects.length === 0 ? (
                        <span className={`text-[11px] italic ${theme.textMuted}`}>
                          Clique para cadastrar as matérias deste curso
                        </span>
                      ) : (
                        course.subjects.slice(0, 4).map((s) => (
                          <span
                            key={s.id}
                            className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${theme.bgSubtle}`}
                          >
                            {s.name}
                          </span>
                        ))
                      )}
                      {course.subjects.length > 4 && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-md ${theme.textMuted}`}>
                          +{course.subjects.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                    <div className="flex justify-between text-xs">
                      <span className={theme.textMuted}>
                        {course.subjects.length} matérias • {course.totalHours}h
                      </span>
                      <span className="font-bold text-emerald-400">
                        {metrics.completed}/{metrics.totalSessions}h ({metrics.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${metrics.pct}%`,
                          backgroundColor: course.accentColor || activePurple,
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourse(course.id, 'cycle');
                        }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:brightness-110"
                        style={{ backgroundColor: activePurple }}
                      >
                        Abrir Ciclo & Matérias
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourse(course.id, 'dashboard');
                        }}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition hover:border-violet-400 ${theme.bgSubtle}`}
                      >
                        Gráficos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={onOpenNewCourse}
            className={`min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition hover:border-violet-500 hover:bg-violet-500/5 ${theme.border}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-violet-500/15 text-violet-400 flex items-center justify-center mb-3">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base">Criar Novo Curso / Trilha</h3>
            <p className={`text-xs text-center mt-1 max-w-xs ${theme.textMuted}`}>
              Adicione um vestibular, faculdade, concurso ou idioma ao seu catálogo pessoal.
            </p>
          </button>
        </div>
      </div>

      {subjectsWithCalculatedSessions.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              ▶️ Continuar Estudando — Matérias de {activeCourse?.name}
            </h2>
            <p className={`text-xs ${theme.textMuted}`}>
              Inicie uma sessão cronometrada em qualquer matéria para alimentar seu gráfico semanal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectsWithCalculatedSessions.map((sub, idx) => {
              const done = sub.completedSessions.filter((i) => i < sub.totalSessions).length;
              const pct = sub.totalSessions > 0 ? Math.round((done / sub.totalSessions) * 100) : 0;
              return (
                <div
                  key={sub.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition hover:border-zinc-500 ${theme.bgCard}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`font-mono font-bold ${theme.textMuted}`}>
                        MATÉRIA {idx + 1}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: sub.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <h4 className="font-bold text-base truncate">{sub.name}</h4>
                    <p className={`text-xs mt-1 ${theme.textMuted}`}>
                      {done} de {sub.totalSessions} sessões concluídas
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mt-3">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: sub.color }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onStartSubjectStudy(sub)}
                    className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 transition hover:brightness-110"
                    style={{ backgroundColor: sub.color }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Estudar {sub.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight">
          ⚡ Ferramentas & Categorias de Estudo
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { id: 'cycle', title: 'Ciclo de Estudos', desc: 'Matérias & Horas', icon: CheckCircle2, color: '#06b6d4' },
            { id: 'dashboard', title: 'Tempo de Estudo', desc: 'Gráfico Semanal', icon: BarChart3, color: '#8b5cf6' },
            { id: 'pomodoro', title: 'Pomodoro', desc: 'Timer & Cronômetro', icon: Timer, color: '#f97316' },
            { id: 'questions', title: 'Banco de Questões', desc: 'Caderno & Acertos', icon: HelpCircle, color: '#10b981' },
            { id: 'tasks', title: 'Lista de Tarefas', desc: 'Prazos & Subtarefas', icon: ListTodo, color: '#3b82f6' },
            { id: 'essays', title: 'Redações & Simulados', desc: 'Notas & Evolução', icon: PenTool, color: '#ec4899' },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`p-4 rounded-2xl border text-left transition hover:-translate-y-1 hover:border-zinc-500 ${theme.bgCard}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow"
                  style={{ backgroundColor: tool.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm leading-tight">{tool.title}</h4>
                <p className={`text-[11px] mt-0.5 ${theme.textMuted}`}>{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MÓDULO A: DASHBOARD DE DESEMPENHO (IDÊNTICO À PRINT 4)
// ============================================================================
function PerformanceDashboardModule({
  theme,
  darkMode,
  currentAccent,
  userName,
  setUserName,
  subjects,
  studyLogs,
  setStudyLogs,
  simulados,
  setSimulados,
  essays,
  setEssays,
  onStartSubjectStudy,
  recordStudyTimeLog,
  showToast,
}) {
  const [editingName, setEditingName] = useState(false);
  const [dashTab, setDashTab] = useState('tempo');

  const [periodFilter, setPeriodFilter] = useState('Semana');
  const [groupFilter, setGroupFilter] = useState('Tempo por período');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [tagFilter, setTagFilter] = useState('ALL');
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewType, setViewType] = useState('grafico');

  const [quickSubjectId, setQuickSubjectId] = useState(subjects[0]?.id || '');
  const [quickMinutes, setQuickMinutes] = useState(60);
  const [quickTag] = useState('Ciclo');

  useEffect(() => {
    if (!quickSubjectId && subjects.length > 0) {
      setQuickSubjectId(subjects[0].id);
    }
  }, [subjects, quickSubjectId]);

  const weekDays = useMemo(() => {
    const baseMonday = getMondayOfCurrentWeek(new Date());
    baseMonday.setDate(baseMonday.getDate() + weekOffset * 7);

    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(baseMonday);
      d.setDate(baseMonday.getDate() + i);
      const iso = formatDateISO(d);
      const dayNumber = String(d.getDate()).padStart(2, '0');
      const fullBR = `${dayNumber}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      return {
        label: `${dayNames[i]} ${dayNumber}`,
        iso,
        fullBR,
      };
    });
  }, [weekOffset]);

  const dateRangeLabel = `${weekDays[0].fullBR} – ${weekDays[6].fullBR}`;

  const filteredWeekLogs = useMemo(() => {
    const validISOs = new Set(weekDays.map((d) => d.iso));
    return studyLogs.filter((log) => {
      if (!validISOs.has(log.date)) return false;
      if (subjectFilter !== 'ALL' && log.subjectName !== subjectFilter) return false;
      if (tagFilter !== 'ALL' && log.tag !== tagFilter) return false;
      return true;
    });
  }, [studyLogs, weekDays, subjectFilter, tagFilter]);

  const chartColumns = useMemo(() => {
    if (groupFilter === 'Tempo por matéria') {
      return subjects.map((sub) => {
        const mins = filteredWeekLogs
          .filter((l) => l.subjectName === sub.name)
          .reduce((acc, l) => acc + l.minutes, 0);
        return {
          key: sub.id,
          label: sub.name,
          minutes: mins,
          color: sub.color,
        };
      });
    }

    return weekDays.map((d) => {
      const mins = filteredWeekLogs
        .filter((l) => l.date === d.iso)
        .reduce((acc, l) => acc + l.minutes, 0);
      return {
        key: d.iso,
        label: d.label,
        minutes: mins,
        color: currentAccent.brightHex || '#6229f6',
      };
    });
  }, [groupFilter, subjects, weekDays, filteredWeekLogs, currentAccent]);

  const maxMinutes = useMemo(() => {
    const highest = Math.max(...chartColumns.map((c) => c.minutes), 0);
    return Math.max(269, Math.ceil(highest * 1.12));
  }, [chartColumns]);

  const yAxisTicks = useMemo(() => {
    return [
      maxMinutes,
      Math.round(maxMinutes * 0.75),
      Math.round(maxMinutes * 0.5),
      Math.round(maxMinutes * 0.25),
      0,
    ];
  }, [maxMinutes]);

  const activePurple = currentAccent.brightHex || '#6229f6';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
            Bem-vindo,{' '}
            {editingName ? (
              <input
                type="text"
                autoFocus
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
                className="bg-transparent border-b-2 outline-none font-normal w-48"
                style={{ color: activePurple, borderColor: activePurple }}
              />
            ) : (
              <span
                onClick={() => setEditingName(true)}
                title="Clique para editar seu nome"
                className="cursor-pointer font-normal hover:underline"
                style={{ color: activePurple }}
              >
                {userName}
              </span>
            )}
          </h1>
          <button
            onClick={() => setEditingName(!editingName)}
            className={`p-1.5 rounded-lg opacity-50 hover:opacity-100 ${theme.textMuted}`}
            title="Editar nome"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {subjects.length > 0 && (
          <div className={`flex flex-wrap items-center gap-2 p-2 rounded-2xl border ${theme.bgCard}`}>
            <select
              value={quickSubjectId}
              onChange={(e) => setQuickSubjectId(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold outline-none ${theme.bgInput}`}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  Matéria: {s.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                const sub = subjects.find((s) => s.id === quickSubjectId) || subjects[0];
                if (sub) onStartSubjectStudy(sub);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition hover:brightness-110"
              style={{ backgroundColor: activePurple }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Iniciar Estudo (Ciclo)
            </button>

            <div className="flex items-center gap-1 pl-2 border-l border-zinc-700/60">
              <input
                type="number"
                min={5}
                max={600}
                step={15}
                value={quickMinutes}
                onChange={(e) => setQuickMinutes(e.target.value)}
                className={`w-16 px-2 py-1.5 rounded-lg border text-xs font-mono text-center ${theme.bgInput}`}
              />
              <span className={`text-xs ${theme.textMuted}`}>min</span>
              <button
                type="button"
                onClick={() =>
                  recordStudyTimeLog({
                    subjectId: quickSubjectId,
                    minutes: Number(quickMinutes) || 60,
                    tag: quickTag,
                    markCycleBox: true,
                  })
                }
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition hover:border-violet-500 ${theme.bgSubtle}`}
              >
                + Somar no Gráfico
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`rounded-3xl border p-4 sm:p-6 ${
          darkMode ? 'bg-[#0e0e11] border-[#1f1f26]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6">
          {[
            { id: 'tempo', label: 'Tempo de Estudo' },
            { id: 'simulados', label: 'Simulados' },
            { id: 'redacoes', label: 'Redações' },
          ].map((pill) => {
            const isSelected = dashTab === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setDashTab(pill.id)}
                className={`py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all ${
                  isSelected
                    ? 'text-white shadow-lg'
                    : darkMode
                    ? 'bg-[#17171c] text-zinc-400 hover:text-zinc-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={isSelected ? { backgroundColor: activePurple } : {}}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {dashTab === 'tempo' && (
          <div
            className={`rounded-2xl border p-5 sm:p-7 ${
              darkMode ? 'bg-[#141418] border-[#232329]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-md text-xs font-medium outline-none border bg-transparent"
                  style={{ borderColor: activePurple }}
                >
                  <option value="Semana" className="bg-zinc-900 text-white">Semana</option>
                  <option value="Mês" className="bg-zinc-900 text-white">Mês</option>
                </select>

                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-md text-xs font-medium outline-none border bg-transparent"
                  style={{ borderColor: activePurple }}
                >
                  <option value="Tempo por período" className="bg-zinc-900 text-white">
                    Tempo por período
                  </option>
                  <option value="Tempo por matéria" className="bg-zinc-900 text-white">
                    Tempo por matéria
                  </option>
                </select>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-md text-xs font-medium outline-none border bg-transparent"
                  style={{ borderColor: activePurple }}
                >
                  <option value="ALL" className="bg-zinc-900 text-white">
                    Todas as matérias
                  </option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name} className="bg-zinc-900 text-white">
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-md text-xs font-medium outline-none border bg-transparent"
                  style={{ borderColor: activePurple }}
                >
                  <option value="ALL" className="bg-zinc-900 text-white">
                    Todas as tags
                  </option>
                  <option value="Ciclo" className="bg-zinc-900 text-white">Ciclo</option>
                  <option value="Pomodoro" className="bg-zinc-900 text-white">Pomodoro</option>
                  <option value="Teoria" className="bg-zinc-900 text-white">Teoria</option>
                  <option value="Questões" className="bg-zinc-900 text-white">Questões</option>
                  <option value="Revisão" className="bg-zinc-900 text-white">Revisão</option>
                </select>

                <div className="flex items-center gap-1 ml-1">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w - 1)}
                    className={`p-2 rounded-md transition ${
                      darkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className={`p-2 rounded-md transition ${
                      darkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-200'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekOffset(0)}
                    className={`px-3.5 py-2 rounded-md text-xs font-medium transition ${
                      darkMode
                        ? 'bg-[#1a1a20] text-zinc-300 hover:bg-zinc-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Hoje
                  </button>
                </div>
              </div>

              <div className="flex items-center rounded-md overflow-hidden border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setViewType('grafico')}
                  className={`px-4 py-2 text-xs font-bold transition ${
                    viewType === 'grafico'
                      ? 'text-white'
                      : darkMode
                      ? 'bg-[#1a1a20] text-zinc-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                  style={viewType === 'grafico' ? { backgroundColor: activePurple } : {}}
                >
                  Gráfico
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('blocos')}
                  className={`px-4 py-2 text-xs font-bold transition ${
                    viewType === 'blocos'
                      ? 'text-white'
                      : darkMode
                      ? 'bg-[#1a1a20] text-zinc-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                  style={viewType === 'blocos' ? { backgroundColor: activePurple } : {}}
                >
                  Blocos
                </button>
              </div>
            </div>

            <div className={`text-xs mt-3 mb-6 font-medium ${theme.textMuted}`}>
              {dateRangeLabel}
            </div>

            {viewType === 'grafico' ? (
              <div className="relative pt-4 pb-2 select-none">
                <div className="relative h-80 sm:h-96 flex">
                  <div
                    className={`w-14 flex flex-col justify-between text-[11px] font-medium pr-3 text-right pb-8 ${theme.textMuted}`}
                  >
                    {yAxisTicks.map((tick, i) => (
                      <span key={i} className="leading-none">
                        {formatMinutesToHoursLabel(tick)}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1 relative flex flex-col justify-between pb-8">
                    <div className="absolute inset-0 bottom-8 flex flex-col justify-between pointer-events-none">
                      {yAxisTicks.map((_, i) => (
                        <div
                          key={i}
                          className={`w-full border-b ${
                            darkMode ? 'border-zinc-800/80' : 'border-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="relative z-10 flex-1 grid grid-cols-7 gap-2 sm:gap-6 items-end px-2 sm:px-6 pt-6">
                      {chartColumns.map((col) => {
                        const heightPct =
                          maxMinutes > 0
                            ? Math.min(100, (col.minutes / maxMinutes) * 100)
                            : 0;
                        return (
                          <div
                            key={col.key}
                            className="h-full flex flex-col items-center justify-end group"
                          >
                            {col.minutes > 0 && (
                              <span className="text-[11px] sm:text-xs font-medium mb-1.5 text-zinc-200">
                                {formatMinutesToHoursLabel(col.minutes)}
                              </span>
                            )}

                            <div
                              className="w-full max-w-[92px] rounded-t-md transition-all duration-500 relative group-hover:brightness-110"
                              style={{
                                height: col.minutes > 0 ? `${Math.max(heightPct, 4)}%` : '0%',
                                backgroundColor: col.color,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 grid grid-cols-7 gap-2 sm:gap-6 px-2 sm:px-6 text-center">
                      {chartColumns.map((col) => (
                        <span
                          key={col.key}
                          className={`text-[11px] sm:text-xs truncate ${theme.textMuted}`}
                        >
                          {col.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                {filteredWeekLogs.length === 0 ? (
                  <p className={`text-sm py-8 text-center ${theme.textMuted}`}>
                    Nenhum bloco de estudo registrado neste período.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredWeekLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 rounded-xl border flex items-center justify-between ${theme.bgCard}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-10 rounded-full"
                            style={{ backgroundColor: log.subjectColor }}
                          />
                          <div>
                            <h4 className="font-bold text-sm">{log.subjectName}</h4>
                            <span className={`text-xs ${theme.textMuted}`}>
                              {log.date} • Tag: {log.tag}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-violet-400">
                            {formatMinutesToHoursLabel(log.minutes)}
                          </span>
                          <button
                            onClick={() =>
                              setStudyLogs(studyLogs.filter((l) => l.id !== log.id))
                            }
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {dashTab === 'simulados' && (
          <div
            className={`rounded-2xl border p-5 sm:p-7 space-y-6 ${
              darkMode ? 'bg-[#141418] border-[#232329]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <h3 className="text-lg font-bold">Evolução nos Simulados</h3>
              <p className={`text-xs ${theme.textMuted}`}>
                Acompanhe a progressão da sua taxa de acerto a cada prova realizada.
              </p>
            </div>

            {simulados.length === 0 ? (
              <p className={`text-xs py-8 text-center ${theme.textMuted}`}>
                Nenhum simulado registrado ainda. Adicione seus simulados na aba "Diário de Simulados".
              </p>
            ) : (
              <div className="h-64 flex items-end gap-6 pt-8 pb-6 px-4 border-b border-zinc-800">
                {simulados.map((sim) => {
                  const pct = Math.round(
                    (sim.correctQuestions / (sim.totalQuestions || 1)) * 100
                  );
                  return (
                    <div
                      key={sim.id}
                      className="flex-1 max-w-[140px] h-full flex flex-col items-center justify-end"
                    >
                      <span className="text-xs font-bold mb-1.5 text-zinc-200">
                        {sim.correctQuestions}/{sim.totalQuestions} ({pct}%)
                      </span>
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height: `${Math.max(pct, 8)}%`,
                          backgroundColor: activePurple,
                        }}
                      />
                      <span className={`text-xs mt-2 truncate max-w-full ${theme.textMuted}`}>
                        {sim.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {dashTab === 'redacoes' && (
          <DedicatedEssaysModule
            theme={theme}
            currentAccent={currentAccent}
            essays={essays}
            setEssays={setEssays}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MÓDULO DEDICADO: CENTRAL DE REDAÇÕES COMPLETA
// ============================================================================
function DedicatedEssaysModule({ theme, currentAccent, essays, setEssays, showToast }) {
  const [themeTitle, setThemeTitle] = useState('');
  const [modelType, setModelType] = useState('ENEM (0 a 1000)');
  const [axis, setAxis] = useState('Sociedade & Cultura');
  const [timeSpent, setTimeSpent] = useState(55);
  const [c1, setC1] = useState(160);
  const [c2, setC2] = useState(200);
  const [c3, setC3] = useState(160);
  const [c4, setC4] = useState(180);
  const [c5, setC5] = useState(200);
  const [customScore, setCustomScore] = useState(85);
  const [customMax, setCustomMax] = useState(100);
  const [notes, setNotes] = useState('');
  const [draftText, setDraftText] = useState('');
  const [selectedEssay, setSelectedEssay] = useState(null);

  const totalEnemScore = Number(c1) + Number(c2) + Number(c3) + Number(c4) + Number(c5);

  const handleSaveEssay = (e) => {
    e.preventDefault();
    if (!themeTitle.trim()) {
      showToast('Informe o tema da redação.');
      return;
    }

    const isEnem = modelType === 'ENEM (0 a 1000)';
    const newEssay = {
      id: `ess-${Date.now()}`,
      theme: themeTitle.trim(),
      date: formatDateISO(new Date()),
      model: modelType,
      axis,
      timeSpentMinutes: Number(timeSpent) || 60,
      competencies: isEnem
        ? { c1: Number(c1), c2: Number(c2), c3: Number(c3), c4: Number(c4), c5: Number(c5) }
        : null,
      score: isEnem ? totalEnemScore : Number(customScore),
      maxScore: isEnem ? 1000 : Number(customMax) || 100,
      notes: notes.trim() || 'Sem observações registradas.',
      content: draftText.trim(),
    };

    setEssays([newEssay, ...essays]);
    setThemeTitle('');
    setNotes('');
    setDraftText('');
    showToast(`Redação "${newEssay.theme}" salva com nota ${newEssay.score}!`);
  };

  const averageScore = useMemo(() => {
    if (!essays.length) return 0;
    const sum = essays.reduce((acc, e) => acc + Number(e.score || 0), 0);
    return Math.round(sum / essays.length);
  }, [essays]);

  const bestScore = useMemo(() => {
    if (!essays.length) return 0;
    return Math.max(...essays.map((e) => Number(e.score || 0)));
  }, [essays]);

  const activePurple = currentAccent.brightHex || currentAccent.hex;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-2xl border p-5 ${theme.bgCard}`}>
          <span className={`text-xs font-bold uppercase ${theme.textMuted}`}>
            Redações Escritas
          </span>
          <p className="text-3xl font-extrabold mt-1">{essays.length}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${theme.bgCard}`}>
          <span className={`text-xs font-bold uppercase ${theme.textMuted}`}>Média Geral</span>
          <p className="text-3xl font-extrabold mt-1 text-violet-400">{averageScore} pts</p>
        </div>
        <div className={`rounded-2xl border p-5 ${theme.bgCard}`}>
          <span className={`text-xs font-bold uppercase ${theme.textMuted}`}>Maior Nota</span>
          <p className="text-3xl font-extrabold mt-1 text-emerald-400">{bestScore} pts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`lg:col-span-5 rounded-2xl border p-6 ${theme.bgCard}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-pink-400" />
            Adicionar Nova Redação
          </h3>

          <form onSubmit={handleSaveEssay} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Tema da Redação</label>
              <input
                type="text"
                placeholder="Ex: Os desafios da inteligência artificial na educação..."
                value={themeTitle}
                onChange={(e) => setThemeTitle(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none ${theme.bgInput}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-semibold mb-1">Modelo / Banca</label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                >
                  <option value="ENEM (0 a 1000)">ENEM (0 a 1000)</option>
                  <option value="Vestibular (0 a 100)">Vestibular (0 a 100)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Eixo Temático</label>
                <select
                  value={axis}
                  onChange={(e) => setAxis(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                >
                  <option value="Sociedade & Cultura">Sociedade & Cultura</option>
                  <option value="Tecnologia & Ciência">Tecnologia & Ciência</option>
                  <option value="Meio Ambiente">Meio Ambiente</option>
                  <option value="Saúde & Educação">Saúde & Educação</option>
                  <option value="Cidadania & Direitos">Cidadania & Direitos</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tempo (min)</label>
                <input
                  type="number"
                  min={10}
                  max={240}
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                />
              </div>
            </div>

            {modelType === 'ENEM (0 a 1000)' ? (
              <div className={`p-3.5 rounded-xl border space-y-2.5 ${theme.bgSubtle}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Notas por Competência (C1 a C5)</span>
                  <span className="text-sm font-extrabold text-pink-400">
                    Total: {totalEnemScore} / 1000
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'C1', val: c1, set: setC1 },
                    { label: 'C2', val: c2, set: setC2 },
                    { label: 'C3', val: c3, set: setC3 },
                    { label: 'C4', val: c4, set: setC4 },
                    { label: 'C5', val: c5, set: setC5 },
                  ].map((comp) => (
                    <div key={comp.label}>
                      <label className="block text-[10px] font-bold text-center mb-1">
                        {comp.label}
                      </label>
                      <select
                        value={comp.val}
                        onChange={(e) => comp.set(Number(e.target.value))}
                        className={`w-full px-1.5 py-1.5 rounded-lg border text-xs font-bold text-center ${theme.bgInput}`}
                      >
                        {[0, 40, 80, 120, 160, 200].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Nota Obtida</label>
                  <input
                    type="number"
                    value={customScore}
                    onChange={(e) => setCustomScore(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Nota Máxima</label>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1">
                Anotações da Correção / Repertórios Utilizados
              </label>
              <textarea
                rows={2}
                placeholder="O que acertou e o que precisa corrigir para a próxima redação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs ${theme.bgInput}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Texto da Redação (Opcional — salve seu rascunho/redação final)
              </label>
              <textarea
                rows={4}
                placeholder="Cole ou escreva aqui o texto da sua redação..."
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs ${theme.bgInput}`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-md transition hover:brightness-110"
              style={{ backgroundColor: activePurple }}
            >
              + Salvar Redação no Portfólio
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
            <h3 className="text-base font-bold mb-4">Evolução das Notas de Redação</h3>
            {essays.length === 0 ? (
              <p className={`text-xs py-10 text-center ${theme.textMuted}`}>
                Nenhuma redação cadastrada ainda. Adicione sua primeira redação no formulário ao lado!
              </p>
            ) : (
              <div className="h-52 flex items-end gap-4 pt-6 pb-4 px-2 border-b border-zinc-800">
                {essays
                  .slice()
                  .reverse()
                  .map((ess) => {
                    const pct = Math.min(100, Math.round((ess.score / (ess.maxScore || 1000)) * 100));
                    return (
                      <div
                        key={ess.id}
                        className="flex-1 max-w-[110px] h-full flex flex-col items-center justify-end"
                      >
                        <span className="text-xs font-bold mb-1.5 text-pink-400">
                          {ess.score}
                        </span>
                        <div
                          className="w-full rounded-t-md transition-all"
                          style={{
                            height: `${Math.max(pct, 8)}%`,
                            backgroundColor: activePurple,
                          }}
                        />
                        <span className={`text-[11px] mt-2 truncate max-w-full ${theme.textMuted}`}>
                          {ess.date}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {essays.map((ess) => (
              <div key={ess.id} className={`rounded-2xl border p-5 ${theme.bgCard}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300">
                        {ess.axis || 'Geral'}
                      </span>
                      <span className={`text-xs ${theme.textMuted}`}>
                        {ess.date} • {ess.timeSpentMinutes || 60} min
                      </span>
                    </div>
                    <h4 className="font-bold text-base mt-1">{ess.theme}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 font-extrabold text-sm">
                      {ess.score} / {ess.maxScore || 1000}
                    </span>
                    <button
                      onClick={() => setEssays(essays.filter((e) => e.id !== ess.id))}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {ess.competencies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(ess.competencies).map(([k, v]) => (
                      <span
                        key={k}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${theme.bgSubtle}`}
                      >
                        {k.toUpperCase()}: <strong>{v}</strong>
                      </span>
                    ))}
                  </div>
                )}

                <p className={`text-xs mt-3 leading-relaxed ${theme.textMuted}`}>{ess.notes}</p>

                {ess.content && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEssay(selectedEssay === ess.id ? null : ess.id)
                      }
                      className="text-xs font-bold text-violet-400 hover:underline"
                    >
                      {selectedEssay === ess.id ? 'Ocultar texto da redação' : 'Ler texto da redação'}
                    </button>
                    {selectedEssay === ess.id && (
                      <div
                        className={`mt-2 p-3.5 rounded-xl border text-xs whitespace-pre-line leading-relaxed ${theme.bgSubtle}`}
                      >
                        {ess.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MÓDULO B: POMODORO & CRONÔMETRO
// ============================================================================
function PomodoroModule({ theme, currentAccent, subjects, onCompleteSession, showToast }) {
  const [mode, setMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState({ pomodoro: 25, shortBreak: 5, longBreak: 15 });
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Ignora caso áudio esteja bloqueado
    }
  };

  useEffect(() => {
    if (!selectedSubjectId && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchSeconds((prev) => prev + 1);
      } else {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep();
            if (mode === 'pomodoro') {
              setCompletedPomodoros((c) => c + 1);
              showToast('Pomodoro concluído! Você pode registrar a sessão no seu ciclo.');
            } else {
              showToast('Tempo de pausa finalizado! Hora de voltar ao foco.');
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode !== 'stopwatch') {
      setSecondsLeft(customMinutes[newMode] * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setSecondsLeft(customMinutes[mode] * 60);
    }
  };

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 flex flex-col items-center justify-center ${theme.bgCard}`}>
        <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border mb-8 ${theme.bgSubtle}`}>
          {[
            { id: 'pomodoro', label: 'Pomodoro (Foco)' },
            { id: 'shortBreak', label: 'Pausa Curta' },
            { id: 'longBreak', label: 'Pausa Longa' },
            { id: 'stopwatch', label: 'Cronômetro Livre' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                mode === m.id ? 'text-white shadow' : theme.textMuted
              }`}
              style={mode === m.id ? { backgroundColor: currentAccent.hex } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 flex flex-col items-center justify-center mb-8 shadow-inner"
          style={{ borderColor: isRunning ? (currentSubject?.color || currentAccent.hex) : '#27272a' }}
        >
          <span className={`text-xs uppercase font-bold tracking-widest mb-2 ${theme.textMuted}`}>
            {mode === 'stopwatch' ? 'Tempo Decorrido' : mode === 'pomodoro' ? 'Sessão de Foco' : 'Descanso'}
          </span>
          <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight">
            {mode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(secondsLeft)}
          </div>
          {currentSubject && (
            <span
              className="mt-3 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: currentSubject.color }}
            >
              {currentSubject.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm shadow-lg transition hover:scale-105"
            style={{ backgroundColor: currentAccent.hex }}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>

          <button
            onClick={handleReset}
            className={`p-4 rounded-2xl border transition hover:scale-105 ${theme.bgSubtle}`}
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Vincular ao Ciclo de Estudos
          </h3>

          <label className="block text-xs font-semibold mb-2">Matéria em estudo agora</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4 ${theme.bgInput}`}
          >
            {subjects.length === 0 ? (
              <option value="">Cadastre matérias no Ciclo primeiro</option>
            ) : (
              subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.completedSessions.length}/{s.totalSessions} sessões)
                </option>
              ))
            )}
          </select>

          <button
            onClick={() => selectedSubjectId && onCompleteSession(selectedSubjectId)}
            disabled={!selectedSubjectId}
            className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-50"
            style={{
              backgroundColor: currentAccent.btnBg,
              color: currentAccent.btnText,
              border: `1px solid ${currentAccent.border}`,
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Marcar +1 Sessão Concluída na Matéria
          </button>

          <div className={`mt-5 pt-5 border-t flex items-center justify-between text-xs ${theme.border}`}>
            <span className={theme.textMuted}>Pomodoros finalizados hoje:</span>
            <span className="font-bold text-base text-amber-400">{completedPomodoros} 🍅</span>
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
            Configurar Minutos (Pomodoro)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'pomodoro', label: 'Foco (min)' },
              { key: 'shortBreak', label: 'Pausa Curta' },
              { key: 'longBreak', label: 'Pausa Longa' },
            ].map((item) => (
              <div key={item.key}>
                <label className={`block text-xs mb-1 ${theme.textMuted}`}>{item.label}</label>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={customMinutes[item.key]}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 1);
                    setCustomMinutes((prev) => ({ ...prev, [item.key]: val }));
                    if (mode === item.key && !isRunning) {
                      setSecondsLeft(val * 60);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${theme.bgInput}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MÓDULO C: BANCO DE QUESTÕES & REGISTRO DE BATERIAS
// ============================================================================
function QuestionBankModule({
  theme,
  currentAccent,
  subjects,
  questions,
  setQuestions,
  questionLogs,
  setQuestionLogs,
  showToast,
}) {
  const [subTab, setSubTab] = useState('bank');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedIds, setRevealedIds] = useState({});

  const [qSubject, setQSubject] = useState(subjects[0]?.name || 'Geral');
  const [qTopic, setQTopic] = useState('');
  const [qDiff] = useState('Média');
  const [qStatement, setQStatement] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  const [logSubject, setLogSubject] = useState(subjects[0]?.name || 'Geral');
  const [logTopic, setLogTopic] = useState('');
  const [logTotal, setLogTotal] = useState(20);
  const [logCorrect, setLogCorrect] = useState(16);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qStatement.trim()) return;
    const foundSub = subjects.find((s) => s.name === qSubject);
    const newQ = {
      id: `q-${Date.now()}`,
      subject: qSubject,
      subjectColor: foundSub?.color || '#3b82f6',
      topic: qTopic.trim() || 'Geral',
      difficulty: qDiff,
      statement: qStatement.trim(),
      options: qOptions.map((opt, idx) =>
        opt.trim()
          ? `${String.fromCharCode(65 + idx)}) ${opt.trim()}`
          : `${String.fromCharCode(65 + idx)}) Alternativa ${idx + 1}`
      ),
      correctIndex: Number(qCorrect),
      explanation: qExplanation.trim() || 'Sem comentário adicional.',
      status: 'unanswered',
    };
    setQuestions([newQ, ...questions]);
    setQStatement('');
    setQTopic('');
    setQOptions(['', '', '', '', '']);
    setQExplanation('');
    showToast('Questão adicionada ao seu Banco de Questões!');
  };

  const handleAddQuestionLog = (e) => {
    e.preventDefault();
    const foundSub = subjects.find((s) => s.name === logSubject);
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      subject: logSubject,
      color: foundSub?.color || '#10b981',
      topic: logTopic.trim() || 'Lista de Exercícios',
      total: Math.max(1, Number(logTotal)),
      correct: Math.min(Number(logTotal), Math.max(0, Number(logCorrect))),
    };
    setQuestionLogs([newLog, ...questionLogs]);
    setLogTopic('');
    showToast('Bateria de questões registrada nas estatísticas!');
  };

  const filteredQuestions = questions.filter(
    (q) => filterSubject === 'ALL' || q.subject === filterSubject
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={`inline-flex p-1.5 rounded-xl border ${theme.bgSubtle}`}>
          <button
            onClick={() => setSubTab('bank')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'bank' ? 'text-white' : theme.textMuted
            }`}
            style={subTab === 'bank' ? { backgroundColor: currentAccent.hex } : {}}
          >
            Caderno de Questões Interativo ({questions.length})
          </button>
          <button
            onClick={() => setSubTab('logs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'logs' ? 'text-white' : theme.textMuted
            }`}
            style={subTab === 'logs' ? { backgroundColor: currentAccent.hex } : {}}
          >
            Registro de Listas & Taxa de Acerto ({questionLogs.length})
          </button>
        </div>

        {subTab === 'bank' && (
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold ${theme.bgInput}`}
          >
            <option value="ALL">Todas as Matérias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {subTab === 'bank' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className={`rounded-2xl border p-10 text-center ${theme.bgCard}`}>
                <p className="font-bold text-base">Seu Caderno de Questões está vazio</p>
                <p className={`text-xs mt-1 ${theme.textMuted}`}>
                  Use o formulário ao lado para guardar questões importantes e revisar depois.
                </p>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const chosen = selectedAnswers[q.id];
                const isRevealed = revealedIds[q.id];
                return (
                  <div key={q.id} className={`rounded-2xl border p-6 ${theme.bgCard}`}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: q.subjectColor }}
                        >
                          {q.subject}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${theme.bgSubtle}`}>
                          {q.topic}
                        </span>
                        <span className={`text-xs ${theme.textMuted}`}>• {q.difficulty}</span>
                      </div>
                      <button
                        onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm sm:text-base font-medium leading-relaxed mb-4">
                      {q.statement}
                    </p>

                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, idx) => {
                        const isSelected = chosen === idx;
                        const isCorrect = q.correctIndex === idx;
                        let optionStyle = theme.bgSubtle;
                        if (isRevealed) {
                          if (isCorrect) optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                          else if (isSelected) optionStyle = 'bg-red-500/20 border-red-500 text-red-300';
                        } else if (isSelected) {
                          optionStyle = 'border-amber-400 bg-amber-400/10';
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: idx }))
                            }
                            className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                        style={{ backgroundColor: currentAccent.hex }}
                      >
                        {isRevealed ? 'Ocultar Gabarito' : 'Verificar Resposta'}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${theme.bgSubtle}`}>
                        <p className="font-bold text-emerald-400 mb-1">
                          Gabarito Oficial: Alternativa {String.fromCharCode(65 + q.correctIndex)}
                        </p>
                        <p className={theme.textMuted}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className={`lg:col-span-5 rounded-2xl border p-6 ${theme.bgCard}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Adicionar Questão ao Caderno
            </h3>
            <form onSubmit={handleAddQuestion} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Matéria</label>
                  <input
                    type="text"
                    placeholder="Ex: Biologia, Matemática..."
                    value={qSubject}
                    onChange={(e) => setQSubject(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tópico / Assunto</label>
                  <input
                    type="text"
                    placeholder="Ex: Óptica, Genética..."
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Enunciado da Questão</label>
                <textarea
                  rows={3}
                  placeholder="Digite ou cole o enunciado da questão..."
                  value={qStatement}
                  onChange={(e) => setQStatement(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold">Alternativas (A até E)</label>
                {['A', 'B', 'C', 'D', 'E'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQCorrect(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 border ${
                        qCorrect === idx
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : theme.bgSubtle
                      }`}
                    >
                      {letter}
                    </button>
                    <input
                      type="text"
                      placeholder={`Texto da alternativa ${letter}`}
                      value={qOptions[idx]}
                      onChange={(e) => {
                        const copy = [...qOptions];
                        copy[idx] = e.target.value;
                        setQOptions(copy);
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs ${theme.bgInput}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Resolução / Comentário</label>
                <textarea
                  rows={2}
                  placeholder="Explicação do motivo da resposta correta..."
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-white"
                style={{ backgroundColor: currentAccent.hex }}
              >
                + Salvar Questão no Banco
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-5 rounded-2xl border p-6 ${theme.bgCard}`}>
            <h3 className="text-lg font-bold mb-4">Registrar Bateria de Exercícios</h3>
            <form onSubmit={handleAddQuestionLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Matéria</label>
                <input
                  type="text"
                  placeholder="Ex: Matemática, Física..."
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm ${theme.bgInput}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Assunto / Frente</label>
                <input
                  type="text"
                  placeholder="Ex: Geometria Espacial"
                  value={logTopic}
                  onChange={(e) => setLogTopic(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm ${theme.bgInput}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Questões Feitas</label>
                  <input
                    type="number"
                    min={1}
                    value={logTotal}
                    onChange={(e) => setLogTotal(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm ${theme.bgInput}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Acertos</label>
                  <input
                    type="number"
                    min={0}
                    max={logTotal}
                    value={logCorrect}
                    onChange={(e) => setLogCorrect(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm ${theme.bgInput}`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-white"
                style={{ backgroundColor: currentAccent.hex }}
              >
                Registrar Desempenho
              </button>
            </form>
          </div>

          <div className={`lg:col-span-7 rounded-2xl border p-6 ${theme.bgCard}`}>
            <h3 className="text-lg font-bold mb-4">Histórico de Baterias & Aproveitamento</h3>
            {questionLogs.length === 0 ? (
              <p className={`text-xs py-8 text-center ${theme.textMuted}`}>
                Nenhuma bateria registrada ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {questionLogs.map((log) => {
                  const acc = Math.round((log.correct / log.total) * 100);
                  return (
                    <div
                      key={log.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${theme.bgSubtle}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: log.color }}
                          />
                          <span className="font-bold text-sm">{log.subject}</span>
                          <span className={`text-xs ${theme.textMuted}`}>• {log.topic}</span>
                        </div>
                        <span className={`text-xs ${theme.textMuted}`}>Data: {log.date}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-extrabold ${
                            acc >= 75 ? 'text-emerald-400' : acc >= 60 ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {acc}% ({log.correct}/{log.total})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MÓDULO D: LISTA DE TAREFAS (MÚLTIPLAS LISTAS, PRAZOS, TAGS E SUBTAREFAS)
// ============================================================================
function TasksModule({
  theme,
  currentAccent,
  subjects,
  taskLists,
  setTaskLists,
  tasks,
  setTasks,
  showToast,
}) {
  const [activeListId, setActiveListId] = useState(taskLists[0]?.id || 'list-1');
  const [newListName, setNewListName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskSubject, setTaskSubject] = useState(subjects[0]?.name || 'Geral');
  const [taskPriority, setTaskPriority] = useState('Média');
  const [taskTagInput, setTaskTagInput] = useState('');
  const [subtaskInputs, setSubtaskInputs] = useState({});

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const nl = { id: `list-${Date.now()}`, name: newListName.trim() };
    setTaskLists([...taskLists, nl]);
    setActiveListId(nl.id);
    setNewListName('');
    showToast(`Lista "${nl.name}" criada!`);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const foundSub = subjects.find((s) => s.name === taskSubject);
    const newTask = {
      id: `task-${Date.now()}`,
      listId: activeListId,
      title: taskTitle.trim(),
      dueDate: taskDueDate || 'Sem prazo',
      subjectName: taskSubject,
      subjectColor: foundSub?.color || '#6366f1',
      priority: taskPriority,
      tags: taskTagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      completed: false,
      subtasks: [],
    };
    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setTaskTagInput('');
    showToast('Tarefa adicionada à lista!');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const addSubtask = (taskId) => {
    const text = subtaskInputs[taskId]?.trim();
    if (!text) return;
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [...t.subtasks, { id: `st-${Date.now()}`, text, done: false }],
            }
          : t
      )
    );
    setSubtaskInputs({ ...subtaskInputs, [taskId]: '' });
  };

  const toggleSubtask = (taskId, stId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === stId ? { ...st, done: !st.done } : st
              ),
            }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) => t.listId === activeListId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className={`lg:col-span-4 rounded-2xl border p-6 space-y-5 ${theme.bgCard}`}>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-amber-400" />
          Suas Listas de Tarefas
        </h3>

        <div className="space-y-2">
          {taskLists.map((list) => {
            const count = tasks.filter((t) => t.listId === list.id && !t.completed).length;
            const active = activeListId === list.id;
            return (
              <button
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition ${
                  active ? 'text-white' : theme.bgSubtle
                }`}
                style={
                  active
                    ? {
                        backgroundColor: currentAccent.btnBg,
                        color: currentAccent.btnText,
                        borderColor: currentAccent.border,
                      }
                    : {}
                }
              >
                <span>{list.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/30">{count}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddList} className="pt-3 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            placeholder="Nova lista (ex: Revisões)..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${theme.bgInput}`}
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white"
            style={{ backgroundColor: currentAccent.hex }}
          >
            + Criar
          </button>
        </form>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
          <h3 className="text-base font-bold mb-4">Adicionar Nova Tarefa</h3>
          <form onSubmit={handleAddTask} className="space-y-3">
            <input
              type="text"
              placeholder="O que você precisa estudar ou entregar?"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${theme.bgInput}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
              >
                <option value="Geral">Matéria: Geral</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
              />

              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
              >
                <option value="Baixa">Prioridade Baixa</option>
                <option value="Média">Prioridade Média</option>
                <option value="Alta">Prioridade Alta</option>
              </select>

              <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={taskTagInput}
                onChange={(e) => setTaskTagInput(e.target.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white"
              style={{ backgroundColor: currentAccent.hex }}
            >
              + Adicionar Tarefa
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={`rounded-2xl border p-8 text-center ${theme.bgCard}`}>
              <p className="font-bold text-sm">Nenhuma tarefa nesta lista ainda</p>
              <p className={`text-xs mt-1 ${theme.textMuted}`}>
                Adicione suas tarefas, prazos e subtarefas no campo acima.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const doneSub = task.subtasks.filter((s) => s.done).length;
              return (
                <div key={task.id} className={`rounded-2xl border p-5 ${theme.bgCard}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-500'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <div>
                        <h4
                          className={`font-bold text-sm sm:text-base ${
                            task.completed ? 'line-through opacity-50' : ''
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className="text-[11px] font-bold px-2.5 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: task.subjectColor }}
                          >
                            {task.subjectName}
                          </span>
                          <span className={`text-xs flex items-center gap-1 ${theme.textMuted}`}>
                            <Calendar className="w-3 h-3" /> {task.dueDate}
                          </span>
                          {task.tags.map((tg, i) => (
                            <span
                              key={i}
                              className={`text-[11px] px-2 py-0.5 rounded-md border ${theme.bgSubtle}`}
                            >
                              #{tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={`mt-4 pt-3 border-t space-y-2 ${theme.border}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${theme.textMuted}`}>
                        Subtarefas ({doneSub}/{task.subtasks.length})
                      </span>
                    </div>
                    {task.subtasks.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => toggleSubtask(task.id, st.id)}
                        className="flex items-center gap-2 text-xs cursor-pointer pl-2 py-1 rounded hover:bg-zinc-800/30"
                      >
                        <input type="checkbox" checked={st.done} readOnly className="rounded" />
                        <span className={st.done ? 'line-through opacity-50' : ''}>{st.text}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Adicionar subtarefa..."
                        value={subtaskInputs[task.id] || ''}
                        onChange={(e) =>
                          setSubtaskInputs({ ...subtaskInputs, [task.id]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === 'Enter' && addSubtask(task.id)}
                        className={`flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none ${theme.bgInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => addSubtask(task.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${theme.bgSubtle}`}
                      >
                        + Subtarefa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MÓDULO E: DIÁRIO DE SIMULADOS, REDAÇÕES & DIAGNÓSTICO DE PROGRESSO
// ============================================================================
function JournalModule({
  theme,
  currentAccent,
  simulados,
  setSimulados,
  essays,
  setEssays,
  questionLogs,
  showToast,
}) {
  const [simTitle, setSimTitle] = useState('');
  const [simTotal, setSimTotal] = useState(90);
  const [simCorrect, setSimCorrect] = useState(65);
  const [simNotes, setSimNotes] = useState('');

  const [essTheme, setEssTheme] = useState('');
  const [essScore, setEssScore] = useState(880);
  const [essNotes, setEssNotes] = useState('');

  const handleAddSimulado = (e) => {
    e.preventDefault();
    if (!simTitle.trim()) return;
    const newSim = {
      id: `sim-${Date.now()}`,
      title: simTitle.trim(),
      date: new Date().toISOString().slice(0, 10),
      totalQuestions: Number(simTotal) || 90,
      correctQuestions: Number(simCorrect) || 0,
      durationMinutes: 240,
      areas: [],
      notes: simNotes.trim() || 'Sem observações.',
    };
    setSimulados([newSim, ...simulados]);
    setSimTitle('');
    setSimNotes('');
    showToast('Simulado registrado no seu Diário de Progresso!');
  };

  const handleAddEssay = (e) => {
    e.preventDefault();
    if (!essTheme.trim()) return;
    const newEss = {
      id: `ess-${Date.now()}`,
      theme: essTheme.trim(),
      date: new Date().toISOString().slice(0, 10),
      model: 'ENEM (0 a 1000)',
      score: Number(essScore) || 0,
      maxScore: 1000,
      notes: essNotes.trim() || 'Sem observações.',
    };
    setEssays([newEss, ...essays]);
    setEssTheme('');
    setEssNotes('');
    showToast('Redação registrada no seu Diário!');
  };

  const subjectPerformance = useMemo(() => {
    const map = {};
    questionLogs.forEach((l) => {
      if (!map[l.subject]) map[l.subject] = { total: 0, correct: 0 };
      map[l.subject].total += l.total;
      map[l.subject].correct += l.correct;
    });
    return Object.entries(map).map(([subject, data]) => ({
      subject,
      acc: Math.round((data.correct / (data.total || 1)) * 100),
      ...data,
    }));
  }, [questionLogs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" />
            Pontos Fortes (Aproveitamento ≥ 75%)
          </h3>
          <div className="space-y-2">
            {subjectPerformance.filter((s) => s.acc >= 75).length === 0 ? (
              <p className={`text-xs ${theme.textMuted}`}>
                Continue registrando baterias de questões para identificar seus pontos fortes.
              </p>
            ) : (
              subjectPerformance
                .filter((s) => s.acc >= 75)
                .map((s) => (
                  <div
                    key={s.subject}
                    className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs"
                  >
                    <span className="font-bold">{s.subject}</span>
                    <span className="font-extrabold text-emerald-400">
                      {s.acc}% de acerto ({s.correct}/{s.total})
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${theme.bgCard}`}>
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5" />
            Pontos de Atenção / Onde Melhorar (&lt; 75%)
          </h3>
          <div className="space-y-2">
            {subjectPerformance.filter((s) => s.acc < 75).length === 0 ? (
              <p className={`text-xs ${theme.textMuted}`}>
                Nenhuma matéria em zona crítica no momento!
              </p>
            ) : (
              subjectPerformance
                .filter((s) => s.acc < 75)
                .map((s) => (
                  <div
                    key={s.subject}
                    className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs"
                  >
                    <span className="font-bold">{s.subject}</span>
                    <span className="font-extrabold text-amber-400">
                      {s.acc}% de acerto ({s.correct}/{s.total}) — Priorizar revisão
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 space-y-5 ${theme.bgCard}`}>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Diário de Simulados
          </h3>

          <form onSubmit={handleAddSimulado} className="space-y-3">
            <input
              type="text"
              placeholder="Nome do Simulado (ex: 1º Simulado ENEM / Fuvest)"
              value={simTitle}
              onChange={(e) => setSimTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] mb-1">Total de Questões</label>
                <input
                  type="number"
                  value={simTotal}
                  onChange={(e) => setSimTotal(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                />
              </div>
              <div>
                <label className="block text-[11px] mb-1">Total de Acertos</label>
                <input
                  type="number"
                  value={simCorrect}
                  onChange={(e) => setSimCorrect(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
                />
              </div>
            </div>
            <textarea
              rows={2}
              placeholder="Análise pós-prova: onde fui bem e o que preciso corrigir..."
              value={simNotes}
              onChange={(e) => setSimNotes(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${theme.bgInput}`}
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white"
              style={{ backgroundColor: currentAccent.hex }}
            >
              + Registrar Simulado
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {simulados.map((sim) => {
              const pct = Math.round((sim.correctQuestions / (sim.totalQuestions || 1)) * 100);
              return (
                <div key={sim.id} className={`p-4 rounded-xl border ${theme.bgSubtle}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{sim.title}</h4>
                      <span className={`text-xs ${theme.textMuted}`}>{sim.date}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold text-xs">
                      {sim.correctQuestions}/{sim.totalQuestions} ({pct}%)
                    </span>
                  </div>
                  <p className={`text-xs mt-2 leading-relaxed ${theme.textMuted}`}>{sim.notes}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 space-y-5 ${theme.bgCard}`}>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-pink-400" />
            Diário de Redações
          </h3>

          <form onSubmit={handleAddEssay} className="space-y-3">
            <input
              type="text"
              placeholder="Tema da Redação..."
              value={essTheme}
              onChange={(e) => setEssTheme(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${theme.bgInput}`}
            />
            <div>
              <label className="block text-[11px] mb-1">Nota Obtida (0 a 1000)</label>
              <input
                type="number"
                min={0}
                max={1000}
                step={20}
                value={essScore}
                onChange={(e) => setEssScore(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${theme.bgInput}`}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Correção: repertórios usados e competências para melhorar..."
              value={essNotes}
              onChange={(e) => setEssNotes(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${theme.bgInput}`}
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white"
              style={{ backgroundColor: currentAccent.hex }}
            >
              + Registrar Redação
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {essays.map((ess) => (
              <div key={ess.id} className={`p-4 rounded-xl border ${theme.bgSubtle}`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-sm">{ess.theme}</h4>
                    <span className={`text-xs ${theme.textMuted}`}>{ess.date}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-extrabold text-xs shrink-0">
                    {ess.score} pts
                  </span>
                </div>
                <p className={`text-xs mt-2 leading-relaxed ${theme.textMuted}`}>{ess.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}