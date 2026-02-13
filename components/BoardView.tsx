
import React from 'react';
import { Task, Status } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { MoreHorizontal, Plus, Flag, MessageSquare, Clock } from 'lucide-react';

interface BoardViewProps {
   tasks: Task[];
   isDarkMode?: boolean;
   onTaskClick: (task: Task) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ tasks, isDarkMode, onTaskClick }) => {
   const statuses: Status[] = ['To Do', 'In Progress', 'Review', 'Complete'];

   const getTasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

   return (
      <div className="h-full bg-white dark:bg-black p-6 flex gap-6 overflow-x-auto">
         {statuses.map(status => (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col gap-4">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                     <div className={`${STATUS_COLORS[status]} w-2 h-2 rounded-full`} />
                     <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{status}</h3>
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">{getTasksByStatus(status).length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                     <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><Plus size={14} /></button>
                     <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><MoreHorizontal size={14} /></button>
                  </div>
               </div>

               <div className="flex-1 space-y-3 overflow-y-auto pb-6">
                  {getTasksByStatus(status).map(task => (
                     <div
                        key={task.id}
                        className="bg-gray-50 dark:bg-[#111111] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => onTaskClick(task)}
                     >
                        <div className={`absolute top-0 left-0 w-1 h-full ${STATUS_COLORS[task.status]}`} />
                        <div className="flex items-start justify-between mb-2">
                           <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_COLORS[task.priority]}`}>
                              <Flag size={10} fill="currentColor" />
                              {task.priority}
                           </div>
                           <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white dark:hover:bg-gray-800 rounded transition-opacity">
                              <MoreHorizontal size={14} className="text-gray-400 dark:text-gray-500" />
                           </button>
                        </div>

                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{task.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                           <div className="flex items-center -space-x-2">
                              <img src={task.assignee.avatar} className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 ring-1 ring-gray-100 dark:ring-gray-700 shadow-sm" alt={task.assignee.name} />
                           </div>
                           <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                              <div className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                                 <Clock size={12} />
                                 <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 dark:text-gray-600 hover:border-purple-300 dark:hover:border-purple-800 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                     <Plus size={16} />
                     Add Task
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
};

export default BoardView;
