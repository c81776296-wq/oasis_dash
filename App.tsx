
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
  MessageCircle,
  Send,
  Video,
  Trophy,
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
  Pencil,
  Goal,
  FolderOpen,
  List,
  Layers,
  GitMerge,
  Wand2,
  Save,
  Pin,
  Lock,
  Download,
  ArrowUpDown,
  Circle as CircleIcon,
  Diamond,
  FileMinus,
  MessageSquare as MessageNote,
  Type,
  TextCursorInput,
  ListOrdered,
  CheckSquare,
  DollarSign,
  Globe,
  Sigma,
  Hourglass,
  Link2,
  GitMerge as SubtaskIcon,
  ListChecks,
  Smile,
  AlertCircle,
  Tag,
  Phone,
  Sparkles,
  Quote,
  Code,
  Strikethrough,
  Square,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  GripVertical,
  HelpCircle,
  CheckCircle2,
  Eye,
  RefreshCw,
  RotateCcw,
  AlignLeft
} from 'lucide-react';
import { USERS, PRIORITY_COLORS, STATUS_COLORS, MOCK_TAGS, TEAMS, MOCK_TASKS } from './constants';
import { Task, ViewType, Status, Priority, User as UserType } from './types';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import CalendarView from './components/CalendarView';
import GanttView from './components/GanttView';
import TeamView from './components/TeamView';
import Overview from './components/Overview';

const DOC_MENU_GROUPS = [
  {
    category: 'SUGGESTIONS',
    items: [
      { label: 'Banners', icon: Flag, color: 'text-gray-500' },
      { label: 'Checklist', icon: CheckSquare, color: 'text-gray-500' },
      { label: 'Oasis List (Table)', icon: TableIcon, color: 'text-gray-500' },
      { label: 'Toggle list', icon: ChevronRight, color: 'text-gray-500' },
      { label: 'Button', icon: Square, color: 'text-gray-500' },
    ]
  },
  {
    category: 'TEXT',
    items: [
      { label: 'Normal text', icon: Type, color: 'text-gray-500' },
      { label: 'Heading 1', icon: Heading1, color: 'text-gray-500' },
      { label: 'Heading 2', icon: Heading2, color: 'text-gray-500' },
      { label: 'Heading 3', icon: Heading3, color: 'text-gray-500' },
      { label: 'Heading 4', icon: Heading4, color: 'text-gray-500' },
      { label: 'Numbered list', icon: ListOrdered, color: 'text-gray-500' },
      { label: 'Toggle list', icon: ChevronRight, color: 'text-gray-500' },
      { label: 'Banners', icon: Flag, color: 'text-gray-500' },
      { label: 'Code block', icon: Code, color: 'text-gray-500' },
      { label: 'Block quote', icon: Quote, color: 'text-gray-500' },
      { label: 'Bulleted list', icon: List, color: 'text-gray-500' },
      { label: 'Pull quote', icon: Quote, color: 'text-gray-500' },
    ]
  },
  {
    category: 'TEXT COLORS',
    items: [
      { label: 'Default', icon: Type, color: 'text-gray-700' },
      { label: 'Red', icon: Type, color: 'text-red-500' },
      { label: 'Orange', icon: Type, color: 'text-orange-500' },
      { label: 'Yellow', icon: Type, color: 'text-yellow-500' },
      { label: 'Blue', icon: Type, color: 'text-blue-500' },
      { label: 'Purple', icon: Type, color: 'text-black' },
      { label: 'Pink', icon: Type, color: 'text-pink-500' },
      { label: 'Green', icon: Type, color: 'text-green-500' },
      { label: 'Grey', icon: Type, color: 'text-gray-500' },
    ]
  },
  {
    category: 'HIGHLIGHTS',
    items: [
      { label: 'Remove highlight', icon: X, color: 'text-gray-500' },
      { label: 'Red highlight', icon: Square, color: 'text-red-500' },
      { label: 'Orange highlight', icon: Square, color: 'text-orange-500' },
      { label: 'Yellow highlight', icon: Square, color: 'text-yellow-500' },
      { label: 'Blue highlight', icon: Square, color: 'text-blue-500' },
      { label: 'Purple highlight', icon: Square, color: 'text-black' },
      { label: 'Pink highlight', icon: Square, color: 'text-pink-500' },
      { label: 'Green highlight', icon: Square, color: 'text-green-500' },
      { label: 'Grey highlight', icon: Square, color: 'text-gray-500' },
    ]
  },
  {
    category: 'BADGES',
    items: [
      { label: 'Remove badge', icon: X, color: 'text-gray-500' },
      { label: 'Red badge', icon: Tag, color: 'text-red-500' },
      { label: 'Strong red badge', icon: Tag, color: 'text-red-700' },
      { label: 'Orange badge', icon: Tag, color: 'text-orange-500' },
      { label: 'Strong orange badge', icon: Tag, color: 'text-orange-700' },
      { label: 'Yellow badge', icon: Tag, color: 'text-yellow-500' },
      { label: 'Strong yellow badge', icon: Tag, color: 'text-yellow-700' },
      { label: 'Blue badge', icon: Tag, color: 'text-blue-500' },
      { label: 'Strong blue badge', icon: Tag, color: 'text-blue-700' },
      { label: 'Purple badge', icon: Tag, color: 'text-black' },
      { label: 'Strong purple badge', icon: Tag, color: 'text-purple-700' },
      { label: 'Pink badge', icon: Tag, color: 'text-pink-500' },
      { label: 'Strong pink badge', icon: Tag, color: 'text-pink-700' },
      { label: 'Green badge', icon: Tag, color: 'text-green-500' },
      { label: 'Strong green badge', icon: Tag, color: 'text-green-700' },
      { label: 'Grey badge', icon: Tag, color: 'text-gray-500' },
      { label: 'Strong grey badge', icon: Tag, color: 'text-gray-700' },
    ]
  },
  {
    category: 'INLINE',
    items: [
      { label: 'Mention a Task', icon: Check, color: 'text-gray-500' },
      { label: 'Mention a Page', icon: FileText, color: 'text-gray-500' },
    ]
  },
  {
    category: 'VIEWS',
    items: [
      { label: 'Oasis List (Table)', icon: TableIcon, color: 'text-gray-500' },
      { label: 'Oasis List (List)', icon: List, color: 'text-gray-500' },
      { label: 'Oasis List (Board)', icon: Layout, color: 'text-gray-500' },
    ]
  },
  {
    category: 'FORMATTING',
    items: [
      { label: 'Clear format', icon: X, color: 'text-gray-500' },
      { label: 'Bold', icon: Type, color: 'text-gray-500' },
      { label: 'Italic', icon: Type, color: 'text-gray-500' },
      { label: 'Strikethrough', icon: Strikethrough, color: 'text-gray-500' },
      { label: 'Inline code', icon: Code, color: 'text-gray-500' },
      { label: 'Website Link', icon: Link, color: 'text-gray-500' },
    ]
  },
  {
    category: 'ADVANCED BLOCKS',
    items: [
      { label: 'Divider', icon: Minus, color: 'text-gray-500' },
      { label: 'Table', icon: TableIcon, color: 'text-gray-500' },
      { label: 'Button', icon: Square, color: 'text-gray-500' },
      { label: 'Markdown', icon: FileText, color: 'text-gray-500' },
    ]
  }
];

