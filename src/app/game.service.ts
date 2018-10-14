import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Game } from './game';
import { Player } from './player';
import { PlayerService } from './player.service'; 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gamesUrl = 'api/games';

  constructor(
    private http: HttpClient,
    private playerService: PlayerService
  ) { }

  /** GET game by id. Will 404 if id not found */
  getGame(id: number): Observable<Game> {
    const url = `${this.gamesUrl}/${id}`
    return this.http.get<Game>(url).pipe(
      tap(_ => this.log(`fetched game id=${id}`)),
      catchError(this.handleError<Game>('getGame'))
    );
  }

  ////////// Save methods ///////////

  /** POST: add a new game to the server */
  addGame(game: Game): Observable<Game> {
    return this.http.post(this.gamesUrl, game, httpOptions).pipe(
      tap((game: Game) => this.log(`added game w/ id=${game.id}`)),
      catchError(this.handleError<any>('addGame'))
    );
  }

  /** PUT: update the game on the server */
  updateGame(game: Game): Observable<any> {
    return this.http.put(this.gamesUrl, game, httpOptions).pipe(
      tap(_ => this.log(`updated game id=${game.id}`)),
      catchError(this.handleError<any>('updateGame'))
    );
  }

  /** DELETE: delete the game from the server */
  deleteGame (game: Game | number): Observable<Game> {
    const id = typeof game === 'number' ? game : game.id;
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
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`${operation}:`)
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
