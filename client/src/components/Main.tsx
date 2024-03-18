// Importing necessary React hooks and components for the component's functionality
import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useWebSocket } from "./useWebSocket"; // Custom hook for WebSocket interactions
import { Socket } from 'socket.io-client'; // Type import for Socket.IO client

// Interfaces to define the shape of props and state objects used in the component
interface TodoItem {
  id: string;
  todo: string;
  isChecked: boolean;
}

interface MainProps {
  socket: Socket;
}

// Main component function, accepting a socket object as props for WebSocket communication
const Main: React.FC<MainProps> = ({ socket }) => {
    // State hooks for managing todos, loading state, and error messages
    const [todo, setTodo] = useState<string>("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Ref hook for managing the file input element for todo JSON import
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Utility function to generate unique IDs for new todos
    const generateID = (): string => Math.random().toString(36).substring(2, 10);

    // Event handler for adding a new todo item, emitting the new todo over the socket
    const handleAddTodo = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (todo.trim() === "") {
            alert("Please enter a todo item.");
            return;
        }
        if (todoList.some((item) => item.todo === todo)) {
            alert("This todo item already exists.");
            return;
        }

        const newTodo: TodoItem = { id: generateID(), todo, isChecked: false };
        socket.emit("addTodo", newTodo); // Emit the new todo to the server via WebSocket
        setTodoList([...todoList, newTodo]); // Add the new todo to the local state
        setTodo(""); // Reset the input field
    };

    // Event handler for changing the checked state of a todo item, emitting the change
    const handleCheckboxChange = (id: string): void => {
        const updatedTodoList = todoList.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        );
        setTodoList(updatedTodoList); // Update the local state with the new todo list
        socket.emit("toggleTodo", id); // Notify the server of the todo state change
    };

    // Function to delete a todo item, emitting the delete action over the socket
    const deleteTodo = (id: string): void => {
        socket.emit("deleteTodo", id); // Emit delete action to the server
        const updatedTodoList = todoList.filter((item) => item.id !== id);
        setTodoList(updatedTodoList); // Update the local state to reflect the deletion
    };

    // Function to delete all todos, emitting the action over the socket
    const deleteAllTodos = (): void => {
        socket.emit("deleteAllTodos"); // Emit delete all action to the server
        setTodoList([]); // Clear the local todo list state
    };

    // Function to export the current todo list to a JSON file
    const exportToJsonFile = (): void => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todoList));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "todos.json");
            document.body.appendChild(downloadAnchorNode); // Temporarily add the download link to the document
            downloadAnchorNode.click(); // Programmatically click the download link
            downloadAnchorNode.remove(); // Remove the download link from the document
        } catch (err) {
            console.error("Failed to export todos", err);
            alert("Failed to export todos.");
        }
    };

    // Function to trigger the file input click for importing todos
    const importFromJsonFile = (): void => {
        fileInputRef.current?.click();
    };

    // Event handler for file selection, parsing the selected file as JSON and importing the todos
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (!file) {
            alert("No file selected.");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const todos = JSON.parse(e.target!.result as string) as TodoItem[];
                // POST the imported todos to the server for processing
                const response = await fetch('http://localhost:4000/api/todos/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(todos),
                });
                if (!response.ok) {
                    throw new Error(`Failed to import todos: ${response.statusText}`);
                }
            } catch (err) {
                console.error("Failed to import todos", err);
                alert("Failed to import todos. Ensure the file format is correct and safe to use.");
            }
        };
        reader.readAsText(file); // Read the selected file as text
    };

    // Use the custom useWebSocket hook to manage WebSocket events and state
    useWebSocket(socket, setTodoList, setLoading, setError, todoList);

    // Conditional rendering based on loading and error state
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Main component render method
    return (
        <div>
            {/* Form for adding new todos */}
            <form className='form' onSubmit={handleAddTodo}>
                <input
                    value={todo}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}
                    className='input'
                    required
                />
                <button className='form__cta'>ADD TODO</button>
            </form>

            {/* List rendering for current todos */}
            <div className='todo__container'>
                {todoList.map((item) => (
                    <div className='todo__item' key={item.id}>
                        <p>{item.todo}</p>
                        <div>
                            <input
                                type="checkbox"
                                checked={item.isChecked || false}
                                onChange={() => handleCheckboxChange(item.id)}
                                className='checkBtn'
                            />
                            <button className='deleteBtn' onClick={() => deleteTodo(item.id)}>
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buttons for additional todo management actions */}
            <button className='deleteBtn' onClick={deleteAllTodos}>Delete All</button>
            <button className='deleteBtn' onClick={exportToJsonFile}>Export to JSON</button>
            <button className='deleteBtn' onClick={importFromJsonFile}>Import from JSON</button>
            {/* Hidden file input for importing todos */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
    );
};

export default Main;
