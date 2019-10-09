import { Component, OnInit, Input } from '@angular/core';

import { Game } from 'src/app/models/game';
import { Player } from 'src/app/models/player';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { GamePhases } from 'src/app/enums/gamephases';

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

  loyalty: string;
  displayLoyalty: boolean;

  gamePhases = GamePhases;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.playerService.getPlayer(this.game._id, this.playerId).subscribe(player => {
      this.loyalty = player.loyalty ? 'Good' : 'Evil';
      this.displayLoyalty = true;
    });
  }

  /** Ends Game */
  endGame(): void {
    this.gameService.endGame();
  }

  toggleDisplayLoyalty() {
    this.displayLoyalty = !this.displayLoyalty;
  }
}
