export declare type GuardType = 'string' | 'boolean' | 'number' | 'function' | 'object' | 'symbol' | 'bigint' | 'date' | 'regexp' | 'array' | 'null' | 'undefined' | 'plainObject';
export declare type DataTypeBase = string | boolean | number | undefined | null | Date | RegExp | Symbol | ((...args: any[]) => void) | BigInt | Record<string, any>;
export declare type DataType<T extends DataTypeBase = DataTypeBase> = T | DataTypeBase;
export declare type DataTypeArray<T extends DataTypeBase = DataTypeBase> = DataType<T> | DataType<T>[];
/**
 * Checks if a value is a given type.
 *
 * @param value the value to inspect as type.
 * @param type the type that's expected.
 * @returns A type guard by the specified type.
 */
export declare function isType<T>(value: T, type: GuardType): value is T;
/**
 * Checks if a value is a string.
 *
 * @param value the value to inspect as string.
 * @returns A bool indicating if is string.
 */
export declare function isString(value: any): value is string;
/**
 * Checks if a value is a number.
 *
 * @param value the value to inspect as number.
 * @returns A bool indicating if is number.
 */
export declare function isNumber(value: any): value is number;
/**
 * Checks if a value is a boolean.
 *
 * @param value the value to inspect as boolean.
 * @returns A bool indicating if is boolean.
 */
export declare function isBoolean(value: any): value is boolean;
/**
 * Checks if a value is a function.
 *
 * @param value the value to inspect as function.
 * @returns A bool indicating if is function.
 */
export declare function isFunction<T extends (...args: any[]) => any>(value: T | undefined | null): value is T;
/**
 * Checks if a value is an object.
 *
 * @param value the value to inspect as object.
 * @returns A bool indicating if is object.
 */
export declare function isObject<T extends Record<string, any>>(value: T | undefined | null): value is T;
/**
 * Checks if a value is a plain object literal.
 *
 * @param value the value to inspect as object literal.
 * @returns A bool indicating if is an object literal.
 */
export declare function isPlainObject<T extends Record<string, any>>(value: T | undefined | null): value is T;
/**
 * Checks if a value is an array.
 *
 * @param value the value to inspect as array.
 * @returns A bool indicating if is an array.
 */
export declare function isArray<T extends any[]>(value: DataTypeArray<T>): value is T;
/**
 * Checks if a value is null.
 *
 * @param value the value to inspect as null.
 * @returns A bool indicating if is a null.
 */
export declare function isNull(value: any): value is null;
/**
 * Checks if a value is undefined.
 *
 * @param value the value to inspect as undefined.
 * @returns A bool indicating if is undefined.
 */
export declare function isUndefined(value: any): value is undefined;
/**
 * Checks if a value is a symbol.
 *
 * @param value the value to inspect as symbol.
 * @returns A bool indicating if is a symbol.
 */
export declare function isSymbol(value: any): value is Symbol;
/**
 * Checks if a value is a date.
 *
 * @param value the value to inspect as date.
 * @returns A bool indicating if is a date.
 */
export declare function isDate(value: any): value is Date;
/**
 * Checks if a value is a regular expression.
 *
 * @param value the value to inspect as regular expression.
 * @returns A bool indicating if is a regular expression.
 */
export declare function isRegExp(value: any): value is RegExp;
/**
 * Checks if a value is a big int.
 *
 * @param value the value to inspect as big int.
 * @returns A bool indicating if is a big int.
 */
export declare function isBigInt(value: any): value is BigInt;
/**
 * Checks if a value is a truthy value.
 *
 * @param value the value to inspect.
 * @returns A bool indicating if value is truthy.
 */
export declare function isTruthy(value: any): boolean;
/**
 * Checks if a value is a falsey value.
 *
 * @param value the value to inspect.
 * @returns A bool indicating if value is falsey.
 */
export declare function isFalsey(value: any): boolean;
/**
 * Checks if a value is empty such as an object or array.
 * Falsey values also return true as empty.
 *
 * @param value the value to inspect as empty.
 * @returns A bool indicating if value is empty.
 */
export declare function isEmpty(value: any): boolean;
/**
 * Checks if a value is a promise.
 *
 * @param value the value to be inspected.
 * @returns Whether or not a the value is a Promise.
 */
export declare function isPromise(value: unknown): boolean;
/**
 * Cast value as string.
 *
 * @param value the value to cast as string.
 * @returns A string.
 */
export declare function toString(value: any, def?: string): string;
/**
 * Cast value as boolean.
 *
 * @param value the value to cast as boolean.
 * @returns A boolean.
 */
export declare function toBoolean(value: any, def?: boolean): boolean;
/**
 * Cast value as number.
 *
 * @param value the value to cast as number.
 * @returns A number.
 */
export declare function toNumber(value: any, def?: number): any;
/**
 * Cast value as date.
 *
 * @param value the value to cast as date.
 * @returns A date.
 */
export declare function toDate(value: any, def?: Date | null): Date | null;
/**
 * Cast value as an array of type.
 *
 * @param value the value to cast as an array.
 * @returns An array of type.
 */
export declare function toArray<T = any>(value: any, def?: T[]): T[];
