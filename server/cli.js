// Require necessary modules
const { Command } = require('commander');
const fs = require('fs');
const axios = require('axios'); // Assuming you use axios for HTTP requests

const program = new Command();
program.version('1.0.0');

// Define the import command
program
  .command('import <file>')
  .description('Import todos from a JSON file')
  .action(async (file) => {
    try {
      const data = fs.readFileSync(file, 'utf8');
      await axios.post('http://localhost:4000/api/todos/import', JSON.parse(data));
      console.log('Todos imported successfully.');
    } catch (error) {
      console.error('Failed to import todos:', error.message);
    }
  });

// Define the export command
program
  .command('export <file>')
  .description('Export todos to a JSON file')
  .action(async (file) => {
    try {
      const response = await axios.get('http://localhost:4000/api/todos/export');
      fs.writeFileSync(file, JSON.stringify(response.data));
      console.log('Todos exported successfully.');
    } catch (error) {
      console.error('Failed to export todos:', error.message);
    }
  });

program.parse(process.argv);
