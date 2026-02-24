export interface Animal {
    id: string;
    name: string;
    image: string; // SVG data URI or URL
    color: string; // Background color for card
}

export interface GameState {
    score: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
    difficultyLevel: number; // 1: 4 animals, 2: 6 animals
    isPlaying: boolean;
    currentAnimals: Animal[];
    targetAnimal: Animal | null;
    showHint: boolean;
    sessionId: string | null;
}
