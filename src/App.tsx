import React from 'react';
import { useState, useEffect } from 'react'
import { Task } from './types/task'
import TaskList from './components/TaskList'
import './tailwind.css';


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Stores tasks
  const [newTaskName, setNewTaskName] = useState("");
  const [suggestions, setSuggestions] = useState<string>(""); // Stores suggestions from gpt

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data); // Update the tasks state with the fetched data
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Use useEffect to call fetchTasks when the component loads
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array means this runs once on component mount
  

  const colorOptions = [
    { value: "#f6546a", label: "Red" },
    { value: "#065535", label: "Green" },
    { value: "#003366", label: "Blue" },
    { value: "#ffd700", label: "Yellow" },
    { value: "#9333ea", label: "Purple" },
    { value: "#00ffff", label: "Cyan" },
    { value: "#ff80ed", label: "Pink" }
  ];

  const toggleComplete = async (_id: string) => {
    try {
      // Optimistically update the state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === _id ? { ...task, completed: !task.completed } : task
        )
      );
  
      // Send a request to update the task in the database
      await fetch(`http://localhost:4000/tasks/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !tasks.find((task) => task._id === _id)?.completed }),
      });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newTaskName.trim() === "") return;

    const newTask = {
      name: newTaskName,
      completed: false,
      color: "#9333ea", // Default color
    };

    try {
      const response = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]); // Add the task with its new `_id`
      setNewTaskName(""); // Clear the input
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (_id: string) => {
    try {
      // Optimistically update the state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== _id));
  
      // Send a request to delete the task in the database
      await fetch(`http://localhost:4000/tasks/${_id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (_id: string, updatedFields: Partial<Task>) => {
    try {
      // Optimistically update the state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === _id ? { ...task, ...updatedFields } : task
        )
      );
  
      // Send a request to update the task in the database
      await fetch(`http://localhost:4000/tasks/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // Fetch suggestions from openai
  const fetchSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:4000/suggestions");
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  


  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl text-center font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
        Task List
      </h1>
      <form onSubmit={addTask} className="flex items-center mb-4 space-x-4 w-full max-w-md">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none p-2 rounded"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow-lg transition duration-300"
        >
          Add
        </button>
      </form>

      <ul className="w-full max-w-md">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-2 rounded mb-2 flex justify-between items-center w-400"
            style={{ backgroundColor: task.color }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task._id)}
              className="mr-4"
            />

            <input
              type="text"
              value={task.name}
              onChange={(e) => editTask(task._id, { name: e.target.value })}
              className={`flex-grow bg-transparent border-none focus:outline-none ${
                task.completed ? "line-through text-gray-500" : "text-white"
              }`}
            />

            <select
              value={task.color}
              onChange={(e) => editTask(task._id, { color: e.target.value })}
              className="ml-4 p-1 bg-gray-800 text-white rounded"
            >
              {colorOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ backgroundColor: option.value, color: "white" }}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => deleteTask(task._id)}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {/* Suggestions */}
      <div className="mt-6">
        <button
          onClick={fetchSuggestions}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600"
        >
          Get Suggestions
        </button>
        {suggestions && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded shadow">
            <h2 className="text-lg font-bold mb-2">Suggestions:</h2>
            <p>{suggestions}</p>
          </div>
        )}
      </div>

      
    </div>
    
  );
};

export default App;

