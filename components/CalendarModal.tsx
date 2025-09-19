import React, { useState, useMemo } from 'react';
import CharacterDisplay from './CharacterDisplay';
// Fix: Import character type
import { Character } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Expect the whole character object instead of just clearedDates.
  character: Character;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, character }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const { blanks, days } = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    
    return {
      blanks: Array(startingDayOfWeek).fill(null),
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    };
  }, [year, month]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-title"
    >
      <div 
        className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg text-white border-4 border-white/50 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-white/20 transition-colors">&lt;</button>
          <h2 id="calendar-title" className="text-3xl font-bold">{`${year}ねん ${month + 1}がつ`}</h2>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-white/20 transition-colors">&gt;</button>
          <button onClick={onClose} className="absolute top-4 right-4 text-3xl hover:text-yellow-300 transition-colors">&times;</button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center font-bold mb-3">
          {['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'].map(day => (
            <div key={day} className="text-yellow-300">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            // Fix: Use clearedDates from the character object.
            const isCleared = character.clearedDates.includes(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div 
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg transition-colors ${isToday ? 'bg-yellow-400/50' : ''}`}
              >
                <div className={`w-full h-full flex items-center justify-center rounded-lg ${isCleared ? 'bg-white/20' : ''}`}>
                    {isCleared ? (
                        <div className="w-4/5 h-4/5">
                           {/* Fix: Pass the character object to CharacterDisplay. */}
                           <CharacterDisplay character={character} isHappy={true} />
                        </div>
                    ) : (
                        <span className={isToday ? 'font-bold text-slate-800' : ''}>{day}</span>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
