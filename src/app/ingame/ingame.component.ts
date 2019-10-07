import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';
import { Game } from '../models/game';
import { GamePhases } from '../enums/gamephases';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.css']
})
export class IngameComponent implements OnInit, OnDestroy {
  game: Game;

  private gameSub: Subscription;
  private errorMsgSub: Subscription;
  private playerIdSub: Subscription;

  gamePhases = GamePhases;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const gameId = params.get('gameId');
      if (!this.game) {
        this.gameService.joinGame(gameId);
      }
    });
    this.gameSub = this.gameService.getThisGame().subscribe( game => this.game = game );
    this.errorMsgSub = this.gameService.getErrorMessage().subscribe( errorMsg => alert(errorMsg) );
  }

  ngOnDestroy() {
    this.gameSub.unsubscribe();
    this.errorMsgSub.unsubscribe();
  }
}
