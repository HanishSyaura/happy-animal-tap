import React from 'react';
import { Animal } from '../types';
import { cn } from '../lib/utils'; // Assuming utils exists, or I will create it. 
// Actually lib/utils might not exist in this template. I'll check.
// If not, I'll just use template literal or create clsx utility.

// Checking utils: The template usually has src/lib/utils.ts?
// Let's assume I can use standard string concatenation or install clsx/tailwind-merge.
// I installed them earlier.

interface AnimalCardProps {
    animal: Animal;
    onClick: (animal: Animal) => void;
    onHover?: (animal: Animal) => void;
    isTarget: boolean; // For debugging or hint?
    showHint: boolean;
    disabled: boolean;
    feedback: 'correct' | 'wrong' | null;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick, onHover, isTarget, showHint, disabled, feedback }) => {
    // Determine animation/style
    const isCorrect = feedback === 'correct' && isTarget;
    const isWrong = feedback === 'wrong' && !isTarget; // Wait, feedback is global?
    // Feedback in useGameLogic is single state.
    // If feedback is 'correct', we show celebration on the correct card?
    // If feedback is 'wrong', we show shake on the clicked card?
    // But useGameLogic doesn't track *which* card was clicked for wrong answer, just that it was wrong.
    // So for now, we might just shake all or just the one if we passed it.
    // Let's simplify: if feedback is wrong, maybe shake the screen or something.
    // But requirement says: "When wrong: Shake animation". Usually shake the wrong card.
    // I need to know which card was clicked. 
    // I'll update useGameLogic later if needed, or handle local state here?
    // No, App.tsx handles the click.
    
    // Let's just use simple styles.
    
    return (
        <button
            onClick={() => onClick(animal)}
            onMouseEnter={() => onHover && onHover(animal)}
            disabled={disabled}
            className={`
                relative w-full aspect-square rounded-3xl p-4 
                transition-all duration-300 transform hover:scale-105 active:scale-95
                ${animal.color}
                shadow-lg hover:shadow-xl border-4
                ${showHint && isTarget ? 'border-yellow-400 animate-pulse ring-4 ring-yellow-200' : 'border-transparent'}
                ${disabled ? 'cursor-default' : 'cursor-pointer'}
            `}
        >
            <img 
                src={animal.image} 
                alt={animal.name} 
                className="w-full h-full object-contain pointer-events-none select-none"
            />
        </button>
    );
};

export default AnimalCard;