
import React from 'react';
import { Task } from '../types';
import { STATUS_COLORS } from '../constants';

interface GanttViewProps {
  tasks: Task[];
  isDarkMode?: boolean;
}

const GanttView: React.FC<GanttViewProps> = ({ tasks, isDarkMode }) => {
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="h-full flex bg-white dark:bg-gray-950 overflow-hidden">
      {/* Task Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="h-12 bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 flex items-center px-6">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Tasks</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tasks.map(task => (
            <div key={task.id} className="h-14 border-b border-gray-50 dark:border-gray-800 px-6 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group">
              <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[task.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{task.title}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{task.assignee.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex flex-col bg-white dark:bg-gray-950">
        <div className="h-12 flex-shrink-0 bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 flex">
          {dates.map(date => (
            <div key={date} className="w-16 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{date}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
           {/* Grid Background */}
           <div className="absolute inset-0 flex">
              {dates.map(date => (
                <div key={date} className="w-16 h-full flex-shrink-0 border-r border-gray-50 dark:border-gray-900/50" />
              ))}
           </div>
           
           {/* Task Bars */}
           <div className="absolute inset-0 pt-0">
              {tasks.map((task, i) => {
                const start = (new Date(task.startDate).getDate() % 28);
                const duration = Math.max(2, (new Date(task.dueDate).getDate() - new Date(task.startDate).getDate()) || 3);
                
                return (
                  <div key={task.id} className="h-14 flex items-center border-b border-gray-50 dark:border-gray-800 relative group">
                    <div 
                      className={`h-7 rounded-lg absolute flex items-center px-3 shadow-sm transition-all hover:brightness-105 cursor-move ${STATUS_COLORS[task.status]} bg-opacity-90 dark:bg-opacity-80`}
                      style={{ 
                        left: `${(start - 1) * 64}px`, 
                        width: `${duration * 64 - 8}px`,
                      }}
                    >
                      <span className="text-[10px] font-bold text-white truncate drop-shadow-sm">{task.title}</span>
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white dark:bg-gray-200 rounded-full border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GanttView;
