import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Game } from '../models/game';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = environment.resistanceApiUri;
  private gamesUrl = this.baseUrl + '/api/games';

  private game: Observable<Game> = this.socket.fromEvent<Game>('game');
  private errorMsg: Observable<string> = this.socket.fromEvent<string>('error_msg');

  displayGameOver: boolean;

  private socketIsConnected = false;

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  connect(): void {
    this.socket.connect();
    this.socketIsConnected = true;
    this.log('connected to socket');
  }

  disconnect(): void {
    this.socket.disconnect();
    this.socketIsConnected = false;
    this.log('disconnected from socket');
  }

  isConnected(): boolean {
    return this.socketIsConnected;
  }

  getThisGame(): Observable<Game> {
    return this.game.pipe(
      tap((game: Game) => this.log(`got game from socket w/ id=${game.roomCode}`))
    );
  }

  getErrorMessage(): Observable<string> {
    return this.errorMsg.pipe(
      tap((errorMsg: string) => this.log(`got error message from socket: ${errorMsg}`))
    );
  }

  joinGame(roomCode: string, playerId: string): void {
    this.socket.emit('join-game', {roomCode, playerId});
  }

  leaveGame(): void {
    this.socket.emit('leave-game');
  }

  startGame(): void {
    this.socket.emit('start-game');
  }

  endGame(): void {
    this.socket.emit('end-game');
  }

  submitSelection(selection: string[]): void {
    this.socket.emit('submit-selection', {selection});
  }

  submitVote(vote: boolean): void {
    this.socket.emit('submit-vote', {vote});
  }

  submitQuest(quest: boolean): void {
    this.socket.emit('submit-quest', {quest});
  }

  /** POST: add a new game to the server */
  createGame(): Observable<Game> {
    return this.http.post(this.gamesUrl, null).pipe(
      tap((createdGame: Game) => this.log(`added game w/ id=${createdGame.roomCode}`)),
      catchError(this.handleError<any>('createGame'))
    );
  }

  /** GET list of games. */
  getGames(): Observable<Game[]> {
    const url = `${this.gamesUrl}`;
    return this.http.get<Game[]>(url).pipe(
      tap(_ => this.log(`fetched games`)),
      catchError(this.handleError<Game[]>('getGames'))
    );
  }

  /** GET game by id. Will 404 if id not found */
  getGame(id: string): Observable<Game> {
    const url = `${this.gamesUrl}/${id}`;
    let params = new HttpParams();
    params = params.append('populatePlayers', 'true');
    return this.http.get<Game>(url, {params}).pipe(
      tap(_ => this.log(`fetched game id=${id}`)),
      catchError(this.handleError<Game>('getGame'))
    );
  }

  /** PUT: update the game on the server */
  updateGame(game: Game): Observable<any> {
    const id = game.roomCode;
    const url = `${this.gamesUrl}/${id}`;
    return this.http.put(url, game, httpOptions).pipe(
      tap(_ => this.log(`updated game id=${game.roomCode}`)),
      catchError(this.handleError<any>('updateGame'))
    );
  }

  /** DELETE: delete the game from the server */
  deleteGame(game: Game | string): Observable<Game> {
    const id = typeof game === 'string' ? game : game.roomCode;
    const url = `${this.gamesUrl}/${id}`;

    return this.http.delete<Game>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted game id=${id}`)),
      catchError(this.handleError<Game>('deleteGame'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`${operation}:`);
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log using console log */
  private log(message: string) {
    // TODO: send error to remote logging infrastructure
    console.log(`GameService: ${message}`); // log to console instead
  }
}
