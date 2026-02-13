
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  CalendarIcon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Settings,
  X,
  User as UserIcon,
  Bell,
  Activity,
  Users,
  Clock,
  Home,
  Menu,
  MoreVertical,
  Calendar,
  Filter,
  LogOut,
  Moon,
  Sun,
  Check,
  Shield,
  Cpu,
  Mail,
  Loader2,
  Zap,
  Share2,
  UserPlus,
  Inbox,
  Reply,
  MessageSquare,
  Star,
  Hash,
  LayoutList,
  LayoutGrid,
  MoreHorizontal,
  GanttChart
} from 'lucide-react';
import { MOCK_TASKS, STATUS_COLORS, PRIORITY_COLORS, USERS } from './constants';
import { Task, ViewType, Status, Priority, User as UserType } from './types';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import CalendarView from './components/CalendarView';
import GanttView from './components/GanttView';
import TeamView from './components/TeamView';

type NavigationContext = 'Everything' | 'Engineering' | 'Design' | 'Marketing' | 'Home' | 'Planner' | 'Teams' | 'My Tasks' | 'Pulse';
type SettingsTab = 'General' | 'Workspace' | 'Security' | 'Notifications' | 'Integrations';

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'mention' | 'update' | 'assigned';
}

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'Home' | 'Planner' | 'AI' | 'Teams' | 'More'>('Home');
  const [activeView, setActiveView] = useState<ViewType>('List');
  const [activeContext, setActiveContext] = useState<NavigationContext>('Everything');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // App Global State
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('oasis-theme') as 'light' | 'dark') || 'light';
  });
  const [workspaceName, setWorkspaceName] = useState('Oasis International Solutions FZCO');
  const [ownerName, setOwnerName] = useState('Augusto Silva');

  // Sync theme with document element
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('oasis-theme', currentTheme);
  }, [currentTheme]);

  // Modals & Panels State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('General');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Temporary Settings State (for Cancel/Save logic)
  const [tempWorkspaceName, setTempWorkspaceName] = useState('');
  const [tempOwnerName, setTempOwnerName] = useState('');

  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Sarah Chen assigned you to "Design Dashboard Layout"', time: '2m ago', read: false, type: 'assigned' },
    { id: '2', title: 'Alex Rivera mentioned you in "Gemini API Integration"', time: '15m ago', read: false, type: 'mention' },
    { id: '3', title: 'Task "End-to-End Testing" priority changed to High', time: '1h ago', read: true, type: 'update' },
    { id: '4', title: 'Workspace "Engineering" was updated', time: '3h ago', read: true, type: 'update' },
  ]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Normal',
    assignee: USERS[0],
    dueDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    tags: []
  });

  // Handle outside click for notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync temp state when opening settings
  const openSettings = () => {
    setTempWorkspaceName(workspaceName);
    setTempOwnerName(ownerName);
    setActiveSettingsTab('General');
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    setTimeout(() => {
      setWorkspaceName(tempWorkspaceName);
      setOwnerName(tempOwnerName);
      setIsSavingSettings(false);
      setIsSettingsOpen(false);
    }, 600);
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (activeContext === 'Engineering') {
      result = result.filter(t => t.tags.includes('Engineering') || t.tags.includes('Frontend') || t.tags.includes('AI') || t.tags.includes('Data Viz'));
    } else if (activeContext === 'Design') {
      result = result.filter(t => t.tags.includes('Design') || t.tags.includes('UI/UX'));
    } else if (activeContext === 'Marketing') {
      result = result.filter(t => t.tags.includes('Marketing'));
    } else if (activeContext === 'My Tasks') {
      result = result.filter(t => t.assignee.name === ownerName || t.assignee.id === USERS[0].id);
    }

    if (searchQuery) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [tasks, searchQuery, activeContext, ownerName]);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus: Status = t.status === 'Complete' ? 'To Do' : 'Complete';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const taskToAdd: Task = {
      id: `TASK-${tasks.length + 1}`,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      status: (newTask.status as Status) || 'To Do',
      priority: (newTask.priority as Priority) || 'Normal',
      assignee: (newTask.assignee as UserType) || USERS[0],
      dueDate: newTask.dueDate || new Date().toISOString(),
      startDate: newTask.startDate || new Date().toISOString(),
      tags: newTask.tags || (activeContext !== 'Everything' && activeContext !== 'Home' && activeContext !== 'My Tasks' && activeContext !== 'Pulse' ? [activeContext] : []),
    };

    setTasks(prev => [taskToAdd, ...prev]);
    setIsModalOpen(false);
    setNewTask({
      title: '', description: '', status: 'To Do', priority: 'Normal',
      assignee: USERS[0], dueDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0], tags: []
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderView = () => {
    const commonProps = { tasks: filteredTasks, isDarkMode: currentTheme === 'dark' };
    switch (activeView) {
      case 'List': return <ListView {...commonProps} onToggleStatus={toggleTaskStatus} onAddTask={() => setIsModalOpen(true)} />;
      case 'Board': return <BoardView {...commonProps} />;
      case 'Calendar': return <CalendarView {...commonProps} />;
      case 'Gantt': return <GanttView {...commonProps} />;
      case 'Team': return <TeamView {...commonProps} />;
      default: return <ListView {...commonProps} onToggleStatus={toggleTaskStatus} onAddTask={() => setIsModalOpen(true)} />;
    }
  };

  const getSidebarIcon = (item: string) => {
    switch (item) {
      case 'Home': return <Home size={20} />;
      case 'Planner': return <Calendar size={20} />;
      case 'Teams': return <Users size={20} />;
      case 'Pulse': return <Activity size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case 'General':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Workspace Appearance</h4>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Workspace Name</label>
                <input
                  type="text"
                  value={tempWorkspaceName}
                  onChange={(e) => setTempWorkspaceName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white dark:bg-[#16161e] text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Personal Info</h4>
              <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                <img src="https://picsum.photos/seed/augusto/100" className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-sm" alt="Profile" />
                <div className="flex-1">
                  <input
                    className="font-bold text-gray-800 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-purple-200 rounded px-1 w-full dark:focus:ring-purple-900/50"
                    value={tempOwnerName}
                    onChange={(e) => setTempOwnerName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">augusto@example.com</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Integrations':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Active Integrations</h4>
            <div className="p-5 border-2 border-purple-100 dark:border-purple-900 rounded-2xl bg-purple-50/30 dark:bg-purple-900/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Cpu size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Gemini AI Engine</p>
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded">ONLINE</span>
                  </div>
                  <p className="text-xs text-gray-500">Task summarization and smart estimation enabled.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center text-gray-400 font-bold dark:text-gray-500">Content for {activeSettingsTab} is coming soon.</div>;
    }
  };

  return (
    <div className={`${currentTheme === 'dark' ? 'dark' : ''} flex h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300 uppercase tracking-tighter`}>
      {/* Primary Sidebar - Icon Only */}
      <aside className={`w-16 bg-white dark:bg-black border-r border-gray-200 dark:border-[#2a2a35] flex flex-col items-center py-6 gap-8 z-[60] flex-shrink-0 relative`}>
        <div className="flex flex-col items-center gap-6 w-full flex-1">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black text-xs hover:rotate-6 transition-transform cursor-pointer">O</div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-12 bg-white dark:bg-black border border-gray-200 dark:border-[#2a2a35] text-gray-500 hover:text-gray-900 dark:hover:text-white p-0.5 rounded-full shadow-lg z-50 transition-all font-bold"
          >
            {sidebarOpen ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
          </button>

          {[
            { id: 'Home', icon: <div className={`p-1.5 rounded-lg ${activeTab === 'Home' ? 'bg-purple-600 text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}><Home size={22} fill={activeTab === 'Home' ? "currentColor" : "none"} /></div> },
            { id: 'Planner', icon: <Calendar size={24} /> },
            { id: 'Teams', icon: <Users size={24} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (!sidebarOpen) setSidebarOpen(true);
              }}
              className={`flex flex-col items-center gap-1 w-full transition-colors relative group ${activeTab === item.id ? 'text-purple-600 dark:text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold transition-opacity uppercase tracking-tighter">{item.id}</span>
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 dark:bg-white rounded-r-full" />}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 w-full pt-4 border-t border-gray-200 dark:border-[#2a2a35]">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group w-full font-bold">
            <UserPlus size={24} />
            <span className="text-[10px] uppercase tracking-tighter">Invite</span>
          </button>
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-[#16161e] shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >AS</div>
        </div>
      </aside>

      {/* Secondary Drawer Panel */}
      {sidebarOpen && (
        <aside className="w-72 bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-[#2a2a35] flex flex-col z-50 relative group/drawer">
          {activeTab === 'Home' && (
            <div className="flex-1 flex flex-col p-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Home</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                    <Plus size={16} /> Create
                  </button>
                </div>
              </div>

              <nav className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
                <div className="space-y-1">
                  {[
                    { id: 'Inbox', icon: <Inbox size={18} /> },
                    { id: 'Replies', icon: <Reply size={18} /> },
                    { id: 'Assigned Comments', icon: <MessageSquare size={18} /> },
                    { id: 'My Tasks', icon: <UserIcon size={18} /> },
                    { id: 'More', icon: <MoreHorizontal size={18} /> },
                  ].map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-all">
                      {item.icon}
                      <span className="text-sm font-medium">{item.id}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer group">
                    <div className="flex items-center gap-1">
                      Favorites <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    <span>Spaces</span>
                    <Plus size={14} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" onClick={() => setIsSpaceModalOpen(true)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 cursor-pointer group">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center"><Hash size={12} /></div>
                      <span className="text-sm flex-1 truncate">All Tasks <span className="text-gray-400 dark:text-gray-600 font-normal">- Oasis International Solutions</span></span>
                    </div>

                    <div className="p-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer flex items-center gap-2 group font-bold" onClick={() => setIsSpaceModalOpen(true)}>
                      <Plus size={14} className="group-hover:scale-110 transition-transform" /> New Space
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800/50">
                  <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Channels</div>
                  <div className="space-y-1">
                    <div className="p-2 text-xs text-gray-400 dark:text-gray-600 italic">No channels created</div>
                  </div>
                </div>
              </nav>
            </div>
          )}

          {activeTab === 'Teams' && (
            <div className="flex-1 flex flex-col p-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teams</h2>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'All Teams', count: 0, icon: <Users size={18} />, active: true },
                  { id: 'All People', count: 1, icon: <UserIcon size={18} /> },
                  { id: 'Analytics', icon: <Activity size={18} /> },
                ].map(item => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${item.active ? 'bg-purple-100 dark:bg-white/10 text-purple-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'} cursor-pointer`}>
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm font-bold">{item.id}</span>
                    </div>
                    {item.count !== undefined && <span className="text-xs opacity-50">{item.count}</span>}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">My Teams</h3>
                <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
                    <Users size={20} />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-medium">Once you are added to a Team you will see it here</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-black relative">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-black border-b border-gray-200 dark:border-[#2a2a35] flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-bold">
              <span className="flex items-center gap-1 cursor-pointer hover:text-purple-600">
                <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center text-[10px] text-white">O</div>
                Oasis
              </span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 cursor-pointer">
                <Activity size={12} className="text-gray-400 dark:text-gray-500" />
                Workspace
                <ChevronDown size={12} />
              </span>
            </div>
            <div className="relative w-96 ml-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
              <input
                type="text"
                placeholder="Search Ctrl K"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-[#16161e] border border-transparent dark:border-gray-800 rounded-full text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-[#1c1c24] focus:border-purple-500 dark:focus:border-purple-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Sparkles size={12} className="text-purple-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 font-bold">
            <button className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs">
              <Users size={14} />
              Agents
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs">
              <Zap size={14} />
              Automate
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs">
              <Sparkles size={14} />
              Ask AI
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs">
              <Share2 size={14} />
              Share
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors border border-gray-100 dark:border-gray-800"
              >
                {currentTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold border border-white dark:border-gray-800 shadow-sm cursor-pointer">AS</div>
            </div>
          </div>
        </header>

        {/* View Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-6 shrink-0">
          <div className="flex items-center gap-6">
            {(['List', 'Board', 'Calendar', 'Gantt', 'Team'] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`py-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-all relative ${activeView === view
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
              >
                {view === 'List' && <LayoutList size={16} />}
                {view === 'Board' && <LayoutGrid size={16} />}
                {view === 'Calendar' && <CalendarIcon size={16} />}
                {view === 'Gantt' && <GanttChart size={16} />}
                {view === 'Team' && <Users size={16} />}
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto bg-white dark:bg-black relative">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center font-bold">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
                <Search size={32} />
              </div>
              <h3 className="text-lg text-gray-400 dark:text-gray-600">No tasks found</h3>
              <p className="text-sm max-w-xs mt-2 text-gray-400 dark:text-gray-700 font-normal">Try adjusting your filters or search to find what you're looking for.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
              >
                <Plus size={16} />
                Create New Task
              </button>
            </div>
          ) : renderView()}
        </div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded flex items-center justify-center"><Plus size={14} /></div>
                Create New Task
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Task Title</label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-colors"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  placeholder="Add more details..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-sm min-h-[100px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-colors"
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Assignee</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-gray-900 dark:text-white"
                    value={newTask.assignee?.id}
                    onChange={e => setNewTask({ ...newTask, assignee: USERS.find(u => u.id === e.target.value) })}
                  >
                    {USERS.map(user => (
                      <option key={user.id} value={user.id} className="bg-white dark:bg-black">{user.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-gray-900 dark:text-white"
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                  >
                    <option value="Low" className="bg-white dark:bg-black">Low</option>
                    <option value="Normal" className="bg-white dark:bg-black">Normal</option>
                    <option value="High" className="bg-white dark:bg-black">High</option>
                    <option value="Urgent" className="bg-white dark:bg-black">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-gray-900 dark:text-white"
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value as Status })}
                  >
                    <option value="To Do" className="bg-white dark:bg-black">To Do</option>
                    <option value="In Progress" className="bg-white dark:bg-black">In Progress</option>
                    <option value="Review" className="bg-white dark:bg-black">Review</option>
                    <option value="Blocked" className="bg-white dark:bg-black">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-gray-900 dark:text-white"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95 uppercase"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-black">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">My Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white dark:bg-black">
              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase">Profile</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-bold">Your personal information and account security settings.</p>
                </div>

                <div className="col-span-8 space-y-8">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">Avatar</label>
                    <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 dark:text-orange-200 text-3xl font-bold border border-orange-200 dark:border-orange-900/30">A</div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-4 italic">AlBot</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon size={18} /></div>
                        <input
                          type="text"
                          defaultValue="AlBot"
                          className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Email</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></div>
                        <input
                          type="email"
                          defaultValue="c81776296@gmail.com"
                          className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Password</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Shield size={18} /></div>
                        <input
                          type="password"
                          placeholder="Enter New Password"
                          className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-12 gap-12 font-bold">
                <div className="col-span-4">
                  <h3 className="text-lg font-bold text-red-500 mb-2 uppercase">Danger zone</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Proceed with caution.</p>
                </div>
                <div className="col-span-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Log out all sessions including any session on mobile, iPad, and other browsers</p>
                    <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors uppercase">Log out all</button>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-500 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors uppercase border border-red-100 dark:border-red-900/30">Delete account</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end bg-gray-50 dark:bg-black">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 uppercase"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Space Modal */}
      {isSpaceModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-black">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Create a New Space</h2>
              <button onClick={() => setIsSpaceModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 font-bold bg-white dark:bg-black">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Space Name</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering, Marketing..."
                  className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Icon & Color</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform">S</div>
                    <div className="flex-1 h-10 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">Select Icon</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Privacy</label>
                  <div className="h-10 bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between px-3 text-sm text-gray-400 dark:text-gray-500 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-purple-500" />
                      <span>Private</span>
                    </div>
                    <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-500/5 rounded-xl border border-purple-100 dark:border-purple-500/10">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 font-bold">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-purple-700 dark:text-purple-200 uppercase tracking-tighter">Workspace Templates</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 font-normal">Start faster with a pre-built structure for your teams.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 bg-gray-50 dark:bg-black">
              <button
                onClick={() => setIsSpaceModalOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase"
              >
                Create Space
              </button>
              <button
                onClick={() => setIsSpaceModalOpen(false)}
                className="w-full text-sm font-bold text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors py-2 uppercase"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
