import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  creatingGame: boolean;
  joiningGame: boolean;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
  ) {}

  createGame(playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) {
      alert('Enter your name!');
      return;
    }
    this.gameService.createGame()
      .subscribe(createdGame => {
        this.joinGame(createdGame.roomCode, playerName);
      });
  }

  joinGame(roomCode: string, playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) {
      alert('Enter your name!');
      return;
    }
    if (!roomCode) {
      alert('Enter room code!');
      return;
    }

    this.gameService.getGame(roomCode).subscribe(game => {
      if (!game) {
        alert(`Game with room code ${roomCode} does not exist`);
      }
    });

    this.playerService.createPlayer(roomCode, playerName).subscribe(createdPlayer => {
      this.playerService.setPlayerId(createdPlayer._id);

      this.router.navigate([roomCode]);
    });
  }
}
