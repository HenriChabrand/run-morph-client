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

  newCardBuilder(requestId: string, isSynchronous?:boolean): CardBuilder {
    return new CardBuilder(requestId, isSynchronous || null, this.apiKey, this.apiSecret);
  }

  newActionResponseBuilder(requestId: string, isSynchronous?:boolean): ActionResponseBuilder {
    return new ActionResponseBuilder(requestId, isSynchronous || null, this.apiKey, this.apiSecret);
  }
}

class Action {
  type: ActionType;
  label: string;
  url?: string;
  id?: string

  constructor(type: ActionType, label: string, url?: string, id?: string) {
    if ((type === 'OPEN_URL' || type === 'OPEN_URL_IN_IFRAME') && !url) {
      throw new Error('A URL is required for OPEN_URL and OPEN_URL_IN_IFRAME action types');
    } else if (type === 'REQUEST' && !id) {
      throw new Error('An ID is required for REQUEST action type');
    }
    this.type = type;
    this.label = label;
   
    if(url){
      this.url = url;
    }

    if(id){
      this.id = id;
    }
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

    newAction(type: ActionType, label: string, url?: string, id?: string): Action {
      let newAction = new Action(type, label, url, id);
      this.actions.push(newAction);
      return newAction;
    }
}

export type CardViewResponse = {
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

class CardBuilder {
    cards: Card[];
    apiKey: string;
    apiSecret: string;
    requestId: string;
    isSynchronous: boolean | null;
    actions: Action[];
  
    constructor(requestId: string, isSynchronous: boolean | null, apiKey: string, apiSecret: string) {
        if (!apiKey || !requestId) {
          throw new Error('RequestId are required');
        }
        this.cards = [];
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.requestId = requestId;
        this.isSynchronous = isSynchronous;
        this.actions = [];
    }

    newCard(title: string): Card {
        let newCard = new Card(title);
        this.cards.push(newCard);
        return newCard;
    }

    newRootAction(type: ActionType, label: string, url?: string, id?: string): Action {
      let newRootAction = new Action(type, label, url, id);
      this.actions.push(newRootAction);
      return newRootAction;
    }


    async build(): Promise<CardViewResponse> {
    const card_view_response:CardViewResponse = { 
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

    if(this.isSynchronous){
      return card_view_response;
    }

    try {
      const response = await axios({
        method: 'POST',
        url:`https://api.runmorph.dev/v0/requests/${this.requestId}/response`,
        headers: {
          'x-api-key': this.apiKey,
          'x-api-secret': this.apiSecret
        },
        data: card_view_response
      });

      // Check the HTTP status code
      // between 200-299 inclusive indicate success
      if (response.status >= 200 && response.status < 300) {
        return card_view_response;
      } else {
        throw new Error(JSON.stringify(response));
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}

type ActionResponse = {
  type: 'action';
  completed: boolean;
  action: {
    succeed: boolean;
    message: string;
  };
};

class ActionResponseBuilder {
  apiKey: string;
  apiSecret: string;
  requestId: string;
  isSynchronous: boolean | null;

  constructor(requestId: string, isSynchronous: boolean | null, apiKey: string, apiSecret: string) {
      if (!apiKey || !requestId) {
        throw new Error('RequestId are required');
      }
      this.apiKey = apiKey;
      this.apiSecret = apiSecret;
      this.requestId = requestId;
      this.isSynchronous = isSynchronous;
  }

  async build(succeed: boolean,  message?: string): Promise<boolean | ActionResponse> {
  const action_response:ActionResponse = { 
      type: 'action',
      completed: true,
      action: {
        succeed: succeed,
        message: message ? message : ( succeed ? 'Succeed' : 'Failed' )
      }
  };

  if(this.isSynchronous){
    return action_response;
  }

  try {
    const response = await axios({
      method: 'POST',
      url:`https://api.runmorph.dev/v0/requests/${this.requestId}/response`,
      headers: {
        'x-api-key': this.apiKey,
        'x-api-secret': this.apiSecret
      },
      data: action_response
    });

    // Check the HTTP status code
    // between 200-299 inclusive indicate success
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else {
      throw new Error(JSON.stringify(response));
    }
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}
}


export { Morph, CardBuilder, Card, CardContent }