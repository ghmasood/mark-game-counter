# Zustand Store Configuration

This directory contains the Zustand store configuration for the Mark Game Counter application with team-based scoring and specific game rules.

## Files

- `useGameStore.ts` - Main store with persistence middleware for team scoring

## Game Rules

### Scoring System

- **Max score per round**: 165 points (divided between 2 teams)
- **Valid score combinations**: (0,165), (5,160), (10,155), (15,150), etc.
- **Score increments**: Steps of 5 points
- **Winning condition**: First team to reach 1100 points wins
- **Unlimited rounds**: No limit on number of rounds

### Validation Rules

- Each round must total exactly 165 points
- All scores must be multiples of 5
- Scores cannot be negative
- Game ends when either team reaches 1100 points

## Store Features

### State Management

- **rounds**: Array of round scores with unique IDs
- **total**: Cumulative scores for both teams
  - `WE`: Total score for WE team
  - `YOU`: Total score for YOU team
- **gameEnded**: Boolean indicating if game is over
- **winner**: Winning team ('WE' | 'YOU' | null)

### Data Structure

```typescript
interface RoundScore {
  id: string; // Unique ID for each round
  WE: number; // WE team score for this round
  YOU: number; // YOU team score for this round
}
```

### Actions

- `addRound(scores: { WE: number; YOU: number })`: Add a new round with validated scores
- `updateRound(id: string, team: 'WE' | 'YOU', score: number)`: Update a specific team's score in a round
- `resetScores()`: Reset all rounds, totals, and game state
- `validateRoundScore(we: number, you: number)`: Validate score combination
- `getValidScoreOptions()`: Get all valid score combinations

### Persistence

- Uses `localStorage` for data persistence
- Automatically saves all rounds, totals, and game state
- Restores complete game state on page reload
- Storage key: `'game-scores-storage'`

## Usage Example

```tsx
import { useGameStore } from '@/store/useGameStore';

function MyComponent() {
  const { rounds, total, gameEnded, winner, addRound, validateRoundScore } =
    useGameStore();

  const handleNewRound = () => {
    // Valid score combination
    addRound({ WE: 80, YOU: 85 });
  };

  const checkValidation = () => {
    const result = validateRoundScore(80, 85);
    if (result.isValid) {
      console.log('Valid score combination');
    } else {
      console.log('Invalid:', result.error);
    }
  };

  return (
    <div>
      <p>WE Total: {total.WE}/1100</p>
      <p>YOU Total: {total.YOU}/1100</p>
      {gameEnded && <p>Winner: {winner}</p>}
    </div>
  );
}
```

## Key Features

### Automatic Validation

- Scores are validated before being added to the game
- Invalid scores are rejected with error messages
- Automatic total calculation with validation

### Game State Management

- Tracks game end condition (1100 points)
- Identifies winning team automatically
- Prevents further rounds after game ends

### Score Constraints

- Enforces 165-point total per round
- Ensures 5-point increments
- Provides quick-select options for valid combinations

### Round Management

- Each round gets a unique ID using `nanoid`
- Rounds can be updated with validation
- Complete round history is maintained

## Customization

To extend the store:

1. Add new fields to the `ScoresState` interface
2. Implement new actions in the store
3. Update the `partialize` function if you want to persist new fields
4. Consider adding new validation rules

## Storage Configuration

The store uses Zustand's `persist` middleware with:

- Storage key: `'game-scores-storage'`
- Storage method: `localStorage`
- Complete state persistence (rounds + totals + game state)
- Automatic state restoration on page load
