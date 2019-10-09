import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';

import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css']
})
export class JoingameComponent implements OnInit {
  private gameId: string;
  @Output() playerIdChange = new EventEmitter<string>();

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.gameService.connect();
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId');
    });
  }

  joinGame(playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) { return; }

    this.playerService.createPlayer(this.gameId, playerName).subscribe(createdPlayer => {
      this.playerService.setPlayerId(createdPlayer._id);
      this.playerIdChange.emit(createdPlayer._id);

      this.gameService.joinGame(this.gameId, createdPlayer._id);
    });
  }
}
