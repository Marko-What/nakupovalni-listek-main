// cli.test.js
const { program } = require('../cli'); // Adjust the path to where your CLI script is
const fs = require('fs');
const axios = require('axios');
jest.mock('axios');
jest.mock('fs');

describe('CLI Tests', () => {
  let consoleLogSpy;

  beforeEach(() => {
    // Reset mocks before each test
    axios.post.mockClear();
    axios.get.mockClear();
    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();

    // Mock file system and network requests
    fs.readFileSync.mockImplementation(() => JSON.stringify({ todos: ["Sample Todo"] }));
    axios.post.mockResolvedValue({ status: 200 });
    axios.get.mockResolvedValue({ data: { todos: ["Sample Todo"] } });

    // Spy on console.log to assert it was called
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore the console.log spy
    consoleLogSpy.mockRestore();
  });

  test('import command should read file and make a POST request', async () => {
    process.argv = ['node', 'cli.js', 'import', 'test.json'];
    await program.parseAsync(process.argv);

    expect(fs.readFileSync).toHaveBeenCalledWith('test.json', 'utf8');
    expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/todos/import', { todos: ["Sample Todo"] });
    expect(console.log).toHaveBeenCalledWith('Todos imported successfully.');
  });

  test('export command should make a GET request and write response to file', async () => {
    process.argv = ['node', 'cli.js', 'export', 'test.json'];
    await program.parseAsync(process.argv);

    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/todos/export');
    expect(fs.writeFileSync).toHaveBeenCalledWith('test.json', JSON.stringify({ todos: ["Sample Todo"] }));
    expect(console.log).toHaveBeenCalledWith('Todos exported successfully.');
  });

  // Include additional tests here for error cases and other functionality
});
