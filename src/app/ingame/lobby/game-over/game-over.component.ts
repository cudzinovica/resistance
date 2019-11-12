import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Game } from 'src/app/models/game';
import { GameService } from 'src/app/services/game.service';
import { Player } from 'src/app/models/player';
import { TEAM_SIZES } from 'src/app/constants';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {
  @Input() game: Game;
  @Output() displayGameOverChange = new EventEmitter<boolean>();

  TEAM_SIZES = TEAM_SIZES;

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

  getQuestResultBorderClass(roundNumber: number): any {
    let questResultBorderClass;
    if (roundNumber <= this.game.currentRound) {
      if (this.game.missionResults[roundNumber]) {
        questResultBorderClass = { 'bg-success': true, 'text-white': true };
      } else {
        questResultBorderClass = { 'bg-danger': true, 'text-white': true };
      }
    } else {
      questResultBorderClass = { 'bg-light': true };
    }
    return questResultBorderClass;
  }
}
