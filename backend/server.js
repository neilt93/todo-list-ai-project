import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/taskManager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({ 
    id: Number, 
    name: String,
    completed: Boolean,
    color: String,
});

const Task = mongoose.model("tasks", taskSchema); // Task corresponds to tasks

// Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find(); // Retrieve all tasks from the database
        res.json(tasks); // Send the tasks as a JSON response
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error });
    }
})

// Get a task by id
app.get("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId); // Query db

        if (!task) {
            return res.status(404).json({ message: "Task not found" }); // Handle missing task
        }

        res.json(task); // Return task
    } catch (error) {
        res.status(500).json({ message: "Error retrieving task", error });
    }
})

// Push tasks to db
app.post("/tasks", async (req, res) => {
    try {
        const { id, name, completed, color } = req.body;

        const newTask = new Task({
            id,
            name,
            completed: completed || false, // Default to false if not provided
            color: color || "#9333ea",     // Default to white if not provided
        });
        
        const savedTask = await newTask.save();

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: "Error adding task", error });
    }
})

// PATCH route to edit a task
app.patch("/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract task ID from the URL
      const updatedFields = req.body; // Extract fields to update from the request body
  
      // Find the task by its _id and update it
      const updatedTask = await Task.findByIdAndUpdate(id, updatedFields, { new: true });
  
      // If task not found, respond with 404
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Respond with the updated task
      res.json(updatedTask);
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: "Error updating task", error });
    }
});

// DELETE route to delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract task ID from the URL
  
      // Find the task by its _id and delete it
      const deletedTask = await Task.findByIdAndDelete(id);
  
      // If task not found, respond with 404
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Respond with a success message
      res.json({ message: "Task deleted successfully", deletedTask });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: "Error deleting task", error });
    }
});
  
  
  






// Start Server
app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
