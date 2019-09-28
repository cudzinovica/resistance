import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { Player } from '../models/player';
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
    private route: ActivatedRoute
  ) {}

  createGame(playerName: string): void {
    this.gameService.createGame()
      .subscribe(createdGame => {
        this.joinGame(createdGame._id, playerName);
      });
  }

  joinGame(gameId: string, playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) { return; }

    this.playerService.createPlayer(gameId, playerName).subscribe(createdPlayer => {
      this.playerService.setMyPlayerId(createdPlayer._id);
      console.log(createdPlayer);

      this.gameService.joinGame(gameId);

      this.router.navigate(['/game', gameId]);
    });
  }
}
