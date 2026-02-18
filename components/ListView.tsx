
import React, { useState } from 'react';
import { Task, Status } from '../types';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Search,
  CheckCircle2,
  Circle,
  Flag,
  Calendar,
  Plus,
  CircleDot,
  History,
  LayoutList,
  Activity,
  LayoutGrid,
  User as UserIcon,
  GripVertical,
  Pencil,
  EyeOff,
  Check,
  MousePointerClick,
  MonitorPlay,
  ClipboardList,
  MessageSquare,
  Hash,
  Smile,
  Zap,
  Tag,
  Settings,
  ArrowLeft,
  X as CloseIcon,
  ChevronUp,
  Files,
  ArrowRightLeft,
  Users as People,
  Mail as Email,
  Phone,
  BarChart3,
  Type,
  CheckSquare,
  DollarSign,
  Globe,
  FunctionSquare,
  Shirt,
  Trash,
  Settings2,
  ChevronLeft,
  ChevronRight as CollapseIcon,
  CheckCheck,
  Box
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface ListViewProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onAddTask: () => void;
  onAddTaskInline: (title: string, status: Status) => void;
  onTaskClick: (task: Task) => void;
  isDarkMode?: boolean;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onToggleStatus, onAddTask, onAddTaskInline, onTaskClick, isDarkMode }) => {
  const [expandedStatuses, setExpandedStatuses] = useState<Record<string, boolean>>({
    'TO DO': true,
    'COMPLETED': true,
    'CANCELLED': true,
    'BLOCKED': true
  });
  const [isCreatingStatus, setIsCreatingStatus] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [activeGroupMenu, setActiveGroupMenu] = useState<string | null>(null);
  const [inlineAddTaskGroup, setInlineAddTaskGroup] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false);
  const [activeColumns, setActiveColumns] = useState<string[]>(['Assignee', 'Due date', 'Priority']);
  const [subtasksView, setSubtasksView] = useState<'Collapsed' | 'Expanded' | 'Separate'>('Collapsed');
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const [isFieldsDrawerOpen, setIsFieldsDrawerOpen] = useState(false);
  const [fieldsSearchQuery, setFieldsSearchQuery] = useState('');

  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);
  const [isGroupTypeDropdownOpen, setIsGroupTypeDropdownOpen] = useState(false);
  const [isSortDirDropdownOpen, setIsSortDirDropdownOpen] = useState(false);
  const [currentGroupType, setCurrentGroupType] = useState<string>('Status');
  const [currentSortDir, setCurrentSortDir] = useState<'Ascending' | 'Descending'>('Ascending');

  // Group Options functionality
  const [renamingGroup, setRenamingGroup] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [hiddenStatuses, setHiddenStatuses] = useState<string[]>([]);
  const [customStatuses, setCustomStatuses] = useState<string[]>([]);
  const [statusOrder, setStatusOrder] = useState<string[]>(['TO DO', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', 'BLOCKED']);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const addColumn = (label: string) => {
    if (!activeColumns.includes(label)) {
      setActiveColumns(prev => [...prev, label]);
    }
    setIsCreateFieldOpen(false);
  };

  const toggleStatusGroup = (status: string) => {
    setExpandedStatuses(prev => ({ ...prev, [status]: !prev[status] }));
  };

  // Group Options handlers
  const handleRenameGroup = (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      // Update expanded statuses
      setExpandedStatuses(prev => {
        const updated = { ...prev };
        updated[newName] = updated[oldName];
        delete updated[oldName];
        return updated;
      });
    }
    setRenamingGroup(null);
    setRenameValue('');
  };

  const handleCollapseGroup = (status: string) => {
    setExpandedStatuses(prev => ({ ...prev, [status]: false }));
    setActiveGroupMenu(null);
  };

  const handleHideStatus = (status: string) => {
    setHiddenStatuses(prev => [...prev, status]);
    setActiveGroupMenu(null);
  };

  const handleSelectAll = (status: string) => {
    const statusTasks = groupedTasks[status] || [];
    const taskIds = statusTasks.map(t => t.id);
    setSelectedTasks(prev => {
      const newSelected = [...prev];
      taskIds.forEach(id => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      return newSelected;
    });
    setActiveGroupMenu(null);
  };

  const handleCollapseAllGroups = () => {
    setExpandedStatuses(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = false;
      });
      return updated;
    });
    setActiveGroupMenu(null);
  };

  // Removed AI summary functions to match screenshot

  const groupedTasks = tasks.reduce((acc, task) => {
    let key = '';
    if (currentGroupType === 'Status') key = task.status;
    else if (currentGroupType === 'Assignee') key = task.assignee.name;
    else if (currentGroupType === 'Priority') key = task.priority;
    else if (currentGroupType === 'Tags') key = task.tags[0] || 'No Tags';
    else if (currentGroupType === 'Due date') key = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date';
    else key = 'Other';

    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      if (sourceIndex === destinationIndex) return;

      // Calculate the new visual order
      const newGroupKeys = [...groupKeys];
      const [movedItem] = newGroupKeys.splice(sourceIndex, 1);
      newGroupKeys.splice(destinationIndex, 0, movedItem);

      // Identify successor (item now after moved item) to place appropriately in full list
      const successor = newGroupKeys[destinationIndex + 1];

      setStatusOrder(prev => {
        const newOrder = [...prev];
        const movedItemCurrentIndex = newOrder.indexOf(movedItem);
        if (movedItemCurrentIndex !== -1) {
          newOrder.splice(movedItemCurrentIndex, 1);
        }

        const successorIndex = successor ? newOrder.indexOf(successor) : -1;
        if (successorIndex !== -1) {
          newOrder.splice(successorIndex, 0, movedItem);
        } else {
          newOrder.push(movedItem);
        }
        return newOrder;
      });
    };

    const groupKeys = (currentGroupType === 'Status'
      ? Array.from(new Set([...Object.keys(groupedTasks), 'TO DO', ...statusOrder]))
      : Object.keys(groupedTasks)
    ).sort((a, b) => {
      if (currentGroupType === 'Status') {
        const indexA = statusOrder.indexOf(a);
        const indexB = statusOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) {
          return currentSortDir === 'Ascending' ? indexA - indexB : indexB - indexA;
        }
        if (indexA !== -1) return currentSortDir === 'Ascending' ? -1 : 1;
        if (indexB !== -1) return currentSortDir === 'Ascending' ? 1 : -1;
      }

      if (currentSortDir === 'Ascending') return a.localeCompare(b);
      return b.localeCompare(a);
    });

    return (
      <div className="p-4 bg-white dark:bg-black min-h-full">
        <div className="max-w-full space-y-6">
          {/* Custom Actions Bar from Screenshot */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <button
                onClick={() => setIsGroupPopoverOpen(!isGroupPopoverOpen)}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 transition-all"
              >
                <LayoutList size={14} />
                Group: {currentGroupType}
              </button>

              {isGroupPopoverOpen && (
                <>
                  <div className="fixed inset-0 z-[140]" onClick={() => setIsGroupPopoverOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e1e1f] border border-gray-800 rounded-xl shadow-2xl z-[150] p-4 animate-in fade-in zoom-in duration-200">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Group by</div>

                    <div className="flex items-center gap-2">
                      {/* Field Selector */}
                      <div className="relative flex-1">
                        <button
                          onClick={() => {
                            setIsGroupTypeDropdownOpen(!isGroupTypeDropdownOpen);
                            setIsSortDirDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 bg-[#121213] border border-gray-800 rounded-lg text-xs text-gray-200 hover:border-purple-500/50 transition-all ${isGroupTypeDropdownOpen ? 'ring-1 ring-purple-500/50 border-purple-500/50' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            <CircleDot size={14} className="text-gray-500" />
                            <span>{currentGroupType}</span>
                          </div>
                          <ChevronDown size={14} className={`text-gray-500 transition-transform ${isGroupTypeDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isGroupTypeDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-[#1e1e1f] border border-gray-800 rounded-lg shadow-2xl z-[160] py-1 overflow-hidden">
                            {['Status', 'Assignee', 'Priority', 'Tags', 'Due date', 'Task type'].map(type => (
                              <button
                                key={type}
                                onClick={() => {
                                  setCurrentGroupType(type);
                                  setIsGroupTypeDropdownOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:bg-purple-600 hover:text-white transition-colors text-left"
                              >
                                <div className="flex items-center gap-2">
                                  {type === 'Status' && <CircleDot size={14} />}
                                  {type === 'Assignee' && <UserIcon size={14} />}
                                  {type === 'Priority' && <Flag size={14} />}
                                  {type === 'Tags' && <Tag size={14} />}
                                  {type === 'Due date' && <Calendar size={14} />}
                                  {type === 'Task type' && <Activity size={14} />}
                                  <span>{type}</span>
                                </div>
                                {currentGroupType === type && <Check size={14} className="text-purple-400" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sort Direction Selector */}
                      <div className="relative w-32">
                        <button
                          onClick={() => {
                            setIsSortDirDropdownOpen(!isSortDirDropdownOpen);
                            setIsGroupTypeDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 bg-[#121213] border border-gray-800 rounded-lg text-xs text-gray-200 hover:border-purple-500/50 transition-all ${isSortDirDropdownOpen ? 'ring-1 ring-purple-500/50 border-purple-500/50' : ''}`}
                        >
                          <span>{currentSortDir}</span>
                          <ChevronDown size={14} className={`text-gray-500 transition-transform ${isSortDirDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortDirDropdownOpen && (
                          <div className="absolute top-full right-0 mt-1 w-full bg-[#1e1e1f] border border-gray-800 rounded-lg shadow-2xl z-[160] py-1 overflow-hidden">
                            {['Ascending', 'Descending'].map(dir => (
                              <button
                                key={dir}
                                onClick={() => {
                                  setCurrentSortDir(dir as any);
                                  setIsSortDirDropdownOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:bg-purple-600 hover:text-white transition-colors text-left"
                              >
                                <span>{dir}</span>
                                {currentSortDir === dir && <Check size={14} className="text-purple-400" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reset Button */}
                      <button
                        onClick={() => {
                          setCurrentGroupType('Status');
                          setCurrentSortDir('Ascending');
                          setIsGroupPopoverOpen(false);
                        }}
                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                        title="Clear grouping"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setIsSubtasksOpen(!isSubtasksOpen)}
              className={`flex items-center gap-1.5 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-xs font-medium transition-colors relative ${isSubtasksOpen ? 'bg-gray-100 dark:bg-gray-800 text-purple-600' : 'text-gray-500'}`}
            >
              <Activity size={14} />
              Subtasks
              {isSubtasksOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1e1e1f] border border-gray-800 rounded-lg shadow-2xl z-[150] overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Show subtasks</div>
                  {(['Collapsed', 'Expanded', 'Separate'] as const).map(option => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubtasksView(option);
                        setIsSubtasksOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-200 hover:bg-purple-600 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{option}</span>
                        {option === 'Collapsed' && <span className="text-gray-500 text-[9px]">(default)</span>}
                      </div>
                      {subtasksView === option && <Check size={14} className="text-purple-400" />}
                    </button>
                  ))}
                  <div className="border-t border-gray-800 mt-1 pt-1 px-3 py-1.5 text-[9px] text-gray-500 italic">Use this to filter subtasks</div>
                </div>
              )}
            </button>
            <button
              onClick={() => setIsFieldsDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded-lg text-xs font-medium transition-colors"
            >
              <Settings size={14} />
              Columns
            </button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="groups" type="GROUP">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                  {groupKeys.map((status, index) => {
                    const statusTasks = groupedTasks[status] || [];
                    if (statusTasks.length === 0 && status !== 'TO DO' && !customStatuses.includes(status)) return null;
                    if (hiddenStatuses.includes(status)) return null; // Skip hidden statuses

                    return (
                      <Draggable key={status} draggableId={status} index={index} isDragDisabled={currentGroupType !== 'Status'}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="space-y-4"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="flex items-center gap-3 transition-colors group/header min-w-max p-1 h-8 cursor-pointer"
                              onClick={() => toggleStatusGroup(status)}
                            >
                              {expandedStatuses[status] ? <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" /> : <ChevronRight size={14} className="text-gray-500 dark:text-gray-400" />}
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#2a2a35] px-2 py-0.5 rounded-md border border-gray-200 dark:border-white/5">
                                <div className={`w-2 h-2 rounded-full ${currentGroupType === 'Status'
                                  ? (STATUS_COLORS[status] || 'bg-gray-400')
                                  : currentGroupType === 'Priority'
                                    ? (PRIORITY_COLORS[status as any] || 'bg-gray-400')
                                    : 'bg-purple-500'
                                  }`} />
                                {renamingGroup === status ? (
                                  <input
                                    type="text"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onBlur={() => handleRenameGroup(status, renameValue)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleRenameGroup(status, renameValue);
                                      if (e.key === 'Escape') {
                                        setRenamingGroup(null);
                                        setRenameValue('');
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide bg-transparent border-none outline-none focus:ring-1 focus:ring-purple-500 rounded px-1"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                                    {status}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-500">{statusTasks.length}</span>

                              <div className="flex items-center gap-2 ml-2 opacity-0 group-hover/header:opacity-100 transition-opacity">
                                <div className="relative">
                                  <button
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveGroupMenu(activeGroupMenu === status ? null : status);
                                    }}
                                  >
                                    <MoreHorizontal size={14} />
                                  </button>

                                  {/* Group Options Menu (Image 2) */}
                                  {activeGroupMenu === status && (
                                    <>
                                      <div className="fixed inset-0 z-[140]" onClick={() => setActiveGroupMenu(null)} />
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-2xl z-[150] overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                                        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Group options</div>

                                        <div className="space-y-0.5 py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setRenamingGroup(status);
                                              setRenameValue(status);
                                              setActiveGroupMenu(null);
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                          >
                                            <Pencil size={14} /> Rename
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setIsCreatingStatus(true);
                                              setActiveGroupMenu(null);
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                          >
                                            <Plus size={14} /> New status
                                          </button>
                                          <button className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                            <Settings2 size={14} /> Edit statuses
                                          </button>
                                        </div>

                                        <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />

                                        <div className="space-y-0.5 py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCollapseGroup(status);
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                          >
                                            <CollapseIcon size={14} /> Collapse group
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleHideStatus(status);
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                          >
                                            <EyeOff size={14} /> Hide status
                                          </button>
                                        </div>

                                        <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2" />

                                        <div className="space-y-0.5 py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSelectAll(status);
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                          >
                                            <CheckCheck size={14} /> Select all
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCollapseAllGroups();
                                            }}
                                            className="w-full px-4 py-2 flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                          >
                                            <CollapseIcon size={14} /> Collapse all groups
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <button
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInlineAddTaskGroup(status);
                                    setExpandedStatuses(prev => ({ ...prev, [status]: true }));
                                  }}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* IMAGEM 3: Group options menu */}
                              {activeGroupMenu === status && (
                                <>
                                  <div className="fixed inset-0 z-50" onClick={() => setActiveGroupMenu(null)} />
                                  <div className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Group options</div>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Pencil size={14} /> Rename
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <Plus size={14} /> New status
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 pb-2 mb-1">
                                      <Settings size={14} /> Edit statuses
                                    </button>

                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <ChevronRight size={14} className="rotate-90" /> Collapse group
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 pb-2 mb-1">
                                      <EyeOff size={14} /> Hide status
                                    </button>

                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <MousePointerClick size={14} /> Select all
                                    </button>
                                    <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                      <ChevronRight size={14} className="rotate-90" /> Collapse all groups
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {expandedStatuses[status] && (
                              <div className="overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                  <thead className="text-[10px] font-bold text-gray-500 uppercase tracking-tight border-b border-gray-200 dark:border-gray-900/50">
                                    <tr>
                                      <th className="px-4 py-2 w-full font-bold text-left">Name</th>
                                      {activeColumns.map(col => (
                                        <th key={col} className="px-4 py-2 w-32 font-bold text-right pr-12 whitespace-nowrap">{col}</th>
                                      ))}
                                      <th
                                        className="px-4 py-2 w-10 flex justify-center items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                                        onClick={() => setIsCreateFieldOpen(true)}
                                      >
                                        <Plus size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors" />
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {statusTasks.map(task => (
                                      <React.Fragment key={task.id}>
                                        <tr
                                          className="hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-all group cursor-pointer border-b border-gray-100 dark:border-white/[0.03]"
                                          onClick={() => onTaskClick(task)}
                                          onMouseEnter={() => setHoveredTask(task.id)}
                                          onMouseLeave={() => setHoveredTask(null)}
                                        >
                                          <td className="px-4 py-2.5 align-middle relative">
                                            <div className="flex items-center gap-3">
                                              {/* Hover icons - left side */}
                                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleStatus(task.id);
                                                  }}
                                                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  {task.status === 'COMPLETED' ? (
                                                    <CheckCircle2 size={14} className="text-green-500" />
                                                  ) : (
                                                    <Circle size={14} className="text-gray-400" />
                                                  )}
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setInlineAddTaskGroup(status);
                                                  }}
                                                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  <Plus size={14} className="text-gray-400" />
                                                </button>
                                              </div>

                                              <Activity size={14} className="text-gray-400" />
                                              <span className={`text-sm ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}>
                                                {task.title}
                                              </span>
                                              {task.tags.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                  <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-500/30 mx-1" />
                                                  {task.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-[9px] font-bold uppercase border border-purple-200 dark:border-purple-500/20">{tag}</span>
                                                  ))}
                                                </div>
                                              )}

                                              {/* Hover icons - right side of task name */}
                                              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  <UserIcon size={14} className="text-gray-400" />
                                                </button>
                                                <button
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  <Pencil size={14} className="text-gray-400" />
                                                </button>
                                              </div>
                                            </div>
                                          </td>
                                          {activeColumns.map(col => (
                                            <td key={col} className="px-4 py-2.5">
                                              <div className="flex justify-end pr-8">
                                                {col === 'Assignee' && (
                                                  <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                                    <UserIcon size={12} className="text-gray-400 dark:text-gray-600" />
                                                  </div>
                                                )}
                                                {col === 'Due date' && <Calendar size={14} className="text-gray-400 dark:text-gray-700" />}
                                                {col === 'Priority' && <Flag size={14} className="text-gray-400 dark:text-gray-700" />}
                                                {!['Assignee', 'Due date', 'Priority'].includes(col) && <span className="text-[10px] text-gray-400 dark:text-gray-700 font-bold uppercase tracking-widest">-</span>}
                                              </div>
                                            </td>
                                          ))}
                                          <td className="px-4 py-2.5 text-center">
                                            <MoreHorizontal size={14} className="text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mx-auto" />
                                          </td>
                                        </tr>
                                        {/* Removed AI Summary View */}
                                      </React.Fragment>
                                    ))}
                                    {/* IMAGEM 4: Inline task creation row */}
                                    {inlineAddTaskGroup === status && (
                                      <tr className="bg-white dark:bg-black border-2 border-purple-500 dark:border-purple-600/50 z-50 shadow-lg">
                                        <td colSpan={5} className="px-4 py-1.5 focus-within:ring-0">
                                          <div className="flex items-center gap-3">
                                            <Activity size={14} className="text-gray-400" />
                                            <input
                                              autoFocus
                                              type="text"
                                              value={newTaskTitle}
                                              onChange={(e) => setNewTaskTitle(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  if (newTaskTitle.trim()) {
                                                    onAddTaskInline(newTaskTitle.trim(), status as Status);
                                                  }
                                                  setInlineAddTaskGroup(null);
                                                  setNewTaskTitle('');
                                                } else if (e.key === 'Escape') {
                                                  setInlineAddTaskGroup(null);
                                                  setNewTaskTitle('');
                                                }
                                              }}
                                              placeholder="Task Name or type '/' for commands"
                                              className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 py-1"
                                            />
                                            <div className="flex items-center gap-1 ml-auto border-l border-gray-200 dark:border-gray-800 pl-4 py-1 pr-1">
                                              <div className="flex items-center gap-1.5 px-1.5">
                                                <button className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 transition-colors"><Box size={12} className="text-gray-400" /></button>
                                                <button className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 transition-colors"><UserIcon size={12} className="text-gray-400" /></button>
                                                <button className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 transition-colors"><Calendar size={12} className="text-gray-400" /></button>
                                                <button className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 transition-colors"><Flag size={12} className="text-gray-400" /></button>
                                                <button className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 transition-colors"><Tag size={12} className="text-gray-400" /></button>
                                              </div>
                                              <div className="flex items-center gap-2 ml-2">
                                                <button onClick={() => setInlineAddTaskGroup(null)} className="px-3 py-1 text-[10px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">Cancel</button>
                                                <button
                                                  onClick={() => {
                                                    if (newTaskTitle.trim()) {
                                                      onAddTaskInline(newTaskTitle.trim(), status as Status);
                                                    }
                                                    setInlineAddTaskGroup(null);
                                                    setNewTaskTitle('');
                                                  }}
                                                  className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded shadow-sm shadow-purple-500/20 flex items-center gap-1"
                                                >
                                                  Save <span className="opacity-70">↵</span>
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                <div
                                  className="px-4 py-3 flex items-center gap-2 text-gray-500/70 hover:text-gray-300 cursor-pointer group/add-task transition-colors"
                                  onClick={() => setInlineAddTaskGroup(status)}
                                >
                                  <Plus size={12} className="text-gray-500/70 group-hover/add-task:text-gray-300" />
                                  <span className="text-[10px] font-bold uppercase tracking-tight">Add Task</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* IMAGEM 1: Add Status Option */}
          <div className="mt-8 group/newstatus max-w-7xl" >
            {
              isCreatingStatus ? (
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#1c1c1e] border-2 border-purple-500/50 rounded-xl shadow-lg w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-200" >
                  <div className="w-4 h-4 rounded-md bg-[#2fb380] shadow-sm shadow-[#2fb380]/20" />
                  <input
                    autoFocus
                    type="text"
                    value={newStatusName}
                    onChange={(e) => setNewStatusName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (newStatusName.trim()) {
                          const name = newStatusName.trim();
                          setCustomStatuses(prev => prev.includes(name) ? prev : [...prev, name]);
                          setStatusOrder(prev => prev.includes(name) ? prev : [...prev, name]);
                        }
                        setIsCreatingStatus(false);
                        setNewStatusName('');
                      } else if (e.key === 'Escape') {
                        setIsCreatingStatus(false);
                        setNewStatusName('');
                      }
                    }}
                    onBlur={() => {
                      if (!newStatusName) setIsCreatingStatus(false);
                    }}
                    placeholder="Status name"
                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-500 w-full"
                  />
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 text-gray-500/50 hover:text-gray-300 transition-colors py-2 cursor-pointer w-fit px-4"
                  onClick={() => setIsCreatingStatus(true)}
                >
                  <Plus size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">New status</span>
                </div>
              )}
          </div >
          {/* IMAGEM 1, 2, 3: Create Field Drawer */}
          <div
            className={`fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isCreateFieldOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setIsCreateFieldOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 w-[320px] h-full bg-white dark:bg-[#121213] border-l border-gray-200 dark:border-gray-800 shadow-2xl z-[210] flex flex-col transition-transform duration-300 ease-in-out ${isCreateFieldOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            {/* Header */}
            <div className="px-4 h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between" >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsCreateFieldOpen(false);
                    setIsFieldsDrawerOpen(true);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400"
                >
                  <ArrowLeft size={18} />
                </button>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Create field</span>
              </div>
              <button
                onClick={() => {
                  setIsCreateFieldOpen(false);
                  setIsFieldsDrawerOpen(false);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400"
              >
                <CloseIcon size={18} />
              </button>
            </div >

            {/* Search */}
            <div className="p-4" >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  placeholder="Search for new or existing fields"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#2a2a2b] rounded-lg py-2 pl-10 pr-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                />
              </div>
            </div >

            {/* Fields List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20" >
              {/* Suggested Section */}
              <div className="px-4 py-2" >
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Suggested</h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 italic px-2">No suggestions available</p>
              </div >

              {/* AI Fields Section */}
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800/50 mt-2" >
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">AI fields</h3>
                {
                  [
                    { label: 'Summary', icon: <Zap size={14} className="text-purple-500" /> },
                    { label: 'Custom Text', icon: <Type size={14} className="text-purple-500" /> },
                    { label: 'Custom Dropdown', icon: <LayoutList size={14} className="text-purple-500" /> },
                  ].map(field => (
                    <button
                      key={field.label}
                      onClick={() => addColumn(field.label)}
                      className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors group text-left"
                    >
                      {field.icon}
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{field.label}</span>
                    </button>
                  ))
                }
              </div >

              {/* All Section */}
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800/50 mt-2" >
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">All</h3>
                {
                  [
                    { label: 'Dropdown', icon: <LayoutList size={14} className="text-emerald-500" /> },
                    { label: 'Text', icon: <Type size={14} className="text-sky-500" /> },
                    { label: 'Date', icon: <Calendar size={14} className="text-amber-500" /> },
                    { label: 'Text area (Long Text)', icon: <Activity size={14} className="text-sky-500" /> },
                    { label: 'Number', icon: <Hash size={14} className="text-emerald-500" /> },
                    { label: 'Labels', icon: <Tag size={14} className="text-emerald-500" /> },
                    { label: 'Checkbox', icon: <CheckSquare size={14} className="text-pink-500" /> },
                    { label: 'Money', icon: <DollarSign size={14} className="text-emerald-500" /> },
                    { label: 'Website', icon: <Globe size={14} className="text-rose-500" /> },
                    { label: 'Formula', icon: <FunctionSquare size={14} className="text-emerald-600" /> },
                    { label: 'Files', icon: <Files size={14} className="text-purple-500" /> },
                    { label: 'Relationship', icon: <ArrowRightLeft size={14} className="text-blue-500" /> },
                    { label: 'People', icon: <People size={14} className="text-rose-500" /> },
                    { label: 'Progress (Auto)', icon: <BarChart3 size={14} className="text-orange-500" /> },
                    { label: 'Email', icon: <Email size={14} className="text-rose-400" /> },
                    { label: 'Phone', icon: <Phone size={14} className="text-rose-400" /> },
                    { label: 'T-shirt Size', icon: <Shirt size={14} className="text-purple-400" /> },
                  ].map(field => (
                    <button
                      key={field.label}
                      onClick={() => addColumn(field.label)}
                      className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors group text-left"
                    >
                      {field.icon}
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{field.label}</span>
                    </button>
                  ))
                }
              </div >
            </div >
          </div >

          {/* IMAGEM 3, 4: Fields Drawer */}
          <div
            className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isFieldsDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setIsFieldsDrawerOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 w-[320px] h-full bg-white dark:bg-[#121213] border-l border-gray-200 dark:border-gray-800 shadow-2xl z-[110] flex flex-col transition-transform duration-300 ease-in-out ${isFieldsDrawerOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            {/* Header */}
            <div className="px-4 h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between" >
              <div className="flex items-center gap-3">
                <button onClick={() => setIsFieldsDrawerOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400">
                  <ArrowLeft size={18} />
                </button>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Fields</span>
              </div>
              <button onClick={() => setIsFieldsDrawerOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400">
                <CloseIcon size={18} />
              </button>
            </div >

            {/* Search */}
            <div className="p-4" >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  value={fieldsSearchQuery}
                  onChange={(e) => setFieldsSearchQuery(e.target.value)}
                  placeholder="Search for new or existing fields"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#2a2a2b] rounded-lg py-2 pl-10 pr-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                />
              </div>
            </div >

            {/* Sections */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20" >
              {/* Shown Section */}
              <div className="px-4 py-2" >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Shown</h3>
                  <button
                    onClick={() => setActiveColumns(['Assignee'])} // Keep at least Task Name (handled by table)
                    className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold uppercase"
                  >
                    Hide all
                  </button>
                </div>
                {
                  [
                    { label: 'Task Name', icon: <Type size={14} />, fixed: true },
                    { label: 'Assignee', icon: <UserIcon size={14} /> },
                    { label: 'Due date', icon: <Calendar size={14} /> },
                    { label: 'Priority', icon: <Flag size={14} /> },
                    ...activeColumns.filter(c => !['Assignee', 'Due date', 'Priority'].includes(c)).map(c => ({ label: c, icon: <Hash size={14} /> }))
                  ].filter(f => f.label.toLowerCase().includes(fieldsSearchQuery.toLowerCase())).map(field => (
                    <div key={field.label} className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
                      <div className="flex items-center gap-3">
                        <GripVertical size={14} className="text-gray-400 dark:text-gray-700 cursor-grab active:cursor-grabbing" />
                        {field.icon}
                        <span className={`text-xs font-medium ${field.fixed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{field.label}</span>
                      </div>
                      {!field.fixed && (
                        <button
                          onClick={() => {
                            if (activeColumns.includes(field.label)) {
                              setActiveColumns(prev => prev.filter(c => c !== field.label));
                            } else {
                              setActiveColumns(prev => [...prev, field.label]);
                            }
                          }}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${activeColumns.includes(field.label) ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${activeColumns.includes(field.label) ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      )}
                      {field.fixed && (
                        <button className="w-7 h-4 rounded-full p-0.5 bg-gray-200 dark:bg-purple-600/50 cursor-not-allowed">
                          <div className="w-3 h-3 bg-white/50 rounded-full translate-x-3" />
                        </button>
                      )}
                    </div>
                  ))
                }
              </div >

              {/* Popular Section */}
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800/50 mt-2" >
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Popular</h3>
                {
                  [
                    { label: 'Comments', icon: <MessageSquare size={14} /> },
                    { label: 'Date created', icon: <Calendar size={14} /> },
                    { label: 'Pull Requests', icon: <ArrowRightLeft size={14} /> },
                    { label: 'Status', icon: <CircleDot size={14} /> },
                  ].filter(f => f.label.toLowerCase().includes(fieldsSearchQuery.toLowerCase())).map(field => (
                    <div key={field.label} className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5" /> {/* Spacing for grip */}
                        {field.icon}
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{field.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (activeColumns.includes(field.label)) {
                            setActiveColumns(prev => prev.filter(c => c !== field.label));
                          } else {
                            setActiveColumns(prev => [...prev, field.label]);
                          }
                        }}
                        className={`w-7 h-4 rounded-full p-0.5 transition-colors ${activeColumns.includes(field.label) ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${activeColumns.includes(field.label) ? 'translate-x-3' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))
                }
              </div >

              {/* Hidden Section */}
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800/50 mt-2" >
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Hidden</h3>
                {
                  [
                    { label: 'Assigned Comments', icon: <MessageSquare size={14} /> },
                    { label: 'Created by', icon: <UserIcon size={14} /> },
                    { label: 'Custom Task ID', icon: <Hash size={14} /> },
                    { label: 'Date closed', icon: <Calendar size={14} /> },
                    { label: 'Date done', icon: <Calendar size={14} /> },
                    { label: 'Date updated', icon: <Calendar size={14} /> },
                    { label: 'Dependencies', icon: <Activity size={14} /> },
                    { label: 'Latest comment', icon: <MessageSquare size={14} /> },
                    { label: 'Linked Docs', icon: <Files size={14} /> },
                    { label: 'Linked tasks', icon: <Plus size={14} /> },
                  ].filter(f => f.label.toLowerCase().includes(fieldsSearchQuery.toLowerCase())).map(field => (
                    <div key={field.label} className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5" /> {/* Spacing for grip */}
                        {field.icon}
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{field.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (activeColumns.includes(field.label)) {
                            setActiveColumns(prev => prev.filter(c => c !== field.label));
                          } else {
                            setActiveColumns(prev => [...prev, field.label]);
                          }
                        }}
                        className={`w-7 h-4 rounded-full p-0.5 transition-colors ${activeColumns.includes(field.label) ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${activeColumns.includes(field.label) ? 'translate-x-3' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))
                }
              </div >
            </div >

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121213]" >
              <button
                onClick={() => {
                  setIsFieldsDrawerOpen(false);
                  setIsCreateFieldOpen(true);
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center shadow-lg shadow-purple-500/20 active:scale-95"
              >
                Create field
              </button>
            </div >
          </div >
        </div >
        );
};

        export default ListView;
