# International Fixed Calendar 

IFC is an npm package for easy handling of date conversion to IFC within your project.

## Installation

Use the package manager [npm](https://docs.npmjs.com/cli/v9/commands/npm-install) to install @volazy/ifc.

```npm
npm install @volazy/ifc
```

## Usage

```typescript
import { IFCDate } from '@volazy/ifc';
//const { IFCDate } = require('@volazy/ifc');

// Current utc time -> 2023-02-19 03:01:55.293
console.log(new IFCDate().toUTCString());

// Utc time of timestamp -> 2023-02-19 03:01:55.293
console.log(new IFCDate(1676516515293).toUTCString());

// Utc time of time string -> 2023-02-19 03:01:55.293
console.log(new IFCDate('2023-02-16T03:01:55.293Z').toUTCString());

// Utc time of date object -> 2023-02-19 03:01:55.293
let myDate = new Date(2023, 1, 16, 3, 1, 55, 293);
console.log(new IFCDate(myDate).toUTCString());
```

## Information

- `.getMonth()` and `.getUTCMonth()` returns the month index (0-12) or null (if leap/year day)
- `.getDate()` and `.getUTCDate()` returns null if leap/year day
- `.getDay()` and `.getUTCDay()` returns the day index (0-6, 7* Year Day, 8* Leap Day)
- LD (Leap Day) and YD (Year Day) are [special weekend days](https://en.wikipedia.org/wiki/International_Fixed_Calendar#Rules) in the year.

## CLI

Looking for an CLI? Check out the cli this package is based on!

- [ifc-cli](https://www.npmjs.com/package/ifc-cli) by [@gauravnumber](https://github.com/gauravnumber)
