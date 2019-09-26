import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { Player } from '../models/player';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  playerId: string;
  gameId: string;

  news: string;
  private _newsSub: Subscription;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._newsSub = this.gameService.currentNews.subscribe(news => this.news = news);
  }

  ngOnDestroy() {
    this._newsSub.unsubscribe();
  }

  sendTestEvent(msg: string) {
    console.log(`sending test event: ${msg}`);
    this.gameService.sendTestEvent(msg);
  }

  createGame(playerName: string): void {
    this.gameService.createGame()
      .subscribe(createdGame => {
        this.joinGame(createdGame._id, playerName);
      });
  }

  joinGame(gameId: string, playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) { return; }

    this.gameService.setMyGameId(gameId);

    this.playerService.createPlayer(gameId, playerName)
      .subscribe(createdPlayer => {
        this.playerService.setMyPlayerId(createdPlayer._id);
        console.log(createdPlayer);
        this.router.navigate(['/game', gameId]);
      });
  }
}
