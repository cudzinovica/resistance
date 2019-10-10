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
  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
  ) {}

  createGame(playerName: string): void {
    this.gameService.createGame()
      .subscribe(createdGame => {
        this.joinGame(createdGame.roomCode, playerName);
      });
  }

  joinGame(roomCode: string, playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) { return; }

    this.gameService.connect();

    this.playerService.createPlayer(roomCode, playerName).subscribe(createdPlayer => {
      this.playerService.setPlayerId(createdPlayer._id);

      this.gameService.joinGame(roomCode, createdPlayer._id);

      this.router.navigate(['/game', roomCode]);
    });
  }
}
