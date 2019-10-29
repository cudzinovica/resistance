import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';
import { Game } from '../models/game';
import { GamePhases } from '../enums/gamephases';
import { Player } from '../models/player';
import { PhaseChangeStatuses } from '../enums/phaseChangeStatuses';
import { debounceTime } from 'rxjs/operators';

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

  private _phaseChange = new Subject<number>();
  phaseChangeStatus: number;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) { }

  generatePrevRoundMessage(newGame: Game) {
    let phaseChangeStatus: number;
    if (newGame.phase === GamePhases.Selection) {
      if (this.game.phase === GamePhases.Lobby) {
        phaseChangeStatus = PhaseChangeStatuses.LobbyToSelection;
      } else if (this.game.phase === GamePhases.Vote) {
        phaseChangeStatus = PhaseChangeStatuses.VoteToSelection;
      } else if (this.game.phase === GamePhases.Quest) {
        phaseChangeStatus = PhaseChangeStatuses.QuestToSelection;
      }
    } else if (newGame.phase === GamePhases.Vote) {
      if (this.game.phase === GamePhases.Selection) {
        phaseChangeStatus = PhaseChangeStatuses.SelectionToVote;
      }
    } else if (newGame.phase === GamePhases.Quest) {
      if (this.game.phase === GamePhases.Vote) {
        phaseChangeStatus = PhaseChangeStatuses.VoteToQuest;
      }
    }

    if (phaseChangeStatus !== undefined) {
      this._phaseChange.next(phaseChangeStatus);
    }
  }

  ngOnInit() {
    this.playerId = this.playerService.getPlayerId();
    this._phaseChange.subscribe(phaseChangeStatus => this.phaseChangeStatus = phaseChangeStatus);
    this.gameSub = this.gameService.getThisGame().subscribe( newGame => {
      if (this.game) {
        this.generatePrevRoundMessage(newGame);
      }

      this.game = newGame;
      this.player = newGame.players.find(player => player._id === this.playerId);
      this.currentLeader = newGame.players[newGame.currentLeaderIdx];
      this.previousPasses = 0;
      this.previousFails = 0;
      this.currentTeamPlayers = [];
      newGame.currentTeam.forEach(playerId => {
        const player = newGame.players.find(p => p._id === playerId);
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
