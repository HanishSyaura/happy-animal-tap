import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configure axios with a timeout
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds timeout
});

export const startSession = async () => {
    const response = await apiClient.post(`/start-session`);
    return response.data.sessionId;
};

export const submitAnswer = async (data: {
    sessionId: string;
    isCorrect: boolean;
    reactionTime: number;
    currentScore: number;
    difficultyLevel: number;
}) => {
    await apiClient.post(`/submit-answer`, data);
};

export const getAnalytics = async (sessionId: string) => {
    const response = await apiClient.get(`/analytics/${sessionId}`);
    return response.data;
};

export const resetSession = async (sessionId: string) => {
    await apiClient.post(`/reset`, { sessionId });
};