import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';
import { Game } from '../models/game';
import { GamePhases } from '../enums/gamephases';
import { Player } from '../models/player';
import { PhaseChangeStatuses } from '../enums/phaseChangeStatuses';
import { ActivatedRoute, Router } from '@angular/router';

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
  gameId: string;

  currentTeamPlayers: Player[];
  previousPasses: number;
  previousFails: number;
  numNotVoted: number;

  private gameSub: Subscription;
  private errorMsgSub: Subscription;
  private kickPlayerSub: Subscription;

  gamePhases = GamePhases;

  private _phaseChange = new Subject<number>();
  phaseChangeStatus: number;

  showJoinGame: boolean;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    this.checkSocketConnected();
  }

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
      this.numNotVoted = 0;
      newGame.players.forEach(player => {
        if (!player.hasVoted) {
          this.numNotVoted++;
        }
      });
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
    this.kickPlayerSub = this.gameService.getKickPlayerSub().subscribe( playerId => {
      if (playerId === this.playerId) {
        this.router.navigate(['']);
      }
    });

    this.route.paramMap.subscribe(params => {
      if (!this.gameService.isConnected()) {
        this.gameId = params.get('gameId');
        this.gameService.getGame(this.gameId).subscribe(game => {
          this.game = game;
          if (!game) {
            alert(`Game with room code ${this.gameId} does not exist`);
            this.router.navigate(['']);
          } else if (!this.playerId) {
            this.showJoinGame = true;
          } else if (!game.players.find(player => player._id === this.playerId)) {
            this.showJoinGame = true;
          } else {
            this.gameService.connect();
            this.gameService.joinGame(this.gameId, this.playerId);
          }
        });
      }
    });

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.gameService.disconnect();
    this.gameSub.unsubscribe();
    this.errorMsgSub.unsubscribe();
  }

  checkSocketConnected(): void {
    if (!this.gameService.isConnected()) {
      this.gameService.getGame(this.gameId).subscribe(game => {
        if (!game) {
          alert(`Game with room code ${this.gameId} does not exist`);

          this.playerService.removePlayerId();
          this.router.navigate(['']);
        } else {
          this.gameService.connect();
          this.gameService.joinGame(this.gameId, this.playerId);
        }
      });
    } else {
      this.gameService.joinGame(this.gameId, this.playerId);
    }
  }

  changePlayerId($event: string): void {
    this.playerId = $event;
  }

  changeShowJoinGame($event: string): void {
    if ($event === 'false') {
      this.showJoinGame = false;
    } else if ($event === 'true') {
      this.showJoinGame = true;
    }
  }
}