const FILTER_OPTIONS = [
  { id: 'status', label: 'Status', icon: <CircleDot size={14} /> },
  { id: 'tags', label: 'Tags', icon: <Tag size={14} /> },
  { id: 'due_date', label: 'Due date', icon: <Calendar size={14} /> },
  { id: 'priority', label: 'Priority', icon: <Flag size={14} /> },
  { id: 'assignee', label: 'Assignee', icon: <Users size={14} /> },
  { id: 'archived', label: 'Archived', icon: <Archive size={14} /> },
  { id: 'assigned_comment', label: 'Assigned comment', icon: <MessageSquare size={14} /> },
  { id: 'created_by', label: 'Created by', icon: <UserPlus size={14} /> },
  { id: 'date_closed', label: 'Date closed', icon: <Calendar size={14} /> },
  { id: 'date_created', label: 'Date created', icon: <Calendar size={14} /> },
  { id: 'date_updated', label: 'Date updated', icon: <Calendar size={14} /> },
  { id: 'date_done', label: 'Date done', icon: <Calendar size={14} /> },
  { id: 'dependency', label: 'Dependency', icon: <GitMerge size={14} /> },
  { id: 'duration', label: 'Duration', icon: <Clock size={14} /> },
  { id: 'location_list', label: 'Location/List', icon: <LayoutList size={14} /> },
  { id: 'recurring', label: 'Recurring', icon: <RefreshCw size={14} /> },
  { id: 'start_date', label: 'Start date', icon: <Calendar size={14} /> },
  { id: 'status_is_closed', label: 'Status is closed', icon: <Check size={14} /> },
  { id: 'time_estimate', label: 'Time estimate', icon: <Hourglass size={14} /> },
  { id: 'time_tracked', label: 'Time tracked', icon: <Clock size={14} /> },
  { id: 'sprint_points', label: 'Sprint points', icon: <Star size={14} /> },
  { id: 'follower', label: 'Follower', icon: <Eye size={14} /> },
  { id: 'task_type', label: 'Task type', icon: <Box size={14} /> },
  { id: 'last_status_change', label: 'Last status change', icon: <RotateCcw size={14} /> },
  { id: 'task_name', label: 'Task Name', icon: <Type size={14} /> },
  { id: 'task_description', label: 'Task Description', icon: <AlignLeft size={14} /> },
];

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

  // Create List Modal State
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedSpaceIdForList, setSelectedSpaceIdForList] = useState<string>('');
  const [isListPrivate, setIsListPrivate] = useState(false);
  const [isSpaceSelectorOpen, setIsSpaceSelectorOpen] = useState(false);

  // Advanced Filter State
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isFilterTypeDropdownOpen, setIsFilterTypeDropdownOpen] = useState(false);
  const [filterTypeSearchQuery, setFilterTypeSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [isSavedFiltersDropdownOpen, setIsSavedFiltersDropdownOpen] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('oasis-theme', currentTheme);
  }, [currentTheme]);

  // Sync view name with active view
  useEffect(() => {
    setViewName(activeView);
  }, [activeView]);

  // Modals & Panels State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [spaceModalStep, setSpaceModalStep] = useState(1);
  const [spaceWorkflowOption, setSpaceWorkflowOption] = useState('Starter');
  const [spaceDefaultViews, setSpaceDefaultViews] = useState(['List', 'Board']);
  const [tempSpaceDefaultViews, setTempSpaceDefaultViews] = useState(['List', 'Board']);
  const [spaceTaskStatuses, setSpaceTaskStatuses] = useState([
    { category: 'Not started', statuses: [{ name: 'TO DO', color: '#87909e' }] },
    { category: 'Active', statuses: [{ name: 'IN PROGRESS', color: '#9333ea' }] },
    { category: 'Done', statuses: [] },
    { category: 'Closed', statuses: [{ name: 'COMPLETE', color: '#10b981' }] }
  ]);
  const [tempSpaceTaskStatuses, setTempSpaceTaskStatuses] = useState([
    { category: 'Not started', statuses: [{ name: 'TO DO', color: '#87909e' }] },
    { category: 'Active', statuses: [{ name: 'IN PROGRESS', color: '#9333ea' }] },
    { category: 'Done', statuses: [] },
    { category: 'Closed', statuses: [{ name: 'COMPLETE', color: '#10b981' }] }
  ]);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [isSpacePrivate, setIsSpacePrivate] = useState(false);
  const [isPermissionPickerOpen, setIsPermissionPickerOpen] = useState(false);
  const [selectedSpacePermission, setSelectedSpacePermission] = useState('Full edit');
  const [isViewSelectorOpen, setIsViewSelectorOpen] = useState(false);
  const [isTaskOptionsOpen, setIsTaskOptionsOpen] = useState(false);
  const [viewSearchQuery, setViewSearchQuery] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('General');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isMainCreateDropdownOpen, setIsMainCreateDropdownOpen] = useState(false);

  // Temporary Settings State (for Cancel/Save logic)
  const [tempWorkspaceName, setTempWorkspaceName] = useState('');
  const [tempOwnerName, setTempOwnerName] = useState('');
  // Customize View State
  const [isCustomizeViewOpen, setIsCustomizeViewOpen] = useState(false);
  const [viewName, setViewName] = useState('List');

  // List View Options
  const [showEmptyStatuses, setShowEmptyStatuses] = useState(false);
  const [wrapText, setWrapText] = useState(false);
  const [showTaskLocations, setShowTaskLocations] = useState(false);
  const [showSubtaskParentNames, setShowSubtaskParentNames] = useState(false);
  const [showClosedTasks, setShowClosedTasks] = useState(false);

  // Board View Options
  const [boardWorkload, setBoardWorkload] = useState('Number of tasks');
  const [boardShowTaskLocations, setBoardShowTaskLocations] = useState(false);
  const [boardShowSubtaskParentNames, setBoardShowSubtaskParentNames] = useState(false);

  // Calendar View Options
  const [calendarTaskDates, setCalendarTaskDates] = useState('1 shown');
  const [calendarColorTasksBy, setCalendarColorTasksBy] = useState('Task status');
  const [calendarTimeFormat, setCalendarTimeFormat] = useState('12h');
  const [calendarShowWeekends, setCalendarShowWeekends] = useState(true);
  const [calendarShowWeekNumbers, setCalendarShowWeekNumbers] = useState(false);

  // Gantt View Options
  const [ganttShowWeekends, setGanttShowWeekends] = useState(true);
  const [ganttShowCriticalPath, setGanttShowCriticalPath] = useState(false);
  const [ganttShowSlackTime, setGanttShowSlackTime] = useState(false);
  const [ganttFullScreen, setGanttFullScreen] = useState(false);
  const [ganttRescheduleDependencies, setGanttRescheduleDependencies] = useState(true);

  // Customize View General Options
  const [autosaveView, setAutosaveView] = useState(false);
  const [pinView, setPinView] = useState(false);
  const [privateView, setPrivateView] = useState(false);
  const [protectView, setProtectView] = useState(false);
  const [defaultView, setDefaultView] = useState(false);

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
    status: 'TO DO',
    priority: 'Clear',
    assignee: undefined,
    dueDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    tags: [],
    taskType: 'Task'
  });

  // Modal Picker States
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [isDescriptionInputOpen, setIsDescriptionInputOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calendar State for Date Picker
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Location Picker State
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [recents, setRecents] = useState<NavigationContext[]>([]);


  // Advanced Modal Pickers State
  const [showTaskTypePicker, setShowTaskTypePicker] = useState(false);
  const [showCustomFieldPicker, setShowCustomFieldPicker] = useState(false);
  const [customFieldSearchQuery, setCustomFieldSearchQuery] = useState('');
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showMoreOptionsPicker, setShowMoreOptionsPicker] = useState(false);
  const [showWatcherPicker, setShowWatcherPicker] = useState(false);
  const [watcherSearchQuery, setWatcherSearchQuery] = useState('');
  const [modalActiveTab, setModalActiveTab] = useState<'Task' | 'Doc' | 'Reminder' | 'Whiteboard' | 'Dashboard'>('Task');
  const [docNewTitle, setDocNewTitle] = useState('');
  const [isDocPrivate, setIsDocPrivate] = useState(false);
  const [showDocSlashMenu, setShowDocSlashMenu] = useState(false);
  const [isWritingDoc, setIsWritingDoc] = useState(false);
  const [docContent, setDocContent] = useState('');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('Default');
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [showDocTable, setShowDocTable] = useState(false);
  const [showDocColumns, setShowDocColumns] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<number>(2);
  const [showOasisList, setShowOasisList] = useState(false);
  const [oasisListSearch, setOasisListSearch] = useState('');
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showNotifyMenu, setShowNotifyMenu] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [selectedNotification, setSelectedNotification] = useState('On due date');
  const [showWhiteboardFolderPicker, setShowWhiteboardFolderPicker] = useState(false);
  const [isWhiteboardPrivate, setIsWhiteboardPrivate] = useState(false);
  const [whiteboardName, setWhiteboardName] = useState('');
  const [showDashboardFolderPicker, setShowDashboardFolderPicker] = useState(false);
  const [isDashboardPrivate, setIsDashboardPrivate] = useState(false);
  const [dashboardName, setDashboardName] = useState('');

  // Inbox states
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isInboxSettingsOpen, setIsInboxSettingsOpen] = useState(false);
  const [inboxActiveTab, setInboxActiveTab] = useState<'Priority' | 'Other' | 'Later' | 'Cleared'>('Priority');
  const [showInboxFilter, setShowInboxFilter] = useState(false);
  const [inboxShowAllTab, setInboxShowAllTab] = useState(true);
  const [inboxGroupByDate, setInboxGroupByDate] = useState(true);
  const [inboxSortNewest, setInboxSortNewest] = useState(true);
  const [inboxDisplayMode, setInboxDisplayMode] = useState<'fullscreen' | 'inline'>('fullscreen');
  const [inboxFilterMentions, setInboxFilterMentions] = useState(false);
  const [inboxFilterAssigned, setInboxFilterAssigned] = useState(false);
  const [inboxFilterUnread, setInboxFilterUnread] = useState(false);
  const [inboxFilterReminders, setInboxFilterReminders] = useState(false);

  // Replies states
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [repliesActiveTab, setRepliesActiveTab] = useState<'Unread' | 'Read'>('Unread');

  // Assigned Comments states
  const [isAssignedCommentsOpen, setIsAssignedCommentsOpen] = useState(false);
  const [assignedCommentsActiveTab, setAssignedCommentsActiveTab] = useState<'Assigned to me' | 'Unassigned to me'>('Assigned to me');
  const [showAssignedCommentsFilter, setShowAssignedCommentsFilter] = useState(false);
  const [showAssignedCommentsDateFilter, setShowAssignedCommentsDateFilter] = useState(false);
  const [assignedCommentsResolved, setAssignedCommentsResolved] = useState(true);
  const [assignedCommentsDatePeriod, setAssignedCommentsDatePeriod] = useState('Last 90 Days');
  const [assignedCommentsFilterTasks, setAssignedCommentsFilterTasks] = useState(false);
  const [assignedCommentsFilterDocs, setAssignedCommentsFilterDocs] = useState(false);
  const [assignedCommentsFilterChats, setAssignedCommentsFilterChats] = useState(false);
  const [assignedCommentsSearch, setAssignedCommentsSearch] = useState('');

  // My Tasks states
  const [showMyTasksSubmenu, setShowMyTasksSubmenu] = useState(false);
  const [myTasksActiveView, setMyTasksActiveView] = useState<'Assigned to me' | 'Today & Overdue' | 'Personal List' | null>(null);

  // More menu and Customize modal states
  const [showMoreSubmenu, setShowMoreSubmenu] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [customizeActiveTab, setCustomizeActiveTab] = useState<'Navigation' | 'Home' | 'Sections'>('Navigation');
  const [navInbox, setNavInbox] = useState(true);
  const [navReplies, setNavReplies] = useState(true);
  const [navAssignedComments, setNavAssignedComments] = useState(true);
  const [navMyTasks, setNavMyTasks] = useState(true);
  const [navChatActivity, setNavChatActivity] = useState(false);
  const [navDraftsSent, setNavDraftsSent] = useState(false);
  const [navPosts, setNavPosts] = useState(false);
  const [navAllChannels, setNavAllChannels] = useState(false);
  const [navAllSpaces, setNavAllSpaces] = useState(false);
  const [navAllTasks, setNavAllTasks] = useState(false);
  const [homeHome, setHomeHome] = useState(true);
  const [homeSpaces, setHomeSpaces] = useState(false);
  const [homeChat, setHomeChat] = useState(false);
  const [homePlanner, setHomePlanner] = useState(true);
  const [homeAI, setHomeAI] = useState(true);
  const [homeTeams, setHomeTeams] = useState(true);
  const [homeDocs, setHomeDocs] = useState(false);
  const [homeDashboards, setHomeDashboards] = useState(false);
  const [homeWhiteboards, setHomeWhiteboards] = useState(false);
  const [homeForms, setHomeForms] = useState(false);
  const [homeClips, setHomeClips] = useState(false);
  const [homeGoals, setHomeGoals] = useState(false);
  const [homeTimesheets, setHomeTimesheets] = useState(false);
  const [homeAppearance, setHomeAppearance] = useState<'icons-only' | 'icons-labels'>('icons-labels');

  const handleContextSelect = (context: NavigationContext) => {
    setActiveContext(context);
    setRecents(prev => {
      const newRecents = [context, ...prev.filter(c => c !== context)].slice(0, 3);
      return newRecents;
    });
    setShowLocationPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`File selected: ${e.target.files[0].name}`);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    return { days, firstDay };
  };

  // Task Detail Transition State
  const [isTaskDetailsVisible, setIsTaskDetailsVisible] = useState(false);

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setTimeout(() => setIsTaskDetailsVisible(true), 10);
  };

  const closeTaskDetail = () => {
    setIsTaskDetailsVisible(false);
    setTimeout(() => {
      setSelectedTask(null);
    }, 300);
  };

  // Handle doc menu item click
  const handleDocMenuItemClick = (label: string) => {
    // Text Colors
    if (label.includes('Default') || label === 'Red' || label === 'Orange' || label === 'Yellow' ||
      label === 'Blue' || label === 'Purple' || label === 'Pink' || label === 'Green' || label === 'Grey') {
      setSelectedTextColor(label);
    }
    // Highlights
    else if (label.includes('highlight')) {
      if (label === 'Remove highlight') {
        setSelectedHighlight(null);
      } else {
        setSelectedHighlight(label);
      }
    }
    // Badges
    else if (label.includes('badge')) {
      if (label === 'Remove badge') {
        setSelectedBadge(null);
      } else {
        setSelectedBadge(label);
      }
    }
    // Table
    else if (label === 'Table') {
      setShowDocTable(true);
      setIsWritingDoc(false);
    }
    // Column
    else if (label === 'Column') {
      setShowDocColumns(true);
      setIsWritingDoc(false);
      // Don't close the menu - let the submenu appear
      return;
    }
    // Oasis List
    else if (label === 'Oasis List' || label.includes('Oasis List')) {
      setShowOasisList(true);
      setIsWritingDoc(false);
    }
    // Other formatting options would be handled here
    // For now, we just close the menu
    setShowDocSlashMenu(false);
  };

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
        const nextStatus: Status = t.status === 'COMPLETED' ? 'TO DO' : 'COMPLETED';
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

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const handleCreateTask = (e?: React.FormEvent, mode: 'default' | 'open' | 'start-another' | 'duplicate' = 'default') => {
    if (e) e.preventDefault();
    if (!newTask.title) return;

    const taskToAdd: Task = {
      id: `TASK-${tasks.length + 1}`,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      status: (newTask.status as Status) || 'TO DO',
      priority: (newTask.priority as Priority) || 'Normal',
      assignee: (newTask.assignee as UserType) || USERS[0],
      dueDate: newTask.dueDate || new Date().toISOString(),
      startDate: newTask.startDate || new Date().toISOString(),
      tags: newTask.tags || (activeContext !== 'Everything' && activeContext !== 'Home' && activeContext !== 'My Tasks' && activeContext !== 'Pulse' ? [activeContext] : []),
      taskType: newTask.taskType || 'Task',
    };

    setTasks(prev => [taskToAdd, ...prev]);
    setIsModalOpen(false);

    // Handle different modes
    if (mode === 'open') {
      setIsModalOpen(false);
      openTaskDetail(taskToAdd);
      setNewTask({
        title: '', description: '', status: 'TO DO', priority: 'Clear',
        assignee: undefined, dueDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0], tags: []
      });
    } else if (mode === 'start-another') {
      setIsModalOpen(true);
      setNewTask({
        title: '', description: '', status: 'TO DO', priority: 'Clear',
        assignee: undefined, dueDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0], tags: []
      });
      // Reset text area also
      setIsDescriptionInputOpen(false);
    } else if (mode === 'duplicate') {
      setIsModalOpen(true);
      // Do not reset newTask
    } else {
      // Default
      setIsModalOpen(false);
      setNewTask({
        title: '', description: '', status: 'TO DO', priority: 'Clear',
        assignee: undefined, dueDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0], tags: []
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderView = () => {
    const commonProps = {
      tasks: filteredTasks,
      isDarkMode: currentTheme === 'dark',
      onTaskClick: openTaskDetail
    };
    switch (activeView) {
      case 'List': return <ListView {...commonProps} onToggleStatus={toggleTaskStatus} onAddTask={() => setIsModalOpen(true)} onAddTaskInline={handleAddTaskInline} onUpdateTask={handleUpdateTask} />;
      case 'Board': return <BoardView {...commonProps} />;
      case 'Calendar': return <CalendarView {...commonProps} />;
      case 'Gantt': return <GanttView {...commonProps} />;
      case 'Team': return <TeamView {...commonProps} />;
      default: return <ListView {...commonProps} onToggleStatus={toggleTaskStatus} onAddTask={() => setIsModalOpen(true)} onAddTaskInline={handleAddTaskInline} onUpdateTask={handleUpdateTask} />;
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
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white dark:bg-[#16161e] text-gray-900 dark:text-gray-100"
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
            { id: 'Home', icon: <div className={`p-1.5 rounded-lg ${activeTab === 'Home' ? 'bg-black text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}><Home size={22} fill={activeTab === 'Home' ? "currentColor" : "none"} /></div> },
            { id: 'Planner', icon: <Calendar size={24} /> },
            { id: 'Teams', icon: <Users size={24} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (!sidebarOpen) setSidebarOpen(true);
              }}
              className={`flex flex-col items-center gap-1 w-full transition-colors relative group ${activeTab === item.id ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold transition-opacity tracking-tighter">{item.id}</span>
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black dark:bg-white rounded-r-full" />}
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
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-black to-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-[#16161e] shadow-lg cursor-pointer hover:scale-105 transition-transform"
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
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => setIsMainCreateDropdownOpen(!isMainCreateDropdownOpen)}
                    className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus size={16} /> Create
                  </button>

                  {isMainCreateDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-[100]" onClick={() => setIsMainCreateDropdownOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1e1e1f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-[101] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Create</div>
                          <div className="space-y-0.5">
                            <button
                              onClick={() => {
                                setIsModalOpen(true);
                                setIsMainCreateDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Task</span>
                              </div>
                              <span className="text-[10px] font-medium text-gray-400">Alt T</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                              <div className="flex items-center gap-3">
                                <Send size={16} className="text-gray-400 group-hover:text-primary transition-colors -rotate-45" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</span>
                              </div>
                              <span className="text-[10px] font-medium text-gray-400">Ctrl G</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={() => {
                              setIsListModalOpen(true);
                              setIsMainCreateDropdownOpen(false);
                            }}
                            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <LayoutList size={18} className="text-gray-400 group-hover:text-primary transition-colors mt-0.5" />
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">List</span>
                              <span className="text-[10px] text-gray-400 font-medium">Track tasks, projects, people & more</span>
                            </div>
                          </button>
                          <button className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                            <Hash size={18} className="text-gray-400 group-hover:text-primary transition-colors mt-0.5" />
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Channel</span>
                              <span className="text-[10px] text-gray-400 font-medium">Conversations on specific topics</span>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setIsSpaceModalOpen(true);
                              setIsMainCreateDropdownOpen(false);
                            }}
                            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <Layers size={18} className="text-gray-400 group-hover:text-primary transition-colors mt-0.5" />
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Space</span>
                              <span className="text-[10px] text-gray-400 font-medium">Organize work by team or department</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <nav className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
                <div className="space-y-1">
                  {[
                    { id: 'Inbox', icon: <Inbox size={18} />, visible: navInbox },
                    { id: 'Replies', icon: <Reply size={18} />, visible: navReplies },
                    { id: 'Assigned Comments', icon: <MessageSquare size={18} />, visible: navAssignedComments },
                    { id: 'My Tasks', icon: <UserIcon size={18} />, visible: navMyTasks },
                    { id: 'Chat Activity', icon: <MessageCircle size={18} />, visible: navChatActivity },
                    { id: 'Drafts & Sent', icon: <Send size={18} />, visible: navDraftsSent },
                    { id: 'Posts', icon: <FileText size={18} />, visible: navPosts },
                    { id: 'All Channels', icon: <Hash size={18} />, visible: navAllChannels },
                    { id: 'All Spaces', icon: <Layers size={18} />, visible: navAllSpaces },
                    { id: 'All Tasks', icon: <Check size={18} />, visible: navAllTasks },
                    { id: 'More', icon: <MoreHorizontal size={18} />, visible: true },
                  ].filter(item => item.visible).map(item => (
                    <div key={item.id}>
                      <div
                        onClick={() => {
                          if (item.id === 'Inbox') setIsInboxOpen(true);
                          if (item.id === 'Replies') setIsRepliesOpen(true);
                          if (item.id === 'Assigned Comments') setIsAssignedCommentsOpen(true);
                          if (item.id === 'My Tasks') setShowMyTasksSubmenu(!showMyTasksSubmenu);
                          if (item.id === 'More') setShowMoreSubmenu(!showMoreSubmenu);
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-all ${(item.id === 'Inbox' && isInboxOpen) ||
                          (item.id === 'Replies' && isRepliesOpen) ||
                          (item.id === 'Assigned Comments' && isAssignedCommentsOpen)
                          ? 'bg-white dark:bg-white/5 text-gray-900 dark:text-white'
                          : ''
                          }`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.id}</span>
                      </div>

                      {/* My Tasks Submenu */}
                      {item.id === 'My Tasks' && showMyTasksSubmenu && (
                        <div className="ml-6 mt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {[
                            { label: 'Assigned to me', icon: <UserIcon size={16} /> },
                            { label: 'Today & Overdue', icon: <Calendar size={16} /> },
                            { label: 'Personal List', icon: <UserIcon size={16} /> }
                          ].map((subItem) => (
                            <div
                              key={subItem.label}
                              onClick={() => setMyTasksActiveView(subItem.label as any)}
                              className="flex items-center gap-3 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-all"
                            >
                              {subItem.icon}
                              <span className="text-sm font-medium">{subItem.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* More Submenu */}
                      {item.id === 'More' && showMoreSubmenu && (
                        <div className="ml-6 mt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {[
                            { label: 'Chat Activity', icon: <MessageCircle size={16} />, shortcut: '⌘' },
                            { label: 'Drafts & Sent', icon: <Send size={16} />, shortcut: '⌘' },
                            { label: 'Posts', icon: <FileText size={16} />, shortcut: '⌘' },
                            { label: 'All Channels', icon: <Hash size={16} />, shortcut: '⌘' },
                            { label: 'All Spaces', icon: <Layers size={16} />, shortcut: '⌘' },
                            { label: 'All Tasks', icon: <Check size={16} />, shortcut: '⌘' }
                          ].map((subItem) => (
                            <div
                              key={subItem.label}
                              className="flex items-center justify-between p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                {subItem.icon}
                                <span className="text-sm font-medium">{subItem.label}</span>
                              </div>
                              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{subItem.shortcut}</span>
                            </div>
                          ))}

                          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                          <div
                            onClick={() => {
                              setIsCustomizeModalOpen(true);
                              setShowMoreSubmenu(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-all"
                          >
                            <Settings size={16} />
                            <span className="text-sm font-medium">Customize</span>
                          </div>
                        </div>
                      )}
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
                        <div className="w-5 h-5 bg-black/20 text-black rounded flex items-center justify-center text-[10px] font-bold">
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
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${item.active ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'} cursor-pointer`}>
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

      {/* Assigned Comments Panel */}
      {isAssignedCommentsOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]" onClick={() => setIsAssignedCommentsOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white dark:bg-[#1e1e1e] shadow-2xl z-[301] animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Assigned Comments Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Comments</h2>
                <button
                  onClick={() => setIsAssignedCommentsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800 mb-4">
                {(['Assigned to me', 'Unassigned to me'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAssignedCommentsActiveTab(tab)}
                    className={`pb-3 text-sm font-bold relative transition-colors ${assignedCommentsActiveTab === tab
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    {tab}
                    {assignedCommentsActiveTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-200" />
                    )}
                  </button>
                ))}
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowAssignedCommentsFilter(!showAssignedCommentsFilter)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Filter size={14} />
                    Filter
                  </button>

                  {showAssignedCommentsFilter && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAssignedCommentsFilter(false)} />
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2">
                          {[
                            { label: 'Tasks', icon: Check, state: assignedCommentsFilterTasks, setState: setAssignedCommentsFilterTasks },
                            { label: 'Docs', icon: FileText, state: assignedCommentsFilterDocs, setState: setAssignedCommentsFilterDocs },
                            { label: 'Chats', icon: Hash, state: assignedCommentsFilterChats, setState: setAssignedCommentsFilterChats }
                          ].map((filter) => (
                            <button
                              key={filter.label}
                              onClick={() => filter.setState(!filter.state)}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <filter.icon size={14} className="text-gray-400" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{filter.label}</span>
                              {filter.state && <Check size={14} className="text-black ml-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Resolved Toggle */}
                <button
                  onClick={() => setAssignedCommentsResolved(!assignedCommentsResolved)}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${assignedCommentsResolved
                    ? 'border-black bg-gray-50 dark:bg-purple-900/20 text-black'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  <Check size={14} />
                  Resolved
                </button>

                {/* Date Period Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowAssignedCommentsDateFilter(!showAssignedCommentsDateFilter)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Calendar size={14} />
                    {assignedCommentsDatePeriod}
                    <ChevronDown size={14} />
                  </button>

                  {showAssignedCommentsDateFilter && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAssignedCommentsDateFilter(false)} />
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2">
                          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Date Period
                          </div>
                          {[
                            'All Time',
                            'Last 30 Days',
                            'Last 60 Days',
                            'Last 90 Days',
                            'Last 180 Days'
                          ].map((period) => (
                            <button
                              key={period}
                              onClick={() => {
                                setAssignedCommentsDatePeriod(period);
                                setShowAssignedCommentsDateFilter(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                            >
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{period}</span>
                              {assignedCommentsDatePeriod === period && <Check size={14} className="text-black" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Search */}
                <div className="ml-auto relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={assignedCommentsSearch}
                    onChange={(e) => setAssignedCommentsSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#121213] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black w-48"
                  />
                </div>
              </div>
            </div>

            {/* Assigned Comments Content */}
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto relative">
                  <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1e1e1e]">
                    <Check size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">You're all caught up</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Looks like you don't have any assigned messages
                </p>
                <button className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  Clear filters
                </button>
              </div>
            </div>

            {/* Assigned Comments Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#121213] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-black relative">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-black border-b border-gray-200 dark:border-[#2a2a35] flex items-center px-6 z-40 relative">
          <div
            className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-bold py-1"
            onMouseEnter={() => setHoveredBreadcrumb('breadcrumbs')}
            onMouseLeave={() => setHoveredBreadcrumb(null)}
          >
            <span
              className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors py-1 group/space"
              onClick={() => setActiveView('Overview')}
            >
              <div className="w-4 h-4 bg-black rounded flex items-center justify-center text-[10px] text-white">
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
                                  <button className="w-full py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors shadow-lg">
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
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center text-[8px] text-white">
                              {space.name[0].toUpperCase()}
                            </div>
                            {space.name}
                          </div>
                          <div className="px-1 space-y-0.5">
                            {space.lists.map((listName) => (
                              <div
                                key={listName}
                                className={`px-3 py-1.5 flex items-center gap-3 text-sm transition-colors rounded-lg cursor-pointer ${activeContext === listName ? 'bg-black/10 text-black dark:text-purple-400 border border-black/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
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

          <div className="absolute left-1/2 -translate-x-1/2 w-96 max-w-[30%]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
              <input
                type="text"
                placeholder="Search Ctrl K"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-1.5 bg-gray-100 dark:bg-[#16161e] border border-transparent dark:border-gray-800 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-[#1c1c24] focus:border-black dark:focus:border-black transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-black to-pink-500 flex items-center justify-center text-white text-[10px] font-bold border border-white dark:border-gray-800 shadow-sm cursor-pointer uppercase">AS</div>
            </div>
          </div>
        </header>
        {/* My Tasks Full-Screen Views */}
        {myTasksActiveView && (
          <div className="absolute top-14 inset-x-0 bottom-0 bg-white dark:bg-[#1e1e1e] z-30 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div
                  onClick={() => setMyTasksActiveView(null)}
                  className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
                >
                  <UserIcon size={16} />
                  <span>My Tasks</span>
                </div>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  {myTasksActiveView === 'Assigned to me' && <UserIcon size={16} />}
                  {myTasksActiveView === 'Today & Overdue' && <Calendar size={16} />}
                  {myTasksActiveView === 'Personal List' && <UserIcon size={16} />}
                  {myTasksActiveView}
                </span>
              </div>
              <button
                onClick={() => setMyTasksActiveView(null)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
              {myTasksActiveView === 'Assigned to me' && (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-gray-50/50 dark:bg-black/20">
                  <div className="text-center space-y-4 max-w-md animate-in slide-in-from-bottom-5 duration-300">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto border border-gray-100 dark:border-gray-700">
                      <Check size={32} className="text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Tasks assigned to you will appear here
                    </h3>
                    <button className="px-4 py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-black/20">
                      Browse tasks
                    </button>
                  </div>
                </div>
              )}

              {myTasksActiveView === 'Today & Overdue' && (
                <div className="absolute inset-0 overflow-auto bg-gray-50/50 dark:bg-black/20 p-8">
                  <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-white dark:bg-[#121213] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Work</h2>
                      </div>

                      <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                          <Layers size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Tasks and Reminders assigned to you will show here
                        </p>
                        <button className="px-4 py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-black/20">
                          <Plus size={16} />
                          Add task or reminder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {myTasksActiveView === 'Personal List' && (
                <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#1e1e1e]">
                  {/* Toolbar */}
                  <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-3">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Filter size={14} />
                        Filter
                      </button>
                      <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <LayoutList size={14} />
                        Me
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <Hash size={14} />
                        Tags
                      </button>

                      <div className="ml-auto flex items-center gap-2">
                        <div className="relative">
                          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search"
                            className="pl-8 pr-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-none rounded-md text-xs w-48 focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                          <Settings size={16} />
                        </button>
                        <button className="px-3 py-1.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white text-xs font-medium rounded-md transition-colors shadow-sm">
                          Add view
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table Header */}
                  <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-2 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="col-span-6 pl-2">Task Name</div>
                      <div className="col-span-2">Assignee</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-2">Priority</div>
                    </div>
                  </div>

                  {/* Add Task Row */}
                  <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4 pl-2">
                      <button className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-black flex items-center justify-center text-transparent hover:text-black transition-all">
                        <Check size={12} />
                      </button>
                      <input
                        type="text"
                        placeholder="+ New Task"
                        className="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none py-2"
                      />
                    </div>
                  </div>

                  {/* Empty State */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <LayoutList size={40} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No tasks found</h3>
                    <p className="text-xs text-gray-500">Create a task to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                    ? 'border-black text-black'
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
                  className={`h-full flex items-center gap-1 text-xs font-bold transition-all relative px-2 ${isViewSelectorOpen ? 'text-black' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                  <Plus size={14} /> View
                </button>

                {isViewSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsViewSelectorOpen(false)} />
                    <div className="absolute top-full right-0 mt-1 w-[480px] bg-white dark:bg-[#1e1e1f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-[110] p-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
                        <input
                          type="text"
                          placeholder="Search views..."
                          value={viewSearchQuery}
                          onChange={(e) => setViewSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#121213] border border-gray-200 dark:border-black/30 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-black transition-all font-normal placeholder:text-gray-400"
                          autoFocus
                        />
                      </div>

                      <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {/* Popular Section */}
                        <div>
                          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">Popular</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'List', desc: 'Track tasks, bugs, people & more', icon: <LayoutList size={18} />, color: 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-white' },
                              { id: 'Gantt', desc: 'Plan dependencies & time', icon: <GanttChart size={18} />, color: 'bg-red-500 text-white' },
                              { id: 'Calendar', desc: 'Plan, schedule, & delegate', icon: <CalendarIcon size={18} />, color: 'bg-orange-500 text-white' },
                              { id: 'Doc', desc: 'Collaborate & document anything', icon: <FileText size={18} />, color: 'bg-blue-400 text-white' },
                              { id: 'Board', label: 'Board – Kanban', desc: 'Move tasks between columns', icon: <LayoutGrid size={18} />, color: 'bg-blue-600 text-white' },
                              { id: 'Form', desc: 'Collect, track, & report data', icon: <FormIcon size={18} />, color: 'bg-black text-white' },
                            ].map(view => (
                              <button
                                key={view.id}
                                onClick={() => {
                                  setActiveView(view.id as ViewType);
                                  setIsViewSelectorOpen(false);
                                }}
                                className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all text-left group"
                              >
                                <div className={`w-9 h-9 ${view.color} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                                  {view.icon}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{view.label || view.id}</div>
                                  <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">{view.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* More views Section */}
                        <div className="border-t border-gray-100 dark:border-gray-800/50 pt-4">
                          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">More views</h3>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {[
                              { id: 'Table', desc: 'Structured table format', icon: <TableIcon size={18} />, color: 'bg-green-600' },
                              { id: 'Dashboard', desc: 'Track metrics & insights', icon: <BarChart3 size={18} />, color: 'bg-black' },
                              { id: 'Timeline', desc: 'See tasks by start & due date', icon: <GanttChart size={18} />, color: 'bg-orange-800/60' },
                              { id: 'Activity', desc: 'Real-time activity feed', icon: <Activity size={18} />, color: 'bg-blue-400/80' },
                              { id: 'Workload', desc: 'Visualize team capacity', icon: <Users size={18} />, color: 'bg-cyan-600' },
                              { id: 'Whiteboard', desc: 'Visualize & brainstorm ideas', icon: <WhiteboardIcon size={18} />, color: 'bg-yellow-500' },
                              { id: 'Team', desc: 'Monitor work being done', icon: <Users size={18} />, color: 'bg-black' },
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
                                className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all text-left group"
                              >
                                <div className={`w-9 h-9 ${view.color} rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                  {view.icon}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{view.id}</div>
                                  <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">{view.desc}</div>
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
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold transition-colors ${isFilterMenuOpen ? 'text-black dark:text-white bg-white dark:bg-gray-800 rounded shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <Filter size={12} /> Filter
                </button>

                {isFilterMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsFilterMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-[450px] bg-white dark:bg-[#1e1e1f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-[101] p-4 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Filters</span>
                          <Info size={14} className="text-gray-400 cursor-help" />
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setIsSavedFiltersDropdownOpen(!isSavedFiltersDropdownOpen)}
                            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                          >
                            Saved filters <ChevronDown size={14} className={`transition-transform ${isSavedFiltersDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isSavedFiltersDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsSavedFiltersDropdownOpen(false)} />
                              <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-20 p-6 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex flex-col items-center text-center space-y-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">No saved filters yet</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                      Save filters you use often to quickly apply them to any view.
                                    </p>
                                  </div>
                                  <button className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    Save new filter
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex flex-col">
                        <div className="relative w-48">
                          <button
                            onClick={() => setIsFilterTypeDropdownOpen(!isFilterTypeDropdownOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-[#121213] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-500 hover:border-gray-300 transition-colors"
                          >
                            <span>Select filter</span>
                            <ChevronDown size={14} className={`transition-transform ${isFilterTypeDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isFilterTypeDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsFilterTypeDropdownOpen(false)} />
                              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      autoFocus
                                      placeholder="Search..."
                                      value={filterTypeSearchQuery}
                                      onChange={(e) => setFilterTypeSearchQuery(e.target.value)}
                                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-primary/20 focus:border-primary rounded-lg text-xs outline-none transition-all"
                                    />
                                  </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar py-1">
                                  {FILTER_OPTIONS.filter(opt => opt.label.toLowerCase().includes(filterTypeSearchQuery.toLowerCase())).map(option => (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        setActiveFilters([...activeFilters, option]);
                                        setIsFilterTypeDropdownOpen(false);
                                        setFilterTypeSearchQuery('');
                                      }}
                                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-xs text-gray-700 dark:text-gray-300 group"
                                    >
                                      <span className="text-gray-400 group-hover:text-primary transition-colors">{option.icon}</span>
                                      <span>{option.label}</span>
                                    </button>
                                  ))}
                                </div>
                                <div className="p-1 border-t border-gray-100 dark:border-gray-800 hidden">
                                  <div className="flex flex-col gap-1 p-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {activeFilters.length > 0 && (
                            <button
                              onClick={() => setActiveFilters([])}
                              className="text-[10px] font-bold text-primary hover:underline"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
                            More
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
            <button
              onClick={() => setIsCustomizeViewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Settings size={12} /> Customize
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-4 py-1.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white rounded-lg text-[10px] font-bold shadow-lg shadow-black/20 transition-all active:scale-95"
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
                  className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-primary-hover active:bg-primary-hover transition-all shadow-lg shadow-black/20 active:scale-95"
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-in zoom-in duration-300 flex flex-col text-gray-900 dark:text-white relative overflow-visible my-auto">
              {/* Tabs Header */}
              <div className="flex items-center justify-between px-6 pt-4 border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center gap-6">
                  {['Task', 'Doc', 'Reminder', 'Whiteboard', 'Dashboard'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setModalActiveTab(tab as any)}
                      className={`pb-3 text-sm font-bold relative transition-colors ${modalActiveTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      {tab}
                      {modalActiveTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-200" />}
                    </button>
                  ))}
                </div>
                <div className="mb-3">
                  <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><X size={16} /></button>
                </div>
              </div>

              {modalActiveTab === 'Task' ? (
                <form onSubmit={handleCreateTask} className="p-6 space-y-6 relative">
                  {/* Location and Type Selectors */}
                  <div className="flex items-center gap-3 relative z-20">
                    <div
                      onClick={() => setShowLocationPicker(!showLocationPicker)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      <LayoutList size={14} className="text-gray-500" />
                      <span>{activeContext === 'Everything' ? 'Workspace' : activeContext}</span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </div>

                    {showLocationPicker && (
                      <div>
                        <div className="fixed inset-0 z-40" onClick={() => setShowLocationPicker(false)} />
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                          {/* Search */}
                          <div className="p-3 border-b border-gray-100 dark:border-gray-700/50">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 rounded-lg py-1.5 pl-9 pr-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-black/50 transition-colors placeholder:text-gray-400"
                                value={locationSearchQuery}
                                onChange={e => setLocationSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Content List */}
                          <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {/* Personal List */}
                            <div
                              onClick={() => handleContextSelect('My Tasks')}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <UserIcon size={14} />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Personal List</span>
                              {activeContext === 'My Tasks' && <Check size={14} className="ml-auto text-black" />}
                            </div>

                            {/* Recents */}
                            {recents.length > 0 && (
                              <div className="pt-2">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recents</div>
                                {recents.filter(r => r.toLowerCase().includes(locationSearchQuery.toLowerCase())).map(recent => (
                                  <div
                                    key={`recent-${recent}`}
                                    onClick={() => handleContextSelect(recent)}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                                  >
                                    <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:scale-110 transition-transform">
                                      <LayoutList size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{recent}</span>
                                    {activeContext === recent && <Check size={14} className="ml-auto text-black" />}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Spaces */}
                            <div className="pt-2">
                              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Spaces</div>
                              {spaces.filter(s => s.name.toLowerCase().includes(locationSearchQuery.toLowerCase())).map(space => (
                                <div
                                  key={space.id}
                                  onClick={() => handleContextSelect(space.name as any)}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                                >
                                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-purple-900/30 text-black dark:text-purple-400 font-bold text-xs group-hover:scale-110 transition-transform">
                                    {space.name[0]}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{space.name}</span>
                                  {activeContext === space.name && <Check size={14} className="ml-auto text-black" />}
                                </div>
                              ))}
                              {spaces.length === 0 && (
                                <div className="px-3 py-2 text-xs text-gray-400 italic">No spaces found.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative">
                      <div
                        className="flex items-center gap-2 w-full h-full"
                        onClick={() => setShowTaskTypePicker(!showTaskTypePicker)}
                      >
                        {(() => {
                          const type = [
                            { label: 'Task', icon: CircleIcon },
                            { label: 'Milestone', icon: Diamond },
                            { label: 'Form Response', icon: FileMinus },
                            { label: 'Meeting Note', icon: MessageNote }
                          ].find(t => t.label === (newTask.taskType || 'Task')) || { icon: CircleIcon, label: 'Task' };
                          return (
                            <div className="flex items-center gap-2">
                              <type.icon size={14} className="text-gray-500" />
                              <span>{type.label}</span>
                            </div>
                          );
                        })()}
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${showTaskTypePicker ? 'rotate-180' : ''}`} />
                      </div>

                      {showTaskTypePicker && (
                        <div>
                          <div className="fixed inset-0 z-40" onClick={() => setShowTaskTypePicker(false)} />
                          <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-1">
                            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 mb-1 flex items-center justify-between">
                              <span>Task Types</span>
                              <span className="opacity-50 cursor-help" title="Oasis Task Types help users categorize different kinds of work.">?</span>
                            </div>
                            {[
                              { label: 'Task', icon: CircleIcon, default: true },
                              { label: 'Milestone', icon: Diamond },
                              { label: 'Form Response', icon: FileMinus },
                              { label: 'Meeting Note', icon: MessageNote }
                            ].map((type) => (
                              <div
                                key={type.label}
                                onClick={() => {
                                  setNewTask({ ...newTask, taskType: type.label });
                                  setShowTaskTypePicker(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                              >
                                <type.icon size={14} className={`${(newTask.taskType || 'Task') === type.label ? 'text-black' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                                <span className={`text-xs font-medium flex-1 ${(newTask.taskType || 'Task') === type.label ? 'text-black dark:text-purple-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                  {type.label} {type.default && <span className="text-gray-400 font-normal ml-1">(default)</span>}
                                </span>
                                {(newTask.taskType || 'Task') === type.label && <Check size={14} className="ml-auto text-black" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="Task Name"
                      className="w-full bg-transparent border-none text-2xl font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    />

                    <div className="flex flex-col gap-3">
                      {isDescriptionInputOpen || newTask.description ? (
                        <textarea
                          className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-black resize-none text-gray-700 dark:text-gray-300 placeholder:text-gray-400"
                          placeholder="Add a description..."
                          value={newTask.description}
                          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                          autoFocus
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsDescriptionInputOpen(true)}
                          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm font-medium w-fit"
                        >
                          <FileText size={18} />
                          Add description
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Field Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 relative z-10">
                    {/* Status Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowStatusPicker(!showStatusPicker)}
                        className={`px-3 py-1.5 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border border-transparent hover:brightness-110 transition-all ${STATUS_COLORS[newTask.status || 'TO DO']}`}
                      >
                        {newTask.status || 'TO DO'}
                      </button>
                      {showStatusPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowStatusPicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#2a2a2b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-2 space-y-1">
                              {Object.keys(STATUS_COLORS).map(status => (
                                <div
                                  key={status}
                                  onClick={() => {
                                    setNewTask({ ...newTask, status: status as Status });
                                    setShowStatusPicker(false);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                >
                                  <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]?.split(' ')[0] || 'bg-gray-400'}`} />
                                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">{status}</span>
                                  {newTask.status === status && <Check size={12} className="ml-auto text-black" />}
                                </div>
                              ))}

                              {/* Create New Status Input */}
                              <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 px-2 pb-1">
                                <input
                                  type="text"
                                  placeholder="+ Create new status"
                                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 text-[10px] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-black/50"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = (e.target as HTMLInputElement).value.toUpperCase();
                                      if (val) {
                                        setNewTask({ ...newTask, status: val });
                                        setShowStatusPicker(false);
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Assignee Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <UserIcon size={14} />
                        {newTask.assignee ? newTask.assignee.name.split(' ')[0] : 'Assignee'}
                      </button>
                      {showAssigneePicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowAssigneePicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#2a2a2b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                              <input placeholder="Search people..." className="w-full bg-transparent text-xs text-gray-700 dark:text-white placeholder:text-gray-400 outline-none" autoFocus />
                            </div>
                            <div className="p-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                              {USERS.map(user => (
                                <div
                                  key={user.id}
                                  onClick={() => {
                                    setNewTask({ ...newTask, assignee: user });
                                    setShowAssigneePicker(false);
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-[10px] font-bold">
                                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name[0]}
                                  </div>
                                  <span className="text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                                  {newTask.assignee?.id === user.id && <Check size={14} className="ml-auto text-black" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Due Date Picker (Mini Calendar) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold transition-colors ${newTask.dueDate ? 'text-black dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        <Calendar size={14} />
                        {newTask.dueDate ? new Date(newTask.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Due date'}
                      </button>
                      {showDatePicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#2a2a2b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                                {currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                              </h3>
                              <div className="flex items-center gap-1">
                                <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1)))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"><ChevronLeft size={16} /></button>
                                <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1)))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"><ChevronRight size={16} /></button>
                              </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {Array.from({ length: getDaysInMonth(currentCalendarDate).firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                              ))}
                              {Array.from({ length: getDaysInMonth(currentCalendarDate).days }).map((_, i) => {
                                const day = i + 1;
                                const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), day);
                                const isSelected = newTask.dueDate && new Date(newTask.dueDate).toDateString() === date.toDateString();
                                const isToday = new Date().toDateString() === date.toDateString();

                                return (
                                  <button
                                    key={day}
                                    onClick={() => {
                                      setNewTask({ ...newTask, dueDate: date.toISOString() });
                                      setShowDatePicker(false);
                                    }}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                                        ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'}
                                        ${isToday && !isSelected ? 'text-black font-bold border border-gray-200 dark:border-purple-900' : ''}
                                      `}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => {
                                setNewTask({ ...newTask, dueDate: undefined });
                                setShowDatePicker(false);
                              }}
                              className="w-full mt-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border-t border-gray-100 dark:border-gray-700 pt-2"
                            >
                              Clear Date
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Priority Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPriorityPicker(!showPriorityPicker)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <Flag
                          size={14}
                          className={(!newTask.priority || newTask.priority === 'Clear') ? '' : (PRIORITY_COLORS[newTask.priority]?.split(' ')[1] || '')}
                          fill={(!newTask.priority || newTask.priority === 'Clear') ? 'none' : 'currentColor'}
                        />
                        {(!newTask.priority || newTask.priority === 'Clear') ? 'Priority' : newTask.priority}
                      </button>
                      {showPriorityPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowPriorityPicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#2a2a2b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1 space-y-0.5">
                              {Object.keys(PRIORITY_COLORS).filter(p => p !== 'Clear').map(p => (
                                <div
                                  key={p}
                                  onClick={() => {
                                    setNewTask({ ...newTask, priority: p as Priority });
                                    setShowPriorityPicker(false);
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Flag
                                    size={14}
                                    className={PRIORITY_COLORS[p]?.split(' ')[1] || ''}
                                    fill="currentColor"
                                  />
                                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{p}</span>
                                  {newTask.priority === p && <Check size={12} className="ml-auto text-black" />}
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 p-1">
                              <div
                                onClick={() => {
                                  setNewTask({ ...newTask, priority: 'Clear' });
                                  setShowPriorityPicker(false);
                                }}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                              >
                                <X size={14} />
                                <span className="text-xs font-bold">Clear</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTagPicker(!showTagPicker)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <Hash size={14} /> Tags
                      </button>
                      {showTagPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowTagPicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700/50">
                              <input
                                placeholder="Search or add tags..."
                                className="w-full bg-transparent text-xs text-gray-700 dark:text-white placeholder:text-gray-400 outline-none"
                                autoFocus
                                value={tagSearchQuery}
                                onChange={e => setTagSearchQuery(e.target.value)}
                              />
                            </div>
                            <div className="p-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                              {MOCK_TAGS.filter(t => t.toLowerCase().includes(tagSearchQuery.toLowerCase())).map(tag => (
                                <div key={tag} className="flex items-center px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold">{tag}</span>
                                </div>
                              ))}
                              {MOCK_TAGS.length === 0 && <div className="p-2 text-xs text-center text-gray-400">No tags found</div>}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMoreOptionsPicker(!showMoreOptionsPicker)}
                        className="p-1.5 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {showMoreOptionsPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMoreOptionsPicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-1">
                            {[
                              { label: 'Time Estimate', icon: Hourglass },
                              { label: 'Dependencies', icon: Link2 },
                              { label: 'Subtasks', icon: SubtaskIcon },
                              { label: 'Checklist', icon: ListChecks },
                            ].map(opt => (
                              <div key={opt.label} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors text-gray-700 dark:text-gray-200">
                                <opt.icon size={14} className="text-gray-500" />
                                <span className="text-xs font-medium">{opt.label}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Custom Fields Section */}
                  <div className="space-y-3 pt-4 relative">
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Custom Fields</h4>
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setShowCustomFieldPicker(!showCustomFieldPicker)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <Plus size={14} /> Create new field
                      </button>

                      {showCustomFieldPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowCustomFieldPicker(false)} />
                          <div className="absolute bottom-full left-0 mb-2 w-60 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700/50">
                              <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  placeholder="Search..."
                                  autoFocus
                                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 rounded-lg py-1.5 pl-9 pr-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-black/50 transition-colors placeholder:text-gray-400"
                                  value={customFieldSearchQuery}
                                  onChange={e => setCustomFieldSearchQuery(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                              {[
                                {
                                  category: 'AI Fields', items: [
                                    { label: 'Summary', icon: Type, color: 'text-black' },
                                    { label: 'Custom Text', icon: TextCursorInput, color: 'text-black' },
                                    { label: 'Custom Dropdown', icon: ListOrdered, color: 'text-black' }
                                  ]
                                },
                                {
                                  category: 'All', items: [
                                    { label: 'Dropdown', icon: ListOrdered, color: 'text-green-500' },
                                    { label: 'Text', icon: Type, color: 'text-blue-500' },
                                    { label: 'Date', icon: Calendar, color: 'text-orange-500' },
                                    { label: 'Text area (Long Text)', icon: FileText, color: 'text-blue-500' },
                                    { label: 'Number', icon: Hash, color: 'text-teal-500' },
                                    { label: 'Labels', icon: Tag, color: 'text-green-600' },
                                    { label: 'Checkbox', icon: CheckSquare, color: 'text-pink-500' },
                                    { label: 'Money', icon: DollarSign, color: 'text-green-500' },
                                    { label: 'Website', icon: Globe, color: 'text-red-500' },
                                    { label: 'Formula', icon: Sigma, color: 'text-emerald-500' },
                                    { label: 'Email', icon: Mail, color: 'text-red-500' },
                                    { label: 'Phone', icon: Phone, color: 'text-red-400' },
                                    { label: 'Location', icon: MapPin, color: 'text-red-600' },
                                    { label: 'Rating', icon: Star, color: 'text-orange-400' },
                                    { label: 'Signature', icon: PenTool, color: 'text-green-600' }
                                  ]
                                }
                              ].map((group, idx) => (
                                <div key={idx}>
                                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400">{group.category}</div>
                                  {group.items.filter(i => i.label.toLowerCase().includes(customFieldSearchQuery.toLowerCase())).map(item => (
                                    <div key={item.label} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                      <item.icon size={14} className={item.color} />
                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50 mt-4">
                    <div>
                      {/* Templates removed as requested */}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors tooltip tooltip-top"
                          title="Attach file"
                        >
                          <Paperclip size={18} />
                        </button>
                        <div className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer relative">
                          <div onClick={() => setShowWatcherPicker(!showWatcherPicker)} className="flex items-center gap-1">
                            <Bell size={18} />
                            <span className="text-sm font-bold">1</span>
                          </div>

                          {showWatcherPicker && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowWatcherPicker(false)} />
                              <div className="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="p-3 border-b border-gray-100 dark:border-gray-800/50">
                                  <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                      placeholder="Search or enter email..."
                                      className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 rounded-lg py-1.5 pl-9 pr-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-black/50 transition-colors placeholder:text-gray-400"
                                      autoFocus
                                      value={watcherSearchQuery}
                                      onChange={e => setWatcherSearchQuery(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                  <div className="p-2">
                                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">People</div>
                                    <div className="space-y-0.5">
                                      {/* Current User "Me" */}
                                      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-black/30 cursor-pointer group">
                                        <div className="w-6 h-6 rounded-full bg-[#3d2b27] flex items-center justify-center text-[10px] font-bold text-white border border-green-500 relative">
                                          A
                                          <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-[#1e1e1e]" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Me</span>
                                      </div>
                                      {USERS.filter(u => u.id !== '1' && (u.name.toLowerCase().includes(watcherSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(watcherSearchQuery.toLowerCase()))).map(user => (
                                        <div key={user.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 relative overflow-hidden">
                                            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]}
                                            <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 bg-gray-300 rounded-full border border-white dark:border-[#1e1e1e]" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate flex-1">{user.email || user.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="p-2 border-t border-gray-100 dark:border-gray-800/50">
                                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teams</div>
                                    <div className="space-y-0.5">
                                      {TEAMS.filter(t => t.name.toLowerCase().includes(watcherSearchQuery.toLowerCase())).map(team => (
                                        <div key={team.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                                          <div className={`w-6 h-6 rounded-lg ${team.color} flex items-center justify-center text-[10px] font-bold text-white relative`}>
                                            {team.name[0]}
                                            <div className="absolute -right-1 -bottom-1 bg-white dark:bg-[#1e1e1e] rounded-full p-0.5 shadow-sm">
                                              <Users size={10} className="text-gray-400" />
                                            </div>
                                          </div>
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">{team.name}</span>
                                          <span className="text-[10px] font-bold text-gray-400">{team.membersCount} people</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center relative">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-black text-sm rounded-l-xl transition-colors shadow-lg shadow-black/10"
                        >
                          Create Task
                        </button>
                        <div className="w-px h-10 bg-black/50" />
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCreateOptions(!showCreateOptions)}
                            className="px-2 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white rounded-r-xl transition-colors shadow-lg shadow-black/10"
                          >
                            <ChevronDown size={14} />
                          </button>
                          {showCreateOptions && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowCreateOptions(false)} />
                              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-1">
                                <button onClick={() => { handleCreateTask(undefined, 'open'); setShowCreateOptions(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between">
                                  Create and open <ChevronRight size={12} />
                                </button>
                                <button onClick={() => { handleCreateTask(undefined, 'start-another'); setShowCreateOptions(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between">
                                  Create and start another <ChevronRight size={12} />
                                </button>
                                <button onClick={() => { handleCreateTask(undefined, 'duplicate'); setShowCreateOptions(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between">
                                  Create and duplicate <ChevronRight size={12} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : modalActiveTab === 'Doc' ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-8 space-y-8 flex-1">
                    {/* Doc Folder Selector */}
                    <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer w-fit rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <FolderOpen size={14} />
                      <span>My Docs</span>
                      <ChevronDown size={14} />
                    </div>

                    {/* Doc Title */}
                    <div className="space-y-4">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Name this Doc..."
                        className="w-full bg-transparent border-none text-2xl font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none"
                        value={docNewTitle}
                        onChange={e => setDocNewTitle(e.target.value)}
                      />

                      <div className="relative">
                        {showDocTable ? (
                          <div className="space-y-4">
                            {/* Table */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500">
                                  <Pencil size={14} />
                                </button>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500">
                                  <LayoutList size={14} />
                                </button>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500">
                                  <Copy size={14} />
                                </button>
                                <div className="flex-1" />
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500">
                                  <Maximize2 size={14} />
                                </button>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500">
                                  <MoreHorizontal size={14} />
                                </button>
                              </div>
                              <table className="w-full">
                                <tbody>
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="border-r border-gray-200 dark:border-gray-700 p-0 w-8 bg-gray-50 dark:bg-gray-800/30">
                                      <div className="flex items-center justify-center h-full">
                                        <GripVertical size={12} className="text-gray-400" />
                                      </div>
                                    </td>
                                    <td className="border-r border-gray-200 dark:border-gray-700 p-2 min-w-[200px]">
                                      <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-black rounded px-1"
                                        placeholder=""
                                      />
                                    </td>
                                    <td className="border-r border-gray-200 dark:border-gray-700 p-2 min-w-[200px]">
                                      <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-black rounded px-1"
                                        placeholder=""
                                      />
                                    </td>
                                    <td className="p-2 min-w-[200px]">
                                      <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-black rounded px-1"
                                        placeholder=""
                                      />
                                    </td>
                                  </tr>
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="border-r border-gray-200 dark:border-gray-700 p-0 w-8 bg-gray-50 dark:bg-gray-800/30">
                                      <div className="flex items-center justify-center h-full">
                                        <GripVertical size={12} className="text-gray-400" />
                                      </div>
                                    </td>
                                    <td className="border-r border-gray-200 dark:border-gray-700 p-2">
                                      <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-black rounded px-1"
                                        placeholder=""
                                      />
                                    </td>
                                    <td className="border-r border-gray-200 dark:border-gray-700 p-2">
                                      <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-black rounded px-1"
                                        placeholder=""
                                      />
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-black rounded px-1"
                                        placeholder=""
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Write something prompt below table */}
                            <div
                              className="flex items-center gap-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-text transition-colors group relative h-10"
                              onClick={() => setIsWritingDoc(true)}
                            >
                              <div
                                className="opacity-0 group-hover:opacity-100 absolute -left-8 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setShowDocSlashMenu(true); }}
                              >
                                <Plus size={16} />
                              </div>
                              <span className="text-sm font-medium">Write something</span>
                            </div>
                          </div>
                        ) : showDocColumns ? (
                          <div className="space-y-4">
                            {/* Columns Layout */}
                            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedColumns}, 1fr)` }}>
                              {Array.from({ length: selectedColumns }).map((_, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[150px] relative group"
                                >
                                  <div
                                    className="opacity-0 group-hover:opacity-100 absolute -left-8 top-1 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                                    onClick={() => setShowDocSlashMenu(true)}
                                  >
                                    <Plus size={16} className="text-gray-400" />
                                  </div>
                                  <span className="text-sm text-gray-400 dark:text-gray-600">Write something</span>
                                </div>
                              ))}
                            </div>

                            {/* Write something prompt below columns */}
                            <div
                              className="flex items-center gap-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-text transition-colors group relative h-10"
                              onClick={() => setIsWritingDoc(true)}
                            >
                              <div
                                className="opacity-0 group-hover:opacity-100 absolute -left-8 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setShowDocSlashMenu(true); }}
                              >
                                <Plus size={16} />
                              </div>
                              <span className="text-sm font-medium">Write something</span>
                            </div>
                          </div>
                        ) : showOasisList ? (
                          <div className="space-y-4">
                            {/* Oasis List */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1e1e1e]">
                              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">/Oasis List (List)</span>
                                </div>
                              </div>

                              <div className="p-4">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                  ADD LIST OF TASKS
                                </h3>

                                {/* Tabs */}
                                <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                                  <button className="pb-2 text-sm font-medium text-black border-b-2 border-black">
                                    Search
                                  </button>
                                  <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    Browse or New List
                                  </button>
                                </div>

                                {/* Search Input */}
                                <div className="relative mb-4">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
                                  <input
                                    type="text"
                                    placeholder="Filter by name..."
                                    value={oasisListSearch}
                                    onChange={(e) => setOasisListSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#121213] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                                  />
                                </div>

                                {/* Paste URL */}
                                <div className="text-center py-6">
                                  <p className="text-xs text-gray-400 dark:text-gray-600 italic">
                                    Paste URL or search List name
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Write something prompt below Oasis List */}
                            <div
                              className="flex items-center gap-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-text transition-colors group relative h-10"
                              onClick={() => setIsWritingDoc(true)}
                            >
                              <div
                                className="opacity-0 group-hover:opacity-100 absolute -left-8 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setShowDocSlashMenu(true); }}
                              >
                                <Plus size={16} />
                              </div>
                              <span className="text-sm font-medium">Write something</span>
                            </div>
                          </div>
                        ) : !isWritingDoc ? (
                          <div
                            onClick={() => setIsWritingDoc(true)}
                            className="flex items-center gap-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-text transition-colors group relative h-10"
                          >
                            <div
                              className="opacity-0 group-hover:opacity-100 absolute -left-8 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); setShowDocSlashMenu(true); }}
                            >
                              <Plus size={16} />
                            </div>
                            <FileText size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-lg font-medium">Start writing</span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3 relative group min-h-[100px]">
                            <div
                              className="absolute -left-8 top-1 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              onClick={() => setShowDocSlashMenu(true)}
                            >
                              <Plus size={16} className="text-gray-400" />
                            </div>
                            <textarea
                              autoFocus
                              placeholder="Write something or type '/' for commands"
                              value={docContent}
                              onChange={(e) => setDocContent(e.target.value)}
                              className={`w-full bg-transparent border-none text-lg placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none resize-none
                                ${selectedTextColor === 'Red' ? 'text-red-500' : ''}
                                ${selectedTextColor === 'Orange' ? 'text-orange-500' : ''}
                                ${selectedTextColor === 'Yellow' ? 'text-yellow-500' : ''}
                                ${selectedTextColor === 'Blue' ? 'text-blue-500' : ''}
                                ${selectedTextColor === 'Purple' ? 'text-black' : ''}
                                ${selectedTextColor === 'Pink' ? 'text-pink-500' : ''}
                                ${selectedTextColor === 'Green' ? 'text-green-500' : ''}
                                ${selectedTextColor === 'Grey' ? 'text-gray-500' : ''}
                                ${selectedTextColor === 'Default' ? 'text-gray-700 dark:text-gray-300' : ''}
                                ${selectedHighlight?.includes('Red') ? 'bg-red-100 dark:bg-red-900/30' : ''}
                                ${selectedHighlight?.includes('Orange') ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                                ${selectedHighlight?.includes('Yellow') ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                                ${selectedHighlight?.includes('Blue') ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                                ${selectedHighlight?.includes('Purple') ? 'bg-gray-100 dark:bg-purple-900/30' : ''}
                                ${selectedHighlight?.includes('Pink') ? 'bg-pink-100 dark:bg-pink-900/30' : ''}
                                ${selectedHighlight?.includes('Green') ? 'bg-green-100 dark:bg-green-900/30' : ''}
                                ${selectedHighlight?.includes('Grey') ? 'bg-gray-100 dark:bg-gray-900/30' : ''}
                              `}
                              rows={5}
                              onKeyDown={(e) => {
                                if (e.key === '/') {
                                  setShowDocSlashMenu(true);
                                }
                              }}
                            />

                            {/* Formatting Indicators */}
                            {(selectedTextColor !== 'Default' || selectedHighlight || selectedBadge) && (
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {selectedTextColor !== 'Default' && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                    <span className="text-gray-500">Color:</span>
                                    <span className={`font-bold ${selectedTextColor === 'Red' ? 'text-red-500' :
                                      selectedTextColor === 'Orange' ? 'text-orange-500' :
                                        selectedTextColor === 'Yellow' ? 'text-yellow-500' :
                                          selectedTextColor === 'Blue' ? 'text-blue-500' :
                                            selectedTextColor === 'Purple' ? 'text-black' :
                                              selectedTextColor === 'Pink' ? 'text-pink-500' :
                                                selectedTextColor === 'Green' ? 'text-green-500' :
                                                  'text-gray-500'
                                      }`}>{selectedTextColor}</span>
                                    <button onClick={() => setSelectedTextColor('Default')} className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5">
                                      <X size={12} />
                                    </button>
                                  </div>
                                )}
                                {selectedHighlight && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                    <span className="text-gray-500">Highlight:</span>
                                    <span className="font-bold">{selectedHighlight.replace(' highlight', '')}</span>
                                    <button onClick={() => setSelectedHighlight(null)} className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5">
                                      <X size={12} />
                                    </button>
                                  </div>
                                )}
                                {selectedBadge && (
                                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${selectedBadge.includes('Red') ? 'bg-red-500 text-white' :
                                    selectedBadge.includes('Orange') ? 'bg-orange-500 text-white' :
                                      selectedBadge.includes('Yellow') ? 'bg-yellow-500 text-white' :
                                        selectedBadge.includes('Blue') ? 'bg-blue-500 text-white' :
                                          selectedBadge.includes('Purple') ? 'bg-black text-white' :
                                            selectedBadge.includes('Pink') ? 'bg-pink-500 text-white' :
                                              selectedBadge.includes('Green') ? 'bg-green-500 text-white' :
                                                'bg-gray-500 text-white'
                                    } ${selectedBadge.includes('Strong') ? 'shadow-lg' : ''}`}>
                                    <Tag size={12} />
                                    <span>{selectedBadge.replace(' badge', '')}</span>
                                    <button onClick={() => setSelectedBadge(null)} className="ml-1 hover:opacity-80 rounded p-0.5">
                                      <X size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {showDocSlashMenu && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDocSlashMenu(false)} />
                            <div className="absolute top-10 left-0 w-[480px] bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[500px] overflow-y-auto custom-scrollbar flex flex-col">
                              <div className="p-4 flex flex-col gap-6">
                                {DOC_MENU_GROUPS.map((group) => (
                                  <div key={group.category} className="space-y-2">
                                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2">{group.category}</h4>
                                    <div className="grid grid-cols-2 gap-1">
                                      {group.items.map((item) => (
                                        <div
                                          key={item.label}
                                          onClick={() => handleDocMenuItemClick(item.label)}
                                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group/item"
                                        >
                                          <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                            <item.icon size={14} className={`${item.color} group-hover/item:scale-110 transition-transform`} />
                                          </div>
                                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
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
                    </div>

                    {/* Add New Options */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Add new</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Table', icon: TableIcon },
                          { label: 'Column', icon: Layout },
                          { label: 'Oasis List', icon: List }
                        ].map(item => (
                          <div
                            key={item.label}
                            onClick={() => handleDocMenuItemClick(item.label)}
                            className="flex items-center gap-3 px-3 py-2 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-all group relative"
                          >
                            <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold">{item.label}</span>

                            {/* Column Selection Submenu */}
                            {item.label === 'Column' && showDocColumns && (
                              <>
                                <div className="fixed inset-0 z-[60]" onClick={(e) => { e.stopPropagation(); setShowDocColumns(false); }} />
                                <div className="absolute left-full top-0 ml-2 w-40 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[70] overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
                                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700">
                                    /Columns
                                  </div>
                                  {[2, 3, 4, 5].map((num) => (
                                    <div
                                      key={num}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedColumns(num);
                                        setShowDocColumns(true);
                                        setShowDocSlashMenu(false);
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                      <LayoutGrid size={14} className="text-gray-500" />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{num} Columns</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Doc Footer */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsDocPrivate(!isDocPrivate)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${isDocPrivate ? 'bg-black' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${isDocPrivate ? 'translate-x-5' : ''}`} />
                      </button>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Private</span>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-black/20 active:scale-95"
                    >
                      Create Doc
                    </button>
                  </div>
                </div>
              ) : modalActiveTab === 'Reminder' ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-8 space-y-6 flex-1">
                    {/* Reminder Name Input */}
                    <input
                      type="text"
                      autoFocus
                      placeholder="Reminder name or type '/' for commands"
                      className="w-full bg-transparent border-none text-2xl font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none"
                    />

                    {/* Add Description Section */}
                    <div className="relative">
                      {!isWritingDoc ? (
                        <div
                          onClick={() => setIsWritingDoc(true)}
                          className="flex items-center gap-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-text transition-colors group relative h-10"
                        >
                          <div
                            className="opacity-0 group-hover:opacity-100 absolute -left-8 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setShowDocSlashMenu(true); }}
                          >
                            <Plus size={16} />
                          </div>
                          <FileText size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Add description</span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 relative group min-h-[100px]">
                          <div
                            className="absolute -left-8 top-1 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            onClick={() => setShowDocSlashMenu(true)}
                          >
                            <Plus size={16} className="text-gray-400" />
                          </div>
                          <textarea
                            autoFocus
                            placeholder="Write or type '/' for commands and AI actions"
                            value={docContent}
                            onChange={(e) => setDocContent(e.target.value)}
                            className={`w-full bg-transparent border-none text-sm placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none resize-none
                              ${selectedTextColor === 'Red' ? 'text-red-500' : ''}
                              ${selectedTextColor === 'Orange' ? 'text-orange-500' : ''}
                              ${selectedTextColor === 'Yellow' ? 'text-yellow-500' : ''}
                              ${selectedTextColor === 'Blue' ? 'text-blue-500' : ''}
                              ${selectedTextColor === 'Purple' ? 'text-black' : ''}
                              ${selectedTextColor === 'Pink' ? 'text-pink-500' : ''}
                              ${selectedTextColor === 'Green' ? 'text-green-500' : ''}
                              ${selectedTextColor === 'Grey' ? 'text-gray-500' : ''}
                              ${selectedTextColor === 'Default' ? 'text-gray-700 dark:text-gray-300' : ''}
                              ${selectedHighlight?.includes('Red') ? 'bg-red-100 dark:bg-red-900/30' : ''}
                              ${selectedHighlight?.includes('Orange') ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                              ${selectedHighlight?.includes('Yellow') ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                              ${selectedHighlight?.includes('Blue') ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                              ${selectedHighlight?.includes('Purple') ? 'bg-gray-100 dark:bg-purple-900/30' : ''}
                              ${selectedHighlight?.includes('Pink') ? 'bg-pink-100 dark:bg-pink-900/30' : ''}
                              ${selectedHighlight?.includes('Green') ? 'bg-green-100 dark:bg-green-900/30' : ''}
                              ${selectedHighlight?.includes('Grey') ? 'bg-gray-100 dark:bg-gray-900/30' : ''}
                            `}
                            rows={5}
                            onKeyDown={(e) => {
                              if (e.key === '/') {
                                setShowDocSlashMenu(true);
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Slash Menu for Reminder */}
                      {showDocSlashMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowDocSlashMenu(false)} />
                          <div className="absolute top-10 left-0 w-[480px] bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[500px] overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="p-4 flex flex-col gap-6">
                              {DOC_MENU_GROUPS.map((group) => (
                                <div key={group.category} className="space-y-2">
                                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2">{group.category}</h4>
                                  <div className="grid grid-cols-2 gap-1">
                                    {group.items.map((item) => (
                                      <div
                                        key={item.label}
                                        onClick={() => handleDocMenuItemClick(item.label)}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group/item"
                                      >
                                        <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                          <item.icon size={14} className={`${item.color} group-hover/item:scale-110 transition-transform`} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      {/* Today Button with Date Picker */}
                      <div className="relative">
                        <button
                          onClick={() => setShowReminderDatePicker(!showReminderDatePicker)}
                          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Calendar size={14} />
                          {reminderDate || 'Today'}
                        </button>

                        {showReminderDatePicker && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowReminderDatePicker(false)} />
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              {/* Time Input */}
                              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <input
                                  type="text"
                                  placeholder="Try 'Tomorrow at 2 PM'..."
                                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#121213] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>

                              {/* Quick Options */}
                              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                {[
                                  { label: 'Later', time: 'in 2 hours' },
                                  { label: 'Tomorrow', time: 'Tue, 8:00 AM' },
                                  { label: 'In 2 days', time: 'Wed, 8:00 AM' },
                                  { label: 'Next week', time: 'Mon, 8:00 AM' }
                                ].map((option) => (
                                  <div
                                    key={option.label}
                                    onClick={() => {
                                      setReminderDate(option.label);
                                      setShowReminderDatePicker(false);
                                    }}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Clock size={14} className="text-gray-400" />
                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{option.time}</span>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                                  <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-black" />
                                    <span className="text-xs font-medium text-black dark:text-purple-400">Set Recurring</span>
                                  </div>
                                  <ChevronRight size={14} className="text-gray-400" />
                                </div>
                              </div>

                              {/* Calendar */}
                              <div className="p-3">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Feb 2026</span>
                                  <div className="flex items-center gap-1">
                                    <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Today</button>
                                    <ChevronDown size={14} className="text-gray-400" />
                                    <ChevronDown size={14} className="text-gray-400 rotate-180" />
                                  </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center">
                                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                    <div key={day} className="text-[10px] font-bold text-gray-400 py-1">{day}</div>
                                  ))}
                                  {Array.from({ length: 35 }, (_, i) => {
                                    const day = i - 6; // Adjust for calendar start
                                    const isToday = day === 16;
                                    const isCurrentMonth = day > 0 && day <= 29;
                                    return (
                                      <button
                                        key={i}
                                        className={`text-xs py-1 rounded-lg transition-colors ${isToday
                                          ? 'bg-black text-white font-bold'
                                          : isCurrentMonth
                                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                            : 'text-gray-300 dark:text-gray-700'
                                          }`}
                                      >
                                        {day > 0 && day <= 29 ? day : day <= 0 ? 31 + day : day - 29}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <UserIcon size={14} />
                        For me
                      </button>

                      {/* Notify Me Button with Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setShowNotifyMenu(!showNotifyMenu)}
                          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Bell size={14} />
                          Notify me
                        </button>

                        {showNotifyMenu && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifyMenu(false)} />
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              <div className="p-1">
                                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  NOTIFY ME
                                </div>
                                {[
                                  { label: 'On due date', icon: Check },
                                  { label: '10 minutes before', icon: null },
                                  { label: '1 hour before', icon: null },
                                  { label: 'Custom...', icon: null },
                                  { label: "Don't notify", icon: null }
                                ].map((option, index) => (
                                  <div
                                    key={option.label}
                                    onClick={() => {
                                      setSelectedNotification(option.label);
                                      setShowNotifyMenu(false);
                                    }}
                                    className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors ${index === 3 ? 'border-t border-gray-200 dark:border-gray-700 mt-1 pt-2' : ''
                                      }`}
                                  >
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                                    {selectedNotification === option.label && option.icon && (
                                      <Check size={14} className="text-black" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reminder Footer */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="reminder-file-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log('File uploaded:', file.name);
                            // Handle file upload logic here
                          }
                        }}
                      />
                      <label htmlFor="reminder-file-upload">
                        <Paperclip size={18} className="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-black/20 active:scale-95"
                    >
                      Create Reminder
                    </button>
                  </div>
                </div>
              ) : modalActiveTab === 'Whiteboard' ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-8 space-y-6 flex-1">
                    {/* Whiteboard Folder Selector */}
                    <div className="relative">
                      <div
                        onClick={() => setShowWhiteboardFolderPicker(!showWhiteboardFolderPicker)}
                        className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer w-fit rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                      >
                        <LayoutList size={14} />
                        <span>My Whiteboards</span>
                        <ChevronDown size={14} />
                      </div>

                      {showWhiteboardFolderPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowWhiteboardFolderPicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Search */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#121213] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                            </div>

                            {/* Workspace */}
                            <div className="p-2">
                              <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                <Hash size={14} className="text-gray-400" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Workspace</span>
                              </div>
                            </div>

                            {/* Spaces */}
                            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Spaces
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Whiteboard Name Input */}
                    <input
                      type="text"
                      autoFocus
                      placeholder="Name this Whiteboard..."
                      value={whiteboardName}
                      onChange={(e) => setWhiteboardName(e.target.value)}
                      className="w-full bg-transparent border-none text-2xl font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none"
                    />

                    {/* Whiteboard Canvas Area */}
                    <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl min-h-[300px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/20">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                          <PenTool size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
                          Your whiteboard canvas will appear here
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Whiteboard Footer */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsWhiteboardPrivate(!isWhiteboardPrivate)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${isWhiteboardPrivate ? 'bg-black' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${isWhiteboardPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Private</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-black/20 active:scale-95"
                    >
                      Create Whiteboard
                    </button>
                  </div>
                </div>
              ) : modalActiveTab === 'Dashboard' ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-8 space-y-6 flex-1">
                    {/* Dashboard Folder Selector */}
                    <div className="relative">
                      <div
                        onClick={() => setShowDashboardFolderPicker(!showDashboardFolderPicker)}
                        className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer w-fit rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                      >
                        <LayoutList size={14} />
                        <span>My Dashboards</span>
                        <ChevronDown size={14} />
                      </div>

                      {showDashboardFolderPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowDashboardFolderPicker(false)} />
                          <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Search */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#121213] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                            </div>

                            {/* Spaces */}
                            <div className="p-2">
                              <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Spaces
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Dashboard Name Input */}
                    <input
                      type="text"
                      autoFocus
                      placeholder="Name this Dashboard..."
                      value={dashboardName}
                      onChange={(e) => setDashboardName(e.target.value)}
                      className="w-full bg-transparent border-none text-2xl font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none"
                    />

                    {/* Dashboard Canvas Area */}
                    <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl min-h-[300px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/20">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                          <BarChart3 size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
                          Your dashboard widgets will appear here
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Footer */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsDashboardPrivate(!isDashboardPrivate)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${isDashboardPrivate ? 'bg-black' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${isDashboardPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Private</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-black/20 active:scale-95"
                    >
                      Create Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                    <Plus size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">{modalActiveTab} creation is coming soon!</h3>
                </div>
              )
              }
            </div>
          </div>
        )
      }
      {/* Settings Modal */}
      {
        isSettingsOpen && (
          <div>
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsSettingsOpen(false)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white dark:bg-black w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300 pointer-events-auto">
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
                              className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-black transition-colors font-bold"
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
                              className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-black transition-colors font-bold"
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
                              className="w-full bg-gray-50 dark:bg-[#16161e] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-black transition-colors font-bold"
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
                    className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-black/20 transition-all hover:scale-105 active:scale-95 uppercase"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Create Space Modal */}
      {
        isSpaceModalOpen && (
          <div>
            <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSpaceModalOpen(false)} />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white dark:bg-[#121213] w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-in zoom-in duration-300 flex flex-col pointer-events-auto relative max-h-[90vh] overflow-hidden">
                {spaceModalStep === 1 ? (
                  <>
                    {/* Step 1: Modal Header */}
                    <div className="px-8 pt-6 pb-2 flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Create a Space</h2>
                        <p className="text-sm text-gray-500 font-medium">A Space represents teams, departments, or groups, each with its own Lists, workflows, and settings.</p>
                      </div>
                      <button onClick={() => setIsSpaceModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 self-start mt-1">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-8 pb-4 space-y-8 custom-scrollbar overflow-y-auto">
                      {/* Icon & Name Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Icon & name</label>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#2e2e2e] border border-gray-200 dark:border-gray-700 font-black text-gray-700 dark:text-white flex items-center justify-center text-lg shadow-inner uppercase">
                            {newSpaceName.trim() ? newSpaceName.trim()[0] : 'S'}
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Marketing, Engineering, HR"
                            value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            className="flex-1 bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-700 transition-all font-medium"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Description Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description <span className="text-gray-400 dark:text-gray-600 font-medium">(optional)</span></label>
                        <textarea
                          placeholder="Type here..."
                          value={newSpaceDescription}
                          onChange={(e) => setNewSpaceDescription(e.target.value)}
                          className="w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-700 transition-all font-medium min-h-[44px] resize-none"
                        />
                      </div>

                      {/* Default Permissions Section */}
                      <div className="relative pt-2">
                        <div
                          onClick={() => setIsPermissionPickerOpen(!isPermissionPickerOpen)}
                          className="flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus size={18} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Default permission</span>
                            <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">?</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1a1b] border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-[#202021] transition-colors">
                            {selectedSpacePermission}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isPermissionPickerOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {isPermissionPickerOpen && (
                          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 pointer-events-auto">
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsPermissionPickerOpen(false)} />
                            <div className="relative w-[400px] bg-white dark:bg-[#1a1a1c] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                              <div className="p-1 space-y-0.5">
                                {[
                                  { id: 'Full edit', desc: 'Can create and edit entities in this Space. Owners and admins can manage Space settings.' },
                                  { id: 'Edit', desc: "Can create and edit entities in this Space. Can't manage Space settings or delete entities." },
                                  { id: 'Comment', desc: "Can comment on entities within this Space. Can't manage Space settings or edit entities." },
                                  { id: 'View only', desc: "Read-only. Can't edit entities or comment in this Space outside of Chat. Can collaborate in Chat." }
                                ].map((perm) => (
                                  <button
                                    key={perm.id}
                                    onClick={() => {
                                      setSelectedSpacePermission(perm.id);
                                      setIsPermissionPickerOpen(false);
                                    }}
                                    className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-base font-bold text-gray-900 dark:text-white">{perm.id}</span>
                                      {selectedSpacePermission === perm.id && (
                                        <Check size={18} className="text-primary" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                      {perm.desc}
                                    </p>
                                  </button>
                                ))}
                              </div>
                              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-center">
                                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                  <span className="underline cursor-pointer">Learn more</span> about permissions.
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Private Toggle Section */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Make Private</div>
                          <div className="text-xs text-gray-500 font-medium">Only you and invited members have access</div>
                        </div>
                        <div
                          onClick={() => setIsSpacePrivate(!isSpacePrivate)}
                          className={`w-11 h-6 ${isSpacePrivate ? 'bg-black' : 'bg-gray-200 dark:bg-[#2a2a2b]'} rounded-full relative p-1 cursor-pointer transition-colors active:scale-95`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isSpacePrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end bg-gray-50 dark:bg-[#121213]">
                      <button
                        onClick={() => setSpaceModalStep(2)}
                        className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : spaceModalStep === 2 ? (
                  <>
                    {/* Step 2: Define your workflow */}
                    <div className="px-8 pt-6 pb-2 flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Define your workflow</h2>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Choose a pre-configured solution, required views, and task statuses.</p>
                      </div>
                      <button onClick={() => setIsSpaceModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 self-start mt-1">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-8 pb-4 space-y-8 overflow-y-auto custom-scrollbar">
                      {/* Workflow Options Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { title: 'Starter', desc: 'The basics for any project' },
                          { title: 'Marketing', desc: 'Campaigns, content & events' },
                          { title: 'Sales', desc: 'CRM, deals & pipelines' },
                          { title: 'Product + Engineering', desc: 'Streamline your product lifecycle' }
                        ].map(option => (
                          <button
                            key={option.title}
                            onClick={() => setSpaceWorkflowOption(option.title)}
                            className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${spaceWorkflowOption === option.title ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/5' : 'border-gray-100 dark:border-gray-800 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                          >
                            <div className={`text-sm font-bold mb-1 ${spaceWorkflowOption === option.title ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>{option.title}</div>
                            <div className="text-xs text-gray-500 font-medium">{option.desc}</div>
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Customize defaults for <span className="text-primary">{spaceWorkflowOption}</span></div>

                        <div className="space-y-3">
                          {/* Default views */}
                          <div
                            onClick={() => {
                              setTempSpaceDefaultViews([...spaceDefaultViews]);
                              setSpaceModalStep(3);
                            }}
                            className="flex items-center justify-between p-4 bg-white dark:bg-transparent border border-gray-100 dark:border-gray-800 rounded-xl group hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                                <Layers size={18} />
                              </div>
                              <div className="space-y-0.5">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">Default views</div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {spaceDefaultViews.length > 0 ? spaceDefaultViews.join(', ') : 'None selected'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">?</span>
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </div>

                          {/* Task statuses */}
                          <div
                            onClick={() => {
                              setTempSpaceTaskStatuses(JSON.parse(JSON.stringify(spaceTaskStatuses)));
                              setSpaceModalStep(4);
                            }}
                            className="flex items-center justify-between p-4 bg-white dark:bg-transparent border border-gray-100 dark:border-gray-800 rounded-xl group hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                                <CircleDot size={18} />
                              </div>
                              <div className="space-y-0.5">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">Task statuses</div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-gray-500">
                                  {spaceTaskStatuses.map((cat, i) => (
                                    <React.Fragment key={cat.category}>
                                      {cat.statuses.map((status, si) => (
                                        <React.Fragment key={status.name + si}>
                                          <span className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full border-2" style={{ borderColor: status.color }} />
                                            {status.name}
                                          </span>
                                          {(si < cat.statuses.length - 1 || (i < spaceTaskStatuses.length - 1 && spaceTaskStatuses[i + 1].statuses.length > 0)) && <ChevronRight size={10} />}
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400">?</span>
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Step 2 */}
                    <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#121213]">
                      <button
                        onClick={() => setSpaceModalStep(1)}
                        className="px-6 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-sm transition-all shadow-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setIsSpaceModalOpen(false);
                          setSpaceModalStep(1);
                        }}
                        className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                      >
                        Create Space
                      </button>
                    </div>
                  </>
                ) : spaceModalStep === 3 ? (
                  <>
                    {/* Step 3: Default settings for views */}
                    <div className="px-8 pt-6 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSpaceModalStep(2)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Default settings for views</h2>
                      </div>
                      <button onClick={() => setIsSpaceModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 self-start mt-1">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="px-8 pt-2">
                      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-6">
                        <button className="flex-1 py-1.5 text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-[#2a2a2c] rounded-lg shadow-sm">Required views</button>
                        <button className="flex-1 py-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors">Default View Templates</button>
                      </div>

                      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                        Set up views that appear automatically in every Space, Folder, or List — and can't be removed.
                      </p>

                      <div className="bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden mb-8">
                        <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                          {[
                            { id: 'List', icon: <Hash size={16} />, required: true },
                            { id: 'Board', icon: <Layout size={16} /> },
                            { id: 'Calendar', icon: <CalendarIcon size={16} /> },
                            { id: 'Map', icon: <MapPin size={16} /> },
                            { id: 'Activity', icon: <Activity size={16} /> },
                            { id: 'Team', icon: <Users size={16} /> },
                            { id: 'Gantt', icon: <GanttChart size={16} /> },
                            { id: 'Mind Map', icon: <MindMapIcon size={16} /> },
                            { id: 'Table', icon: <TableIcon size={16} /> },
                            { id: 'Timeline', icon: <Clock size={16} /> },
                            { id: 'Workload', icon: <BarChart3 size={16} /> },
                          ].map((view) => {
                            const isActive = tempSpaceDefaultViews.includes(view.id);
                            return (
                              <div key={view.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`text-gray-400 ${view.id === 'List' ? 'text-gray-400' : isActive ? 'text-primary' : ''}`}>
                                    {view.icon}
                                  </div>
                                  <span className={`text-sm font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {view.id} {view.required && <span className="text-gray-400 font-medium">— Required</span>}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  {view.required && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Default</span>}
                                  <div
                                    onClick={() => {
                                      if (view.required) return;
                                      setTempSpaceDefaultViews(prev =>
                                        prev.includes(view.id)
                                          ? prev.filter(v => v !== view.id)
                                          : [...prev, view.id]
                                      );
                                    }}
                                    className={`w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors ${isActive ? (view.required ? 'bg-primary/40' : 'bg-primary') : 'bg-gray-200 dark:bg-[#2a2a2b]'} ${view.required ? 'cursor-not-allowed opacity-60' : 'active:scale-95'}`}
                                  >
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Step 3 Footer */}
                    <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121213]">
                      <button
                        onClick={() => {
                          setSpaceDefaultViews([...tempSpaceDefaultViews]);
                          setSpaceModalStep(2);
                        }}
                        className="w-full bg-primary hover:bg-primary-hover active:bg-primary-hover text-white py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                      >
                        Done
                      </button>
                    </div>
                  </>
                ) : spaceModalStep === 4 ? (
                  <>
                    {/* Step 4: Edit task statuses */}
                    <div className="px-8 pt-6 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSpaceModalStep(2)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Edit {spaceWorkflowOption.toLowerCase()} statuses</h2>
                      </div>
                      <button onClick={() => setIsSpaceModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 self-start mt-1">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                      <div className="space-y-8">
                        {tempSpaceTaskStatuses.map((category, catIndex) => (
                          <div key={category.category} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">{category.category}</h4>
                              <Info size={12} className="text-gray-300" />
                              <button className="ml-auto text-gray-300 hover:text-gray-500 transition-colors">
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="space-y-2">
                              {category.statuses.map((status, statusIndex) => (
                                <div key={statusIndex} className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-gray-800 rounded-xl group hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                                  <div className="w-4 h-4 cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-gray-400">
                                    <div className="grid grid-cols-2 gap-0.5">
                                      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-0.5 h-0.5 bg-current rounded-full" />)}
                                    </div>
                                  </div>
                                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: status.color }}>
                                    {category.category === 'Closed' && <Check size={10} style={{ color: status.color }} />}
                                    {category.category === 'Active' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />}
                                  </div>
                                  <input
                                    value={status.name}
                                    onChange={(e) => {
                                      const newStatuses = [...tempSpaceTaskStatuses];
                                      newStatuses[catIndex].statuses[statusIndex].name = e.target.value;
                                      setTempSpaceTaskStatuses(newStatuses);
                                    }}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-bold text-gray-900 dark:text-white"
                                  />
                                  <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-600 transition-all p-1">
                                    <MoreHorizontal size={16} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const newStatuses = [...tempSpaceTaskStatuses];
                                  newStatuses[catIndex].statuses.push({ name: 'NEW STATUS', color: '#94a3b8' });
                                  setTempSpaceTaskStatuses(newStatuses);
                                }}
                                className="w-full py-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus size={14} /> Add status
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 4 Footer */}
                    <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121213] flex items-center justify-between">
                      <button className="text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
                        <HelpCircle size={14} />
                        <span className="underline cursor-pointer">Learn more about statuses</span>
                      </button>
                      <button
                        onClick={() => {
                          setSpaceTaskStatuses(JSON.parse(JSON.stringify(tempSpaceTaskStatuses)));
                          setSpaceModalStep(2);
                        }}
                        className="bg-primary hover:bg-primary-hover active:bg-primary-hover text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                      >
                        Apply changes
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )
      }
      {/* Task Detail Modal */}
      {
        selectedTask && (
          <div
            className={`fixed inset-0 z-[150] flex items-center justify-end bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isTaskDetailsVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeTaskDetail}
          >
            <div
              className={`bg-white dark:bg-[#0f0f13] w-full max-w-[95%] h-full flex transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800 ${isTaskDetailsVisible ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content - Main Detail Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Modal Header */}
                <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      <Hash size={12} />
                      <span>Task</span>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500">86ewkpyb7</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                    <button onClick={closeTaskDetail} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                  {/* Title Section */}
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">{selectedTask.title}</h2>
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
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded text-xs font-black uppercase tracking-widest">Clients</span>
                        <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
                        <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-green-500"><Check size={12} /></div>
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
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-300">
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
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-black/20 text-black dark:text-purple-400 rounded text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-black/20">client</span>
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
                  <div className="p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#16161e]/30 rounded-[32px] max-w-4xl min-h-[160px]">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed mb-1">Phone: +971 50 963 6126</p>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed">Email: info@kocrossboxdubai.com</p>
                  </div>

                  {/* Section Tabs */}
                  <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 max-w-4xl">
                    {['Details', 'Subtasks', 'Action Items'].map((tab, idx) => (
                      <button key={tab} className={`pb-4 text-sm font-black uppercase tracking-tighter relative ${idx === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-400'}`}>
                        {tab}
                        {idx === 0 && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-orange-500" />}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom Fields */}
                  <div className="space-y-6 max-w-4xl pt-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Add Custom Fields</h3>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-800/50 rounded-lg text-[10px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      + Create a field in this List
                    </button>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-6 max-w-4xl pt-8">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Attachments</h3>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-800/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-black/30 transition-colors cursor-pointer">
                      <p className="text-sm font-black text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">Drop your files here to <span className="underline">upload</span></p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Right Activity Panel */}
              <div className="w-[380px] border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-[#0f0f13] overflow-hidden">
                <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Activity</h3>
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                    <Search size={16} className="hover:text-gray-700 dark:hover:text-white cursor-pointer" />
                    <Filter size={16} className="hover:text-gray-700 dark:hover:text-white cursor-pointer" />
                    <div className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                      <MessageSquare size={16} />
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <p>Gustavo created this task</p>
                  </div>
                  <span className="text-gray-700">11:43 am</span>
                </div>
                <div className="flex items-start gap-4 text-[10px] font-bold text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-black mt-1" />
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
        )
      }

      {/* Customize View Drawer (Image 3) */}
      {/* Customize View Sidebar - Always rendered for animation */}
      <div
        className={`fixed inset-0 z-[160] bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ${isCustomizeViewOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsCustomizeViewOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-gray-800 shadow-2xl z-[170] transition-transform duration-300 ease-in-out flex flex-col ${isCustomizeViewOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-200">Customize view</h2>
          <button
            onClick={() => setIsCustomizeViewOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">

          {/* View Name Input */}
          <div className="bg-gray-50 dark:bg-[#2a2a2b] border border-gray-200 dark:border-gray-700/50 rounded-lg flex items-center px-3 py-2">
            <div className="text-gray-500 dark:text-gray-400 mr-3">
              {activeView === 'List' && <List size={16} />}
              {activeView === 'Board' && <LayoutGrid size={16} />}
              {activeView === 'Calendar' && <Calendar size={16} />}
              {activeView === 'Gantt' && <GanttChart size={16} />}
            </div>
            <input
              type="text"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-200 w-full placeholder-gray-500 font-medium"
              placeholder="View name"
            />
          </div>

          {/* LIST VIEW OPTIONS */}
          {(activeView === 'List' || activeView === 'Overview') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show empty statuses</span>
                <button
                  onClick={() => setShowEmptyStatuses(!showEmptyStatuses)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${showEmptyStatuses ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showEmptyStatuses ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Wrap text</span>
                <button
                  onClick={() => setWrapText(!wrapText)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${wrapText ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${wrapText ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show task locations</span>
                <button
                  onClick={() => setShowTaskLocations(!showTaskLocations)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${showTaskLocations ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showTaskLocations ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show subtask parent names</span>
                <button
                  onClick={() => setShowSubtaskParentNames(!showSubtaskParentNames)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${showSubtaskParentNames ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showSubtaskParentNames ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show closed tasks</span>
                <button
                  onClick={() => setShowClosedTasks(!showClosedTasks)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${showClosedTasks ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showClosedTasks ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                More options <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* BOARD VIEW OPTIONS */}
          {activeView === 'Board' && (
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between py-1 group">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-200">Workload</span>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{boardWorkload}</span>
                  <ChevronRight size={14} />
                </div>
              </button>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show task locations</span>
                <button
                  onClick={() => setBoardShowTaskLocations(!boardShowTaskLocations)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${boardShowTaskLocations ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${boardShowTaskLocations ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show subtask parent names</span>
                <button
                  onClick={() => setBoardShowSubtaskParentNames(!boardShowSubtaskParentNames)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${boardShowSubtaskParentNames ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${boardShowSubtaskParentNames ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                More options <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* CALENDAR VIEW OPTIONS */}
          {activeView === 'Calendar' && (
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between py-1 group">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-200">Task dates</span>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{calendarTaskDates}</span>
                  <ChevronRight size={14} />
                </div>
              </button>
              <button className="w-full flex items-center justify-between py-1 group">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-200">Color tasks by</span>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{calendarColorTasksBy}</span>
                  <ChevronRight size={14} />
                </div>
              </button>
              <button className="w-full flex items-center justify-between py-1 group">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-200">Time format</span>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{calendarTimeFormat}</span>
                  <ChevronRight size={14} />
                </div>
              </button>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show weekends</span>
                <button
                  onClick={() => setCalendarShowWeekends(!calendarShowWeekends)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${calendarShowWeekends ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${calendarShowWeekends ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show week numbers</span>
                <button
                  onClick={() => setCalendarShowWeekNumbers(!calendarShowWeekNumbers)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${calendarShowWeekNumbers ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${calendarShowWeekNumbers ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                More options <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* GANTT VIEW OPTIONS */}
          {activeView === 'Gantt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show weekends</span>
                <button
                  onClick={() => setGanttShowWeekends(!ganttShowWeekends)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${ganttShowWeekends ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${ganttShowWeekends ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show critical path</span>
                <button
                  onClick={() => setGanttShowCriticalPath(!ganttShowCriticalPath)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${ganttShowCriticalPath ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${ganttShowCriticalPath ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show slack time</span>
                <button
                  onClick={() => setGanttShowSlackTime(!ganttShowSlackTime)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${ganttShowSlackTime ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${ganttShowSlackTime ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Full screen mode</span>
                <button
                  onClick={() => setGanttFullScreen(!ganttFullScreen)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${ganttFullScreen ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${ganttFullScreen ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Reschedule dependencies</span>
                <button
                  onClick={() => setGanttRescheduleDependencies(!ganttRescheduleDependencies)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${ganttRescheduleDependencies ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${ganttRescheduleDependencies ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                More options <ChevronRight size={12} />
              </button>
            </div>
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Settings Section - Conditional based on View */}
          <div className="space-y-1">
            {/* Calendar specific: Sync */}
            {activeView === 'Calendar' && (
              <button className="w-full flex items-center gap-3 py-2 group">
                <Calendar size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Sync with calendar</span>
              </button>
            )}

            {/* Common: Fields (All except Calendar sometimes? No, Calendar has fields too) */}
            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Pencil size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Fields</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-[10px] uppercase">
                  {activeView === 'List' ? '3 shown' : activeView === 'Gantt' ? '1 shown' : activeView === 'Board' ? '3 shown' : 'None'}
                </span>
                <ChevronRight size={14} />
              </div>
            </button>

            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Filter size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Filter</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-[10px] uppercase">None</span>
                <ChevronRight size={14} />
              </div>
            </button>

            {/* Group: List Only? Board implies columns are groups. Image 1 doesn't show Group. */}
            {(activeView === 'List' || activeView === 'Overview') && (
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-3">
                  <Layers size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Group</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] uppercase">Status</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            )}

            {/* Sort: Board Only in explicit list? Image 1 shows Sort. List usually has sort in headers. */}
            {activeView === 'Board' && (
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-3">
                  {/* Use ArrowUpDown or similar if available, else generic */}
                  <ArrowUpDown size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Sort</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] uppercase">Task Name</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            )}

            {/* Subtasks: List, Board, Calendar */}
            {activeView !== 'Gantt' && (
              <button className="w-full flex items-center justify-between py-2 group">
                <div className="flex items-center gap-3">
                  <GitMerge size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Subtasks</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-[10px] uppercase">Collapsed</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            )}

            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Wand2 size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Templates</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <ChevronRight size={14} />
              </div>
            </button>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Options Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Save size={15} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Autosave for me</span>
              </div>
              <button
                onClick={() => setAutosaveView(!autosaveView)}
                className={`w-8 h-4 rounded-full transition-colors relative ${autosaveView ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autosaveView ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pin size={15} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Pin view</span>
              </div>
              <button
                onClick={() => setPinView(!pinView)}
                className={`w-8 h-4 rounded-full transition-colors relative ${pinView ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${pinView ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={15} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Private view</span>
              </div>
              <button
                onClick={() => setPrivateView(!privateView)}
                className={`w-8 h-4 rounded-full transition-colors relative ${privateView ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${privateView ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={15} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Protect view</span>
              </div>
              <button
                onClick={() => setProtectView(!protectView)}
                className={`w-8 h-4 rounded-full transition-colors relative ${protectView ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${protectView ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home size={15} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Set as default view</span>
              </div>
              <button
                onClick={() => setDefaultView(!defaultView)}
                className={`w-8 h-4 rounded-full transition-colors relative ${defaultView ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${defaultView ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Actions Section */}
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Link size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Copy link to view</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Star size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Favorite</span>
              </div>
              <ChevronRight size={14} className="text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Download size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Export view</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between py-2 group">
              <div className="flex items-center gap-3">
                <Share2 size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">Sharing & Permissions</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Replies Panel */}
      {
        isRepliesOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]" onClick={() => setIsRepliesOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl z-[301] animate-in slide-in-from-right duration-300 flex flex-col">
              {/* Replies Header */}
              <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Replies</h2>
                  <button
                    onClick={() => setIsRepliesOpen(false)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800">
                  {(['Unread', 'Read'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setRepliesActiveTab(tab)}
                      className={`pb-3 text-sm font-bold relative transition-colors ${repliesActiveTab === tab
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      {tab}
                      {repliesActiveTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-200" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Replies Content */}
              <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto relative">
                    <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1e1e1e]">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">You're all caught up</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Looks like you don't have any unread replies
                  </p>
                  <button className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    Read old replies
                  </button>
                </div>
              </div>

              {/* Replies Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <span>Draft</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )
      }

      {/* Inbox Panel */}
      {
        isInboxOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]" onClick={() => setIsInboxOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl z-[301] animate-in slide-in-from-right duration-300">
              {/* Inbox Header */}
              <div className="border-b border-gray-200 dark:border-gray-800">
                {/* Tabs */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-6">
                    {(['Priority', 'Other', 'Later', 'Cleared'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setInboxActiveTab(tab)}
                        className={`pb-3 text-sm font-bold relative transition-colors ${inboxActiveTab === tab
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        {tab}
                        {inboxActiveTab === tab && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-200" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsInboxOpen(false)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Filter and Settings */}
                <div className="flex items-center gap-2 px-4 pb-3">
                  {/* Filter Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowInboxFilter(!showInboxFilter)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <Filter size={14} />
                      Filter
                    </button>

                    {showInboxFilter && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowInboxFilter(false)} />
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-2">
                            {[
                              { label: 'Mentions', icon: '@', count: 1, state: inboxFilterMentions, setState: setInboxFilterMentions },
                              { label: 'Assigned to me', icon: '@', count: 2, state: inboxFilterAssigned, setState: setInboxFilterAssigned },
                              { label: 'Unread', icon: '📧', count: 3, state: inboxFilterUnread, setState: setInboxFilterUnread },
                              { label: 'Reminders', icon: '🔔', count: 4, state: inboxFilterReminders, setState: setInboxFilterReminders }
                            ].map((filter) => (
                              <button
                                key={filter.label}
                                onClick={() => filter.setState(!filter.state)}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-sm">{filter.icon}</span>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{filter.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">{filter.count}</span>
                                  {filter.state && <Check size={14} className="text-black" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Settings Button */}
                  <button
                    onClick={() => setIsInboxSettingsOpen(true)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Settings size={16} />
                  </button>

                  <button className="ml-auto flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <Check size={14} />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Inbox Content */}
              <div className="flex-1 overflow-auto p-8">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                    <Inbox size={48} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Inbox Zero</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Congratulations! You cleared your important notifications 🎉
                  </p>
                </div>
              </div>

              {/* Inbox Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <span>Draft</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )
      }

      {/* Inbox Settings Panel */}
      {
        isInboxSettingsOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]" onClick={() => setIsInboxSettingsOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#1e1e1e] shadow-2xl z-[401] animate-in slide-in-from-right duration-300">
              {/* Settings Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customize Inbox</h2>
                <button
                  onClick={() => setIsInboxSettingsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Settings Content */}
              <div className="p-6 space-y-6 overflow-auto">
                {/* Toggle Options */}
                <div className="space-y-4">
                  {[
                    { label: 'Show All tab', icon: '@', state: inboxShowAllTab, setState: setInboxShowAllTab },
                    { label: 'Group by date', icon: '📅', state: inboxGroupByDate, setState: setInboxGroupByDate },
                    { label: 'Sort by newest first', icon: '↕️', state: inboxSortNewest, setState: setInboxSortNewest }
                  ].map((option) => (
                    <div key={option.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                      </div>
                      <button
                        onClick={() => option.setState(!option.state)}
                        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${option.state ? 'bg-black' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${option.state ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Important Notifications */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Important notifications</h3>
                  <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customize importance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">11/42</span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  </button>
                </div>

                {/* Display Mode */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Display mode</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setInboxDisplayMode('fullscreen')}
                      className={`relative p-4 border-2 rounded-xl transition-all ${inboxDisplayMode === 'fullscreen'
                        ? 'border-black bg-gray-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      {inboxDisplayMode === 'fullscreen' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                      <div className="bg-gray-100 dark:bg-purple-900/30 rounded-lg p-3 mb-2">
                        <div className="space-y-1.5">
                          <div className="h-1 bg-purple-300 dark:bg-purple-700 rounded w-3/4" />
                          <div className="h-1 bg-purple-200 dark:bg-purple-800 rounded w-full" />
                          <div className="h-1 bg-purple-200 dark:bg-purple-800 rounded w-2/3" />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Fullscreen</p>
                    </button>

                    <button
                      onClick={() => setInboxDisplayMode('inline')}
                      className={`relative p-4 border-2 rounded-xl transition-all ${inboxDisplayMode === 'inline'
                        ? 'border-black bg-gray-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      {inboxDisplayMode === 'inline' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2">
                        <div className="space-y-1.5">
                          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Inline</p>
                    </button>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <Settings size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <Hash size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Keyboard shortcuts</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      }
      {/* Customize Modal */}
      {
        isCustomizeModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsCustomizeModalOpen(false)}>
            <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customize</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Personalize and organize your ClickUp interface</p>
                </div>
                <button
                  onClick={() => setIsCustomizeModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                {['Navigation', 'Home', 'Sections'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCustomizeActiveTab(tab as any)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${customizeActiveTab === tab
                      ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                {customizeActiveTab === 'Navigation' && (
                  <div className="p-4 space-y-1">
                    {[
                      { label: 'Inbox', icon: <Inbox size={16} />, state: navInbox, setState: setNavInbox },
                      { label: 'Replies', icon: <Reply size={16} />, state: navReplies, setState: setNavReplies },
                      { label: 'Assigned Comments', icon: <MessageIcon size={16} />, state: navAssignedComments, setState: setNavAssignedComments },
                      { label: 'My Tasks', icon: <UserIcon size={16} />, state: navMyTasks, setState: setNavMyTasks },
                      { label: 'Chat Activity', icon: <MessageCircle size={16} />, state: navChatActivity, setState: setNavChatActivity },
                      { label: 'Drafts & Sent', icon: <Send size={16} />, state: navDraftsSent, setState: setNavDraftsSent },
                      { label: 'Posts', icon: <FileText size={16} />, state: navPosts, setState: setNavPosts },
                      { label: 'All Channels', icon: <Hash size={16} />, state: navAllChannels, setState: setNavAllChannels },
                      { label: 'All Spaces', icon: <Layers size={16} />, state: navAllSpaces, setState: setNavAllSpaces },
                      { label: 'All Tasks', icon: <Check size={16} />, state: navAllTasks, setState: setNavAllTasks },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${item.state ? 'bg-black text-white' : 'border border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                          }`}>
                          {item.state && <Check size={14} />}
                        </div>
                        <input
                          type="checkbox"
                          checked={item.state}
                          onChange={() => item.setState(!item.state)}
                          className="hidden"
                        />
                        <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {customizeActiveTab === 'Home' && (
                  <div className="p-4 space-y-6">
                    <div className="space-y-1">
                      {[
                        { label: 'Home', icon: <Home size={16} />, state: homeHome, setState: setHomeHome },
                        { label: 'Spaces', icon: <Layers size={16} />, state: homeSpaces, setState: setHomeSpaces },
                        { label: 'Chat', icon: <MessageCircle size={16} />, state: homeChat, setState: setHomeChat },
                        { label: 'Planner', icon: <Calendar size={16} />, state: homePlanner, setState: setHomePlanner },
                        { label: 'AI', icon: <Sparkles size={16} />, state: homeAI, setState: setHomeAI },
                        { label: 'Teams', icon: <Users size={16} />, state: homeTeams, setState: setHomeTeams },
                        { label: 'Docs', icon: <FileText size={16} />, state: homeDocs, setState: setHomeDocs },
                        { label: 'Dashboards', icon: <LayoutGrid size={16} />, state: homeDashboards, setState: setHomeDashboards },
                        { label: 'Whiteboards', icon: <WhiteboardIcon size={16} />, state: homeWhiteboards, setState: setHomeWhiteboards },
                        { label: 'Forms', icon: <FormIcon size={16} />, state: homeForms, setState: setHomeForms },
                        { label: 'Clips', icon: <Video size={16} />, state: homeClips, setState: setHomeClips },
                        { label: 'Goals', icon: <Trophy size={16} />, state: homeGoals, setState: setHomeGoals },
                        { label: 'Timesheets', icon: <Clock size={16} />, state: homeTimesheets, setState: setHomeTimesheets },
                      ].map((item) => (
                        <label key={item.label} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${item.state ? 'bg-black text-white' : 'border border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                            }`}>
                            {item.state && <Check size={14} />}
                          </div>
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={() => item.setState(!item.state)}
                            className="hidden"
                          />
                          <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Appearance */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Appearance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer group">
                          <input
                            type="radio"
                            name="appearance"
                            checked={homeAppearance === 'icons-only'}
                            onChange={() => setHomeAppearance('icons-only')}
                            className="hidden"
                          />
                          <div className={`p-4 border-2 rounded-xl transition-all ${homeAppearance === 'icons-only'
                            ? 'border-black bg-gray-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 group-hover:border-purple-300'
                            }`}>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 aspect-video mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Icons only</span>
                          </div>
                        </label>
                        <label className="cursor-pointer group">
                          <input
                            type="radio"
                            name="appearance"
                            checked={homeAppearance === 'icons-labels'}
                            onChange={() => setHomeAppearance('icons-labels')}
                            className="hidden"
                          />
                          <div className={`p-4 border-2 rounded-xl transition-all ${homeAppearance === 'icons-labels'
                            ? 'border-black bg-gray-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 group-hover:border-purple-300'
                            }`}>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 aspect-video mb-2 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                                <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                                <div className="w-10 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Icons & Labels</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {customizeActiveTab === 'Sections' && (
                  <div className="p-4 space-y-2">
                    {[
                      'Favorites',
                      'Spaces',
                      'Channels',
                      'Direct Messages'
                    ].map((section) => (
                      <div key={section} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#1e1e1e] hover:border-gray-300 dark:hover:border-gray-700 transition-colors group cursor-grab active:cursor-grabbing">
                        <div className="flex items-center gap-3">
                          <MoreVertical size={16} className="text-gray-300 cursor-grab" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{section}</span>
                        </div>
                      </div>
                    ))}

                    <button className="w-full flex items-center justify-center gap-2 p-3 mt-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <Plus size={16} />
                      <span className="text-sm font-medium">Create section</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }


      {/* Create List Modal */}
      {isListModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsListModalOpen(false)}>
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col relative" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create List</h2>
                <button
                  onClick={() => setIsListModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">All Lists are located within a Space. Lists can house any type of task.</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Project, List of items, Campaign"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#121213] border-2 border-primary/20 focus:border-primary rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-all"
                />
              </div>

              {/* Space Selector */}
              <div className="space-y-2 relative">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Space (location)</label>
                <button
                  onClick={() => setIsSpaceSelectorOpen(!isSpaceSelectorOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#121213] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all text-sm group"
                >
                  <div className="flex items-center gap-2">
                    {selectedSpaceIdForList ? (
                      <>
                        <div className="w-5 h-5 bg-primary text-white rounded flex items-center justify-center text-[10px] font-bold">
                          {spaces.find(s => s.id === selectedSpaceIdForList)?.name[0].toUpperCase()}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {spaces.find(s => s.id === selectedSpaceIdForList)?.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">Select a Space</span>
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isSpaceSelectorOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSpaceSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSpaceSelectorOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {spaces.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">No spaces available</div>
                      ) : (
                        spaces.map(space => (
                          <button
                            key={space.id}
                            onClick={() => {
                              setSelectedSpaceIdForList(space.id);
                              setIsSpaceSelectorOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm ${selectedSpaceIdForList === space.id ? 'bg-gray-50 dark:bg-white/5' : ''}`}
                          >
                            <div className="w-5 h-5 bg-primary text-white rounded flex items-center justify-center text-[10px] font-bold">
                              {space.name[0].toUpperCase()}
                            </div>
                            <span className="text-gray-700 dark:text-gray-200">{space.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Private Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Make private</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Only you and invited members have access</p>
                </div>
                <button
                  onClick={() => setIsListPrivate(!isListPrivate)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${isListPrivate ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${isListPrivate ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end">
              <button
                disabled={!newListName.trim() || !selectedSpaceIdForList}
                onClick={() => {
                  setSpaces(prev => prev.map(space => {
                    if (space.id === selectedSpaceIdForList) {
                      return {
                        ...space,
                        lists: [...space.lists, newListName]
                      };
                    }
                    return space;
                  }));
                  alert(`List "${newListName}" created successfully in space!`);
                  setIsListModalOpen(false);
                  setNewListName('');
                  setSelectedSpaceIdForList('');
                }}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${(!newListName.trim() || !selectedSpaceIdForList)
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-hover text-white shadow-lg active:scale-95'
                  }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
};

export default App;
