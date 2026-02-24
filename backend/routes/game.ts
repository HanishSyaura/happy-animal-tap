import { Router, Request, Response } from 'express';
import pool from '../db.js';

const router = Router();

// Helper for random session ID if not using uuid
const generateSessionId = () => {
    return 'sess_' + Math.random().toString(36).substring(2, 15);
};

// Start Session
router.post('/start-session', async (req: Request, res: Response) => {
    try {
        const sessionId = generateSessionId();
        // Create initial record
        await pool.query(
            'INSERT INTO game_sessions (session_id) VALUES (?)',
            [sessionId]
        );
        res.json({ sessionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// Submit Answer (Update stats)
// Expects: { sessionId, isCorrect, reactionTime, currentScore, difficultyLevel }
router.post('/submit-answer', async (req: Request, res: Response) => {
    const { sessionId, isCorrect, reactionTime, currentScore, difficultyLevel } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
    }

    try {
        // Get current stats
        const [rows]: any = await pool.query(
            'SELECT * FROM game_sessions WHERE session_id = ?',
            [sessionId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const session = rows[0];
        const newAttempts = session.attempts + 1;
        const newCorrect = session.correct + (isCorrect ? 1 : 0);
        // Recalculate average reaction time
        // (old_avg * old_attempts + new_time) / new_attempts
        // But reactionTime is for this attempt.
        // If it's the first attempt, avg is reactionTime.
        const currentTotalTime = session.avg_reaction_time * session.attempts;
        const newAvgTime = (currentTotalTime + reactionTime) / newAttempts;

        await pool.query(
            `UPDATE game_sessions 
             SET score = ?, attempts = ?, correct = ?, avg_reaction_time = ?, difficulty_level = ? 
             WHERE session_id = ?`,
            [currentScore, newAttempts, newCorrect, newAvgTime, difficultyLevel, sessionId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update stats' });
    }
});

// Get Analytics
router.get('/analytics/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM game_sessions WHERE session_id = ?',
            [sessionId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const session = rows[0];
        const accuracy = session.attempts > 0 ? (session.correct / session.attempts) * 100 : 0;

        res.json({
            total_taps: session.attempts,
            accuracy_rate: accuracy.toFixed(2) + '%',
            reaction_time_avg: session.avg_reaction_time.toFixed(2) + 's',
            score: session.score
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get analytics' });
    }
});

// Reset (Create new session or reset current?)
// Requirements say "POST /reset". Usually resets current game state.
// Maybe just clear stats for the session?
router.post('/reset', async (req: Request, res: Response) => {
    const { sessionId } = req.body;
    try {
        await pool.query(
            `UPDATE game_sessions 
             SET score = 0, attempts = 0, correct = 0, avg_reaction_time = 0, difficulty_level = 1 
             WHERE session_id = ?`,
            [sessionId]
        );
        res.json({ success: true, message: 'Session reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset session' });
    }
});

export default router;