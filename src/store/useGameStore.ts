import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';

type Team = 'WE' | 'YOU';
type Suit = '♠️' | '♥️' | '♦️' | '♣️';

interface RoundScore {
  id: string; // unique id برای هر دست
  WE: number;
  YOU: number;
  target: number; // هدف تعیین شده در ابتدای دست
  targetSetter: Team; // تیمی که هدف را تعیین کرده
  suit: Suit; // خال انتخاب شده
}

interface ScoresState {
  rounds: RoundScore[];
  total: {
    WE: number;
    YOU: number;
  };
  gameEnded: boolean;
  winner: Team | null;
  currentTarget: number | null; // هدف فعلی برای دست جدید
  currentTargetSetter: Team | null; // تیمی که هدف فعلی را تعیین کرده
  currentSuit: Suit | null; // خال فعلی برای دست جدید
  addRound: (scores: { WE: number; YOU: number }) => void;
  updateRound: (id: string, team: Team, score: number) => void;
  deleteRound: (id: string) => void;
  resetScores: () => void;
  setTarget: (target: number, team: Team, suit: Suit) => void;
  validateRoundScore: (
    we: number,
    you: number
  ) => { isValid: boolean; error?: string };
  getValidScoreOptions: () => Array<{ WE: number; YOU: number }>;
}

// Game constants
const MAX_ROUND_SCORE = 165;
const MIN_TARGET = 85;
const WINNING_SCORE = 1100;
const SCORE_STEP = 5;

