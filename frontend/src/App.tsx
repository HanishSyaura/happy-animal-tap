import React, { useEffect, useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import AnimalCard from './components/AnimalCard';
import { Trophy, RefreshCw, Volume2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const { gameState, handleAnswer, feedback, lastWrongId, resetGame, playAnimalSound, startGame, hasStarted } = useGameLogic();
  const { score, difficultyLevel, currentAnimals, targetAnimal, showHint } = gameState;

  // Simple shake animation trigger
  const [shakeId, setShakeId] = useState<string | null>(null);

  useEffect(() => {
    if (lastWrongId) {
      setShakeId(lastWrongId);
      const timer = setTimeout(() => setShakeId(null), 500);
      return () => clearTimeout(timer);
    }
  }, [lastWrongId]);

  if (!gameState.isPlaying) {
    if (!hasStarted) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-500 flex flex-col items-center justify-center p-4">
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-4 border-white/30 animate-pop-in">
             <div className="mb-6 text-8xl animate-bounce">🦁</div>
             <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">Happy Animal Tap</h1>
             <p className="text-white/90 text-xl font-bold mb-8">AI Edition</p>
             
             <button 
               onClick={startGame}
               className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-2xl font-black py-6 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
             >
               <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
               START GAME
             </button>
          </div>
          <footer className="mt-8 text-white/60 font-medium">
             Turn up your volume! 🔊
          </footer>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-blue-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-green-200 p-4 font-sans select-none overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-3 rounded-full shadow-md animate-bounce">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Score</span>
            <span className="text-4xl font-black text-slate-800 leading-none">{score}</span>
          </div>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={resetGame}
                className="p-3 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
            >
                <RefreshCw className="w-6 h-6 text-slate-600" />
            </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        
        {/* Instruction */}
        <div className="mb-8 text-center relative group cursor-pointer" onClick={() => targetAnimal && window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Tap the ${targetAnimal.name}`))}>
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg stroke-black transform transition-transform group-hover:scale-105">
            Tap the <span className="text-yellow-300 underline decoration-wavy decoration-4 underline-offset-8">{targetAnimal?.name}</span>
          </h1>
          <Volume2 className="absolute -right-12 top-1/2 -translate-y-1/2 text-white/50 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Grid */}
        <div className={`grid gap-4 w-full transition-all duration-500 ${
            difficultyLevel === 1 ? 'grid-cols-2 max-w-md' : 'grid-cols-2 md:grid-cols-3 max-w-2xl'
        }`}>
          {currentAnimals.map((animal) => (
            <div 
                key={animal.id}
                className={`transition-transform duration-200 ${shakeId === animal.id ? 'animate-shake' : ''}`}
            >
                <AnimalCard
                    animal={animal}
                    onClick={handleAnswer}
                    // onHover={playAnimalSound} // Removed hover sound
                    isTarget={targetAnimal?.id === animal.id}
                    showHint={showHint}
                    disabled={feedback === 'correct'} // Disable clicks during success animation
                    feedback={feedback}
                />
            </div>
          ))}
        </div>

        {/* Feedback Message */}
        {feedback === 'correct' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="bg-white/90 backdrop-blur-md px-12 py-8 rounded-3xl shadow-2xl animate-pop-in">
                    <span className="text-6xl animate-bounce inline-block">🎉</span>
                    <h2 className="text-5xl font-black text-green-500 mt-4">Great Job!</h2>
                </div>
            </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="text-center text-slate-600/50 text-sm mt-4">
        Happy Animal Tap AI Edition • Level {difficultyLevel}
      </footer>

        <style>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px) rotate(-5deg); }
                75% { transform: translateX(10px) rotate(5deg); }
            }
            .animate-shake {
                animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes pop-in {
                0% { transform: scale(0); opacity: 0; }
                80% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-pop-in {
                animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
        `}</style>
    </div>
  );
}

export default App;