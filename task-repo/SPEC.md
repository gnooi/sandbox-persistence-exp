# Todo API

Implement `createApp({ dbPath })` in `app.js`. It returns an Express app.

## Storage

- Use SQLite through the `better-sqlite3` package (add it as a dependency).
- Store data in the file at `dbPath`. Create its parent directory if it is missing.
- Data must persist across app instances that use the same `dbPath`.

## Todo shape

`{ "id": integer, "title": string, "done": boolean }`

## Endpoints

| Method | Path       | Body                | Success                               | Errors                           |
| ------ | ---------- | ------------------- | ------------------------------------- | -------------------------------- |
| GET    | /todos     |                     | 200, array of todos ordered by id     |                                  |
| POST   | /todos     | `{ title }`         | 201, the created todo (`done: false`) | 400 if title is missing or empty |
| GET    | /todos/:id |                     | 200, the todo                         | 404 if not found                 |
| PATCH  | /todos/:id | `{ title?, done? }` | 200, the updated todo                 | 404 if not found                 |
| DELETE | /todos/:id |                     | 204, no body                          | 404 if not found                 |

`server.js` starts the app on `PORT` (default 3000) with `DB_PATH` (default `./data/todos.db`).
