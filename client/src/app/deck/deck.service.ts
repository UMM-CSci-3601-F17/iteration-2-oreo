import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Deck} from "./deck";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {SimpleDeck} from "../simple-deck/simple-deck";

@Injectable()
export class DeckService {

    constructor(private http: Http) {
    }

    public decks: Deck[];

    private deckUrl: string = environment.API_URL + "decks";

    private cardUrl: string = environment.API_URL + "cards";

    public getDecks(): void {
        this.http.request(this.deckUrl, {withCredentials: true}).map(res => res.json()).subscribe(
            decksres => {
                this.decks = decksres;
            }, err => {
                console.log(err);
            }
        );
    }

    public getDeck(id: string): Observable<Deck> {
        let newDeck: Observable<Deck> = this.http.request(this.deckUrl + "/" + id, {withCredentials: true}).map(res => res.json());
        return newDeck;
    }

    public addNewCard(deckID: string, word: string, synonym: string, antonym: string, general: string, example: string) {
        const body = {
            deckID: deckID,
            word: word,
            synonym: synonym,
            antonym: antonym,
            general_sense: general,
            example_usage: example
        };

        return this.http.post(this.cardUrl + "/add", body, {withCredentials: true}).map(res => res.json());
    }

    public updateName(newName: String, id: object) {
        let response = this.http.post(this.deckUrl + "/updateName", {name: newName, id: id}, {withCredentials: true}).map(res => res.json()).subscribe();
        return response;
    }

    public addNewDeck(name: string) {
        let response = this.http.post(this.deckUrl + "/add", {name: name},{withCredentials: true}).map(res => res.json());
        return response;
    }

    public deleteDeck(id: object){
        let response = this.http.post(this.deckUrl + "/deleteDeck", {id: id}, {withCredentials: true}).map(res => res.json());
        return response;
    }

    public getSimpleDecks(): Observable<SimpleDeck[]> {
        let observable: Observable<any> = this.http.request(environment.API_URL + "/simple-decks", {withCredentials: true});
        return observable.map(res => res.json());
    }
}
