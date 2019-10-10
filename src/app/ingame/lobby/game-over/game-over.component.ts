import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GameService } from 'src/app/services/game.service';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {
  @Input() game: Game;
  @Output() displayGameOverChange = new EventEmitter<boolean>();

  winningTeam: string;
  goodPlayers: Player[];
  evilPlayers: Player[];

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit() {
    this.winningTeam = this.game.winningTeam ? 'Good' : 'Evil';
    this.goodPlayers = [];
    this.evilPlayers = [];
    this.game.players.forEach(player => {
      if (player.loyalty) {
        this.goodPlayers.push(player);
      } else {
        this.evilPlayers.push(player);
      }
    });
  }

  goToLobby() {
    this.gameService.displayGameOver = false;
    this.displayGameOverChange.emit(false);
  }

}
