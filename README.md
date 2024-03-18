
# Unified Todo List Application with Real-time Capabilities

    Todo List application, a full-stack project that demonstrates the power of real-time web technologies. This application is built using React for the frontend and Node.js for the backend, with WebSockets facilitating live updates across client and server. It's designed to offer users a seamless experience in managing their todo lists.

## Features

- **Real-time Interactions**: Instantly add, toggle, and delete todos across multiple clients.
- **Persistence**: Todos are saved on the server, allowing for continuity across sessions.
- **Import/Export Functionality**: Users can import and export their todo lists as JSON files.
- **Comprehensive Testing**: Includes integration and unit tests to ensure reliability.

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- [Node.js](https://nodejs.org/en/) (version 14.x or above recommended)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Project Structure

The project is divided into two main directories:

- `client/`: Contains the React frontend application.
- `server/`: Contains the Node.js backend application.

## Installation Instructions

Follow these steps to get the application running on your local machine.

### Clone the Repository

```sh
git clone https://github.com/Marko-What/nakupovalni-listek
cd your-repo
cd server
npm install
npx ts-node index.ts

cd path/to/your-repo/client
npm install
npm start
