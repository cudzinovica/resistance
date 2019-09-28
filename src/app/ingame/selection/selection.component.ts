import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../models/game';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Input() game: Game;

  constructor() { }

  ngOnInit() {
  }

}
