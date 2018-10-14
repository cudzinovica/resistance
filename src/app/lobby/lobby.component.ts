import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
import { Game } from '../game';
import { PlayerService } from '../player.service';
import { Player } from '../player';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  game: Game;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getGame(0);
  }

  /** Sets game to in progress **/
  startGame(): void {
    this.game.inProgress = true;

    this.gameService.updateGame(this.game)
      .subscribe(_ => {
        this.getGame(0);
      });
  }

  /** Removes Player from game and routes to home **/
  exitGame(): void {
    let playerId = this.playerService.getPlayerId();

    this.game.players.splice(playerId, 1);

    this.gameService.updateGame(this.game)
      .subscribe(_ => {
        this.router.navigate([''])
      });
  }

  /** Get game from database **/
  getGame(id: number): void {
    this.gameService.getGame(id)
      .subscribe(game => {
        this.game = game;
        console.log("lobby:");
        console.log(game);
      });
  }
}
