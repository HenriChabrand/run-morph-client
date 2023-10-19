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

## CardContent
This class is used to manage the content of a `Card`. Depending upon the `type` (`text` or `status`), it facilitates the manipulation of `label`, `value`, and `color` (only for `status` type).

#### Text Content

You can add text to your card using the `newText` method of the `Card` class.

```javascript
let cardContent = card.newText('Label', 'Text Value');
```

This will create a new text content with the given label and value. You can access and modify the properties of `CardContent` using:

```javascript
cardContent.setLabel('New Label');
cardContent.setValue('New Value');
```
Please note that color change is not applicable for text content type.

#### Status Content
You can add a status to your card using the `newStatus` method of the `Card` class.

```javascript
let cardContent = card.newStatus('Label', 'Status Value', 'SUCCESS');
```

This will create a new status content with the given label, value, and color. You can access and modify the properties of `CardContent` like label, value, and color through:

```javascript
cardContent.setLabel('New Status Label');
cardContent.setValue('New Status Value');
cardContent.setColor('WARNING');
```

Make sure to use a valid color. The acceptable colors for statuses are 'SUCCESS', 'WARNING', 'DANGER', 'INFO' and 'DEFAULT'.

```javascript
cardContent.setColor('INVALID_COLOR'); // Throws error
```

> Please remember, the `setColor` function is only available for 'status' type of CardContent and not for 'text'.

## Action

The `Action` class is used to handle actions that can occur in your cards. These actions can be defined as `ActionType` and include 'REQUEST', 'OPEN_URL', and 'OPEN_URL_IN_IFRAME'. 

An action can be addition as a global action (applies to all cards), or individually to a specific card. Note that 'OPEN_URL' and 'OPEN_URL_IN_IFRAME' types require a URL.
 
#### URL Open Action

To create an instance of an `Action` of type 'OPEN_URL', you need to define the type, name, and the URL to be opened.

```javascript
let action = card.newAction('OPEN_URL', 'Open URL Action Name', 'https://www.example.com');
```

#### iFrame Open Action

Similarly, to create an instance of an `Action` of type 'OPEN_URL_IN_IFRAME', you need to define the type, name, and the URL to be opened in iFrame.

```javascript
let action = card.newAction('OPEN_URL_IN_IFRAME', 'iFrame URL Action Name', 'https://www.example.com');
```
> Note: The URL is mandatory for 'OPEN_URL' and 'OPEN_URL_IN_IFRAME' action types. An attempt to create such action types without a URL raises an error.


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
