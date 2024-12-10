import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Calendar, Clock } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

interface TaskListProps {
  leadId: string;
}

export default function TaskList({ leadId }: TaskListProps) {
  const { tasks, addTask, updateTask } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const leadTasks = tasks.filter(task => task.leadId === leadId);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask({
        leadId,
        description: newTask,
        dueDate,
        completed: false
      });
      setNewTask('');
      setDueDate('');
      setShowAddTask(false);
    }
  };

  const toggleTaskStatus = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {leadTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleTaskStatus(task.id, !task.completed)}
                className="text-gray-400 hover:text-blue-500"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.description}
              </span>
            </div>
            {task.dueDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddTask ? (
        <form onSubmit={handleAddTask} className="space-y-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task description"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      )}
    </div>
  );
}