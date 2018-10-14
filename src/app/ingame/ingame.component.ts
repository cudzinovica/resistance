import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';
import { Game } from '../game';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.css']
})
export class IngameComponent implements OnInit {
  game: Game;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.getGame(0);
  }

  getGame(id: number): void {
    this.gameService.getGame(id)
      .subscribe(game => {
        this.game = game;
        console.log("inGame:");
        console.log(game);
      });
  }
}
