import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';
import { Game } from '../models/game';
import { GamePhases } from '../enums/gamephases';
import { Player } from '../models/player';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.css']
})
export class IngameComponent implements OnInit, OnDestroy {
  game: Game;
  playerId: string;
  player: Player;
  currentLeader: Player;

  private gameSub: Subscription;
  private errorMsgSub: Subscription;

  gamePhases = GamePhases;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.playerId = this.playerService.getPlayerId();
    this.gameSub = this.gameService.getThisGame().subscribe( game => {
      this.game = game;
      this.player = game.players.find(player => player._id === this.playerId);
      this.currentLeader = game.players[game.currentLeaderIdx];
    });
    this.errorMsgSub = this.gameService.getErrorMessage().subscribe( errorMsg => alert(errorMsg) );

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.gameService.disconnect();
    this.gameSub.unsubscribe();
    this.errorMsgSub.unsubscribe();
  }

  /** Removes Player from game and routes to home */
  exitGame(): void {
    this.playerService.deletePlayer(this.game._id, this.playerId)
      .subscribe(_ => {
        this.gameService.leaveGame();

        this.gameService.getGame(this.game._id)
          .subscribe(game => {
            if (game.players.length === 0) {
              this.gameService.deleteGame(this.game._id).subscribe();
            }
            this.router.navigate(['']);
          });
      });
  }

  changePlayerId($event: string): void {
    this.playerId = $event;
  }
}
