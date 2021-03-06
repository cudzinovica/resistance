import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css']
})
export class JoingameComponent implements OnInit {
  @Input() private gameId: string;
  @Input() private roomCode: string;
  @Output() playerIdChange = new EventEmitter<string>();
  @Output() showJoinGameChange = new EventEmitter<string>();

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  joinGame(playerName: string): void {
    playerName = playerName.trim();
    if (!playerName) {
      alert('Enter your name!');
      return;
    }

    this.playerService.createPlayer(this.gameId, playerName).subscribe(createdPlayer => {
      this.playerService.setPlayerId(createdPlayer._id);
      this.playerIdChange.emit(createdPlayer._id);
      this.gameService.connect();
      this.gameService.joinGame(this.roomCode, createdPlayer._id);
      this.showJoinGameChange.emit('false');
    });
  }

  leaveGame(): void {
    this.playerService.removePlayerId();
    this.router.navigate(['']);
  }
}
