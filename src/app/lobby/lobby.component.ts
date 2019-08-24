import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
import { Game } from '../game';
import { PlayerService } from '../player.service';
import { Player } from '../player';
import { GamePhases } from '../gamephases';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  gameId: string;
  playerId: string;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.gameId = this.gameService.getMyGameId();
    this.playerId = this.playerService.getMyPlayerId();
  }

  /** Sets game to in progress **/
  startGame(): void {
    const game = new Game();

    game.phase = GamePhases.Selection;

    this.gameService.updateGame(game)
      .subscribe(updatedGame => {
        console.log(updatedGame);
      });
  }

  /** Removes Player from game and routes to home **/
  exitGame(): void {
    this.playerService.deletePlayer(this.gameId, this.playerId)
      .subscribe(_ => {
        this.gameService.getGame(this.gameId)
          .subscribe(game => {
            if (game.players.length === 0) {
              this.gameService.deleteGame(this.gameId).subscribe();
            }
            this.router.navigate(['']);
          })
      });
  }
}
