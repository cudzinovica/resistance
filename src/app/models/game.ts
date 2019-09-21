import { GamePhases } from '../enums/gamephases';
import { Team } from '../enums/team';
import { Player } from './player';

export class Game {
  _id: string;
  phase: GamePhases;
  players: Player[];
  currentLeaderIdx: number;
  missionResults: boolean[];
  failedVotes: number;
  currentRound: number;
  currentTeam: Player[];
  winningTeam: Team;
}
