import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Game } from '../game';
import { GameService } from '../game.service';
import { Player } from '../player';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  playerId: string;
  gameId: string;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  }

  createGame(playerName: string): void {
    this.gameService.createGame()
      .subscribe(createdGame => {
        this.joinGame(createdGame._id, playerName);
      });
  }

  joinGame(gameId: string, playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) { return; }

    this.gameService.setMyGameId(gameId);

    this.playerService.createPlayer(gameId, playerName)
      .subscribe(createdPlayer => {
        this.playerService.setMyPlayerId(createdPlayer._id);
        console.log(createdPlayer);
        this.router.navigate(['/game', gameId]);
      });
  }
}
