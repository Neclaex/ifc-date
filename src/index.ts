/*interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
};*/

class calculate {
    private numOfDaysThisYear: number;
    private month: number;
    private weekDay: number;
    private remainingDays: number;
    private knownToday: Date;
    private todayYear: number;
    private fixedDays: number;

    constructor(utc: boolean, date?: Date) {
        let today = date ?? new Date();
        if (utc) {
            today = new Date (today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), today.getUTCMilliseconds());
        };

        this.knownToday = today;
        this.todayYear = today.getFullYear();
        const resetYear = new Date(this.todayYear, 0, 0);

        const diffResetYearAndNow = today.getTime() - resetYear.getTime();

        this.numOfDaysThisYear = diffResetYearAndNow / (1000 * 3600 * 24);

        this.numOfDaysThisYear = Math.floor(this.numOfDaysThisYear);

        this.month = 0;
        this.remainingDays = 0;
        this.weekDay = 0;
        this.fixedDays = 365;
        this.calculate(this.numOfDaysThisYear);
    };

    private calculate(numOfDaysThisYear: number) {
        if (this.isLeapYear()) {
            this.fixedDays = 366;

            numOfDaysThisYear = numOfDaysThisYear > 169 ? numOfDaysThisYear - 1 : numOfDaysThisYear;
        };

        if (numOfDaysThisYear > this.fixedDays) {
            this.month += Math.floor(this.numOfDaysThisYear / this.fixedDays);
            this.calculate(numOfDaysThisYear - this.fixedDays);
        } else {
            let month = numOfDaysThisYear / 28;
            this.month = Math.ceil(month);
            this.remainingDays = numOfDaysThisYear % 28 === 0 ? 28 : numOfDaysThisYear % 28;
        };

        this.whatWeekDay();
    };

    private isLeapYear(): boolean {
        return ((this.todayYear % 4 === 0 && this.todayYear % 100 !== 0) || this.todayYear % 400 === 0);
    };

    private whatWeekDay() {
        const weekDays = [[1, 8, 15, 22], [2, 9, 16, 23], [3, 10, 17, 24], [4, 11, 18, 25], [5, 12, 19, 26], [6, 13, 20, 27], [7, 14, 21, 28]];
        for (let days of weekDays) {
            if (days.find(n => n === this.remainingDays)) {
                this.weekDay = weekDays.indexOf(days);
            };
        };
        if (this.numOfDaysThisYear % this.fixedDays === 0) {
            this.weekDay = 7;
        } else if (this.isLeapYear()) {
            if (this.numOfDaysThisYear === 169) {
                this.weekDay = 8;
            };
        };
    };

    now() {
        let info = {
            day: this.weekDay,
            date: this.remainingDays,
            month: this.month - 1,
            year: this.todayYear,
            hours: this.knownToday.getHours(),
            minutes: this.knownToday.getMinutes(),
            seconds: this.knownToday.getSeconds(),
            milliseconds: this.knownToday.getMilliseconds(),
        };

        if (this.numOfDaysThisYear % this.fixedDays === 0) {
            info.date = 29;
            info.month = 12;
        };

        if (this.isLeapYear()) {
            if (this.numOfDaysThisYear === 169) {
                info.date = 29;
                info.month = 5;
            };
        };

        return info;
    };
};

