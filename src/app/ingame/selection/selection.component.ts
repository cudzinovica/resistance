import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../models/game';
import { Team } from '../../enums/team';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Input() game: Game;

  private team: Team;
  private teamDisplay: boolean;

  constructor() { }

  ngOnInit() { }

}
