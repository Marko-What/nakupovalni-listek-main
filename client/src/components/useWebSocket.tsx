import { useEffect } from 'react';

interface TodoItem {
  id: string;
  todo: string;
  isChecked: boolean;
}

// Assuming the socket has a type, you might need to import it or define it based on your implementation
// For simplicity, I'll use any here, but you should replace it with the actual type
interface Socket {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string) => void;
}

export const useWebSocket = (
  socket: Socket,
  setTodoList: React.Dispatch<React.SetStateAction<TodoItem[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  todoList: TodoItem[]
) => {
  useEffect(() => {
    socket.on('connect', () => {
      setLoading(false);
      setError("");
    });

    socket.on('todos', (data: TodoItem[]) => {
      console.log(data);
      setTodoList(data);
      setLoading(false);
    });

    socket.on('addTodo', (newTodo: TodoItem) => {
      setTodoList(prev => [...prev, newTodo]);
      setLoading(false);
    });

    socket.on('toggleTodo', (id: string) => {
      console.log('toggleTodo: ' + id);
      console.log('todoList before: ' + JSON.stringify(todoList));
      setTodoList(prev => prev.map(todo => 
        todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo
      ));
      console.log('todoList after: ' + JSON.stringify(todoList));
      setLoading(false);
    });

    socket.on('deleteTodo', (id: string) => {
      setTodoList(prev => prev.filter(todo => todo.id !== id));
      setLoading(false);
    });

    socket.on("deleteAllTodos", () => setTodoList([]));

    socket.on('connect_error', (err: Error) => {
      setError("Connection failed usewebsocket");
      setLoading(false);
    });

    socket.on('error', (errorMsg: string) => {
      alert(`Error: ${errorMsg}`); // Or any other error handling mechanism
    });

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
  }, [socket, setTodoList, setLoading, setError, todoList]); // Dependencies array
};
