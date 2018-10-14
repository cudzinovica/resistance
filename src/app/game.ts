import { GamePhases } from './gamephases';
import { Team } from './team';
import { Player } from './player';

export class Game {
  id: number;
  inProgress: boolean;
  phase: GamePhases;
  winner: Team;
  currentRound: number;
  roundWinners: Team[];
  currentLeader: number;
  players: Player[];
}