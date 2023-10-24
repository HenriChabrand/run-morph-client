import axios from 'axios'; 

type CardColor = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'DEFAULT';
type ActionType = 'REQUEST' | 'OPEN_URL' | 'OPEN_URL_IN_IFRAME';

class Morph {
  apiKey: string;
  apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    if (!apiKey) {
      throw new Error('An API key is required');
    }
    this.apiKey = apiKey;

    if (!apiSecret) {
      throw new Error('An API secret is required');
    }
    this.apiSecret = apiSecret;
  }

  newCardBuilder(requestId: string): CardBuilder {
    return new CardBuilder(requestId, this.apiKey, this.apiSecret);
  }
}

class Action {
  type: ActionType;
  name: string;
  url?: string;

  constructor(type: ActionType, name: string, url?: string) {
    if ((type === 'OPEN_URL' || type === 'OPEN_URL_IN_IFRAME') && !url) {
      throw new Error('A URL is required for OPEN_URL and OPEN_URL_IN_IFRAME action types');
    }

    this.type = type;
    this.name = name;
    this.url = url;
  }
}

class CardContent {
    type: string;
    label: string;
    value: string;
    color?: CardColor;

    constructor(type: string, label: string, value: string) {
        this.type = type;
        this.label = label;
        this.value = value;
    }

    setValue(value: string): void {
        this.value = value;
    }

    setLabel(label: string): void {
        this.label = label;
    }

    setColor(color: CardColor): void {
        if (this.type === 'status') {
            if (!['SUCCESS', 'WARNING', 'DANGER', 'INFO', 'DEFAULT'].includes(color)) {
                throw new Error('Invalid status color');
            }
            this.color = color;
        } else {
            throw new Error('SetColor is only allowed for CardContent of type "status"');
        }
    }
}

class Card {
    title: string;
    contents: CardContent[];
    actions: Action[]; 
    link?: string;

    constructor(title: string, url?: string) {
        this.title = title;
        this.contents = [];
        this.actions = []; 
        if (url) this.link = url;
    }


    setTitle(title: string): void {
        this.title = title;
    }

    setLink(url: string): void {
        this.link = url;
    }

    newText(label: string, value: string): CardContent {
        let newTextContent = new CardContent('text', label, value);
        this.contents.push(newTextContent);
        return newTextContent;
    }

    newStatus(label: string, value: string, color: CardColor): CardContent {
        let newStatusContent = new CardContent('status', label, value);
        newStatusContent.setColor(color);
        this.contents.push(newStatusContent);
        return newStatusContent;
    }

    newAction(type: ActionType, name: string, url?: string): Action {
      let newAction = new Action(type, name, url);
      this.actions.push(newAction);
      return newAction;
    }

}

class CardBuilder {
    cards: Card[];
    apiKey: string;
    apiSecret: string;
    requestId: string;
    actions: Action[];
  
    constructor(requestId: string, apiKey: string, apiSecret: string) {
        if (!apiKey || !requestId) {
          throw new Error('RequestId are required');
        }
        this.cards = [];
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.requestId = requestId;
        this.actions = [];
    }

    newCard(title: string): Card {
        let newCard = new Card(title);
        this.cards.push(newCard);
        return newCard;
    }

    newRootAction(type: ActionType, name: string, url?: string): Action {
      let newRootAction = new Action(type, name, url);
      this.actions.push(newRootAction);
      return newRootAction;
    }


    async build(): Promise<boolean> {
    const card_view_response = { 
        type: 'card_view',
        completed: true,
        card_view: {
            root:{
                actions: this.actions
            },
            cards: this.cards.map((card) => ({
                title: card.title,
                ...(card.link && { link: card.link }),
                contents: card.contents,
                actions: card.actions
            }))
        }
    };

    try {
      const response = await axios({
        method: 'POST',
        url:`https://tlgbrx45cg.execute-api.eu-west-3.amazonaws.com/v0/requests/${this.requestId}/response`,
        headers: {
          'x-api-key': this.apiKey,
          'x-api-secret': this.apiSecret
        },
        data: card_view_response
      });

      // Check the HTTP status code
      // between 200-299 inclusive indicate success
      if (response.status >= 200 && response.status < 300) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}



export { Morph, CardBuilder, Card, CardContent }