import React, { createContext, useContext, useState } from 'react';

interface Task {
  id: string;
  leadId: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      leadId: 'lead1',
      description: 'Follow up on sales proposal',
      dueDate: '2024-03-15',
      completed: false
    },
    {
      id: '2',
      leadId: 'lead2',
      description: 'Schedule product demo',
      dueDate: '2024-03-20',
      completed: false
    }
  ]);
  const [error, setError] = useState<string | null>(null);

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask: Task = {
        ...task,
        id: `task_${Date.now()}`
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      error, 
      addTask, 
      updateTask, 
      deleteTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}