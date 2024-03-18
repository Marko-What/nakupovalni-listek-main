// Require necessary modules for CLI operations, file system interactions, and HTTP requests
const { Command } = require('commander'); // Used for creating command-line interfaces
const fs = require('fs'); // File system module for reading and writing files
const axios = require('axios'); // HTTP client for making requests to external APIs

// Initialize the command-line interface program with Commander
const program = new Command();
program.version('1.0.0'); // Set the version of the CLI tool

// Define the 'import' command to read todos from a JSON file and send them to an API
program
  .command('import <file>') // Specify the command syntax with a required file parameter
  .description('Import todos from a JSON file') // Provide a brief description of the command's purpose
  .action(async (file) => { // Define the action to perform when this command is invoked
    try {
      // Read the specified file synchronously, assuming UTF-8 encoding
      const data = fs.readFileSync(file, 'utf8');
      // Send a POST request to the API with the file's contents as the request body
      await axios.post('http://localhost:4000/api/todos/import', JSON.parse(data));
      // Log success message to the console
      console.log('Todos imported successfully.');
    } catch (error) {
      // Log any errors encountered during the import process
      console.error('Failed to import todos:', error.message);
    }
  });

// Define the 'export' command to fetch todos from an API and save them to a JSON file
program
  .command('export <file>') // Specify the command syntax with a required file parameter
  .description('Export todos to a JSON file') // Provide a brief description of the command's purpose
  .action(async (file) => { // Define the action to perform when this command is invoked
    try {
      // Send a GET request to the API to retrieve the todos
      const response = await axios.get('http://localhost:4000/api/todos/export');
      // Write the response data to the specified file, converting the data to a JSON string
      fs.writeFileSync(file, JSON.stringify(response.data));
      // Log success message to the console
      console.log('Todos exported successfully.');
    } catch (error) {
      // Log any errors encountered during the export process
      console.error('Failed to export todos:', error.message);
    }
  });

// Parse command-line arguments provided by the user
program.parse(process.argv);
