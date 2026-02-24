import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const startSession = async () => {
    const response = await axios.post(`${API_URL}/start-session`);
    return response.data.sessionId;
};

export const submitAnswer = async (data: {
    sessionId: string;
    isCorrect: boolean;
    reactionTime: number;
    currentScore: number;
    difficultyLevel: number;
}) => {
    await axios.post(`${API_URL}/submit-answer`, data);
};

export const getAnalytics = async (sessionId: string) => {
    const response = await axios.get(`${API_URL}/analytics/${sessionId}`);
    return response.data;
};

export const resetSession = async (sessionId: string) => {
    await axios.post(`${API_URL}/reset`, { sessionId });
};