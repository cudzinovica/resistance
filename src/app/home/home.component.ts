import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Game } from '../game';
import { GameService } from '../game.service';
import { Player } from '../player';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  player: Player;
  game: Game;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getGame(0)
  }

  createGame(): void {
    let game = new Game();
    game.id = 0;
    game.inProgress = false;
    game.players = [];
    this.gameService.addGame(game)
      .subscribe(game => {
        this.game = game;
      });
  }

  joinGame(id: number, name: string): void {
    name = name.trim();
    if (!name) { return; }

    let playerId = this.game.players.length;
    this.playerService.addPlayer(playerId);

    let player = new Player();

    player.name = name;

    this.game.players.push(player);
    this.gameService.updateGame(this.game)
      .subscribe(_ => {
        this.router.navigate(['game'], { relativeTo: this.route });
      });
  }

  getGame(id: number): void {
    this.gameService.getGame(id)
      .subscribe(game => {
        this.game = game;
        console.log("home:");
        console.log(game);
      });
  }

}
