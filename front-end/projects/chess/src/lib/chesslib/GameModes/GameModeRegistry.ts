import { GameMode } from "../GameMode";
import { DoubleMove } from "./DoubleMove";
import { RandomAtomic } from "./RandomAtomic";
import { QChess } from "./QChess";
import { War } from "./War";

export interface GameModeDescription {
  displayName: string;
  description: string;
  id?: number;
  gameMode: typeof GameMode;
}

const allGameModeDescriptions: GameModeDescription[] = [
  {
    displayName: "Double Move",
    description:
      "Instead of the normal 1 move per turn, each player gets 2 moves per turn!",
    gameMode: DoubleMove,
  },
  {
    displayName: "Random Atomic",
    description:
      "Each player has one secret atomic piece. If this piece gets taken/takes another piece, then all 8 adjacent pieces also get destroyed!",
    gameMode: RandomAtomic,
  },
  {
    displayName: "War",
    description: "Every 10 turns the board gets bigger!",
    gameMode: War,
  },
  // Disabled until we fix game state stuff
  // {
  //   displayName: "Q Chess",
  //   description:
  //     "Instead of turns, each player queues up 3 moves. The game will then play those moves out 1 by 1.",
  //   gameMode: QChess,
  // },
];

export const getGameModeDescriptions = (): GameModeDescription[] => {
  for (let i = 0; i < allGameModeDescriptions.length; i++) {
    allGameModeDescriptions[i].id = i;
  }
  return allGameModeDescriptions;
};

export const getGameModeById = (id: number): typeof GameMode => {
  return allGameModeDescriptions[id].gameMode;
};
