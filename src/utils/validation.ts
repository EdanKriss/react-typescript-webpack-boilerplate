export function isString(value: any): value is string {
    return typeof value === 'string' || value instanceof String;
}

export function isNumber(value: any): value is number {
    return typeof value === 'number';
}

export function isInteger(value: any): boolean {
    return typeof value === 'number' && Math.floor(value) === value;
}

export function isObject(value: any): value is Object {
    // return Object.prototype.toString.call(value) === '[object Object]'; // alternative
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type _typeof_PossibleValues = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export namespace PropertyValidation {
    export interface Typeof {
        propertyName: string,
        valueType: _typeof_PossibleValues,
        allowNull: boolean,
        allowUndefined: boolean,
        error?: Error,
    }
    export interface StringRegex {
        propertyName: string,
        regex: RegExp,
        allowNull: boolean,
        allowUndefined: boolean,
        error?: Error,
    }
    export interface Equality {
        propertyName: string,
        exactValue: _typeof_PossibleValues,
        error?: Error,
    }
}

// Best suited for strings, numbers, and booleans until expanded.
// Currently only supports built-in typeof operator comparisons and null/undefined equality comparisons.
// TODO add more features, string length, regex, Array/Object, equality comparison against const array values, etc
export function validateObject(
    object: any, 
    typeof_validations: PropertyValidation.Typeof[] | undefined,
    regex_validations?: PropertyValidation.StringRegex[],
    equality_validations?: PropertyValidation.Equality[],
): boolean {
    if (!isObject(object)) return false;
    if (typeof_validations && typeof_validations.length > 0) {
        for (const validation of typeof_validations) {
            if (
                !object.hasOwnProperty(validation.propertyName)
                || 
                (
                    (validation.allowNull)

                        ?   (validation.allowUndefined)

                                ?   (object[validation.propertyName] !== null) 
                                    && (object[validation.propertyName] !== undefined)
                                    && (typeof object[validation.propertyName] !== validation.valueType)

                                :   (object[validation.propertyName] !== null) 
                                    && (typeof object[validation.propertyName] !== validation.valueType)

                        :   (validation.allowUndefined)

                            ?   (object[validation.propertyName] !== undefined)
                                && (typeof object[validation.propertyName] !== validation.valueType)

                            :   (typeof object[validation.propertyName] !== validation.valueType)
                )
            ) {
                if (validation.error) {
                    throw validation.error;
                } else {
                    return false;
                }
            }
        }
    }
    if (regex_validations && regex_validations.length > 0) {
        for (const validation of regex_validations) {
            if (
                !object.hasOwnProperty(validation.propertyName)
                || 
                !isString(object[validation.propertyName])
                ||
                (
                    (validation.allowNull)

                        ?   (validation.allowUndefined)

                                ?   (object[validation.propertyName] !== null) 
                                    && (object[validation.propertyName] !== undefined)
                                    && (!validation.regex.test(object[validation.propertyName]))

                                :   (object[validation.propertyName] !== null) 
                                    && (!validation.regex.test(object[validation.propertyName]))

                        :   (validation.allowUndefined)

                            ?   (object[validation.propertyName] !== undefined)
                                && (!validation.regex.test(object[validation.propertyName]))

                            :   (!validation.regex.test(object[validation.propertyName]))
                )
            ) {
                if (validation.error) {
                    throw validation.error;
                } else {
                    return false;
                }
            }
        }
    }
    // untested
    if (equality_validations && equality_validations.length > 0) {
        for (const validation of equality_validations) {
            if (
                !object.hasOwnProperty(validation.propertyName)
                || 
                object[validation.propertyName] !== validation.exactValue
            ) {
                if (validation.error) {
                    throw validation.error;
                } else {
                    return false;
                }
            }
        }
    }
    return true;
}
// doesnt require every property, but there must be at least one, and all present must be valid
export function validatePartialObject(
    object: any, 
    regex_validations: PropertyValidation.StringRegex[],
): boolean {
    if (!isObject(object)) return false;
    // check for any properties that shouldnt be there
    for (const key in object) {
        // if key is not in validator array
        if (!regex_validations.some(({ propertyName }) => propertyName === key)) {
            throw { name: "InvalidRequestError", message: `Request is invalid.`, status: 400 };
        }
    }
    const valid: boolean = regex_validations.some((validation) => {
        if (
            !object.hasOwnProperty(validation.propertyName)
            || 
            !isString(object[validation.propertyName])
        ) {
            return false;
        } else {
            if (validation.allowNull) {
                if (validation.allowUndefined) {
                    if (
                        (object[validation.propertyName] !== null) 
                        && (object[validation.propertyName] !== undefined)
                        && (!validation.regex.test(object[validation.propertyName]))) 
                    {
                        if (validation.error) {
                            throw validation.error;
                        } else {
                            throw { name: "InvalidRequestError", message: `${validation.propertyName} is invalid.`, status: 400 };
                        }
                    } else {
                        return true;
                    }
                } else {
                    if (
                        (object[validation.propertyName] !== null) 
                        && (!validation.regex.test(object[validation.propertyName]))
                    ) {
                        if (validation.error) {
                            throw validation.error;
                        } else {
                            throw { name: "InvalidRequestError", message: `${validation.propertyName} is invalid.`, status: 400 };
                        }
                    } else {
                        return true;
                    }
                }
            } else {
                if (validation.allowUndefined) {
                    if (
                        (object[validation.propertyName] !== undefined)
                        && (!validation.regex.test(object[validation.propertyName]))) 
                    {
                        if (validation.error) {
                            throw validation.error;
                        } else {
                            throw { name: "InvalidRequestError", message: `${validation.propertyName} is invalid.`, status: 400 };
                        }
                    } else {
                        return true;
                    }
                } else {
                    if (
                        (!validation.regex.test(object[validation.propertyName]))
                    ) {
                        if (validation.error) {
                            throw validation.error;
                        } else {
                            throw { name: "InvalidRequestError", message: `${validation.propertyName} is invalid.`, status: 400 };
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
    });
    return valid;
}

export const Regex = {

    // RFC5322 according to this guide: https://emailregex.com/
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    // 1 lowercase letter, 1 uppercase letter, 1 number, and be between 8 and 24 characters long
    password: /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,24}$/,

    // Length constraint 2-36
    name: /^.{2,36}$/,

    // exactly 10 digits with no spaces or other characters allowed
    phone: /^[0-9]{10}$/,

    // at least one digit, not other characters allowed, no max length
    digitsOnly: /^[0-9]+$/,

    // strict format as provided from Date.prototype.toISOString()
    // strict month-day validation (i.e. June 31 not allowed), but always allows 29 feb
    // restricts years to 19xx and 20xx
    ISO_Date: /^[12][90][0-9][0-9]-(?:(?:01|03|05|07|08|10|12)-(?:0[1-9]|[1-2][0-9]|3[0-1])|(?:04|06|09|11)-(?:0[1-9]|[1-2][0-9]|30)|02-(?:0[1-9]|[1-2][0-9]))T(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].[0-9]{3}Z$/,

    // only allows 00, 15, 30, 45 for minutes, and zeroed out seconds and ms
    ISO_Date_15minIncrements: /^[12][90][0-9][0-9]-(?:(?:01|03|05|07|08|10|12)-(?:0[1-9]|[1-2][0-9]|3[0-1])|(?:04|06|09|11)-(?:0[1-9]|[1-2][0-9]|30)|02-(?:0[1-9]|[1-2][0-9]))T(?:[0-1][0-9]|2[0-3]):(?:00|15|30|45):00.000Z/,
};

export type HumanName = string;
export function isValidHumanName(value: any): value is HumanName {
    return isString(value) && Regex.name.test(value);
}

export type Email = string;
export function isValidEmail(value: any): value is Email {
    return isString(value) && value.length > 5 && value.length < 255 && Regex.email.test(value);
}

export type Password = string;
export function isValidPassword(value: any): value is Password {
    return isString(value) && Regex.password.test(value);
}

export type Phone = string;
export function isValidPhone(value: any): value is Phone {
    return isString(value) && Regex.phone.test(value);
}