import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  @Input() game: Game;

  constructor(
    private gameService: GameService,
  ) {}

  ngOnInit() {
  }

  /** Sets game to in progress **/
  startGame(): void {
    this.gameService.startGame();
  }
}
