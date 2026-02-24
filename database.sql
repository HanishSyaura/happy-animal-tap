CREATE DATABASE IF NOT EXISTS happy_animal_tap;
USE happy_animal_tap;

CREATE TABLE IF NOT EXISTS game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    correct INT DEFAULT 0,
    avg_reaction_time FLOAT DEFAULT 0,
    difficulty_level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert example
INSERT INTO game_sessions (session_id, score, attempts, correct, avg_reaction_time, difficulty_level)
VALUES ('sess_12345', 10, 12, 10, 2.5, 2);

-- Select example
SELECT * FROM game_sessions WHERE session_id = 'sess_12345';