import React from "react";
import TaskItem from "./TaskItem";
import { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  toggleComplete: (id: string) => void;
  editTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  toggleComplete,
  editTask,
  deleteTask,
}) => {
  return (
    <ul className="w-full max-w-md">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          toggleComplete={toggleComplete}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
