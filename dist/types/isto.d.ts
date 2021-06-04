export declare type GuardType = 'string' | 'boolean' | 'number' | 'function' | 'object' | 'symbol' | 'bigint' | 'date' | 'regexp' | 'array' | 'null' | 'undefined' | 'plainObject';
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
export declare function isString(value: string): value is string;
/**
 * Checks if a value is a number.
 *
 * @param value the value to inspect as number.
 * @returns A bool indicating if is number.
 */
export declare function isNumber(value: number): value is number;
/**
 * Checks if a value is a boolean.
 *
 * @param value the value to inspect as boolean.
 * @returns A bool indicating if is boolean.
 */
export declare function isBoolean(value: boolean): value is boolean;
/**
 * Checks if a value is a function.
 *
 * @param value the value to inspect as function.
 * @returns A bool indicating if is function.
 */
export declare function isFunction<T extends (...args: any[]) => any>(value: T): value is T;
/**
 * Checks if a value is an object.
 *
 * @param value the value to inspect as object.
 * @returns A bool indicating if is object.
 */
export declare function isObject<T extends Record<string, any>>(value: T): value is T;
/**
 * Checks if a value is a plain object literal.
 *
 * @param value the value to inspect as object literal.
 * @returns A bool indicating if is an object literal.
 */
export declare function isPlainObject<T extends Record<string, any>>(value: T): value is T;
/**
 * Checks if a value is an array.
 *
 * @param value the value to inspect as array.
 * @returns A bool indicating if is an array.
 */
export declare function isArray<T extends any[]>(value: T): value is T;
/**
 * Checks if a value is null.
 *
 * @param value the value to inspect as null.
 * @returns A bool indicating if is a null.
 */
export declare function isNull(value: null): value is null;
/**
 * Checks if a value is undefined.
 *
 * @param value the value to inspect as undefined.
 * @returns A bool indicating if is undefined.
 */
export declare function isUndefined(value: undefined): value is undefined;
/**
 * Checks if a value is a symbol.
 *
 * @param value the value to inspect as symbol.
 * @returns A bool indicating if is a symbol.
 */
export declare function isSymbol(value: Symbol): value is Symbol;
/**
 * Checks if a value is a date.
 *
 * @param value the value to inspect as date.
 * @returns A bool indicating if is a date.
 */
export declare function isDate(value: Date): value is Date;
/**
 * Checks if a value is a regular expression.
 *
 * @param value the value to inspect as regular expression.
 * @returns A bool indicating if is a regular expression.
 */
export declare function isRegExp(value: RegExp): value is RegExp;
/**
 * Checks if a value is a big int.
 *
 * @param value the value to inspect as big int.
 * @returns A bool indicating if is a big int.
 */
export declare function isBigInt(value: BigInt): value is BigInt;
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
export declare function toNumber(value: any, def?: number): number;
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
