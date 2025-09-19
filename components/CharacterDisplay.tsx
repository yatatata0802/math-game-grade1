import React from 'react';
// Fix: Import the Character type.
import { Character } from '../types';

interface CharacterDisplayProps {
  // Fix: Add character prop to display customizations.
  character: Character;
  isHappy?: boolean;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character, isHappy = false }) => {
  const eyePath = isHappy 
    ? "M 35 55 Q 40 45 45 55" // Happy U-shape
    : "M 35 55 L 45 55";     // Neutral line
  const rightEyePath = isHappy 
    ? "M 55 55 Q 60 45 65 55" // Happy U-shape for right eye
    : "M 55 55 L 65 55";     // Neutral line for right eye
  const mouthPath = isHappy 
    ? "M 40 75 Q 50 90 60 75" // Happy smile
    : "M 40 75 L 60 75";     // Neutral line
  
  // Fix: Use color from character prop.
  const characterColor = character.color || '#3b82f6';

  // Fix: Added renderer for hats based on character prop.
  const renderHat = () => {
    switch (character.hat) {
      case 'Top Hat':
        return <path d="M 35 20 L 35 10 L 65 10 L 65 20 L 70 20 L 70 22 L 30 22 L 30 20 Z" fill="#1e293b" stroke="#1e293b" strokeWidth="1" />;
      case 'Party Hat':
        return <path d="M 50 5 L 65 22 L 35 22 Z" fill="#f87171" stroke="#1e293b" strokeWidth="1.5" />;
      case 'Crown':
        return <path d="M 30 22 L 35 12 L 50 17 L 65 12 L 70 22 H 30 Z" fill="#facc15" stroke="#1e293b" strokeWidth="1.5" />;
      case 'Beanie':
        return <path d="M 30 25 Q 50 10 70 25" fill="#60a5fa" stroke="#1e293b" strokeWidth="1.5" />;
      default:
        return null;
    }
  };

  // Fix: Added renderer for accessories based on character prop.
  const renderAccessory = () => {
    switch (character.accessory) {
      case 'Glasses':
        return (
          <>
            <circle cx="40" cy="55" r="8" stroke="#1e293b" strokeWidth="2.5" fill="none" />
            <circle cx="60" cy="55" r="8" stroke="#1e293b" strokeWidth="2.5" fill="none" />
            <line x1="48" y1="55" x2="52" y2="55" stroke="#1e293b" strokeWidth="2.5" />
          </>
        );
      case 'Bowtie':
        return <path d="M 42 72 L 50 77 L 42 82 Z M 58 72 L 50 77 L 58 82 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />;
      case 'Scarf':
        return <path d="M 25 80 Q 50 90 75 80 L 80 95 L 20 95 Z" fill="#22c55e" stroke="#1e293b" strokeWidth="1.5" />;
      default:
        return null;
    }
  };


  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g>
        {/* Body */}
        <path d="M 20 100 V 40 Q 20 20 40 20 H 60 Q 80 20 80 40 V 100 Z" fill={characterColor} stroke="#1e293b" strokeWidth="2.5" />
        
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="10" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="50" cy="8" r="4" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" />
        
        {/* Fix: Render hat */}
        {renderHat()}

        {/* Eyes */}
        <path d={eyePath} stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d={rightEyePath} stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        
        {/* Mouth */}
        <path d={mouthPath} stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        
        {/* Fix: Render accessory */}
        {renderAccessory()}
        
        {/* Arms */}
        <path d="M 20 65 Q 5 70 20 80" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 80 65 Q 95 70 80 80" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        
        {/* Feet */}
        <path d="M 35 98 Q 30 105 25 98" stroke="#1e293b" strokeWidth="2.5" fill={characterColor} />
        <path d="M 65 98 Q 70 105 75 98" stroke="#1e293b" strokeWidth="2.5" fill={characterColor} />
      </g>
    </svg>
  );
};

export default CharacterDisplay;
