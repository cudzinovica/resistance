import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './ingame/lobby/lobby.component';
import { IngameComponent } from './ingame/ingame.component';
import { SelectionComponent } from './ingame/game/selection/selection.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { JoingameComponent } from './ingame/joingame/joingame.component';
import { VoteComponent } from './ingame/game/vote/vote.component';
import { QuestComponent } from './ingame/game/quest/quest.component';
import { GameComponent } from './ingame/game/game.component';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LobbyComponent,
    IngameComponent,
    SelectionComponent,
    JoingameComponent,
    VoteComponent,
    QuestComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [JoingameComponent, VoteComponent, QuestComponent]
})
export class AppModule { }
