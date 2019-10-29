import { Component, OnInit, Input } from '@angular/core';

import { Game } from 'src/app/models/game';
import { Player } from 'src/app/models/player';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { GamePhases } from 'src/app/enums/gamephases';
import { PhaseChangeStatuses } from 'src/app/enums/phaseChangeStatuses';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string;
  @Input() player: Player;
  @Input() currentLeader: Player;
  @Input() previousPasses: number;
  @Input() previousFails: number;
  @Input() currentTeamPlayers: Player[];
  @Input() phaseChangeStatus: number;

  gamePhases = GamePhases;
  phaseChangeStatuses = PhaseChangeStatuses;

  loyalty: string;
  displayLoyalty: boolean;

  fellowTraitors: Player[];

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.playerService.getPlayer(this.game.roomCode, this.playerId).subscribe(player => {
      this.loyalty = player.loyalty ? 'Good' : 'Evil';
      this.displayLoyalty = true;
    });
    this.gameService.displayGameOver = true;
    this.fellowTraitors = [];
    this.game.players.forEach(player => {
      if (!player.loyalty && player._id !== this.playerId) {
        this.fellowTraitors.push(player);
      }
    });
  }

  /** Ends Game */
  endGame(): void {
    this.gameService.displayGameOver = false;
    this.gameService.endGame();
  }

  toggleDisplayLoyalty() {
    this.displayLoyalty = !this.displayLoyalty;
  }
}
