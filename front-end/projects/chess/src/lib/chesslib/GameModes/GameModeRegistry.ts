import { GameMode } from "../GameMode";
import { DoubleMove } from "./DoubleMove";
import { RandomAtomic } from "./RandomAtomic";
import { War } from "./War";

export interface GameModeDescription {
  displayName: string;
  description: string;
  id?: number;
  buildNewGameMode: () => GameMode;
}

const allGameModeDescriptions: GameModeDescription[] = [
  {
    displayName: "Double Move",
    description: "Description text here",
    buildNewGameMode: () => new DoubleMove(),
  },
  {
    displayName: "Random Atomic",
    description: "Description text here",
    buildNewGameMode: () => new RandomAtomic(),
  },
  {
    displayName: "War",
    description: "Description text here",
    buildNewGameMode: () => new War(),
  },
];

export const getGameModeDescriptions = (): GameModeDescription[] => {
  for (let i = 0; i < allGameModeDescriptions.length; i++) {
    allGameModeDescriptions[i].id = i;
  }
  return allGameModeDescriptions;
};

export const getGameModeById = (id: number): GameMode => {
  return allGameModeDescriptions[id].buildNewGameMode();
};
