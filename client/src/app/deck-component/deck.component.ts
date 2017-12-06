import {Component, OnInit} from '@angular/core';
import {DeckService} from "../deck/deck.service";
import {ActivatedRoute} from "@angular/router";
import {Deck} from "../deck/deck";
import {NewCardDialogComponent} from "../new-card-dialog/new-card-dialog.component";
import {MdDialog, MatDialogConfig} from "@angular/material";
import {DeleteDeckDialogComponent} from "../delete-deck-dialog/delete-deck-dialog";


@Component({
    selector: 'app-deck',
    templateUrl: './deck.component.html',
    styleUrls: ['./deck.component.css']
})

/*
Depending on the value of EditMode, certain elements will be hidden at the top of the screen for editing decks.
The newDeckTitle will be sent out to the server with the id of the deck to be updated in the database.
 */

export class DeckComponent implements OnInit {

    id: string;
    deck: Deck;
    editMode: boolean = false;
    newDeckTitle: string;
    cardRef: any;


    constructor(public deckService: DeckService, private route: ActivatedRoute, public dialog: MdDialog) {
        this.editMode = false;
    }

    changeMode() {
        if (this.editMode == false) {
            this.editMode = true;
        } else {
            this.editMode = false;
        }
    }

    /*
    Makes a call to the server to update the Deck with the new title of the deck. Makes this change
    locally as well so that the page does not need to be refreshed. Changes the edit mode back to default (false)
     */
    saveEdit() {
        this.deckService.updateName(this.newDeckTitle, this.deck._id);
        this.deck.name = this.newDeckTitle;
        this.changeMode();

    }

    // Opens the delete deck dialog, which handles the service request to delete the deck.
    deleteDeck() {
        this.openDeleteDeckDialog();
    }

    cancelEdit() {
        this.changeMode();
    }

    openAddDialog() {
        let config = new MatDialogConfig();
        config.data = {deckId: this.id};

        let dialogRef = this.dialog.open(NewCardDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deck.cards.push(result);
            }
        });
    }

    /*
    Opens up a delete deck Dialog. Sends the deck name and id to the constructor of the dialog.
     */
    public openDeleteDeckDialog() {
        let config = new MatDialogConfig();
        let deckName: string = this.deck.name;
        let deckId: object = this.deck._id;

        config.data = {
            deckId: deckId,
            deckName: deckName
        };
        console.log(config);
        let cardRef = this.dialog.open(DeleteDeckDialogComponent, config);
        this.cardRef = cardRef;
        cardRef.afterClosed().subscribe(result => {
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];

            this.deckService.getDeck(this.id).subscribe(
                deck => {
                    this.deck = deck;
                }
            );
        });
    }


}
