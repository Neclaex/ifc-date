# International Fixed Calendar 

IFC is an npm package for simple handling of date and time (based on gregorian calendar) conversion to international fixed calendar date and time within your project.

## Installation

Use the package manager [npm](https://docs.npmjs.com/cli/v9/commands/npm-install) to install ifc-date.

```npm
npm install ifc-date
```

## Usage

```typescript
const { ifcDate } = require('ifc-date');
//import { ifcDate } from 'ifc-date';

// Current utc time -> 2023-02-19T03:01:55.293Z
console.log( new ifcDate().toISOString() );

// Utc time of timestamp -> 2023-02-19T03:01:55.293Z
console.log( new ifcDate(1676516515293).toISOString() );

// Utc time of gregorian calendar string -> 2023-02-19T03:01:55.000Z
console.log( new ifcDate('February 16, 2023 03:01:55').toISOString() );

// Utc time of gregorian calendar input -> 2023-02-19T03:01:55.293Z
console.log( new ifcDate(2023, 1, 16, 3, 1, 55, 293).toISOString() );

// Utc time of Date or ifcDate object -> 2023-02-19T03:01:55.293Z
console.log( new ifcDate( new Date(2023, 1, 16, 3, 1, 55, 293) ).toISOString() );


// Leap- and Year Day support -> 2024-06-29T03:02:04.004Z
console.log( new ifcDate(2024, 5, 17, 3, 2, 4, 4).toISOString() );
// Leap- and Year Day support -> 2024-LD 03:02:04.004
console.log( new ifcDate(2024, 5, 17, 3, 2, 4, 4).toUTCString() );

// Add/Subtract Time -> returns timestamp example: 1676685715293
const ms = require('ms'); // It's on you how you convert your time to milliseconds
console.log( new ifcDate(2023, 1, 16, 3, 1, 55, 293).addTime( ms('2d') ) );
```

## Information

- Except for a timestamp or IFC-/Date object, all inputs must be based on gregorian calendar.
- `.toISOString()` returns an `Date().toISOString().` styled string.
- `.getMonth()` and `.getUTCMonth()` returns the month index (0-12).
- `.getDate()` and `.getUTCDate()` returns 1-28 (29 if leap/year day).
- `.getDay()` and `.getUTCDay()` returns the day index (0-6, 7* Year Day, 8* Leap Day).
- LD (Leap Day) and YD (Year Day) are [special weekend days](https://en.wikipedia.org/wiki/International_Fixed_Calendar#Rules) in the year.

## CLI

Looking for an CLI? Check out the cli this package is based on!

- [ifc-cli](https://www.npmjs.com/package/ifc-cli) by [@gauravnumber](https://github.com/gauravnumber)
