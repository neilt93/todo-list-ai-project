import React from "react";
import TaskItem from "./TaskItem"; // Import the TaskItem component
import { Task } from "../types/task"; // Import the Task interface

// Define the props interface for TaskList
interface TaskListProps {
    tasks: Task[]; // Array of tasks to render
    toggleComplete: (id: number) => void; // Function to handle task toggling
    deleteTask: (id: number) => void; // Add deleteTask prop
    editTask: (id: number, newName: string) => void;
  }

  const TaskList: React.FC<TaskListProps> = ({ tasks, toggleComplete, deleteTask, editTask }) => {
    return (
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            editTask={editTask}
            />
        ))}
      </div>
      
    );
  };
  
  export default TaskList;