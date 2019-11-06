import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string;
  @Input() gameId: string;
  @Output() playerIdChange = new EventEmitter<string>();
  @Output() showJoinGameChange = new EventEmitter<string>();

  displayGameOver: boolean;

  hovered = new Set();

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.displayGameOver = this.gameService.displayGameOver;
  }

  /** Sets game to in progress */
  startGame(): void {
    this.gameService.startGame();
  }

  /** Removes Player from game and routes to home */
  exitGame(): void {
    this.playerService.deletePlayer(this.game.roomCode, this.playerId)
      .subscribe(_ => {
        this.gameService.leaveGame();

        this.gameService.getGame(this.game.roomCode)
          .subscribe(game => {
            if (game.players.length === 0) {
              this.gameService.deleteGame(this.game.roomCode).subscribe();
            }

            this.playerService.removePlayerId();
            this.router.navigate(['']);
          });
      });
  }

  changeDisplayGameOver($event: boolean): void {
    this.displayGameOver = $event;
  }

  kickPlayer(playerId: string): void {
    // delete player from game
    this.playerService.deletePlayer(this.gameId, playerId).subscribe(_ => {
      // broadcast player was kicked
      this.gameService.kickPlayer(playerId);
    });
  }

  leaveGame(): void {
    // delete player from game
    // emit leave game socket
    // change player id in player service
    // emit player id change to ingame
    // emit showjoingame true to ingame
    this.playerService.deletePlayer(this.gameId, this.playerId).subscribe(_ => {
      this.gameService.leaveGame();
      this.playerService.removePlayerId();
      this.playerIdChange.emit(null);
      this.showJoinGameChange.emit('true');
    });
  }
}
