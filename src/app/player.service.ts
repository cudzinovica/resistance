import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerId: number;

  constructor() { }

  getPlayerId(): number {
    return this.playerId;
  }

  addPlayer(playerId: number): void {
    this.playerId = playerId;
  }
}
