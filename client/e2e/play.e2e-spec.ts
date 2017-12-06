import {PlayPage} from "./play.po";
import {browser, by} from "protractor";

describe('play-page', () => {
    let page: PlayPage;

    beforeEach(() => {
        page = new PlayPage();
        page.navigateTo();
    });

    it('should show a card', () => {
        expect(page.getActivePage().element(by.className("card-word")).getText()).toContain('Aesthetic reading');
    });

    // Commented out because the kb-page-slider causes the test to be ran faster than the page has time to load the next card, causing an empty string
    // instead of the intended result

    it('should not get hint after 4 uses', () => {
        let hintButton = page.getActivePage().element(by.className("hint-button"));
        hintButton.click();
        hintButton.click();
        hintButton.click();
        hintButton.click();
        expect(hintButton.isEnabled()).toEqual(false);
    });

    // it('should not add points or give hints from a card after card was already used', () => {
    //     page.getActivePage().element(by.className("got-it-button")).click();
    //     page.clickButton('backward-button');
    //     expect(page.getActivePage().element(by.className('got-it-button')).isEnabled()).toEqual(false);
    //     expect(page.getActivePage().element(by.className('hint-button')).isEnabled()).toEqual(false);
    // });

    it("should allow peeking at cards", () => {
        //page.getActivePage();
        page.clickButton('cardPeek');
        browser.sleep(1000);
        expect(page.getElementsByClass("pop-in-card-entire")).toBeTruthy();
        expect(page.getElementsByClass("pop-in-card-synonym").first().isPresent).toBeTruthy();
        expect(page.getElementsByClass("pop-in-card-synonym").first().getText()).toContain("Synonym");
        expect(page.getElementsByClass("pop-in-card-content").first().getText()).toContain("artistic");
    });

    it("should peek at the present card", () => {
        //page.getActivePage();
        page.clickButton("forward-button");
        page.clickButton('cardPeek');
        browser.sleep(1000);
        expect(page.getElementById("pop-in-card")).toBeTruthy();
        expect(page.getElementsByClass("pop-in-card-content").first().getText()).toContain("allegory");
    });

    it("should pop-up with results after all of the cards have been answered", () => {
        let gotItButton = page.getActivePage().element(by.className("got-it-button"));

        let i:number;
        for(i=0;i<14;i++){
            gotItButton.click();
        }
        expect(page.getElementsByClass('entire-card')).toBeTruthy();
        expect(page.getElementById("player1-score").getText()).toContain("35");
        expect(page.getElementById("player2-score").getText()).toContain("35");
    });

    it("should have two different scores displayed in results pop-up", () => {
        let gotItButton = page.getActivePage().element(by.className("got-it-button"));
        let hintButton = page.getActivePage().element(by.className("hint-button"));
        hintButton.click();
        let i:number;
        for(i=0;i<14;i++){
            gotItButton.click();
        }
        expect(page.getElementsByClass('entire-card')).toBeTruthy();
        expect(page.getElementById("player1-score").getText()).toContain("34");
        expect(page.getElementById("player2-score").getText()).toContain("35");
    });

    it("should pop-up with results no matter what order they are answered", () => {
        let gotItButton = page.getActivePage().element(by.className("got-it-button"));

        let i:number;
        for(i=0;i<12;i++){
            gotItButton.click();
        }
        page.clickButton('forward-button');
        gotItButton.click();
        page.clickButton('backward-button');
        gotItButton.click();

        expect(page.getElementsByClass('entire-card')).toBeTruthy();
    });

    it("should travel to the start page after clicking the play-again button", () =>{
        let gotItButton = page.getActivePage().element(by.className("got-it-button"));

        let i:number;
        for(i=0;i<14;i++){
            gotItButton.click();
        }
        expect(page.getElementsByClass('entire-card')).toBeTruthy();
        browser.sleep(1000);
        page.clickButton('play-again-button');
        expect(page.getPageTitle('title')).toEqual('Make Your Selections!');
    });

    it("should travel to the home page after clicking the home button", () =>{
        let gotItButton = page.getActivePage().element(by.className("got-it-button"));

        let i:number;
        for(i=0;i<14;i++){
            gotItButton.click();
        }
        expect(page.getElementsByClass('entire-card')).toBeTruthy();
        browser.sleep(1000);
        page.clickButton('home-button');
        expect(page.getPageTitle('logo')).toEqual('I Am Sage');
    });


});
