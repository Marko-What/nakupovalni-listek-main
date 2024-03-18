import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

import todosSchema from './validation/todoSchema';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Adjust according to your frontend origin
        methods: ["GET", "POST"],
    },
});

interface Todo {
    id: string;
    todo: string;
    isChecked: boolean;
}

let todos: Todo[] = []; // This will store our todo items

app.get('/api', (req: Request, res: Response) => {
    res.json(todos);
});

app.post('/api/todos/import', (req: Request, res: Response, next: NextFunction) => {

    const { error, value } = todosSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        todos = req.body as Todo[];
        io.emit('todos', todos);
        res.status(200).send("Todos imported successfully.");
    } catch (e) {
        next(e); // Pass errors to the central error handler
    }
});

app.get('/api/todos/export', (req, res) => {
    res.json(todos);
});




const validateTodoItem = (todo: Todo) => {
    return todosSchema.validate(todo);
};

const isTodoIdValid = (id: string): boolean => {
    return todos.some(todo => todo.id === id);
};


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(500).send('Something broke!');
});






io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Send the current state of todos to newly connected clients
    socket.emit('todos', todos);

    socket.on('addTodo', (todo: Todo) => {
       const { error } = validateTodoItem(todo);
        if (error) {
            //socket.emit('error', 'Invalid or missing todo ID');
            socket.emit('todos', todos);
            return console.error('Invalid or missing todo ID');
        }

        todos.push(todo);
        socket.broadcast.emit('addTodo', todo); // Emit only new todo
    });

    socket.on('deleteTodo', (id: string) => {
        if (!id || !isTodoIdValid(id)) {
           //socket.emit('error', 'Invalid or missing todo ID');
           socket.emit('todos', todos);
           return console.error('Invalid or missing todo ID');
        }
        todos = todos.filter(todo => todo.id !== id);
        socket.broadcast.emit('deleteTodo', id); // Emit only deleted todo's ID to reduce network load
    });

    socket.on('toggleTodo', (id: string) => {
        if (!id || !isTodoIdValid(id)) { 
            //socket.emit('error', 'Invalid or missing todo ID');
            socket.emit('todos', todos);
            return console.error('Invalid or missing todo ID');
        }
        todos = todos.map(todo => todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo);
       socket.broadcast.emit('toggleTodo', id);  
    });

    socket.on('deleteAllTodos', () => {
        todos = [];
        socket.broadcast.emit('deleteAllTodos'); // Broadcast deleteAllTodos event
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });


}); // end of io.on('connection'



const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));











