import React from "react";
import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  toggleComplete: (id: string) => void;
  editTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const colorOptions = [
  { value: "#f6546a", label: "Red" },
  { value: "#065535", label: "Green" },
  { value: "#003366", label: "Blue" },
  { value: "#ffd700", label: "Yellow" },
  { value: "#9333ea", label: "Purple" },
  { value: "#00ffff", label: "Cyan" },
  { value: "#ff80ed", label: "Pink" },
];

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  toggleComplete,
  editTask,
  deleteTask,
}) => {
  return (
    <li
      className="p-2 rounded mb-2 flex justify-between items-center"
      style={{ backgroundColor: task.color }}
    >
      {/* Checkbox for completion */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task._id)}
        className="mr-4"
      />

      {/* Task name (editable) */}
      <input
        type="text"
        value={task.name}
        onChange={(e) => editTask(task._id, { name: e.target.value })}
        className={`flex-grow bg-transparent border-none focus:outline-none ${
          task.completed ? "line-through text-gray-500" : "text-white"
        }`}
      />

      {/* Color Dropdown */}
      <select
        value={task.color}
        onChange={(e) => editTask(task._id, { color: e.target.value })} // Call editTask
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

      {/* Delete button */}
      <button
        onClick={() => deleteTask(task._id)}
        className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
