// src/contexts/TaskContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

const TASKS_KEY = "td_tasks_v1";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) setTasks(JSON.parse(raw));
    else {
      const sample = [
        {
          id: uuidv4(),
          title: "Design landing hero",
          description: "Create hero layout",
          priority: "High",
          status: "Pending",
          dueDate: null,
          assignedTo: null,
          comments: [],
          activityLog: [{ action: "Created", timestamp: new Date().toISOString() }]
        }
      ];
      localStorage.setItem(TASKS_KEY, JSON.stringify(sample));
      setTasks(sample);
    }
  }, []);

  const saveTasks = (next) => {
    setTasks([...next]);  // FORCE RERENDER //change here
    localStorage.setItem(TASKS_KEY, JSON.stringify(next));
  };

  const addTask = (taskData) => {
    const task = { id: uuidv4(), comments: [], activityLog: [{ action: "Created", timestamp: new Date().toISOString() }], ...taskData };
    const next = [task, ...tasks];
    saveTasks(next);
    return task;
  };

  const updateTask = (id, patch) => {
    const next = tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...patch };
        if (patch.status && patch.status !== t.status) {
          updated.activityLog = [...(t.activityLog || []), { action: `Status ${t.status} → ${patch.status}`, timestamp: new Date().toISOString() }];
        }
        return updated;
      }
      return t;
    });
    saveTasks(next);
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const addComment = (id, text) => {
    const next = tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, comments: [...(t.comments || []), { text, timestamp: new Date().toISOString() }] };
        return updated;
      }
      return t;
    });
    saveTasks(next);
  };

  return <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, addComment }}>{children}</TaskContext.Provider>;
}
