import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Player } from '../models/player';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerId;

  private baseUrl = 'http://localhost:3000';
  private gamesUrl = this.baseUrl + '/api/games';
  private playersUrl = 'players';

  constructor(
    private http: HttpClient,
    private playerService: PlayerService
  ) { }

  setMyPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  getMyPlayerId(): string {
    return this.playerId;
  }

  /** POST: add a new player to the server */
  createPlayer(gameId: string, name: string): Observable<Player> {
    const url = `${this.gamesUrl}/${gameId}/${this.playersUrl}`;
    const body = { 'name': name };
    return this.http.post(url, body, httpOptions).pipe(
      tap((createdPlayer: Player) => this.log(`added player w/ id=${createdPlayer._id}`)),
      catchError(this.handleError<any>('createPlayer'))
    );
  }

  /** GET list of players.*/
  getPlayers(gameId: string): Observable<Player[]> {
    const url = `${this.gamesUrl}/${gameId}/${this.playersUrl}`;
    return this.http.get<Player[]>(url).pipe(
      tap(_ => this.log(`fetched players`)),
      catchError(this.handleError<Player[]>('getPlayers'))
    );
  }

  /** GET player by id. Will 404 if id not found */
  getPlayer(gameId: string, playerId: string): Observable<Player> {
    const url = `${this.gamesUrl}/${gameId}/${this.playersUrl}/${playerId}`;
    return this.http.get<Player>(url).pipe(
      tap(_ => this.log(`fetched player id=${playerId}`)),
      catchError(this.handleError<Player>('getPlayer'))
    );
  }

  /** PUT: update the player on the server */
  updatePlayer(gameId: string, player: Player): Observable<any> {
    const playerId = player._id;
    const url = `${this.gamesUrl}/${gameId}/${this.playersUrl}/${playerId}`;
    return this.http.put(this.playersUrl, player, httpOptions).pipe(
      tap(_ => this.log(`updated player id=${player._id}`)),
      catchError(this.handleError<any>('updatePlayer'))
    );
  }

  /** DELETE: delete the player from the server */
  deletePlayer (gameId: string, player: Player | string): Observable<Player> {
    const playerId = typeof player === 'string' ? player : player._id;
    const url = `${this.gamesUrl}/${gameId}/${this.playersUrl}/${playerId}`;

    return this.http.delete<Player>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted player id=${playerId}`)),
      catchError(this.handleError<Player>('deletePlayer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
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
    console.log(`PlayerService: ${message}`); // log to console instead
  }
}
