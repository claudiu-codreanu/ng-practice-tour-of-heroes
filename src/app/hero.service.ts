import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = "api/heroes";

  httpOptions = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
  };

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
              tap(_ => this.log("Fetched heroes")),
              catchError(this.handleError<Hero[]>("getHeroes", []))
            );
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`)
            .pipe(
              tap(_ => this.log(`Fetched hero id=${id}`)),
              catchError(this.handleError<Hero>("getHero"))
            );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Updated hero id=${hero.id}`)),
        catchError(this.handleError<any>("updateHero"))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap( (newHero: Hero) => this.log(`Added hero with id=${newHero.id}`)),
        catchError(this.handleError<Hero>("addHero"))
      );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions)
        .pipe(
          tap(_ => this.log(`Deleted hero with id=${id}`)),
          catchError(this.handleError<Hero>("deleteHero"))
        );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([]);
    }

    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url)
        .pipe(
          tap(a => a.length ?
              this.log("Found heroes matching '${term}'") :
              this.log("No heroes matching '${term}'")),
          catchError(this.handleError<Hero[]>("searchHeroes", []))
        );
  }

  constructor(private messageService: MessageService,
              private http: HttpClient) { }

  
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
