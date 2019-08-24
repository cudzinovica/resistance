import { Team } from './team';

export class Player {
  _id: string;
  name: string;
  loyalty: Team;
  character: number;
  currentVote: boolean;
  hasVoted: boolean;
  currentQuest: boolean;
  hasQuested: boolean;
}
