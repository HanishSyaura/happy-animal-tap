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

#### 1. Vercel (Frontend)
This project is configured for Vercel deployment.

1.  Push the code to GitHub.
2.  Log in to Vercel and **Add New Project**.
3.  Import your `happy-animal-tap` repository.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Vite.
    *   **Environment Variables**:
        *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend-app.onrender.com`).
5.  Click **Deploy**.

#### 2. Render (Backend)
Since the backend uses MySQL and Node.js, Render is a good choice.

1.  Log in to Render and create a **Web Service**.
2.  Connect your GitHub repository.
3.  **Configure Service**:
    *   **Root Directory**: Leave empty or set to `.`.
    *   **Build Command**: `npm install`
    *   **Start Command**: `npx tsx backend/server.ts`
4.  **Environment Variables**:
    *   Add all variables from your `.env` file (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`).
    *   *Note*: You need a cloud MySQL database (e.g., Railway, PlanetScale, or Render's own PostgreSQL/MySQL if available).

## Development Notes
- **Voice Recognition**: Only works on supported browsers (Chrome recommended).
- **Audio**: Place MP3 files in `frontend/public/sounds/` matching animal IDs (e.g., `lion.mp3`).

## License
MIT
