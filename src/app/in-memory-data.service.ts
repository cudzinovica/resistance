import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Game } from './game';
import { GamePhases } from './gamephases'
import { Team } from './team'

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const games = [];
    return {games};
  }
}