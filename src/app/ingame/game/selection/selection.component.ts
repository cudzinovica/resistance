import { Component, OnInit, Input } from '@angular/core';

import { Game } from 'src/app/models/game';
import { TEAM_SIZES } from 'src/app/constants';
import { GameService } from 'src/app/services/game.service';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string;

  @Input() currentLeader: Player;

  TEAM_SIZES = TEAM_SIZES;

  selection: string[];

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit() {
    this.selection = [];
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
