# Morph SDK
Morph is a package designed to build, manage, and send interaction CRM cards to service like HubSpot, Salesforce and Intercom – with only one build ✨

These cards can include texts, status, links, and actions. This package enables the creation of a card with different content types and actions using classes and methods for easy manipulation.

## Installation
```
npm install run-morph-client
```
or
```
yarn add run-morph-client
```

## Getting Started

Before getting started, ensure that you have an API key. You can obtain this key by reaching out to [Henri Chabrand](https://www.linkedin.com/in/henri-chabrand--product-manager/).

```javascript
import { Morph } from 'run-morph-client';

let morph = new Morph('YOUR_API_KEY');
```

## Usage

#### Morph
This is the main class and it should be initialized with an API Key.

```javascript
let morph = new Morph('YOUR_API_KEY');
```

#### CardBuilder
This class is used to create new cards and global actions.

It take as only parametre the `REQUEST_ID` that you will receiver from Morph `card.requested` webhook.

```javascript
let cardBuilder = morph.newCardBuilder('REQUEST_ID');

let card = cardBuilider.newCard('Hello World Card');
card.newText('Foo', 'Bar');
```

#### Card
This class is for managing card title, link, contents, and actions. Multiple instances of `CardContent` can be added as card content and similarly, `Action` instances can be added as actions.

```javascript
let card = cardBuilider.newCard('Card Title');

card.newText('Text Label', 'Text Value');
card.newStatus('Status Label', 'Status Value', 'SUCCESS');
card.newAction('OPEN_URL', 'https://henri.pm/');
```

#### CardContent
This class manages card content. Depending upon content type (`text` or `status`), it allows manipulation of label, value and color (for `status` type)

```javascript
let content = card.newStatus('Status Label', 'Status Value', 'SUCCESS');

content.setLabel('New Label');
content.setValue('New Value');
content.setColor('WARNING');
```

## Building Cards

Once the card is set up with the desired contents and actions, you need use the `build` method of `CardBuilder` to send the cards.

```javascript
cardBuilder.build().then((status) => {
  if(status) {
    console.log("Card sent successfully");
  } else {
    console.log("Error sending card");
  }
});
```

## Colors and Action Types

Colors for statuses can be:
-  'SUCCESS'
-  'WARNING'
-  'DANGER'
-  'INFO'
-  'DEFAULT'

Action Types can be:
-  'REQUEST'
-  'OPEN_URL'
-  'OPEN_URL_IN_IFRAME'

Note: For 'OPEN_URL' and 'OPEN_URL_IN_IFRAME' action types, an URL is required.
