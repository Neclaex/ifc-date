export type ifcOutput = {
    day: number;
    date: number | null;
    month: number | null;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

export type ifcJson = {
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
};