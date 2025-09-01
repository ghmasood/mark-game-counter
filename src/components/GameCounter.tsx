'use client';

import { useGameStore } from '@/store/useGameStore';
import { useState } from 'react';

export default function GameCounter() {
  const {
    rounds,
    total,
    gameEnded,
    winner,
    currentTarget,
    currentTargetSetter,
    currentSuit,
    addRound,
    deleteRound,
    setTarget,
    resetScores,
    validateRoundScore,
    getValidScoreOptions,
  } = useGameStore();

  const [newRound, setNewRound] = useState({ WE: 0, YOU: 165 });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState('');
  const [selectedSuit, setSelectedSuit] = useState<
    '♠️' | '♥️' | '♦️' | '♣️' | null
  >(null);

  const suits = [
    { emoji: '♠️', name: 'پیک' },
    { emoji: '♥️', name: 'دل' },
    { emoji: '♣️', name: 'گشنیز' },
    { emoji: '♦️', name: 'خشت' },
  ];

  const handleAddRound = () => {
    const validation = validateRoundScore(newRound.WE, newRound.YOU);
    if (validation.isValid) {
      addRound(newRound);
      setNewRound({ WE: 0, YOU: 165 });
      setValidationError(null);
    } else {
      setValidationError(validation.error || 'ترکیب امتیاز نامعتبر است');
    }
  };

  const handleSetTarget = (team: 'WE' | 'YOU') => {
    const target = parseInt(targetInput);
    if (target >= 85 && target <= 165 && target % 5 === 0 && selectedSuit) {
      setTarget(target, team, selectedSuit);
      setTargetInput('');
      setSelectedSuit(null);
    }
  };

  const handleDeleteRound = (id: string) => {
    deleteRound(id);
  };

  const handleScoreChange = (team: 'WE' | 'YOU', value: number) => {
    const otherTeam = team === 'WE' ? 'YOU' : 'WE';
    const newScores = { ...newRound, [team]: value, [otherTeam]: 165 - value };

    setNewRound(newScores);

    // Clear validation error when user is typing
    if (validationError) {
      setValidationError(null);
    }
  };

  const getProgressPercentage = (score: number) => {
    return Math.min((score / 1100) * 100, 100);
  };

  const validScoreOptions = getValidScoreOptions();

  return (
    <div className='-min-h-[calc(100dvh_-_5.5rem)] h-full bg-gray-50 p-4  max-w-md mx-auto rounded-2xl relative'>
      {/* Game Status */}
      {gameEnded && (
        <div className='mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-center'>
          <h3 className='text-lg font-bold text-yellow-800 mb-1'>
            🎉 بازی تمام شد! 🎉
          </h3>
          <p className='text-sm text-yellow-700'>
            برنده:{' '}
            <span className='font-bold'>{winner === 'WE' ? 'ما' : 'شما'}</span>
          </p>
        </div>
      )}

      {/* Total Scores with Progress Bars */}
      <div className='grid grid-cols-2 gap-3 mb-3'>
        <div className='text-center p-4 bg-blue-50 rounded-lg'>
          <h3 className='text-sm font-semibold text-blue-800 mb-1'>ما</h3>
          <div className='text-3xl font-bold text-blue-600 mb-1'>
            {total.WE.toLocaleString('fa')}
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 mb-1'>
            <div
              className='bg-blue-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${getProgressPercentage(total.WE)}%` }}
            ></div>
          </div>
        </div>
        <div className='text-center p-4 bg-red-50 rounded-lg'>
          <h3 className='text-sm font-semibold text-red-800 mb-1'>شما</h3>
          <div className='text-3xl font-bold text-red-600 mb-1'>
            {total.YOU.toLocaleString('fa')}
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 mb-1'>
            <div
              className='bg-red-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${getProgressPercentage(total.YOU)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Target Setting */}
      {!gameEnded && !currentTarget && (
        <div className='bg-white p-3 rounded-lg mb-2 shadow-sm'>
          {/* Suit Selection */}
          <div className='mb-2'>
            <label className='block text-xs font-medium text-gray-700 mb-2'>
              انتخاب خال:
            </label>
            <div className='grid grid-cols-4 gap-2'>
              {suits.map((suit) => (
                <button
                  key={suit.emoji}
                  onClick={() =>
                    setSelectedSuit(suit.emoji as '♠️' | '♥️' | '♦️' | '♣️')
                  }
                  className={`p-1 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                    selectedSuit === suit.emoji
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className='text-xl drop-shadow-sm'>{suit.emoji}</div>
                  <div className='text-xs font-medium text-gray-700'>
                    {suit.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Input */}
          <div className='mb-3'>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              هدف:
            </label>
            <input
              type='number'
              min='85'
              max='165'
              step='5'
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder={`مثال: ${(120).toLocaleString('fa')}`}
              className='w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-black'
            />
          </div>

          {/* Team Buttons */}
          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={() => handleSetTarget('WE')}
              disabled={
                !targetInput ||
                !selectedSuit ||
                parseInt(targetInput) < 85 ||
                parseInt(targetInput) > 165 ||
                parseInt(targetInput) % 5 !== 0
              }
              className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-1 px-4 rounded transition-colors text-sm'
            >
              ما تعیین می‌کنیم
            </button>
            <button
              onClick={() => handleSetTarget('YOU')}
              disabled={
                !targetInput ||
                !selectedSuit ||
                parseInt(targetInput) < 85 ||
                parseInt(targetInput) > 165 ||
                parseInt(targetInput) % 5 !== 0
              }
              className='bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-1 px-4 rounded transition-colors text-sm'
            >
              شما تعیین می‌کنید
            </button>
          </div>
        </div>
      )}

      {/* Current Target Display */}
      {!gameEnded && currentTarget && currentSuit && (
        <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg mb-4 text-center border border-green-200 shadow-sm'>
          <div className='flex items-center justify-center space-x-2 space-x-reverse mb-2'>
            <span className='text-lg font-bold text-green-800'>
              هدف: {currentTarget.toLocaleString('fa')}
            </span>
            <span className='text-2xl drop-shadow-sm px-1'>{currentSuit}</span>
          </div>
          <p className='text-sm text-green-700'>
            توسط{' '}
            <span className='font-bold'>
              {currentTargetSetter === 'WE' ? 'ما' : 'شما'}
            </span>
          </p>
        </div>
      )}

      {/* Add New Round */}
      {!gameEnded && currentTarget && currentSuit && (
        <div className='bg-white p-4 rounded-lg mb-6 shadow-sm'>
          {/* Quick Score Options */}
          <div className='mb-3'>
            <p className='text-xs text-gray-600 mb-2'>انتخاب سریع:</p>
            <div className='grid grid-cols-3 gap-1'>
              {validScoreOptions
                .filter((option) => {
                  if (currentTargetSetter === 'WE') {
                    return option.WE >= currentTarget || option.WE === 0;
                  } else {
                    return option.YOU >= currentTarget || option.YOU === 0;
                  }
                })
                .map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setNewRound(option)}
                    className='px-2 py-1 text-xs bg-violet-100 hover:bg-violet-200 text-violet-800 rounded border'
                  >
                    ما:
                    {option.WE} شما:
                    {option.YOU}
                  </button>
                ))}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div>
              <label className='block text-xs font-medium text-blue-500 mb-1'>
                ما
              </label>
              <input
                type='number'
                min='0'
                max='165'
                step='5'
                value={newRound.WE}
                onChange={(e) =>
                  handleScoreChange('WE', parseInt(e.target.value) || 0)
                }
                className='w-full text-black px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-red-500 mb-1'>
                شما
              </label>
              <input
                type='number'
                min='0'
                max='165'
                step='5'
                value={newRound.YOU}
                onChange={(e) =>
                  handleScoreChange('YOU', parseInt(e.target.value) || 0)
                }
                className='w-full text-black px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
              />
            </div>
          </div>

          {validationError && (
            <div className='mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs'>
              {validationError}
            </div>
          )}

          <button
            onClick={handleAddRound}
            disabled={newRound.WE + newRound.YOU !== 165}
            className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded transition-colors text-sm'
          >
            افزودن دست
          </button>
        </div>
      )}

      {/* Rounds History */}
      <div className='mb-1'>
        <h3 className='text-xs font-semibold mb-1 text-black'>
          تاریخچه دست‌ها
        </h3>
        {rounds.length === 0 ? (
          <p className='text-gray-500 text-center py-1 text-sm'>
            هنوز دستی اضافه نشده
          </p>
        ) : (
          <div className='flex flex-col gap-2'>
            {[...rounds].reverse().map((round, index) => (
              <div
                key={round.id}
                className='flex items-center justify-between gap-1 p-1 bg-white rounded-lg shadow-sm'
              >
                <div className='flex items-center space-x-3 space-x-reverse'>
                  <span className='text-xs px-1 font-medium text-gray-600'>
                    {index + 1}
                  </span>
                  <div className='flex flex-col px-4'>
                    <div className='text-xs text-gray-500 flex gap-2 items-center'>
                      {round.target.toLocaleString('fa')}
                      <span className='inline-flex items-center justify-center  rounded-full text-sm'>
                        {round.suit}
                      </span>
                      ({round.targetSetter === 'WE' ? 'ما' : 'شما'})
                    </div>
                    <div className='flex gap-2'>
                      <div className='flex items-center'>
                        <span className='text-blue-600  text-xs'>ما:</span>
                        <span className='text-blue-600  text-sm'>
                          {round.WE.toLocaleString('fa')}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <span className='text-red-600 text-xs'>شما:</span>
                        <span className='text-red-600 text-sm'>
                          {round.YOU.toLocaleString('fa')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRound(round.id)}
                  className='text-red-500 hover:text-red-700 text-3xl cursor-pointer font-bold px-3'
                  disabled={gameEnded}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className='text-center my-3'>
        <button
          onClick={resetScores}
          className='border border-red-400 cursor-pointer hover:bg-red-600 text-red-400 hover:text-white font-bold py-1 px-4 rounded transition-colors text-sm'
        >
          شروع مجدد
        </button>
      </div>
    </div>
  );
}
