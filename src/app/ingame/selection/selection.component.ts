import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../models/game';
import { Loyalty } from '../../enums/loyalty';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Input() game: Game;

  loyalty: boolean;
  displayLoyalty: boolean;

  constructor(
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    const playerId = this.playerService.getPlayerId();
    this.playerService.getPlayer(this.game._id, playerId).subscribe(player => {
      this.loyalty = player.loyalty;
      this.displayLoyalty = true;
    });
  }

  toggleDisplayLoyalty() {
    this.displayLoyalty = !this.displayLoyalty;
  }
}
