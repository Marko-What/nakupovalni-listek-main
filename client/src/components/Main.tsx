import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useWebSocket } from "./useWebSocket";
import { Socket } from 'socket.io-client';


// Define the shape of your todo items and any props your component might receive
interface TodoItem {
  id: string;
  todo: string;
  isChecked: boolean;
}

interface MainProps {
    socket: Socket;
  }

const Main: React.FC<MainProps> = ({ socket }) => {
    const [todo, setTodo] = useState<string>("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null); // Specify the element type

    const generateID = (): string => Math.random().toString(36).substring(2, 10);

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
        socket.emit("addTodo", newTodo);
        setTodoList([...todoList, newTodo]);
        setTodo("");
    };

    const handleCheckboxChange = (id: string): void => {
        const updatedTodoList = todoList.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        );
        setTodoList(updatedTodoList);
        socket.emit("toggleTodo", id);
    };

    const deleteTodo = (id: string): void => {
        socket.emit("deleteTodo", id);
        const updatedTodoList = todoList.filter((item) => item.id !== id);
        setTodoList(updatedTodoList);
    };

    const deleteAllTodos = (): void => {
        socket.emit("deleteAllTodos");
        setTodoList([]);
    };

    const exportToJsonFile = (): void => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todoList));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "todos.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (err) {
            console.error("Failed to export todos", err);
            alert("Failed to export todos.");
        }
    };

    const importFromJsonFile = (): void => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (!file) {
            alert("No file selected.");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // Ensure you properly typecast e.target.result
                const todos = JSON.parse(e.target!.result as string) as TodoItem[];
                // Additional validation could be implemented here
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
        reader.readAsText(file);
    };

    // Adapt your useWebSocket hook for TypeScript as well
    useWebSocket(socket, setTodoList, setLoading, setError, todoList);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <form className='form' onSubmit={handleAddTodo}>
                <input
                    value={todo}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}
                    className='input'
                    required
                />
                <button className='form__cta'>ADD TODO</button>
            </form>

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

            <button className='deleteBtn' onClick={deleteAllTodos}>Delete All</button>
            <button className='deleteBtn' onClick={exportToJsonFile}>Export to JSON</button>
            <button className='deleteBtn' onClick={importFromJsonFile}>Import from JSON</button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
    );
};

export default Main;
