type CardColor = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'DEFAULT';
type ActionType = 'request' | 'open_url' | 'open_url_in_iframe';
declare class Morph {
    apiKey: string;
    constructor(apiKey: string);
    newCardBuilder(requestId: string): CardBuilder;
}
declare class Action {
    type: ActionType;
    name: string;
    url: string;
    constructor(type: ActionType, name: string, url: string);
}
declare class CardContent {
    type: string;
    label: string;
    value: string;
    color?: CardColor;
    constructor(type: string, label: string, value: string);
    setValue(value: string): void;
    setLabel(label: string): void;
    setColor(color: CardColor): void;
}
declare class Card {
    title: string;
    contents: CardContent[];
    actions: Action[];
    constructor(title: string);
    setTitle(title: string): void;
    newText(label: string, value: string): CardContent;
    newStatus(label: string, value: string, color: CardColor): CardContent;
    addAction(type: ActionType, name: string, url: string): Action;
}
declare class CardBuilder {
    cards: Card[];
    apiKey: string;
    requestId: string;
    actions: Action[];
    constructor(requestId: string, apiKey: string);
    newCard(title: string): Card;
    addHeaderAction(type: ActionType, name: string, url: string): Action;
    build(): Promise<boolean>;
}
export { Morph, CardBuilder, Card, CardContent };