export const useGameStore = create<ScoresState>()(
  persist(
    (set, get) => ({
      rounds: [],
      total: { WE: 0, YOU: 0 },
      gameEnded: false,
      winner: null,
      currentTarget: null,
      currentTargetSetter: null,
      currentSuit: null,

      setTarget: (target: number, team: Team, suit: Suit) => {
        if (
          target >= MIN_TARGET &&
          target <= MAX_ROUND_SCORE &&
          target % SCORE_STEP === 0
        ) {
          set({
            currentTarget: target,
            currentTargetSetter: team,
            currentSuit: suit,
          });
        }
      },

      validateRoundScore: (we: number, you: number) => {
        // Check if scores are multiples of 5
        if (we % SCORE_STEP !== 0 || you % SCORE_STEP !== 0) {
          return {
            isValid: false,
            error: `امتیازات باید مضرب ${SCORE_STEP} باشند`,
          };
        }

        // Check if total round score equals MAX_ROUND_SCORE
        if (we + you !== MAX_ROUND_SCORE) {
          return {
            isValid: false,
            error: `مجموع امتیاز دست باید ${MAX_ROUND_SCORE} باشد (فعلی: ${
              we + you
            })`,
          };
        }

        // Check if scores are non-negative
        if (we < 0 || you < 0) {
          return { isValid: false, error: 'امتیازات نمی‌توانند منفی باشند' };
        }

        // Check if target setter's score meets their target
        const state = get();
        if (state.currentTarget && state.currentTargetSetter) {
          if (
            state.currentTargetSetter === 'WE' &&
            we > 0 &&
            we < state.currentTarget
          ) {
            return {
              isValid: false,
              error: `تیم ما نمی‌تواند کمتر از هدف خود (${state.currentTarget}) امتیاز بگیرد`,
            };
          } else if (
            state.currentTargetSetter === 'YOU' &&
            you > 0 &&
            you < state.currentTarget
          ) {
            return {
              isValid: false,
              error: `تیم شما نمی‌تواند کمتر از هدف خود (${state.currentTarget}) امتیاز بگیرد`,
            };
          }
        }

        return { isValid: true };
      },

      getValidScoreOptions: () => {
        const options: Array<{ WE: number; YOU: number }> = [];
        const state = get();

        for (let we = 0; we <= MAX_ROUND_SCORE; we += SCORE_STEP) {
          const you = MAX_ROUND_SCORE - we;

          // Filter out options where target setter scores below their target
          if (state.currentTarget && state.currentTargetSetter) {
            if (
              state.currentTargetSetter === 'WE' &&
              we > 0 &&
              we < state.currentTarget
            ) {
              continue; // Skip this option
            } else if (
              state.currentTargetSetter === 'YOU' &&
              you > 0 &&
              you < state.currentTarget
            ) {
              continue; // Skip this option
            }
          }

          options.push({ WE: we, YOU: you });
        }
        return options;
      },

      addRound: (scores) =>
        set((state) => {
          // Validate the round score
          const validation = get().validateRoundScore(scores.WE, scores.YOU);
          if (!validation.isValid) {
            console.error('Invalid round score:', validation.error);
            return state; // Don't update state if invalid
          }

          // Check if target and suit are set
          if (
            !state.currentTarget ||
            !state.currentTargetSetter ||
            !state.currentSuit
          ) {
            console.error('Target and suit must be set before adding round');
            return state;
          }

          const round: RoundScore = {
            id: nanoid(),
            ...scores,
            target: state.currentTarget,
            targetSetter: state.currentTargetSetter,
            suit: state.currentSuit,
          };

          const newTotal = {
            WE: state.total.WE + scores.WE,
            YOU: state.total.YOU + scores.YOU,
          };

          // Check if game has ended
          let gameEnded = state.gameEnded;
          let winner: Team | null = state.winner;

          if (!gameEnded) {
            if (newTotal.WE >= WINNING_SCORE) {
              gameEnded = true;
              winner = 'WE';
            } else if (newTotal.YOU >= WINNING_SCORE) {
              gameEnded = true;
              winner = 'YOU';
            }
          }

          return {
            rounds: [...state.rounds, round],
            total: newTotal,
            gameEnded,
            winner,
            currentTarget: null, // Reset target for next round
            currentTargetSetter: null,
            currentSuit: null,
          };
        }),

      updateRound: (id, team, score) =>
        set((state) => {
          const rounds = state.rounds.map((r) => {
            if (r.id === id) {
              const newRound = { ...r, [team]: score };

              // Validate the updated round
              const validation = get().validateRoundScore(
                newRound.WE,
                newRound.YOU
              );
              if (!validation.isValid) {
                console.error('Invalid round score:', validation.error);
                return r; // Don't update if invalid
              }

              return newRound;
            }
            return r;
          });

          // Recalculate totals
          const total = rounds.reduce(
            (acc, r) => ({
              WE: acc.WE + r.WE,
              YOU: acc.YOU + r.YOU,
            }),
            { WE: 0, YOU: 0 }
          );

          // Check if game has ended
          let gameEnded = state.gameEnded;
          let winner: Team | null = state.winner;

          if (!gameEnded) {
            if (total.WE >= WINNING_SCORE) {
              gameEnded = true;
              winner = 'WE';
            } else if (total.YOU >= WINNING_SCORE) {
              gameEnded = true;
              winner = 'YOU';
            }
          }

          return { rounds, total, gameEnded, winner };
        }),

      deleteRound: (id) =>
        set((state) => {
          const updatedRounds = state.rounds.filter((round) => round.id !== id);

          // Recalculate totals
          const total = updatedRounds.reduce(
            (acc, r) => ({
              WE: acc.WE + r.WE,
              YOU: acc.YOU + r.YOU,
            }),
            { WE: 0, YOU: 0 }
          );

          // Check if game has ended
          let gameEnded = state.gameEnded;
          let winner: Team | null = state.winner;

          if (!gameEnded) {
            if (total.WE >= WINNING_SCORE) {
              gameEnded = true;
              winner = 'WE';
            } else if (total.YOU >= WINNING_SCORE) {
              gameEnded = true;
              winner = 'YOU';
            }
          }

          return { rounds: updatedRounds, total, gameEnded, winner };
        }),

      resetScores: () =>
        set({
          rounds: [],
          total: { WE: 0, YOU: 0 },
          gameEnded: false,
          winner: null,
          currentTarget: null,
          currentTargetSetter: null,
          currentSuit: null,
        }),
    }),
    {
      name: 'game-scores-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rounds: state.rounds,
        total: state.total,
        gameEnded: state.gameEnded,
        winner: state.winner,
        currentTarget: state.currentTarget,
        currentTargetSetter: state.currentTargetSetter,
        currentSuit: state.currentSuit,
      }),
    }
  )
);
