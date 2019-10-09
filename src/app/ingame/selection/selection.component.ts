import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../models/game';
import { Loyalty } from '../../enums/loyalty';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player';
import { TEAM_SIZES } from 'src/app/constants';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string; // TODO: make playerid observable or get in this component

  TEAM_SIZES = TEAM_SIZES;

  currentLeader: Player;

  loyalty: string;
  displayLoyalty: boolean;

  selection: string[];

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.playerService.getPlayer(this.game._id, this.playerId).subscribe(player => {
      this.loyalty = player.loyalty ? 'Good' : 'Evil';
      this.displayLoyalty = true;
    });

    this.currentLeader = this.game.players[this.game.currentLeaderIdx];
    this.selection = [];
  }

  toggleDisplayLoyalty() {
    this.displayLoyalty = !this.displayLoyalty;
  }

  selectPlayer(playerId: string) {
    const teamSize = TEAM_SIZES[this.game.players.length][this.game.currentRound];

    if (this.selection.includes(playerId)) {
      this.selection = this.selection.filter(pId => pId !== playerId);
    } else {
      if (this.selection.length < teamSize) {
        this.selection.push(playerId);
      }
    }
  }

  submitSelection() {
    this.gameService.submitSelection(this.selection);
  }
}
