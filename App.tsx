
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
  GanttChart,
  Circle,
  Flag,
  FileText,
  Layout,
  Maximize2,
  Paperclip,
  Info,
  BarChart3,
  MessageSquare as MessageIcon,
  Layout as FormIcon,
  Edit3 as WhiteboardIcon,
  Share2 as MindMapIcon,
  MapPin,
  Table as TableIcon,
  Link,
  Droplet,
  PenTool,
  CircleDot,
  Box,
  Copy,
  Archive,
  Trash,
  ArrowRight,
  Pencil
} from 'lucide-react';
import { MOCK_TASKS, STATUS_COLORS, PRIORITY_COLORS, USERS } from './constants';
import { Task, ViewType, Status, Priority, User as UserType } from './types';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import CalendarView from './components/CalendarView';
import GanttView from './components/GanttView';
import TeamView from './components/TeamView';
import Overview from './components/Overview';

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
  const [activeTab, setActiveTab] = useState<'Home' | 'Planner' | 'Teams' | 'More'>('Home');
  const [activeView, setActiveView] = useState<ViewType>('List');
  const [activeContext, setActiveContext] = useState<NavigationContext>('Everything');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // App Global State
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('oasis-theme') as 'light' | 'dark') || 'light';
  });
  const [workspaceName, setWorkspaceName] = useState('');
  const [ownerName, setOwnerName] = useState('Augusto Silva');
  const [spaces, setSpaces] = useState<{ id: string, name: string, lists: string[] }[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isListSelectorOpen, setIsListSelectorOpen] = useState(false);
  const [hoveredBreadcrumb, setHoveredBreadcrumb] = useState<'space' | 'task' | null>(null);

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
  const [isViewSelectorOpen, setIsViewSelectorOpen] = useState(false);
  const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState(false);
  const [viewSearchQuery, setViewSearchQuery] = useState('');
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
      result = result.filter(t => t.tags.includes('Engineering') || t.tags.includes('Frontend') || t.tags.includes('Data Viz'));
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

  const handleAddTaskInline = (title: string, status: Status) => {
    if (!title) return;
    const taskToAdd: Task = {
      id: `TASK-${tasks.length + 1}`,
      title,
      description: '',
      status,
      priority: 'Normal',
      assignee: USERS[0],
      dueDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      tags: (activeContext !== 'Everything' && activeContext !== 'Home' && activeContext !== 'My Tasks' && activeContext !== 'Pulse' ? [activeContext] : []),
    };
    setTasks(prev => [taskToAdd, ...prev]);
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
    const commonProps = {
      tasks: filteredTasks,
      isDarkMode: currentTheme === 'dark',
      onTaskClick: (task: Task) => setSelectedTask(task)
    };
    switch (activeView) {
      case 'List': return <ListView {...commonProps} onToggleStatus={toggleTaskStatus} onAddTask={() => setIsModalOpen(true)} onAddTaskInline={handleAddTaskInline} />;
      case 'Board': return <BoardView {...commonProps} />;
      case 'Calendar': return <CalendarView {...commonProps} />;
      case 'Gantt': return <GanttView {...commonProps} />;
      case 'Team': return <TeamView {...commonProps} />;
      default: return <ListView {...commonProps} onToggleStatus={toggleTaskStatus} onAddTask={() => setIsModalOpen(true)} onAddTaskInline={handleAddTaskInline} />;
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
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Active Integrations</h4>
            <p className="text-sm text-gray-500">No active integrations.</p>
          </div>
        );
      default:
        return <div className="p-20 text-center text-gray-400 font-bold dark:text-gray-500">Content for {activeSettingsTab} is coming soon.</div>;
    }
  };

  return (
    <div className={`${currentTheme === 'dark' ? 'dark' : ''} flex h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300 tracking-tighter`}>
      {/* Primary Sidebar - Icon Only */}
      <aside className={`w-16 bg-white dark:bg-black border-r border-gray-200 dark:border-[#2a2a35] flex flex-col items-center py-6 gap-8 z-[60] flex-shrink-0 relative`}>
        <div className="flex flex-col items-center gap-6 w-full flex-1">
          <img src="/oasis_logo-dash.webp" alt="Oasis Logo" className="w-8 h-8 rounded-lg object-contain hover:rotate-6 transition-transform cursor-pointer" />

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
              <span className="text-[10px] font-bold transition-opacity tracking-tighter">{item.id}</span>
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 dark:bg-white rounded-r-full" />}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 w-full pt-4 border-t border-gray-200 dark:border-[#2a2a35]">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group w-full font-bold">
            <UserPlus size={24} />
            <span className="text-[10px] tracking-tighter">Invite</span>
          </button>
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-[#16161e] shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >AS</div>
        </div>
      </aside>

      {/* Secondary Drawer Panel - Refactored for smooth animation */}
      <aside
        className={`bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-[#2a2a35] flex flex-col z-50 relative group/drawer transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? 'w-72' : 'w-0 border-none'}`}
      >
        <div className={`w-72 flex-1 flex flex-col transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
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
                      <span className="text-sm flex-1 truncate">
                        All Tasks {workspaceName && <span className="text-gray-400 dark:text-gray-600 font-normal">- {workspaceName}</span>}
                      </span>
                    </div>

                    {spaces.map(space => (
                      <div key={space.id} className="flex items-center gap-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 cursor-pointer group">
                        <div className="w-5 h-5 bg-purple-600/20 text-purple-600 rounded flex items-center justify-center text-[10px] font-bold">
                          {space.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm flex-1 truncate">{space.name}</span>
                      </div>
                    ))}

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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-black relative">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-black border-b border-gray-200 dark:border-[#2a2a35] flex items-center px-6 z-40 relative">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-bold py-1"
              onMouseEnter={() => setHoveredBreadcrumb('breadcrumbs')}
              onMouseLeave={() => setHoveredBreadcrumb(null)}
            >
              <span
                className="flex items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors py-1 group/space"
                onClick={() => setActiveView('Overview')}
              >
                <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center text-[10px] text-white">
                  {(workspaceName ? workspaceName[0] : '?').toUpperCase()}
                </div>
                {workspaceName || 'Workspace (?)'}
              </span>
              <span className="text-gray-300 dark:text-gray-600 px-1">/</span>
              <div className="relative">
                <span
                  className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 px-2 py-1 rounded transition-colors group/task"
                  onClick={() => setIsListSelectorOpen(!isListSelectorOpen)}
                >
                  <Activity size={12} className="text-gray-400 dark:text-gray-500" />
                  {/* Fallback for Task name */}
                  {activeContext && activeContext !== 'Everything' ? activeContext : 'Task (?)'}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isListSelectorOpen ? 'rotate-180' : ''}`} />
                </span>

                {isListSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-50" onClick={() => setIsListSelectorOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-100 font-normal">
                      <div className="px-3 pb-2 border-b border-gray-100 dark:border-white/5 mx-2 mb-2">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                          <Activity size={14} className="text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search lists..."
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                            readOnly
                          />
                          <Share2 size={14} className="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors" />
                          <div className="relative">
                            <MoreHorizontal
                              size={14}
                              className="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                              onClick={() => {
                                setIsTaskOptionsOpen(!isTaskOptionsOpen);
                              }}
                            />

                            {/* Image 2: Task options menu */}
                            {isTaskOptionsOpen && (
                              <>
                                <div className="fixed inset-0 z-[70]" onClick={() => setIsTaskOptionsOpen(false)} />
                                <div className="absolute top-0 left-full ml-2 w-72 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-2xl z-[80] overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                  <div className="space-y-0.5 py-1">
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><Star size={14} /> Favorite</div>
                                      <ChevronRight size={14} />
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Pencil size={14} /> Rename
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Link size={14} /> Copy link
                                    </button>
                                  </div>
                                  <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />
                                  <div className="space-y-0.5 py-1">
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><Plus size={14} /> Create new</div>
                                      <ChevronRight size={14} />
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><Droplet size={14} /> Color & Icon</div>
                                      <ChevronRight size={14} />
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><PenTool size={14} /> Templates</div>
                                      <ChevronRight size={14} />
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Zap size={14} /> Automations
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Pencil size={14} /> Custom Fields
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <CircleDot size={14} /> Task statuses
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><MoreHorizontal size={14} /> More</div>
                                      <ChevronRight size={14} />
                                    </button>
                                  </div>
                                  <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />
                                  <div className="space-y-0.5 py-1">
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Info size={14} /> List Info
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><Box size={14} /> Default task type</div>
                                      <ChevronRight size={14} />
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Mail size={14} /> Email to List
                                    </button>
                                  </div>
                                  <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />
                                  <div className="space-y-0.5 py-1">
                                    <button className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <div className="flex items-center gap-3"><ArrowRight size={14} /> Move</div>
                                      <ChevronRight size={14} />
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Copy size={14} /> Duplicate
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Archive size={14} /> Archive
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                      <Trash size={14} /> Delete
                                    </button>
                                  </div>
                                  <div className="p-2 mt-1">
                                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg">
                                      Sharing & Permissions
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-1">
                        {spaces.map(space => (
                          <div key={space.id} className="mb-2 last:mb-0">
                            <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center text-[8px] text-white">
                                {space.name[0].toUpperCase()}
                              </div>
                              {space.name}
                            </div>
                            <div className="px-1 space-y-0.5">
                              {space.lists.map((listName) => (
                                <div
                                  key={listName}
                                  className={`px-3 py-1.5 flex items-center gap-3 text-sm transition-colors rounded-lg cursor-pointer ${activeContext === listName ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                  onClick={() => {
                                    setActiveContext(listName as any);
                                    setIsListSelectorOpen(false);
                                  }}
                                >
                                  <Activity size={14} /> {listName}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1 ${isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
              >
                <Star size={16} fill={isFavorited ? "currentColor" : "none"} />
              </button>

              <div className={`flex items-center gap-2 ml-1 px-2 py-1 bg-white dark:bg-black/40 border border-gray-100 dark:border-white/10 rounded-lg shadow-sm transition-all duration-200 ${hoveredBreadcrumb ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
                <FileText size={14} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" />
                <UserIcon size={14} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" />
                <Flag size={14} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" />
                <Calendar size={14} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 w-96 max-w-[30%]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
              <input
                type="text"
                placeholder="Search Ctrl K"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-1.5 bg-gray-100 dark:bg-[#16161e] border border-transparent dark:border-gray-800 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-[#1c1c24] focus:border-purple-500 dark:focus:border-purple-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 font-bold ml-auto">
            <button className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs">
              <Share2 size={14} /> Share
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors border border-gray-100 dark:border-gray-800"
              >
                {currentTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold border border-white dark:border-gray-800 shadow-sm cursor-pointer uppercase">AS</div>
            </div>
          </div>
        </header>

        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-6 shrink-0 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6 h-full">
            <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-lg text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm border-dashed">
              Add Channel
            </button>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
            <div className="flex items-center gap-4 h-full">
              {(['Overview', 'List', 'Board', 'Calendar', 'Gantt', 'Team'] as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`h-full flex items-center gap-1.5 text-xs font-bold border-b-2 transition-all relative ${activeView === view
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                >
                  {view === 'Overview' && <LayoutList size={14} />}
                  {view === 'List' && <LayoutList size={14} />}
                  {view === 'Board' && <LayoutGrid size={14} />}
                  {view === 'Calendar' && <CalendarIcon size={14} />}
                  {view === 'Gantt' && <GanttChart size={14} />}
                  {view === 'Team' && <Users size={14} />}
                  {view}
                </button>
              ))}
              <div className="relative h-full flex items-center">
                <button
                  onClick={() => setIsViewSelectorOpen(!isViewSelectorOpen)}
                  className={`h-full flex items-center gap-1 text-xs font-bold transition-all relative px-2 ${isViewSelectorOpen ? 'text-purple-600' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                  <Plus size={14} /> View
                </button>

                {isViewSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsViewSelectorOpen(false)} />
                    <div className="absolute top-full right-0 mt-1 w-[480px] bg-[#1e1e1f] border border-gray-800 rounded-xl shadow-2xl z-[110] p-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                          type="text"
                          placeholder="Search views..."
                          value={viewSearchQuery}
                          onChange={(e) => setViewSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#121213] border border-purple-500/30 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-all font-normal"
                          autoFocus
                        />
                      </div>

                      <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {/* Popular Section */}
                        <div>
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Popular</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'List', desc: 'Track tasks, bugs, people & more', icon: <LayoutList size={18} />, color: 'bg-gray-600' },
                              { id: 'Gantt', desc: 'Plan dependencies & time', icon: <GanttChart size={18} />, color: 'bg-red-500' },
                              { id: 'Calendar', desc: 'Plan, schedule, & delegate', icon: <CalendarIcon size={18} />, color: 'bg-orange-500' },
                              { id: 'Doc', desc: 'Collaborate & document anything', icon: <FileText size={18} />, color: 'bg-blue-400' },
                              { id: 'Board', label: 'Board – Kanban', desc: 'Move tasks between columns', icon: <LayoutGrid size={18} />, color: 'bg-blue-600' },
                              { id: 'Form', desc: 'Collect, track, & report data', icon: <FormIcon size={18} />, color: 'bg-purple-600' },
                            ].map(view => (
                              <button
                                key={view.id}
                                onClick={() => {
                                  setActiveView(view.id as ViewType);
                                  setIsViewSelectorOpen(false);
                                }}
                                className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/10 transition-all text-left group"
                              >
                                <div className={`w-9 h-9 ${view.color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                                  {view.icon}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-gray-200 group-hover:text-white">{view.label || view.id}</div>
                                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{view.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* More views Section */}
                        <div className="border-t border-gray-800/50 pt-4">
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">More views</h3>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {[
                              { id: 'Table', desc: 'Structured table format', icon: <TableIcon size={18} />, color: 'bg-green-600' },
                              { id: 'Dashboard', desc: 'Track metrics & insights', icon: <BarChart3 size={18} />, color: 'bg-purple-500' },
                              { id: 'Timeline', desc: 'See tasks by start & due date', icon: <GanttChart size={18} />, color: 'bg-orange-800/60' },
                              { id: 'Activity', desc: 'Real-time activity feed', icon: <Activity size={18} />, color: 'bg-blue-400/80' },
                              { id: 'Workload', desc: 'Visualize team capacity', icon: <Users size={18} />, color: 'bg-cyan-600' },
                              { id: 'Whiteboard', desc: 'Visualize & brainstorm ideas', icon: <WhiteboardIcon size={18} />, color: 'bg-yellow-500' },
                              { id: 'Team', desc: 'Monitor work being done', icon: <Users size={18} />, color: 'bg-purple-600' },
                              { id: 'Mind Map', desc: 'Visual brainstorming of ideas', icon: <MindMapIcon size={18} />, color: 'bg-pink-500' },
                              { id: 'Map', desc: 'Tasks visualized by address', icon: <MapPin size={18} />, color: 'bg-orange-600' },
                            ].map(view => (
                              <button
                                key={view.id}
                                onClick={() => {
                                  if (['Table', 'List', 'Board', 'Calendar', 'Gantt', 'Team'].includes(view.id)) {
                                    setActiveView(view.id as ViewType);
                                  }
                                  setIsViewSelectorOpen(false);
                                }}
                                className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/10 transition-all text-left group"
                              >
                                <div className={`w-9 h-9 ${view.color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                                  {view.icon}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-gray-200 group-hover:text-white">{view.id}</div>
                                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{view.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-[#1c1c1e]/50 rounded-lg p-0.5 border border-gray-200 dark:border-[#2c2c2e]">
              <button className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Filter size={12} /> Filter
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-l border-gray-200 dark:border-gray-800">
                <Check size={12} /> Closed
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-l border-gray-200 dark:border-gray-800">
                <Users size={12} /> Assignee
              </button>
              <button className="p-1 px-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border-l border-gray-200 dark:border-gray-800">
                <Search size={12} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Settings size={12} /> Customize
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white dark:bg-black relative w-full">
          {activeView === 'Overview' && <Overview tasks={tasks} />}
          {
            activeView !== 'Overview' && filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center font-bold">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
                  <Search size={32} />
                </div>
                <p className="text-xl mb-2">No tasks found</p>
                <p className="text-sm max-w-xs font-medium mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                  <Plus size={16} />
                  Create New Task
                </button>
              </div>
            ) : renderView()
          }
        </div>
      </main>

      {/* Modals */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e1e1e] w-full max-w-3xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
              {/* Tabs Header */}
              <div className="flex items-center justify-between px-6 pt-4 border-b border-gray-800/50">
                <div className="flex items-center gap-6">
                  {['Task', 'Doc', 'Reminder', 'Whiteboard', 'Dashboard'].map((tab, idx) => (
                    <button key={tab} className={`pb-3 text-sm font-bold relative ${idx === 0 ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      {tab}
                      {idx === 0 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500" />}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <button className="p-1.5 hover:bg-gray-800 rounded text-gray-500"><Maximize2 size={16} /></button>
                  <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-800 rounded text-gray-500"><X size={16} /></button>
                </div>
              </div>

              <form onSubmit={handleCreateTask} className="p-6 space-y-6">
                {/* Location and Type Selectors */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs font-bold text-gray-300 cursor-pointer hover:bg-gray-800 transition-colors">
                    <LayoutList size={14} className="text-gray-500" />
                    <span>{activeContext === 'Everything' ? 'Workspace' : activeContext}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs font-bold text-gray-300 cursor-pointer hover:bg-gray-800 transition-colors">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    </div>
                    <span>Task</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-4">
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder="Task Name or type '/' for commands"
                    className="w-full bg-transparent border-none text-2xl font-bold text-white placeholder:text-gray-600 focus:outline-none"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  />

                  <div className="flex flex-col gap-3">
                    <button type="button" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium w-fit">
                      <FileText size={18} />
                      Add description
                    </button>
                  </div>
                </div>

                {/* Field Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <div className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border border-gray-700/50">TO DO</div>
                  <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 transition-colors">
                    <UserIcon size={14} /> Assignee
                  </button>
                  <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 transition-colors">
                    <Calendar size={14} /> Due date
                  </button>
                  <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 transition-colors">
                    <Flag size={14} /> Priority
                  </button>
                  <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 transition-colors">
                    <Hash size={14} /> Tags
                  </button>
                  <button type="button" className="p-1.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-gray-400">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {/* Custom Fields Section */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Custom Fields</h4>
                  <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 transition-colors">
                    <Plus size={14} /> Create new field
                  </button>
                </div>

                {/* Footer */}
                <div className="pt-8 flex items-center justify-between border-t border-gray-800/50 mt-4">
                  <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-lg text-xs font-bold text-gray-300 transition-colors">
                    Templates
                  </button>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-gray-500">
                      <button type="button" className="hover:text-gray-300"><Paperclip size={18} /></button>
                      <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
                        <Bell size={18} />
                        <span className="text-sm font-bold">1</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button type="submit" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-l-xl transition-colors shadow-lg shadow-purple-500/10">
                        Create Task
                      </button>
                      <div className="w-px h-10 bg-purple-500/50" />
                      <button type="button" className="px-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-r-xl transition-colors shadow-lg shadow-purple-500/10">
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Settings Modal */}
      {
        isSettingsOpen && (
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
        )
      }

      {/* Create Space Modal */}
      {
        isSpaceModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#121213] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
              {/* Modal Header */}
              <div className="px-8 pt-6 pb-2 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Create a Space</h2>
                  <p className="text-sm text-gray-500 font-medium">A Space represents teams, departments, or groups, each with its own Lists, workflows, and settings.</p>
                </div>
                <button onClick={() => setIsSpaceModalOpen(false)} className="p-1 hover:bg-gray-800 rounded text-gray-400 self-start mt-1">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 pb-4 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Icon & Name Section */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-300">Icon & name</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#2e2e2e] border border-gray-700 font-black text-white flex items-center justify-center text-lg shadow-inner">S</div>
                    <input
                      type="text"
                      placeholder="e.g. Marketing, Engineering, HR"
                      className="flex-1 bg-transparent border border-gray-800 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all font-medium"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-300">Description <span className="text-gray-600 font-medium">(optional)</span></label>
                  <textarea
                    className="w-full bg-transparent border border-gray-800 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all font-medium min-h-[44px] resize-none"
                  />
                </div>

                {/* Default Permissions Section */}
                <div className="flex items-center justify-between group cursor-pointer pt-2">
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-300">Default permission</span>
                    <Info size={14} className="text-gray-600" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1b] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 group-hover:bg-[#202021] transition-colors">
                    Full edit
                    <ChevronDown size={14} />
                  </div>
                </div>

                {/* Private Toggle Section */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-gray-300">Make Private</div>
                    <div className="text-xs text-gray-500 font-medium">Only you and invited members have access</div>
                  </div>
                  <div className="w-11 h-6 bg-[#2a2a2b] rounded-full relative p-1 cursor-pointer transition-colors active:scale-95">
                    <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-800 flex items-center justify-between bg-[#121213]">
                <button className="text-sm font-bold text-gray-500 hover:text-gray-300 transition-colors">
                  Use Templates
                </button>
                <button
                  onClick={() => setIsSpaceModalOpen(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/10"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Task Detail Modal */}
      {
        selectedTask && (
          <div className="fixed inset-0 z-[150] flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f0f13] w-full max-w-[95%] h-full flex animate-in slide-in-from-right duration-300 border-l border-gray-800">
              {/* Modal Content - Main Detail Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Modal Header */}
                <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded">
                      <Hash size={12} />
                      <span>Task</span>
                    </div>
                    <div className="text-gray-500">86ewkpyb7</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                    <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                  {/* Title Section */}
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6">{selectedTask.title}</h2>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-x-20 gap-y-6 max-w-4xl">
                    {/* Status */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Circle size={14} />
                        Status
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-800 text-white rounded text-xs font-black uppercase tracking-widest">Clients</span>
                        <ChevronRight size={14} className="text-gray-600" />
                        <div className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center text-green-500"><Check size={12} /></div>
                      </div>
                    </div>

                    {/* Assignees */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Users size={14} />
                        Assignees
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-600">Empty</span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Calendar size={14} />
                        Dates
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-600">
                        <Clock size={14} />
                        <span>Start → Due</span>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Flag size={14} />
                        Priority
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-600">Empty</span>
                    </div>

                    {/* Time Estimate */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Clock size={14} />
                        Time Estimate
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-600">Empty</span>
                    </div>

                    {/* Track Time */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Activity size={14} />
                        Track Time
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-bold text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Add time
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Hash size={14} />
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-[10px] font-black uppercase tracking-widest border border-purple-500/20">client</span>
                      </div>
                    </div>

                    {/* Relationships */}
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <Zap size={14} />
                        Relationships
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-600">Empty</span>
                    </div>
                  </div>

                  {/* Description Text Area */}
                  <div className="p-8 border border-gray-800 bg-[#16161e]/30 rounded-[32px] max-w-4xl min-h-[160px]">
                    <p className="text-sm font-bold text-gray-300 leading-relaxed mb-1">Phone: +971 50 963 6126</p>
                    <p className="text-sm font-bold text-gray-300 leading-relaxed">Email: info@kocrossboxdubai.com</p>
                  </div>

                  {/* Section Tabs */}
                  <div className="flex items-center gap-8 border-b border-gray-800 max-w-4xl">
                    {['Details', 'Subtasks', 'Action Items'].map((tab, idx) => (
                      <button key={tab} className={`pb-4 text-sm font-black uppercase tracking-tighter relative ${idx === 0 ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                        {tab}
                        {idx === 0 && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-orange-500" />}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom Fields */}
                  <div className="space-y-6 max-w-4xl pt-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">Add Custom Fields</h3>
                    <button className="px-4 py-2 border border-gray-800/50 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-800/30 transition-colors">
                      + Create a field in this List
                    </button>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-6 max-w-4xl pt-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">Attachments</h3>
                    <div className="border-2 border-dashed border-gray-800/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-purple-500/30 transition-colors cursor-pointer">
                      <p className="text-sm font-black text-gray-600 group-hover:text-gray-400 transition-colors">Drop your files here to <span className="underline">upload</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Activity Panel */}
              <div className="w-[380px] border-l border-gray-800 flex flex-col bg-[#0f0f13] overflow-hidden">
                <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Activity</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Search size={16} className="hover:text-white cursor-pointer" />
                    <Filter size={16} className="hover:text-white cursor-pointer" />
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer">
                      <MessageSquare size={16} />
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <MoreHorizontal size={16} className="hover:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4">
                  <div className="flex items-start gap-4 text-[10px] font-bold text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1" />
                    <div className="flex-1">
                      <p>Gustavo created this task</p>
                    </div>
                    <span className="text-gray-700">11:43 am</span>
                  </div>
                  <div className="flex items-start gap-4 text-[10px] font-bold text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1" />
                    <div className="flex-1">
                      <p>Gustavo added tag client</p>
                    </div>
                    <span className="text-gray-700">11:43 am</span>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-800 bg-[#16161e]/50">
                  <div className="bg-[#0f0f13] border border-gray-800 rounded-2xl p-4 flex flex-col gap-4">
                    <textarea
                      className="w-full bg-transparent border-none focus:outline-none resize-none text-sm font-medium text-white placeholder:text-gray-700 min-h-[60px]"
                      placeholder="Write a comment..."
                    />
                    <div className="flex items-center justify-between pt-2 border-t border-gray-900">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-900 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:bg-gray-800">
                        Comment
                        <ChevronDown size={12} />
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MoreHorizontal size={16} className="hover:text-gray-400 cursor-pointer" />
                        <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
                          <MessageSquare size={16} />
                          <span className="text-xs">1</span>
                        </div>
                        <button className="p-1.5 bg-gray-800 rounded-lg hover:text-white transition-colors">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default App;
