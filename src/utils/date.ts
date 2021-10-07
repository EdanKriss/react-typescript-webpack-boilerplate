import { isObject, Regex } from './validation';

function getTimestamp(): string {
    // YYYY-MM-DD HH:MM:SS
    const pad = (n: number,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date();
    return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function addMinutesToDate(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes*60000);
}

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

function isValidDateInstance(obj: any): obj is Date {
    return obj instanceof Date && !isNaN(obj.valueOf());
}

interface DateRange {
    start: Date;
    end: Date;
}
function isDateRange(obj: any): obj is DateRange {
    return isObject(obj) && obj.start && obj.end 
        && isValidDateInstance(obj.start)
        && isValidDateInstance(obj.end)
        && obj.start < obj.end;
}

interface ISODateRange {
    start: ISODateString;
    end: ISODateString;
}
function isISODateRange(obj: any): obj is ISODateRange {
    return isObject(obj) && obj.start && obj.end 
        && isISODateString(obj.start)
        && isISODateString(obj.end)
        && (new Date(obj.start)) < (new Date(obj.end));
}

type ISODateString = string;
function isISODateString(string: string): string is ISODateString {
    return Regex.ISO_Date.test(string);
}

/*** 15-minute increment times ***/
// For event start/end times, we only want to allow time in 15 minute increments, with no seconds or miliseconds
// Example: '2021-09-17T12:15:00.000Z'
interface ISODateRange_15minIncrements {
    start: ISODateString_15minIncrements;
    end: ISODateString_15minIncrements;
}
function isISODateRange_15minIncrements(obj: any): obj is ISODateRange_15minIncrements {
    return isObject(obj) && obj.start && obj.end 
        && isISODateString_15minIncrements(obj.start)
        && isISODateString_15minIncrements(obj.end)
        && (new Date(obj.start)) < (new Date(obj.end));
}
type ISODateString_15minIncrements = string;
function isISODateString_15minIncrements(string: string): string is ISODateString_15minIncrements {
    return Regex.ISO_Date_15minIncrements.test(string);
}

type ReasonableYearNumber = number;
function isReasonableYearNumber(year: number): year is ReasonableYearNumber {
    return Number.isInteger(year) && year > 2000 && year < 2050;
}

type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
function isMonthNumber(month: number): month is MonthNumber {
    return Number.isInteger(month) && month > 0 && month < 13;
}

type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
function isDayNumber(day: number): day is DayNumber {
    return Number.isInteger(day) && day > 0 && day < 32;
}

export {
    getTimestamp,
    addMinutesToDate,
    isSameDay,
    isValidDateInstance,
    DateRange,
    isDateRange,
    ISODateRange,
    isISODateRange,
    ISODateString,
    isISODateString,
    ISODateRange_15minIncrements,
    isISODateRange_15minIncrements,
    ISODateString_15minIncrements,
    isISODateString_15minIncrements,
    ReasonableYearNumber,
    isReasonableYearNumber,
    MonthNumber,
    isMonthNumber,
    DayNumber,
    isDayNumber,
};