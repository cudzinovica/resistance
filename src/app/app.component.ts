import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'resistance';

  constructor(
    private gameService: GameService,
  ) {}

  ngOnInit() {
    this.gameService.disconnect();
  }
}
