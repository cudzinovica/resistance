import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './ingame/lobby/lobby.component';
import { IngameComponent } from './ingame/ingame.component';
import { SelectionComponent } from './ingame/game/selection/selection.component';
import { JoingameComponent } from './ingame/joingame/joingame.component';
import { VoteComponent } from './ingame/game/vote/vote.component';
import { QuestComponent } from './ingame/game/quest/quest.component';
import { GameComponent } from './ingame/game/game.component';
import { GameOverComponent } from './ingame/lobby/game-over/game-over.component';
import { environment } from 'src/environments/environment';
import { FooterComponent } from './footer/footer.component';

const socketIoConfig: SocketIoConfig = { url: environment.resistanceApiUri, options: {} };

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
    GameOverComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(socketIoConfig),
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [JoingameComponent, VoteComponent, QuestComponent]
})
export class AppModule { }
