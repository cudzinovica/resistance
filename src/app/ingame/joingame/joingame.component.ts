import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css']
})
export class JoingameComponent implements OnInit {
  private gameId: string;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId');
    });
  }

  joinGame(playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) { return; }

    this.playerService.createPlayer(this.gameId, playerName).subscribe(createdPlayer => {
      this.playerService.setPlayerId(createdPlayer._id);

      this.gameService.joinGame(this.gameId, createdPlayer._id);
    });
  }
}
