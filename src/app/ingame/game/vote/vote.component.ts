import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Player } from 'src/app/models/player';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string;
  @Input() player: Player;

  currentVote: boolean;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit() {
  }

  updateVote(vote: boolean) {
    this.currentVote = vote;
  }

  submitVote() {
    this.gameService.submitVote(this.currentVote);
  }

}
