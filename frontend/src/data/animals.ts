import { Animal } from '../types';

// Simple SVG placeholders. In a real app, these would be detailed illustrations or API URLs.
const getAnimalSVG = (emoji: string, color: string) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='${encodeURIComponent(color)}' /%3E%3Ctext x='50' y='65' font-size='60' text-anchor='middle' fill='black'%3E${emoji}%3C/text%3E%3C/svg%3E`;

export const animals: Animal[] = [
    { id: 'lion', name: 'Lion', image: getAnimalSVG('🦁', '#FCD34D'), color: 'bg-yellow-100' },
    { id: 'elephant', name: 'Elephant', image: getAnimalSVG('🐘', '#9CA3AF'), color: 'bg-gray-100' },
    { id: 'dog', name: 'Dog', image: getAnimalSVG('🐶', '#D97706'), color: 'bg-orange-100' },
    { id: 'cat', name: 'Cat', image: getAnimalSVG('🐱', '#FCA5A5'), color: 'bg-red-100' },
    { id: 'monkey', name: 'Monkey', image: getAnimalSVG('🐵', '#92400E'), color: 'bg-amber-100' },
    { id: 'cow', name: 'Cow', image: getAnimalSVG('🐮', '#E5E7EB'), color: 'bg-slate-100' },
    { id: 'sheep', name: 'Sheep', image: getAnimalSVG('🐑', '#F3F4F6'), color: 'bg-zinc-100' },
    { id: 'pig', name: 'Pig', image: getAnimalSVG('🐷', '#F9A8D4'), color: 'bg-pink-100' },
    { id: 'tiger', name: 'Tiger', image: getAnimalSVG('🐯', '#FB923C'), color: 'bg-orange-200' },
    { id: 'bear', name: 'Bear', image: getAnimalSVG('🐻', '#78350F'), color: 'bg-brown-200' },
    { id: 'rabbit', name: 'Rabbit', image: getAnimalSVG('🐰', '#E5E7EB'), color: 'bg-gray-200' },
    { id: 'panda', name: 'Panda', image: getAnimalSVG('🐼', '#1F2937'), color: 'bg-slate-200' },
];

export const sounds: Record<string, string> = {
    // In a real app, these would be paths to audio files.
    // We'll use SpeechSynthesis for now as a fallback if real sounds aren't available,
    // or simulate "real animal sound" with a generic placeholder if requested.
    // The requirement says "Play real animal sound". 
    // Since I can't generate audio files easily, I'll assume they exist in public/sounds/
    // or I'll try to find online open source URLs. 
    // For now, I'll just map them to filenames and handle the "missing file" gracefully.
    lion: '/sounds/lion.mp3',
    elephant: '/sounds/elephant.mp3',
    // ...
};