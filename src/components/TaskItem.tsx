import React, { useState } from "react";
import { Task } from "../types/task";

interface TaskItemProps {
    task: Task,
    toggleComplete: (id: number) => void; // Function to toggle completion status
    deleteTask: (id: number) => void; // Add deleteTask prop
    editTask: (id: number, newName: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleComplete, deleteTask, editTask }) => {
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [editedName, setEditedName] = useState(task.name); // Temporary input value

    const handleSave = () => {
        if (editedName.trim() === "") return; // Ignore empty edits
        editTask(task.id, editedName); // Save the changes
        setIsEditing(false); // Exit edit mode
      };

    return (
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          className="w-4 h-4"
        />
        {isEditing ? (
            <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)} // Update input value
            onBlur={handleSave} // Save when input loses focus
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSave(); // Save on Enter
            }}
            className="flex-grow border p-1 rounded"
            autoFocus
            />
        ) : (
            <span
            className={`flex-grow ${
                task.completed ? "line-through text-gray-500" : "text-black"
            }`}
            onClick={() => setIsEditing(true)} // Switch to edit mode on click
            >
            {task.name}
            </span>
        )}
        <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
        >Delete
        </button>
    </div>
  );
  };

export default TaskItem;


