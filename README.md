# Happy Animal Tap AI Edition

A FULL AI-powered kids web game for ages 1–6.

## Features

- **Frontend**: React, Tailwind CSS, Bright & Colorful UI.
- **Backend**: Node.js, Express, MySQL.
- **AI Features**:
    - **Adaptive Difficulty**: Adjusts choices based on performance.
    - **Voice Recognition**: Say the animal name to select it (Chrome).
    - **Text-to-Speech**: Reads instructions aloud.
    - **Mood Detection**: Encourages the child if they take too long.
    - **Analytics**: Tracks reaction time, accuracy, and score.

## Project Structure

```
happy-animal-tap/
├── backend/            # Node.js Express Server
│   ├── routes/         # API Routes
│   ├── app.ts          # App setup
│   ├── db.ts           # Database connection
│   └── server.ts       # Server entry point
├── frontend/           # React Frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── index.html      # Entry HTML
│   └── vite.config.ts  # Vite config
├── database.sql        # MySQL Database Schema
├── .env                # Environment variables
└── package.json        # Project dependencies
```

## Setup & Deployment Guide

### Prerequisites
- Node.js (v16+)
- MySQL Database

### 1. Database Setup
1. Create a MySQL database named `happy_animal_tap`.
2. Run the SQL script `database.sql` to create the `game_sessions` table.

```sql
source database.sql;
```

### 2. Backend Setup
1. Configure `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=happy_animal_tap
   PORT=3001
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend:
   ```bash
   npm run server:dev
   ```

### 3. Frontend Setup
1. The frontend is configured to proxy requests to `http://localhost:3001`.
2. Run the frontend:
   ```bash
   npm run client:dev
   ```
3. Open `http://localhost:5173` in your browser.

### Deployment

#### GitHub
1. Push the code to a GitHub repository.

#### Vercel (Frontend)
1. Import the repository to Vercel.
2. Set the **Root Directory** to `frontend` (or keep root if using monorepo settings, but usually `frontend` is safer if deploying just the static site).
   - *Note*: Since the backend is separate, you need to deploy the backend first and update the API URL in the frontend.
   - Update `frontend/src/api/game.ts` to point to your deployed backend URL instead of `/api` proxy if deploying separately.

#### Render (Backend)
1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set **Root Directory** to `.`.
4. Set **Build Command**: `npm install && npm run build` (Ensure backend build script exists if using TS, currently `tsx` is used for dev).
   - *Production Tip*: For production, you should compile TS to JS. Add a build script for backend or use `ts-node`/`tsx` in production (not recommended for high load but fine for small apps).
5. Set **Start Command**: `npx tsx backend/server.ts` (or compile and run `node backend/dist/server.js`).
6. Add Environment Variables (`DB_HOST`, etc.) in Render dashboard.

## Development Notes
- **Voice Recognition**: Only works on supported browsers (Chrome recommended).
- **Audio**: Place MP3 files in `frontend/public/sounds/` matching animal IDs (e.g., `lion.mp3`).

## License
MIT
