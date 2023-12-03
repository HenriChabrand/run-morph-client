type CardColor = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'DEFAULT';
type ActionType = 'REQUEST' | 'OPEN_URL' | 'OPEN_URL_IN_IFRAME';
declare class Morph {
    apiKey: string;
    apiSecret: string;
    constructor(apiKey: string, apiSecret: string);
    newCardBuilder(requestId: string): CardBuilder;
}
declare class Action {
    type: ActionType;
    label: string;
    url?: string;
    constructor(type: ActionType, label: string, url?: string);
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
    link?: string;
    constructor(title: string, url?: string);
    setTitle(title: string): void;
    setLink(url: string): void;
    newText(label: string, value: string): CardContent;
    newStatus(label: string, value: string, color: CardColor): CardContent;
    newAction(type: ActionType, label: string, url?: string): Action;
}
declare class CardBuilder {
    cards: Card[];
    apiKey: string;
    apiSecret: string;
    requestId: string;
    actions: Action[];
    constructor(requestId: string, apiKey: string, apiSecret: string);
    newCard(title: string): Card;
    newRootAction(type: ActionType, label: string, url?: string): Action;
    build(): Promise<boolean>;
}
export { Morph, CardBuilder, Card, CardContent };
