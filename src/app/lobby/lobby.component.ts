import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GameService } from '../services/game.service';
import { Game } from '../models/game';
import { PlayerService } from '../services/player.service';
import { Player } from '../models/player';
import { GamePhases } from '../enums/gamephases';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  @Input() game: Game;

  playerId: string;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.playerId = this.playerService.getMyPlayerId();
  }

  /** Sets game to in progress **/
  startGame(): void {
    this.gameService.getGame(this.game._id)
      .subscribe(game => {
        game.phase = GamePhases.Selection;
        this.gameService.updateGame(game)
          .subscribe(game => {
            console.log(game);
          });
      });
  }

  /** Removes Player from game and routes to home **/
  exitGame(): void {
    this.playerService.deletePlayer(this.game._id, this.playerId)
      .subscribe(_ => {
        this.gameService.leaveGame(this.game._id);

        this.gameService.getGame(this.game._id)
          .subscribe(game => {
            if (game.players.length === 0) {
              this.gameService.deleteGame(this.game._id).subscribe();
            }
            this.router.navigate(['']);
          });
      });
  }
}
