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

  currentTeamPlayers: Player[];
  previousPasses: number;
  previousFails: number;

  private gameSub: Subscription;
  private errorMsgSub: Subscription;

  gamePhases = GamePhases;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.playerId = this.playerService.getPlayerId();
    this.gameSub = this.gameService.getThisGame().subscribe( game => {
      this.game = game;
      this.player = game.players.find(player => player._id === this.playerId);
      this.currentLeader = game.players[game.currentLeaderIdx];
      this.previousPasses = 0;
      this.previousFails = 0;
      this.currentTeamPlayers = [];
      game.currentTeam.forEach(playerId => {
        const player = game.players.find(p => p._id === playerId);
        this.currentTeamPlayers.push(player);
        if (player.currentQuest) {
          this.previousPasses++;
        } else {
          this.previousFails++;
        }
      });
    });
    this.errorMsgSub = this.gameService.getErrorMessage().subscribe( errorMsg => alert(errorMsg) );

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.gameService.disconnect();
    this.gameSub.unsubscribe();
    this.errorMsgSub.unsubscribe();
  }

  changePlayerId($event: string): void {
    this.playerId = $event;
  }
}
