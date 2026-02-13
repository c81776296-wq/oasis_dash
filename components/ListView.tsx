
import React, { useState } from 'react';
import { Task, Status } from '../types';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
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
  User as UserIcon
} from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface ListViewProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onAddTask: () => void;
  isDarkMode?: boolean;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onToggleStatus, onAddTask, isDarkMode }) => {
  const [expandedStatuses, setExpandedStatuses] = useState<Record<string, boolean>>({
    'To Do': true,
    'In Progress': true,
    'Review': true,
    'Complete': true,
    'Blocked': true
  });

  const toggleStatusGroup = (status: string) => {
    setExpandedStatuses(prev => ({ ...prev, [status]: !prev[status] }));
  };

  // Removed AI summary functions to match screenshot

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<Status, Task[]>);

  const statuses: Status[] = ['To Do', 'In Progress', 'Review', 'Complete', 'Blocked'];

  return (
    <div className="p-4 bg-white dark:bg-black min-h-full">
      <div className="max-w-7xl space-y-6">
        {/* Custom Actions Bar from Screenshot */}
        <div className="flex items-center gap-2 mb-4">
          <button className="flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-bold shadow-sm">
            <LayoutList size={14} />
            Group: Status
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded-lg text-xs font-medium transition-colors">
            <Activity size={14} />
            Subtasks
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded-lg text-xs font-medium transition-colors">
            <LayoutGrid size={14} />
            Columns
          </button>
        </div>

        {statuses.map(status => {
          const statusTasks = groupedTasks[status] || [];
          if (statusTasks.length === 0 && status !== 'To Do') return null;

          return (
            <div key={status} className="space-y-4">
              <div
                className="flex items-center gap-3 group cursor-pointer select-none"
                onClick={() => toggleStatusGroup(status)}
              >
                {expandedStatuses[status] ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/80 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700/50">
                  <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status] || 'bg-gray-400'}`} />
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">
                    {status === 'In Progress' ? 'CLIENTS' : status === 'To Do' ? 'TO DO' : status}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{statusTasks.length}</span>
              </div>

              {expandedStatuses[status] && (
                <div className="overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight border-b border-gray-100 dark:border-gray-900">
                      <tr>
                        <th className="px-4 py-2 w-48">Name</th>
                        <th className="px-4 py-2 w-32 border-l border-gray-100 dark:border-gray-900">Assignee</th>
                        <th className="px-4 py-2 w-32 border-l border-gray-100 dark:border-gray-900">Due date</th>
                        <th className="px-4 py-2 w-32 border-l border-gray-100 dark:border-gray-900">Priority</th>
                        <th className="px-4 py-2 w-10 flex justify-center items-center"><Plus size={14} className="opacity-50" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {statusTasks.map(task => (
                        <React.Fragment key={task.id}>
                          <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                            <td className="px-4 py-3 align-middle">
                              <div className="flex items-center gap-3">
                                <History size={14} className="text-gray-400 dark:text-gray-500" />
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold ${task.status === 'Complete' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                      {task.title}
                                    </span>
                                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
                                    {task.tags.map(tag => (
                                      <span key={tag} className="px-1.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-[9px] font-black uppercase">{tag}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-l border-gray-100 dark:border-gray-900">
                              <div className="flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                  <UserIcon size={14} className="text-gray-400" />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-l border-gray-100 dark:border-gray-900">
                              <div className="flex items-center justify-center">
                                <Calendar size={14} className="text-gray-400" />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-l border-gray-100 dark:border-gray-900">
                              <div className="flex items-center justify-center text-gray-400">
                                <Flag size={14} />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center border-l border-gray-100 dark:border-gray-900">
                              <Plus size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mx-auto" />
                            </td>
                          </tr>
                          {/* Removed AI Summary View */}
                        </React.Fragment>
                      ))}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer group" onClick={onAddTask}>
                        <td colSpan={5} className="px-4 py-2 border-t border-gray-100 dark:border-gray-900">
                          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            <Plus size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Add Task</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
