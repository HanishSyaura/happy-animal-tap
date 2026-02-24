import { useState, useEffect, useRef, useCallback } from 'react';
import { animals } from '../data/animals';
import { Animal, GameState } from '../types';
import * as api from '../api/game';
import confetti from 'canvas-confetti';

// AI Voice Recognition Setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        difficultyLevel: 1,
        isPlaying: false, // Start false for intro
        currentAnimals: [],
        targetAnimal: null,
        showHint: false,
        sessionId: null,
    });
    
    const [hasStarted, setHasStarted] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    const [lastActionTime, setLastActionTime] = useState<number>(Date.now());
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [lastWrongId, setLastWrongId] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

    const stopAllSound = useCallback(() => {
        window.speechSynthesis.cancel();
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
        }
    }, []);

    const startGame = async () => {
        try {
            setHasStarted(true);
            
            // Start background music
            const bgMusic = new Audio('/sounds/bg-music.mp3');
            bgMusic.loop = true;
            bgMusic.volume = 0.1; // Softer volume (was 0.2)
            bgMusic.playbackRate = 0.8; // Slower speed
            bgMusic.play().catch((e) => console.log("Bg music failed to play:", e));
            bgMusicRef.current = bgMusic;

            const sessionId = await api.startSession();
            setGameState(prev => ({ ...prev, sessionId, isPlaying: true }));
            startRound(1);
        } catch (error) {
            console.warn('Failed to start session, switching to offline mode', error);
            // Fallback to offline mode
            setIsOffline(true);
            const offlineSessionId = 'offline_' + Date.now();
            setGameState(prev => ({ ...prev, sessionId: offlineSessionId, isPlaying: true }));
            startRound(1);
        }
    };
    
    // Initialize Game - Removed auto start
    useEffect(() => {
        // Load voices early
        window.speechSynthesis.getVoices();
        
        // Remove auto init
        // const init = async () => { ... }
        // init();
    }, []);

    // Load voices when they are ready (some browsers load async)
    useEffect(() => {
        const loadVoices = () => {
             window.speechSynthesis.getVoices();
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    // AI Text-to-Speech
    const speak = useCallback((text: string) => {
        // Only stop other speech, don't stop music
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find a female voice if possible
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha'));
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.rate = 0.7; // Kids friendly speed (not too slow)
        utterance.pitch = 1.1; // Friendly tone
        window.speechSynthesis.speak(utterance);
    }, [stopAllSound]);

    const playAnimalSound = useCallback((animal: Animal) => {
        // Do NOT stop background music, only stop TTS and other sound effects
        window.speechSynthesis.cancel();
        if (currentAudioRef.current && currentAudioRef.current !== bgMusicRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
        }
        
        // Simulating animal sounds with TTS if real files are missing
        // In a real app, you'd have lion.mp3, dog.mp3 etc.
        const audio = new Audio(`/sounds/${animal.id}.mp3`);
        currentAudioRef.current = audio;
        
        audio.play().catch(() => {
            // Fallback: Make a funny sound with TTS
            const soundMap: Record<string, string> = {
                lion: "Rooo-aaar!",
                dog: "Woof woof!",
                cat: "Meee-ooow!",
                cow: "Moooo-oooo!",
                sheep: "Baaaaa-aaaa!",
                pig: "Oink oink oink!",
                tiger: "Grrrrr-aaaa!",
                elephant: "Pa-wooooo!",
                monkey: "Ooh ooh aah aah!",
                bear: "Grrrrr-oooo!",
                rabbit: "Sniff sniff!",
                panda: "Munch munch!"
            };
            
            const sound = soundMap[animal.id] || animal.name;
            
            // Special TTS settings for animal sounds to make them cuter
            const utterance = new SpeechSynthesisUtterance(sound);
            utterance.rate = 0.8; 
            utterance.pitch = 1.4; // High pitch for cute animal sounds
            
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English'));
            if (femaleVoice) utterance.voice = femaleVoice;
            
            window.speechSynthesis.speak(utterance);
        });
    }, [stopAllSound]);

    // AI Voice Recognition
    useEffect(() => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim().toLowerCase();
            console.log('Voice command:', command);
            
            if (gameState.targetAnimal && command.includes(gameState.targetAnimal.name.toLowerCase())) {
                handleAnswer(gameState.targetAnimal);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [gameState.targetAnimal]);

    // AI Mood Detection (Slow response)
    useEffect(() => {
        if (!gameState.targetAnimal || !gameState.isPlaying) return;

        const timer = setTimeout(() => {
            setGameState(prev => ({ ...prev, showHint: true }));
        const hints = [
            "You're doing great! Can you find it?",
            "Take your time, I know you can find it!",
            "Don't give up, look closely!",
            "Where is it hiding? You can do it!"
        ];
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        speak(randomHint);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [gameState.targetAnimal, gameState.isPlaying, speak]);

    const startRound = (difficulty: number) => {
        const count = difficulty === 1 ? 4 : 6;
        // Shuffle animals
        const shuffled = [...animals].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        const target = selected[Math.floor(Math.random() * selected.length)];

        setGameState(prev => ({
            ...prev,
            currentAnimals: selected,
            targetAnimal: target,
            showHint: false,
            difficultyLevel: difficulty
        }));
        
        setLastActionTime(Date.now());
        setFeedback(null);
        setLastWrongId(null);
        
        // Announce target
        setTimeout(() => speak(`Can you find the ${target.name}?`), 500);
    };

    const handleAnswer = async (animal: Animal) => {
        if (!gameState.targetAnimal || !gameState.sessionId) return;
        
        // Play animal sound immediately on click
        playAnimalSound(animal);
        
        const isCorrect = animal.id === gameState.targetAnimal.id;
        const now = Date.now();
        const reactionTime = (now - lastActionTime) / 1000; // seconds

        // Update Backend
        // Optimistically update UI first
        
        if (isCorrect) {
            // Sound already played at start of function
            
            setFeedback('correct');
            
            const newScore = gameState.score + 1;
            const newConsecutiveCorrect = gameState.consecutiveCorrect + 1;
            
            // Check for difficulty increase
            let newDifficulty = gameState.difficultyLevel;
            if (newConsecutiveCorrect >= 5 && gameState.difficultyLevel === 1) {
                newDifficulty = 2;
                setTimeout(() => speak("Great Job! Let's try more animals!"), 1000);
            }

            // Confetti if 5 correct total or just correct
            if (newScore % 5 === 0) {
                 confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setTimeout(() => speak("Great Job!"), 1000);
            }

            setGameState(prev => ({
                ...prev,
                score: newScore,
                consecutiveCorrect: newConsecutiveCorrect,
                consecutiveWrong: 0,
                difficultyLevel: newDifficulty
            }));

            // Next round after delay
            setTimeout(() => startRound(newDifficulty), 2000);

        } else {
            // Wrong answer
            // Play error sound slightly delayed so we hear the animal first
            setTimeout(() => {
                const audio = new Audio('/sounds/error.mp3'); // Generic error
                audio.play().catch(() => {});
            }, 800);
            
            setFeedback('wrong');
            setLastWrongId(animal.id);
            
            const newConsecutiveWrong = gameState.consecutiveWrong + 1;
            
            // Adaptive Difficulty: Reduce choices if struggling
            if (newConsecutiveWrong >= 3) {
                 // Keep target + 1 random
                 const target = gameState.targetAnimal;
                 const others = gameState.currentAnimals.filter(a => a.id !== target.id);
                 const oneOther = others[Math.floor(Math.random() * others.length)];
                 const reduced = [target, oneOther].sort(() => 0.5 - Math.random());
                 
                 setGameState(prev => ({
                     ...prev,
                     currentAnimals: reduced,
                     showHint: true, // Also highlight
                     consecutiveWrong: 0 // Reset counter so it doesn't trigger every time
                 }));
                 speak(`Look for the ${target.name}!`);
            } else {
                 setGameState(prev => ({
                     ...prev,
                     consecutiveWrong: newConsecutiveWrong
                 }));
            }
        }

        // Send stats
        if (!isOffline) {
            try {
                await api.submitAnswer({
                    sessionId: gameState.sessionId,
                    isCorrect,
                    reactionTime,
                    currentScore: isCorrect ? gameState.score + 1 : gameState.score,
                    difficultyLevel: gameState.difficultyLevel
                });
            } catch (e) {
                console.error(e);
            }
        }
    };
    
    const resetGame = async () => {
        if (gameState.sessionId && !isOffline) {
            try {
                await api.resetSession(gameState.sessionId);
            } catch (e) {
                console.error("Failed to reset session on server", e);
            }
        }
        setGameState(prev => ({
            ...prev,
            score: 0,
            consecutiveCorrect: 0,
            consecutiveWrong: 0,
            difficultyLevel: 1
        }));
        setLastWrongId(null);
        startRound(1);
    };

    return {
        gameState,
        handleAnswer,
        feedback,
        lastWrongId,
        resetGame,
        playAnimalSound,
        startGame,
        hasStarted,
        isOffline
    };
};
