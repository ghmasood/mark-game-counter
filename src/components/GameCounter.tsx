'use client';

import { suits } from '@/const';
import { useGameStore } from '@/store/useGameStore';
import { RefreshCircle, Setting2 } from 'iconsax-reactjs';
import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './UI';
import Link from 'next/link';

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
    labels,
  } = useGameStore();

  const [newRound, setNewRound] = useState({ WE: 0, YOU: 165 });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedSuit, setSelectedSuit] = useState<
    '♠️' | '♥️' | '♦️' | '♣️' | null
  >(null);

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

    // Check if target setter is trying to score below their target
    if (currentTarget && currentTargetSetter) {
      if (currentTargetSetter === team && value > 0 && value < currentTarget) {
        setValidationError(
          `تیم ${
            currentTargetSetter === 'WE' ? labels.we : labels.you
          } نمی‌تواند کمتر از هدف خود (${currentTarget}) امتیاز بگیرد`
        );
        setNewRound(newScores);
        return;
      }
    }

    // Apply bonus rule: if target setter gets all points (165), they get 330 bonus
    if (currentTargetSetter === team && value === 165) {
      setNewRound(team === 'WE' ? { WE: 330, YOU: 0 } : { WE: 0, YOU: 330 });
      if (validationError) {
        setValidationError(null);
      }
      return;
    }

    setNewRound(newScores);

    // Clear validation error when user is typing
    if (validationError) {
      setValidationError(null);
    }
  };

  const validScoreOptions = getValidScoreOptions();

  return (
    <>
      <div className='fade-in min-h-[calc(100dvh_-_9rem)] bg-gray-50 p-4  max-w-md mx-auto rounded-2xl relative'>
        <div className='mb-2 flex items-center gap-2'>
          <Link href='/settings'>
            <Setting2
              variant='Bulk'
              size='1.75rem'
              className='text-gray-800 hover:rotate-180 transition-transform cursor-pointer duration-1000'
            />
          </Link>
          <RefreshCircle
            onClick={() => setShowDrawer(true)}
            variant='Bulk'
            size='1.75rem'
            className='text-gray-800 hover:rotate-180 active:rotate-180 transition-transform cursor-pointer duration-1000'
          />
        </div>
        {/* Game Status */}
        {gameEnded && (
          <div className='mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-center'>
            <h3 className='text-lg font-bold text-yellow-800 mb-1'>
              🎉 بازی تمام شد! 🎉
            </h3>
            <p className='text-sm text-yellow-700'>
              برنده:{' '}
              <span className='font-bold'>
                {winner === 'WE' ? labels.we : labels.you}
              </span>
            </p>
          </div>
        )}

        {/* Total Scores with Progress Bars */}
        <div className='grid grid-cols-2 gap-3 mb-3'>
          <div className='text-center p-4 bg-blue-50 rounded-lg'>
            <h3 className='text-sm font-semibold text-blue-600 mb-1'>
              {labels.we} (ما)
            </h3>
            <div className='text-3xl font-bold text-blue-600 mb-1'>
              {total.WE.toLocaleString('fa')}
              <span className='text-sm px-1'>
                /{(1100).toLocaleString('fa')}
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 mb-1 overflow-hidden'>
              <div
                className='bg-blue-600 h-2  transition-all duration-300 animate-pulse'
                style={{ width: `${(100 * total.WE) / 1100}%` }}
              ></div>
            </div>
          </div>
          <div className='text-center p-4 bg-red-50 rounded-lg'>
            <h3 className='text-sm font-semibold text-red-600 mb-1'>
              {labels.you} (شما)
            </h3>
            <div className='text-3xl font-bold text-red-600 mb-1'>
              {total.YOU.toLocaleString('fa')}
              <span className='text-sm px-1'>
                /{(1100).toLocaleString('fa')}
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 mb-1 overflow-hidden'>
              <div
                className='bg-red-600 h-2 transition-all duration-300 animate-pulse'
                style={{ width: `${(100 * total.YOU) / 1100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Target Setting */}
        {!gameEnded && !currentTarget && (
          <div className='bg-white p-3 rounded-lg mb-2 shadow-sm'>
            {/* Suit Selection */}
            <div className='mb-2'>
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
              <input
                dir='ltr'
                type='number'
                inputMode='numeric'
                min='85'
                max='165'
                step='5'
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder={`مثال: ${(120).toLocaleString('fa')}`}
                className='w-full px-2 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-black'
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
                className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm'
              >
                برای {labels.we}
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
                className='bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm'
              >
                برای {labels.you}
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
              <span className='text-2xl drop-shadow-sm px-1'>
                {currentSuit}
              </span>
            </div>
            <p className='text-sm text-green-700'>
              برای تیم{' '}
              <span className='font-bold'>
                {currentTargetSetter === 'WE' ? labels.we : labels.you}
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
              <div className='grid grid-cols-3 gap-2'>
                {(
                  [
                    ...validScoreOptions.filter((option) => {
                      if (currentTargetSetter === 'WE') {
                        return (
                          option.WE >= currentTarget &&
                          !(option.WE === 165 && option.YOU === 0)
                        );
                      } else {
                        return (
                          option.YOU >= currentTarget &&
                          !(option.WE === 0 && option.YOU === 165)
                        );
                      }
                    }),
                    currentTargetSetter === 'WE'
                      ? { WE: 0, YOU: 165 }
                      : { WE: 165, YOU: 0 },
                    ,
                  ] as { WE: number; YOU: number }[]
                )
                  .sort((a, b) => {
                    if (currentTargetSetter === 'WE') return a.WE - b.WE;
                    else return a.YOU - b.YOU;
                  })
                  .map((option, index, arr) => (
                    <button
                      key={index}
                      onClick={() => setNewRound(option)}
                      className={`px-2 py-1 text-xs hover:bg-indigo-200 text-indigo-800 bg-indigo-100 rounded-lg border-2 transition-colors   ${
                        index === 0 && '!bg-red-200 text-red-800'
                      }

                    ${
                      index === arr.length - 2 &&
                      '!bg-green-200 text-green-800 '
                    }
                     ${
                       option.WE === newRound.WE
                         ? index == 0
                           ? 'border-red-800'
                           : index === arr.length - 2
                           ? 'border-green-800'
                           : 'border-indigo-800 bg-indigo-200'
                         : 'border-indigo-200 bg-indigo-100'
                     }
                  
                    `}
                    >
                      ما: {option.WE.toLocaleString('fa')} <br />
                      شما: {option.YOU.toLocaleString('fa')}
                    </button>
                  ))}
              </div>
            </div>

            {/* <div className='grid grid-cols-2 gap-3 mb-3'>
            <div>
              <label className='block text-xs font-medium text-blue-500 mb-1'>
                {labels.we}:
                {currentTarget && currentTargetSetter === 'WE' && (
                  <span className='text-xs text-gray-500 ml-1'>
                    (۰ یا حداقل: {currentTarget.toLocaleString('fa')})
                  </span>
                )}
              </label>
              <input
                dir='ltr'
                type='number'
                inputMode='numeric'
                min={currentTarget && currentTargetSetter === 'WE' ? 0 : 5}
                max='330'
                step='5'
                value={newRound.WE}
                onChange={(e) =>
                  handleScoreChange('WE', parseInt(e.target.value) || 0)
                }
                className='w-full text-black  px-2 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-red-500 mb-1'>
                {labels.you}:
                {currentTarget && currentTargetSetter === 'YOU' && (
                  <span className='text-xs text-gray-500 ml-1'>
                    (۰ یا حداقل: {currentTarget.toLocaleString('fa')})
                  </span>
                )}
              </label>
              <input
                dir='ltr'
                type='number'
                inputMode='numeric'
                min={currentTarget && currentTargetSetter === 'YOU' ? 0 : 5}
                max='330'
                step='5'
                value={newRound.YOU}
                onChange={(e) =>
                  handleScoreChange('YOU', parseInt(e.target.value) || 0)
                }
                className='w-full text-black  px-2 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
              />
            </div>
          </div> */}

            {validationError && (
              <div className='mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs'>
                {validationError}
              </div>
            )}

            <button
              onClick={handleAddRound}
              disabled={
                newRound.WE + newRound.YOU !== 165 &&
                newRound.WE + newRound.YOU !== 330
              }
              className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm'
            >
              افزودن دست
            </button>
          </div>
        )}

        {/* Rounds History */}
        <div className='mb-1'>
          <h3 className='text-xs font-semibold mb-1 text-gray-600'>
            تاریخچه دست‌ها
          </h3>
          {rounds.length === 0 ? (
            <p className='text-gray-500 text-center py-1 text-sm'>
              هنوز دستی اضافه نشده
            </p>
          ) : (
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between gap-1 p-1 bg-white rounded-lg shadow-sm'>
                <div className='flex items-center py-1 w-full'>
                  <div className='flex justify-between px-4 font-bold w-full'>
                    <div className='flex items-center'>
                      <span className='text-blue-600 '>{labels.we}</span>
                    </div>

                    <div className='flex items-center'>
                      <span className='text-red-600'>{labels.you}</span>
                    </div>
                  </div>
                </div>
              </div>
              {rounds.map((round, index) => (
                <div
                  key={round.id}
                  className='flex items-center justify-between gap-1 p-1 bg-white rounded-lg shadow-sm'
                >
                  <div className='flex items-center py-1 w-full'>
                    <span className='text-xs ps-1 font-medium text-gray-600'>
                      {(index + 1).toLocaleString('fa')}.
                    </span>

                    <div className='flex px-4 w-full relative'>
                      <div className='flex items-center basis-0'>
                        <span className='text-blue-600 '>
                          {round.WE.toLocaleString('fa')}
                        </span>
                      </div>

                      <div className='text-sm text-gray-500 flex gap-2 items-center absolute start-1/2 translate-x-[2rem] top-1/2 -translate-y-1/2'>
                        <span>{round.suit}</span>
                        <span>{round.target.toLocaleString('fa')}</span>
                        <span>
                          {round.targetSetter === 'WE' ? labels.we : labels.you}
                        </span>
                      </div>

                      <div className='flex items-center  justify-end basis-full'>
                        <span className='text-red-600'>
                          {round.YOU.toLocaleString('fa')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <button
                  onClick={() => handleDeleteRound(round.id)}
                  className='text-red-500 hover:text-red-700 text-3xl cursor-pointer font-bold px-3'
                  disabled={gameEnded}
                >
                  ×
                </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
        <DrawerContent className='bg-white text-gray-600'>
          <DrawerHeader>
            <DrawerTitle className='text-gray-600 font-bold'>
              آیا مطمئنید می‌خواهید بازی را ریست کنید؟
            </DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <div className='flex gap-2 items-center justify-center'>
              <button
                className='border w-1/2 border-red-400 cursor-pointer bg-red-600 text-white font-bold py-1 px-4 rounded-lg transition-colors text-sm'
                onClick={() => {
                  resetScores();
                  setShowDrawer(false);
                }}
              >
                بله
              </button>
              <button
                className='border w-1/2 border-gray-400 cursor-pointer hover:bg-gray-600 text-gray-400 hover:text-white font-bold py-1 px-4 rounded-lg transition-colors text-sm'
                onClick={() => setShowDrawer(false)}
              >
                خیر
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
