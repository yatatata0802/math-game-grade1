import React from 'react';
import CharacterDisplay from './CharacterDisplay';
import useGameState from '../hooks/useGameState';
import { CUSTOMIZATION_OPTIONS } from '../constants';

type CustomizationScreenProps = ReturnType<typeof useGameState> & {
    playSound: (sound: 'levelUp') => void;
};

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  character,
  applyCustomization,
  startNextStage,
  playSound,
}) => {
    
    const equivalentLevel = character.stagesCleared + 1;
    const unlockedHats = CUSTOMIZATION_OPTIONS.hats.slice(0, Math.min(equivalentLevel, CUSTOMIZATION_OPTIONS.hats.length));
    const unlockedAccessories = CUSTOMIZATION_OPTIONS.accessories.slice(0, Math.min(Math.floor(equivalentLevel / 2) + 1, CUSTOMIZATION_OPTIONS.accessories.length));

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl animate-pop-in">
      <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">へんしんタイム！</h2>
      <p className="text-xl text-white mb-6">すきなすがたをえらんでね！</p>
      
      <div className="w-64 h-64 my-4">
        <CharacterDisplay character={character} isHappy={true} />
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Color Customization */}
        <div>
            <h3 className="text-2xl text-white font-bold mb-3">いろ</h3>
            <div className="flex justify-center gap-3 flex-wrap">
                {CUSTOMIZATION_OPTIONS.colors.map(color => (
                    <button
                        key={color}
                        onClick={() => applyCustomization({ color })}
                        className={`w-12 h-12 rounded-full shadow-md transform hover:scale-110 transition-transform ${character.color === color ? 'ring-4 ring-white ring-offset-4 ring-offset-blue-500' : ''}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                    />
                ))}
            </div>
        </div>

        {/* Hat Customization */}
        <div>
            <h3 className="text-2xl text-white font-bold mb-3">ぼうし</h3>
            <div className="flex justify-center gap-4 flex-wrap bg-black/20 p-3 rounded-xl">
                {unlockedHats.map(hat => (
                    <button
                        key={hat}
                        onClick={() => applyCustomization({ hat })}
                        className={`px-6 py-2 rounded-lg text-lg font-bold transition-colors ${character.hat === hat ? 'bg-yellow-400 text-slate-800' : 'bg-white/50 text-slate-700 hover:bg-white/80'}`}
                    >
                        {hat === 'none' ? 'なし' : hat}
                    </button>
                ))}
            </div>
        </div>

        {/* Accessory Customization */}
         <div>
            <h3 className="text-2xl text-white font-bold mb-3">アクセサリー</h3>
            <div className="flex justify-center gap-4 flex-wrap bg-black/20 p-3 rounded-xl">
                {unlockedAccessories.map(accessory => (
                    <button
                        key={accessory}
                        onClick={() => applyCustomization({ accessory })}
                        className={`px-6 py-2 rounded-lg text-lg font-bold transition-colors ${character.accessory === accessory ? 'bg-yellow-400 text-slate-800' : 'bg-white/50 text-slate-700 hover:bg-white/80'}`}
                    >
                        {accessory === 'none' ? 'なし' : accessory}
                    </button>
                ))}
            </div>
        </div>

      </div>

      <button
        onClick={() => {
            playSound('levelUp');
            startNextStage();
        }}
        className="mt-12 bg-green-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        つぎのステージへ！
      </button>
    </div>
  );
};

export default CustomizationScreen;
