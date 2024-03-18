// Import necessary hook from React for side effects in functional components
import { useEffect } from 'react';

// Interface definition for TodoItem used within the hook and the component it's used in
interface TodoItem {
  id: string;
  todo: string;
  isChecked: boolean;
}

// Simplified interface for a Socket, defining methods for event handling
interface Socket {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string) => void;
}

// Custom hook for managing WebSocket connections and events
export const useWebSocket = (
  socket: Socket, // WebSocket instance for real-time communication
  setTodoList: React.Dispatch<React.SetStateAction<TodoItem[]>>, // State setter function for updating todo list
  setLoading: React.Dispatch<React.SetStateAction<boolean>>, // State setter function for updating loading state
  setError: React.Dispatch<React.SetStateAction<string>>, // State setter function for updating error messages
  todoList: TodoItem[] // Current list of todos, used for certain WebSocket event responses
) => {
  useEffect(() => {
    // Event handler for successful WebSocket connection
    socket.on('connect', () => {
      setLoading(false); // Update loading state
      setError(""); // Clear any error messages
    });

    // Event handler for receiving updated todo list from the server
    socket.on('todos', (data: TodoItem[]) => {
      console.log(data); // Log received data for debugging
      setTodoList(data); // Update the todo list with received data
      setLoading(false); // Update loading state
    });

    // Event handler for adding a new todo received from the server
    socket.on('addTodo', (newTodo: TodoItem) => {
      setTodoList(prev => [...prev, newTodo]); // Add new todo to the current list
      setLoading(false); // Update loading state
    });

    // Event handler for toggling the isChecked state of a todo
    socket.on('toggleTodo', (id: string) => {
      console.log('toggleTodo: ' + id); // Debug logging
      console.log('todoList before: ' + JSON.stringify(todoList)); // Debug logging
      setTodoList(prev => prev.map(todo => 
        todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo
      )); // Update todo's isChecked state
      console.log('todoList after: ' + JSON.stringify(todoList)); // Debug logging
      setLoading(false); // Update loading state
    });

    // Event handler for deleting a todo by id
    socket.on('deleteTodo', (id: string) => {
      setTodoList(prev => prev.filter(todo => todo.id !== id)); // Remove todo from list
      setLoading(false); // Update loading state
    });

    // Event handler for deleting all todos
    socket.on("deleteAllTodos", () => setTodoList([])); // Clear todo list

    // Event handler for WebSocket connection errors
    socket.on('connect_error', (err: Error) => {
      setError("Connection failed usewebsocket"); // Set error message
      setLoading(false); // Update loading state
    });

    // General error event handler
    socket.on('error', (errorMsg: string) => {
      alert(`Error: ${errorMsg}`); // Display or log error message
    });

    // Cleanup function to remove all event listeners on component unmount
    return () => {
      socket.off('connect');
      socket.off('todos');
      socket.off('addTodo');
      socket.off('toggleTodo');
      socket.off('deleteTodo');
      socket.off('deleteAllTodos');
      socket.off('connect_error');
      socket.off('error');
    };
  }, [socket, setTodoList, setLoading, setError, todoList]); // Dependencies for useEffect hook
};
