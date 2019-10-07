import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './ingame/lobby/lobby.component';
import { IngameComponent } from './ingame/ingame.component';
import { SelectionComponent } from './ingame/selection/selection.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { JoingameComponent } from './ingame/joingame/joingame.component';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LobbyComponent,
    IngameComponent,
    SelectionComponent,
    JoingameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [JoingameComponent]
})
export class AppModule { }
