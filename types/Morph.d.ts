type CardColor = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'DEFAULT';
type ActionType = 'REQUEST' | 'OPEN_URL' | 'OPEN_URL_IN_IFRAME';
declare class Morph {
    apiKey: string;
    apiSecret: string;
    constructor(apiKey: string, apiSecret: string);
    newCardBuilder(requestId: string, isSynchronous?: boolean): CardBuilder;
    newActionResponseBuilder(requestId: string, isSynchronous?: boolean): ActionResponseBuilder;
}
declare class Action {
    type: ActionType;
    label: string;
    url?: string;
    id?: string;
    constructor(type: ActionType, label: string, url?: string, id?: string);
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
    newAction(type: ActionType, label: string, url?: string, id?: string): Action;
}
type CardViewResponse = {
    type: 'card_view';
    completed: boolean;
    card_view: {
        root: {
            actions: Action[];
        };
        cards: {
            title: string;
            link?: string;
            contents: CardContent[];
            actions: Action[];
        }[];
    };
};
declare class CardBuilder {
    cards: Card[];
    apiKey: string;
    apiSecret: string;
    requestId: string;
    isSynchronous: boolean | null;
    actions: Action[];
    constructor(requestId: string, isSynchronous: boolean | null, apiKey: string, apiSecret: string);
    newCard(title: string): Card;
    newRootAction(type: ActionType, label: string, url?: string, id?: string): Action;
    build(): Promise<boolean | CardViewResponse>;
}
type ActionResponse = {
    type: 'action';
    completed: boolean;
    action: {
        succeed: boolean;
        message: string;
    };
};
declare class ActionResponseBuilder {
    apiKey: string;
    apiSecret: string;
    requestId: string;
    isSynchronous: boolean | null;
    constructor(requestId: string, isSynchronous: boolean | null, apiKey: string, apiSecret: string);
    build(succeed: boolean, message?: string): Promise<boolean | ActionResponse>;
}
export { Morph, CardBuilder, Card, CardContent };
