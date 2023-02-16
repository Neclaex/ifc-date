class ifcCalc {
    private numOfDaysThisYear: number;
    private month: number;
    private weekDay: number;
    private remainingDays: number;
    private knownToday: Date;
    private todayYear: number;
    private fixedDays: number;

    constructor(utc: boolean, date?: Date) {
        let today = date ?? new Date()
        this.todayYear = today.getFullYear();
        if (utc) {
            today = new Date (today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), today.getUTCMilliseconds())
            this.todayYear = today.getUTCFullYear(); 
        };

        this.knownToday = today;
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
        if (this.numOfDaysThisYear % this.fixedDays === 0) {
            this.weekDay = 7;
        } else if (this.isLeapYear()) {
            if (this.numOfDaysThisYear === 169) {
                this.weekDay = 8;
            };
        } else {
            const weekDays = [[1, 8, 15, 22], [2, 9, 16, 23], [3, 10, 17, 24], [4, 11, 18, 25], [5, 12, 19, 26], [6, 13, 20, 27], [7, 14, 21, 28]];
            for (let days of weekDays) {
                if (days.find(n => n === this.remainingDays)) {
                    this.weekDay = weekDays.indexOf(days);
                };
            };
        };
    };

    now() {
        let info = {
            day: this.weekDay,
            date: this.remainingDays || null,
            month: this.month - 1 || null,
            year: this.todayYear,
            hours: this.knownToday.getHours(),
            minutes: this.knownToday.getMinutes(),
            seconds: this.knownToday.getSeconds(),
            milliseconds: this.knownToday.getMilliseconds(),
        };

        if (this.numOfDaysThisYear % this.fixedDays === 0) {
            info.date = null;
            info.month = null;
        }

        if (this.isLeapYear()) {
            if (this.numOfDaysThisYear === 169) {
                info.date = null;
                info.month = null;
            };
        };

        return info;
    };
};

type ifcOutput = {
    day: number;
    date: number | null;
    month: number | null;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

type ifcJson = {
    year: number;
    month: number | null;
    date: number | null;
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
        month: number | null;
        date: number | null;
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
}

export class IFCDate {

    private date: Date;
    private ifc: ifcOutput;
    private ifcUTC: ifcOutput;

    constructor (value?: string | number | Date) {
        this.date = value ? new Date(value) : new Date();
        this.ifc = new ifcCalc(false, this.date).now();
        this.ifcUTC = new ifcCalc(true, this.date).now();
    };

    /** Get the stored time value in milliseconds since midnight, January 1, 1970 UTC. */
    getTime () : number {
        return this.date.getTime();
    };

    /** Get the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC). */
    getTimezoneOffset () : number {
        return this.date.getTimezoneOffset();
    };

    /** True if it's a leapyear. */
    isLeap () : boolean {
        return ((this.ifc.year % 4 === 0 && this.ifc.year % 100 !== 0) || this.ifc.year % 400 === 0);
    };

    /** True if it's a leapyear. */
    isUTCLeap () : boolean {
        return ((this.ifcUTC.year % 4 === 0 && this.ifcUTC.year % 100 !== 0) || this.ifcUTC.year % 400 === 0);
    };

    /** Get the year. */
    getFullYear () : number {
        return this.ifc.year;
    };

    /** Get the utc year. */
    getUTCFullYear () : number {
        return this.ifcUTC.year;
    };

    /** Get the month of the year. Returns null if it's a special day of the year! */
    getMonth () : number | null {
        return this.ifc.month;
    };

    /** Get the utc month of the year. Returns null if it's a special day of the year! */
    getUTCMonth () : number | null {
        return this.ifcUTC.month;
    };

    /** Get the day of the month. Returns null if it's a special day of the year! */
    getDate () : number | null {
        return this.ifc.date;
    };

    /** Get the utc day of the month. Returns null if it's a special day of the year! */
    getUTCDate () : number | null {
        return this.ifcUTC.date;
    };

    /** Get the weekday 0-6 (Sun - Sat). 7 (Year Day) and 8 (Leap Day) are special days of the year! */
    getDay () : number {
        return this.ifc.day;
    };

    /** Get the utc weekday 0-6 (Sun - Sat). 7 (Year Day) and 8 (Leap Day) are special days of the year! */
    getUTCDay () : number {
        return this.ifcUTC.day;
    };

    /** Get the hours of the day. */
    getHours () : number {
        return this.ifc.hours;
    };

    /** Get the minutes of the day. */
    getMinutes () : number {
        return this.ifc.minutes;
    };

    /** Get the seconds of the day. */
    getSeconds () : number {
        return this.ifc.seconds;
    };

    /** Get the milliseconds of the day. */
    getMilliseconds () : number {
        return this.ifc.milliseconds;
    };

    /** Get the utc hours of the day. */
    getUTCHours () : number {
        return this.ifcUTC.hours;
    };

    /** Get the utc minutes of the day. */
    getUTCMinutes () : number {
        return this.ifcUTC.minutes;
    };

    /** Get the utc seconds of the day. */
    getUTCSeconds () : number {
        return this.ifcUTC.seconds;
    };

    /** Get the utc milliseconds of the day. */
    getUTCMilliseconds () : number {
        return this.ifcUTC.milliseconds;
    };

    /** Get the date as a string. */
    toDateString () : string {
        let md = `${('0' + ((this.getMonth() ?? 0) + 1)).slice(-2)}-${('0' + (this.getDate() ?? 0)).slice(-2)}`
        if (this.getMonth() === null) {
            if (this.getDay() === 7) md = 'YD';
            if (this.getDay() === 8) md = 'LD';
        };
        return `${this.getFullYear()}-${md}`;
    };

    /** Get the utc date as a string. */
    toUTCDateString () : string {
        let md = `${('0' + ((this.getUTCMonth() ?? 0) + 1)).slice(-2)}-${('0' + (this.getUTCDate() ?? 0)).slice(-2)}`
        if (this.getUTCMonth() === null) {
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
};