const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');
const { createApp } = require('../app');

const tmpDb = () =>
  path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'todos-')), 'todos.db');

describe('todo API', () => {
  let app;
  beforeEach(() => {
    app = createApp({ dbPath: tmpDb() });
  });

  test('declares better-sqlite3 as a dependency', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
    );
    expect(
      pkg.dependencies && pkg.dependencies['better-sqlite3'],
    ).toBeDefined();
  });

  test('GET /todos starts empty', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /todos creates a todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'write tests' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'write tests', done: false });
    expect(Number.isInteger(res.body.id)).toBe(true);
  });

  test('POST /todos rejects a missing title', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.status).toBe(400);
  });

  test('GET /todos/:id returns a todo or 404', async () => {
    const { body } = await request(app).post('/todos').send({ title: 'a' });
    const found = await request(app).get(`/todos/${body.id}`);
    expect(found.status).toBe(200);
    expect(found.body).toEqual(body);
    expect((await request(app).get('/todos/9999')).status).toBe(404);
  });

  test('PATCH /todos/:id updates fields', async () => {
    const { body } = await request(app).post('/todos').send({ title: 'a' });
    const res = await request(app)
      .patch(`/todos/${body.id}`)
      .send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...body, done: true });
  });

  test('DELETE /todos/:id removes a todo', async () => {
    const { body } = await request(app).post('/todos').send({ title: 'a' });
    expect((await request(app).delete(`/todos/${body.id}`)).status).toBe(204);
    expect((await request(app).get(`/todos/${body.id}`)).status).toBe(404);
  });

  test('data persists across app instances', async () => {
    const dbPath = tmpDb();
    await request(createApp({ dbPath }))
      .post('/todos')
      .send({ title: 'persist me' });
    const res = await request(createApp({ dbPath })).get('/todos');
    expect(res.body.map((t) => t.title)).toEqual(['persist me']);
  });
});
