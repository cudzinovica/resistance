import { Component, OnInit, OnDestroy, Input } from '@angular/core';

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

  displayGameOver: boolean;

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

  changeDisplayGameOver($event: boolean): void {
    this.displayGameOver = $event;
  }
}
