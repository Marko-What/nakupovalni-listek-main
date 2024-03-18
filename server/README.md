# Node.js Todo Application with Express and Socket.IO

This is a simple yet powerful Todo application built with Node.js, Express, and Socket.IO, allowing real-time interaction between the server and clients. It supports operations like adding, toggling, and deleting todos, as well as importing and exporting todo lists.

## Features

- Real-time addition, toggling, and deletion of todo items.
- Import and export functionality for todo lists.
- Real-time updates to all connected clients using Socket.IO.
- CORS enabled for cross-origin requests.
- Input validation for todos.

## Prerequisites

Before you run this application, make sure you have Node.js installed on your machine. The application has been developed and tested using Node.js [version].

## Installation

To get this application running on your local machine, follow these steps:

1. Clone the repository:

git clone [[https://example.com/your-repo.git](https://github.com/Marko-What/nakupovalni-listek-main.git)](https://github.com/Marko-What/nakupovalni-listek-main.git)

2. Navigate into the project directory:

cd your-repo

3. Install the dependencies:

npm install

4. Start the server:

npm start



After starting the server, it will listen on port 4000, and you can access the API endpoints as described in the API Endpoints section below.

## API Endpoints

- `GET /api`: Fetches all todos.
- `POST /api/todos/import`: Imports todos from a JSON payload.
- `GET /api/todos/export`: Exports current todos to JSON.

## WebSocket Events

- `connection`: Establishes a connection to the WebSocket server.
- `addTodo`: Adds a new todo item.
- `deleteTodo`: Deletes a specific todo item by id.
- `toggleTodo`: Toggles the completion status of a todo item by id.
- `deleteAllTodos`: Deletes all todo items.


# Todo CLI Tool

This CLI tool provides a simple interface to import and export todo items to and from a backend server. Built with Node.js, it leverages Commander for command-line interactions, Axios for HTTP requests, and the native File System module for file operations.

## Features

- **Import Todos**: Imports todo items from a local JSON file and posts them to the backend server.
- **Export Todos**: Fetches todo items from the backend server and exports them to a local JSON file.

node cli.js import <path-to-your-json-file>

node cli.js export <path-to-your-json-file>
