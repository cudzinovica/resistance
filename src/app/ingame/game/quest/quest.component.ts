import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Player } from 'src/app/models/player';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class QuestComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string;
  @Input() player: Player;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit() {
  }

  submitQuest(quest: boolean) {
    this.gameService.submitQuest(this.player.loyalty ? true : quest);
  }
}
