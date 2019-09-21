import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.css']
})
export class IngameComponent implements OnInit {
  game: Game;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const gameId = params.get('gameId');
      this.getGame(gameId);
    });
  }

  getGame(id: string): void {
    this.gameService.getGame(id).subscribe(game => {
      this.game = game;
      console.log(game);
    });
  }
}
