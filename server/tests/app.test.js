const request = require('supertest');
const http = require('http');
//const app = require('./app'); // Adjust the path to where your express app is defined
const app = require('../app'); 
const server = http.createServer(app);

describe('HTTP endpoints', () => {
  afterAll((done) => {
    server.close();
    done();
  });

  it('should fetch all todos', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should import todos', async () => {
    const todos = [{ id: 1, text: 'Test Todo', isChecked: false }];
    const response = await request(app)
      .post('/api/todos/import')
      .send(todos);
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Todos imported successfully.');
  });

  it('should export todos', async () => {
    const response = await request(app).get('/api/todos/export');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, text: 'Test Todo', isChecked: false }]);
  });
});
