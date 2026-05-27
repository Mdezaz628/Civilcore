# Structura Dashboard

React + Vite frontend with a MongoDB-backed Express API.

## Run

1. Create a `.env` file in the project root.
2. Add your MongoDB connection string:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/structura
```

3. Install dependencies and start both servers:

```powershell
npm install
npm run dev
```

## Notes

- The API stores the entire dashboard state as one MongoDB document.
- Frontend requests go through `/api` and are proxied to the Express server in development.
- The first login seed is created automatically if the database is empty.
