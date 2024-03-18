// Import necessary modules and initialize the express app
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

// Import the schema for todo item validation
import todosSchema from './validation/todoSchema';

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing for all origins
app.use(express.json()); // Parse JSON bodies

// Create an HTTP server and initialize Socket.IO with CORS settings
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Adjust according to your frontend origin
        methods: ["GET", "POST"],
    },
});

// Define the Todo interface for TypeScript type checking
interface Todo {
    id: string;
    todo: string;
    isChecked: boolean;
}

// Array to store todos. This acts as our database in this simple example.
let todos: Todo[] = [];

// Route to get all todos
app.get('/api', (req: Request, res: Response) => {
    res.json(todos);
});

// Route to import todos. Validates the request body and updates the todos array.
app.post('/api/todos/import', (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = todosSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        todos = req.body as Todo[];
        io.emit('todos', todos); // Notify all clients about the new todos list
        res.status(200).send("Todos imported successfully.");
    } catch (e) {
        next(e); // Pass errors to the central error handler
    }
});

// Route to export all todos
app.get('/api/todos/export', (req, res) => {
    res.json(todos);
});

// Validates a todo item using the defined schema
const validateTodoItem = (todo: Todo) => {
    return todosSchema.validate(todo);
};

// Checks if a given todo ID is valid (exists in the todos array)
const isTodoIdValid = (id: string): boolean => {
    return todos.some(todo => todo.id === id);
};

// Central error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!');
});

// Setup Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Send the current todos to newly connected clients
    socket.emit('todos', todos);

    // Handle adding a new todo
    socket.on('addTodo', (todo: Todo) => {
       const { error } = validateTodoItem(todo);
        if (error) {
            socket.emit('todos', todos); // Notify the client of the current todos state
            return console.error('Invalid or missing todo ID');
        }

        todos.push(todo);
        socket.broadcast.emit('addTodo', todo); // Notify all other clients about the new todo
    });

    // Handle deleting a todo by ID
    socket.on('deleteTodo', (id: string) => {
        if (!id || !isTodoIdValid(id)) {
           socket.emit('todos', todos);
           return console.error('Invalid or missing todo ID');
        }
        todos = todos.filter(todo => todo.id !== id);
        socket.broadcast.emit('deleteTodo', id); // Notify all other clients about the deletion
    });

    // Handle toggling the isChecked status of a todo by ID
    socket.on('toggleTodo', (id: string) => {
        if (!id || !isTodoIdValid(id)) { 
            socket.emit('todos', todos);
            return console.error('Invalid or missing todo ID');
        }
        todos = todos.map(todo => todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo);
       socket.broadcast.emit('toggleTodo', id);  
    });

    // Handle the deletion of all todos
    socket.on('deleteAllTodos', () => {
        todos = [];
        socket.broadcast.emit('deleteAllTodos'); // Notify all clients about the deletion of all todos
    });

    // Log when a client disconnects
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });

}); // End of io.on('connection'

// Start the server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
