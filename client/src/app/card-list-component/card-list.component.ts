import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CardListService} from "./card-list.service";
import {Card} from "../card/card";
import {SimpleCardComponent} from "../simple-card-component/simple-card.component";
import {MatDialogConfig} from "@angular/material";
import {CardDisplayDialogComponent} from "../card-display-dialog/card-display-dialog.component";
import {MdDialog} from "@angular/material";
import {DeckService} from "../deck/deck.service";
import {SimpleCard} from "../simple-card/simple-card";
import {SimpleDeck} from "../simple-deck/simple-deck";
import {DeckChangesDialogComponent} from "../deck-changes-dialog/deck-changes-dialog";

@Component({
    selector: 'card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.css']
})


@ViewChild(SimpleCardComponent)

export class CardListComponent implements OnInit {
    public cards: SimpleCard[];
    public selectedCards: SimpleCard[];
    public selectedButton: string;
    public mode: String;
    public clearAllSelected: boolean;
    public decks: SimpleDeck[];
    public selectedDeck: SimpleDeck;
    public cardRef: any;
    public cardWords: string[] = [];


    selectDeck(deck) {
        this.selectedDeck = deck;
    }

    select(card) {
        if (this.mode == "View") {
            this.openCardDisplay(card);
        } else {
            if (card.selected == true) {
                this.selectedCards.splice(this.selectedCards.indexOf(card), 1);
                card.selected = false;
            } else {
                card.selected = true;
                this.selectedCards.push(card);
            }
        }
    }

    clearSelected(card) {
        card.selected = false;
    }

    public openCardDisplay(card) {
        let config = new MatDialogConfig();
        let presentCard: Card = card;
        this.CardListService.getCard(card._id["$oid"]).subscribe(
            newCard => {
                presentCard = newCard;
                config.data = {
                    Word: presentCard.word,
                    Synonym: presentCard.synonym,
                    Antonym: presentCard.antonym,
                    General_sense: presentCard.general_sense,
                    Example_usage: presentCard.example_usage,
                    deleteShown: true,
                    cardId: presentCard._id
                };
                let cardRef = this.peek.open(CardDisplayDialogComponent, config);
            }
        );

    };

    public openDeckChangesDisplay(button: string) {
        let config = new MatDialogConfig();
        let changeType: string = "";
        let cards: string[] = this.cardWords;
        if (button == 'add') {
            changeType = 'added to';
        } else {
            changeType = 'removed from';
        }

        config.data = {
            deck: this.selectedDeck,
            cards: cards,
            typeOfChange: changeType
        };
        let cardRef = this.peek.open(DeckChangesDialogComponent, config);
        this.cardRef = cardRef;
            cardRef.afterClosed().subscribe(result => {
        });
    }

    public modeHandler() {
        if (this.selectedButton == null) {
            this.mode = "View";
        } else if (this.selectedButton == "select") {
            this.mode = "Select";
        } else {
            this.mode = "View";
        }
        if (this.mode == "View") {
            this.clearAllSelected = true;
            this.selectedCards.length = 0;
        } else {
            this.clearAllSelected = false;
        }
    }

    public changeButton(button) {
        if (this.selectedButton == button) {
            this.selectedButton = null;
        } else {
            this.selectedButton = button;
        }
        this.modeHandler();
    }


    constructor(public CardListService: CardListService, public DeckService: DeckService, public peek: MdDialog) {
        this.mode = "View";
        this.selectedCards = [];
        peek.afterAllClosed.subscribe(() => {
          this.refreshPage();
        })
    }


    changeDeck(button: string) {
        let cardIds: string[] = [];
        if (this.selectedCards.length > 0) {
            for (var i = 0; i < this.selectedCards.length; i++) {
                cardIds[i] = this.selectedCards[i]._id["$oid"];
                this.cardWords[i] = this.selectedCards[i].word;
            }
        }
        if (button == 'add') {
            this.CardListService.addCardsToDeck(this.selectedDeck, cardIds);
            this.openDeckChangesDisplay(button);
        }
        else {
            this.CardListService.deleteCardsFromDeck(this.selectedDeck, cardIds);
            this.openDeckChangesDisplay(button);
        }
        this.clearAllSelected = true;
        this.mode = "View";
        this.selectedCards.length = 0;
        this.selectedButton = 'Select';
    }

    refreshPage() {
        this.CardListService.getSimpleCards().subscribe(
            cards => {
                this.cards = cards;
                this.sortCards();
            }
        )
    }

    sortCards() {
        this.cards.sort((n1, n2) => {
           if (n1.word.toLowerCase() > n2.word.toLowerCase()){
               return 1;
           }
           if (n1.word.toLowerCase() < n2.word.toLowerCase()){
               return -1;
           }
           return 0;
        });
    }

    ngOnInit(): void {
        this.CardListService.getSimpleCards().subscribe(
            cards => {
                this.cards = cards;
                this.sortCards();
            },
            err => {
                console.log(err);
            }
        );
        this.DeckService.getSimpleDecks().subscribe(
            decks => {
                this.decks = decks;
            },
            err => {
                console.log(err);
            }
        );
    }
}
