// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DeckListComponent} from "./deck-list-component/deck-list.component";
import {DeckComponent} from "./deck-component/deck.component";
import {PlayComponent} from "./play-component/play.component";
import {HelpComponent} from "./help-component/help.component";
import {CardListComponent} from "./card-list-component/card-list.component";
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {SelectColorComponent} from "./select-color/select-color.component";

// Route Configuration
export const routes: Routes = [
    {path: 'play/:deck', component: PlayComponent},
    {path: 'decks/:id', component: DeckComponent},
    {path: 'decks', component: DeckListComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'card', redirectTo: '/decks', pathMatch: 'full'},
    {path: 'help', component: HelpComponent},
    {path: 'card-list', component: CardListComponent},
    {path: 'start', component: StartScreenComponent},
    {path: 'card-list', component: CardListComponent},
    {path: 'select-color/:info', component: SelectColorComponent},
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