type ifcOutput = {
    day: number;
    date: number;
    month: number;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

type ifcJson = {
    year: number;
    month: number;
    date: number;
    day: number;
    isLeapDay: boolean;
    isLeapYear: boolean;
    isYearDay: boolean;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    timezoneOffset: number;
    UTC: {
        year: number;
        month: number;
        date: number;
        day: number;
        isLeapDay: boolean;
        isLeapYear: boolean;
        isYearDay: boolean;
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;
    };
    timestamp: number;
};

export class ifcDate {
    protected GGCDate: Date;
    protected ifcDate: string;
    #ifc: ifcOutput;
    #ifcUTC: ifcOutput;

    /**
     * Creates a new ifcDate for the current time
     */
    constructor();
    /**
     * Creates a new ifcDate based on given timestamp, string* or Date*
     * * *Based on gregorian calendar
     */
    constructor(value: number | string | Date);
    /**
     * The full year designation is required for cross-century date accuracy. If year between 0 and 99 is used, then year is assumed to be 1900 + year.
     * * Creates a new ifcDate based on given gregorian calendar input
     */
    constructor(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number);

    constructor (...args: Array<any>) {
        if (args.length === 1) {
            if (typeof args[0].GGCDate !== 'undefined') {
                this.GGCDate = new Date(args[0].GGCDate);
            } else {
                this.GGCDate = new Date(args[0]);
            };
        } else if (args.length > 1) {
            let dC = args.slice(0, 7);
            if (dC.length < 7) { dC = Array.from({ length: 7 }, (_, i) => dC[i] ?? 0); };
            if (dC[2] === 0) { dC[2] = 1; };
            this.GGCDate = new Date(dC[0], dC[1], dC[2], dC[3], dC[4], dC[5], dC[6]);
        } else {
            this.GGCDate = new Date();
        };
        this.#ifc = new calculate(false, this.GGCDate).now();
        this.#ifcUTC = new calculate(true, this.GGCDate).now();
        this.ifcDate = this.toISOString();
    };

    /** Get the stored time value in milliseconds since midnight, January 1, 1970 UTC. */
    getTime () : number {
        return this.GGCDate.getTime();
    };

    /** Get the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC). */
    getTimezoneOffset () : number {
        return this.GGCDate.getTimezoneOffset();
    };

    /** True if it's a leapyear. */
    isLeap () : boolean {
        return ((this.#ifc.year % 4 === 0 && this.#ifc.year % 100 !== 0) || this.#ifc.year % 400 === 0);
    };

    /** True if it's a leapyear. */
    isUTCLeap () : boolean {
        return ((this.#ifcUTC.year % 4 === 0 && this.#ifcUTC.year % 100 !== 0) || this.#ifcUTC.year % 400 === 0);
    };

    /** Get the year. */
    getFullYear () : number {
        return this.#ifc.year;
    };

    /** Get the utc year. */
    getUTCFullYear () : number {
        return this.#ifcUTC.year;
    };

    /** Get the month of the year. */
    getMonth () : number {
        return this.#ifc.month;
    };

    /** Get the utc month of the year. */
    getUTCMonth () : number {
        return this.#ifcUTC.month;
    };

    /** Get the day of the month. Returns 29 if it's a special day of the year! */
    getDate () : number {
        return this.#ifc.date;
    };

    /** Get the utc day of the month. Returns 29 if it's a special day of the year! */
    getUTCDate () : number {
        return this.#ifcUTC.date;
    };

    /** Get the weekday 0-6 (Sun - Sat). 7 (Year Day) and 8 (Leap Day) are special days of the year! */
    getDay () : number {
        return this.#ifc.day;
    };

    /** Get the utc weekday 0-6 (Sun - Sat). 7 (Year Day) and 8 (Leap Day) are special days of the year! */
    getUTCDay () : number {
        return this.#ifcUTC.day;
    };

    /** Get the hours of the day. */
    getHours () : number {
        return this.#ifc.hours;
    };

    /** Get the minutes of the day. */
    getMinutes () : number {
        return this.#ifc.minutes;
    };

    /** Get the seconds of the day. */
    getSeconds () : number {
        return this.#ifc.seconds;
    };

    /** Get the milliseconds of the day. */
    getMilliseconds () : number {
        return this.#ifc.milliseconds;
    };

    /** Get the utc hours of the day. */
    getUTCHours () : number {
        return this.#ifcUTC.hours;
    };

    /** Get the utc minutes of the day. */
    getUTCMinutes () : number {
        return this.#ifcUTC.minutes;
    };

    /** Get the utc seconds of the day. */
    getUTCSeconds () : number {
        return this.#ifcUTC.seconds;
    };

    /** Get the utc milliseconds of the day. */
    getUTCMilliseconds () : number {
        return this.#ifcUTC.milliseconds;
    };

    /** Get the date as a string. */
    toDateString () : string {
        let md = `${('0' + ((this.getMonth() ?? 0) + 1)).slice(-2)}-${('0' + (this.getDate() ?? 0)).slice(-2)}`
        if (this.getDate() === 29) {
            if (this.getDay() === 7) md = 'YD';
            if (this.getDay() === 8) md = 'LD';
        };
        return `${this.getFullYear()}-${md}`;
    };

    /** Get the utc date as a string. */
    toUTCDateString () : string {
        let md = `${('0' + ((this.getUTCMonth() ?? 0) + 1)).slice(-2)}-${('0' + (this.getUTCDate() ?? 0)).slice(-2)}`
        if (this.getDate() === 29) {
            if (this.getUTCDay() === 7) md = 'YD';
            if (this.getUTCDay() === 8) md = 'LD';
        };
        return `${this.getUTCFullYear()}-${md}`;
    };

    /** Get the time as a string. */
    toTimeString () : string {
        return `${('0' + this.getHours()).slice(-2)}:${('0' + this.getMinutes()).slice(-2)}:${('0' + this.getSeconds()).slice(-2)}.${('00' + this.getMilliseconds()).slice(-3)}`;
    };

    /** Get the utc time as a string. */
    toUTCTimeString () : string {
        return `${('0' + this.getUTCHours()).slice(-2)}:${('0' + this.getUTCMinutes()).slice(-2)}:${('0' + this.getUTCSeconds()).slice(-2)}.${('00' + this.getUTCMilliseconds()).slice(-3)}`;
    };

    /** Get the date and time as a string. */
    toString () : string {
        return `${this.toDateString()} ${this.toTimeString()}`;
    };

    /** Get the utc date and utc time as a string. */
    toUTCString () : string {
        return `${this.toUTCDateString()} ${this.toUTCTimeString()}`;
    };

    /** Get the utc date and time as an ISO styled string. */
    toISOString () : string {
        return `${this.toUTCDateString().replace(/-([^D]+)D/g, `-${('0' + ((this.getMonth() ?? 0) + 1)).slice(-2)}-${('0' + (this.getDate() ?? 0)).slice(-2)}`)}T${this.toUTCTimeString()}Z`;
    };

    /** Get the json output. */
    toJSON () : ifcJson {
        return {
            year: this.getFullYear(),
            month: this.getMonth(),
            date: this.getDate(),
            day: this.getDay(),
            isLeapDay: (() => { return (this.getDay() === 8) })(),
            isLeapYear: this.isLeap(),
            isYearDay: (() => { return (this.getDay() === 7) })(),
            hours: this.getHours(),
            minutes: this.getMinutes(),
            seconds: this.getSeconds(),
            milliseconds: this.getMilliseconds(),
            timezoneOffset: this.getTimezoneOffset(),
            UTC: {
                year: this.getUTCFullYear(),
                month: this.getUTCMonth(),
                date: this.getUTCDate(),
                day: this.getUTCDay(),
                isLeapDay: (() => { return (this.getUTCDay() === 8) })(),
                isLeapYear: this.isUTCLeap(),
                isYearDay: (() => { return (this.getUTCDay() === 7) })(),
                hours: this.getUTCHours(),
                minutes: this.getUTCMinutes(),
                seconds: this.getUTCSeconds(),
                milliseconds: this.getUTCMilliseconds(),
            },
            timestamp: this.getTime(),
        };
    };

    /** Add milliseconds to the current time.
     *  * "ms" might be a useful package.
     */
    addTime (milliseconds: number) : number {
        return new Date(this.getTime() + milliseconds).getTime();
    };

    /** Subtract milliseconds from the current time.
     *  * "ms" might be a useful package.
     */
    subtractTime (milliseconds: number) : number {
        return new Date(this.getTime() - milliseconds).getTime();
    };
};