import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.css']
})
export class IngameComponent implements OnInit, OnDestroy {
  game: Game;
  private _gameSub: Subscription;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._gameSub = this.gameService.getThisGame().subscribe( game => this.game = game );
  }

  ngOnDestroy() {
    this._gameSub.unsubscribe();
  }
}
