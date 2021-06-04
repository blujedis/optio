export type GuardType = 'string' | 'boolean' | 'number' | 'function' | 'object' | 'symbol' | 'bigint' | 'date' | 'regexp' | 'array' | 'null' | 'undefined' | 'plainObject';

export type DataTypeBase = string | boolean | number | undefined | null | Date | RegExp | Symbol | ((...args: any[]) => void) | BigInt | Record<string, any>;

export type DataType<T extends DataTypeBase = DataTypeBase> = T | DataTypeBase;

export type DataTypeArray<T extends DataTypeBase = DataTypeBase> = DataType<T> | DataType<T>[];

// Check Is

/**
 * Checks if a value is a given type.
 * 
 * @param value the value to inspect as type.
 * @param type the type that's expected.
 * @returns A type guard by the specified type.
 */
export function isType<T>(value: T, type: GuardType): value is T {

  if (!['date', 'regexp', 'array', 'null', 'plainObject', 'object'].includes(type))
    return typeof value === type;

  if (type === 'object')
    return value !== null && typeof value === 'object';

  if (type === 'plainObject')
    return (value !== null && typeof value === 'object' &&
      Object.prototype.toString.call(value) === '[object Object]') &&
      typeof (value as Object).constructor === 'function' &&
      (value as Object).constructor.name === 'Object';

  if (type === 'null')
    return value === null;

  if (type === 'date')
    return value instanceof Date;

  if (type === 'regexp')
    return value instanceof RegExp;

  if (type === 'array')
    return Array.isArray(value);

  return false;

}

/**
 * Checks if a value is a string.
 * 
 * @param value the value to inspect as string.
 * @returns A bool indicating if is string.
 */
export function isString(value: any): value is string {
  return isType<string>(value, 'string');
}

/**
 * Checks if a value is a number.
 * 
 * @param value the value to inspect as number.
 * @returns A bool indicating if is number.
 */
export function isNumber(value: any): value is number {
  return isType<number>(value, 'number');
}

/**
 * Checks if a value is a boolean.
 * 
 * @param value the value to inspect as boolean.
 * @returns A bool indicating if is boolean.
 */
export function isBoolean(value: any): value is boolean {
  return isType<boolean>(value, 'boolean');
}

/**
 * Checks if a value is a function.
 * 
 * @param value the value to inspect as function.
 * @returns A bool indicating if is function.
 */
export function isFunction<T extends (...args: any[]) => any>(value: T | undefined | null): value is T {
  return isType(value, 'function');
}

/**
 * Checks if a value is an object.
 * 
 * @param value the value to inspect as object.
 * @returns A bool indicating if is object.
 */
export function isObject<T extends Record<string, any>>(value: T | undefined | null): value is T {
  return isType(value, 'object');
}

/**
 * Checks if a value is a plain object literal.
 * 
 * @param value the value to inspect as object literal.
 * @returns A bool indicating if is an object literal.
 */
export function isPlainObject<T extends Record<string, any>>(value: T | undefined |null): value is T {
  return isType(value, 'plainObject');
}

/**
 * Checks if a value is an array.
 * 
 * @param value the value to inspect as array.
 * @returns A bool indicating if is an array.
 */
export function isArray<T extends any[]>(value: DataTypeArray<T>): value is T {
  return isType(value, 'array');
}

/**
 * Checks if a value is null.
 * 
 * @param value the value to inspect as null.
 * @returns A bool indicating if is a null.
 */
export function isNull(value: any): value is null {
  return isType<null>(value, 'null');
}

/**
 * Checks if a value is undefined.
 * 
 * @param value the value to inspect as undefined.
 * @returns A bool indicating if is undefined.
 */
export function isUndefined(value: any): value is undefined {
  return isType<undefined>(value, 'undefined');
}

/**
 * Checks if a value is a symbol.
 * 
 * @param value the value to inspect as symbol.
 * @returns A bool indicating if is a symbol.
 */
export function isSymbol(value: any): value is Symbol {
  return isType<Symbol>(value, 'symbol');
}

/**
 * Checks if a value is a date.
 * 
 * @param value the value to inspect as date.
 * @returns A bool indicating if is a date.
 */
export function isDate(value: any): value is Date {
  return isType<Date>(value, 'date');
}

/**
 * Checks if a value is a regular expression.
 * 
 * @param value the value to inspect as regular expression.
 * @returns A bool indicating if is a regular expression.
 */
export function isRegExp(value: any): value is RegExp {
  return isType<RegExp>(value, 'regexp');
}

/**
 * Checks if a value is a big int.
 * 
 * @param value the value to inspect as big int.
 * @returns A bool indicating if is a big int.
 */
export function isBigInt(value: any): value is BigInt {
  return isType<BigInt>(value, 'bigint');
}

/**
 * Checks if a value is a truthy value.
 * 
 * @param value the value to inspect.
 * @returns A bool indicating if value is truthy.
 */
export function isTruthy(value: any) {
  return !isNull(value) && !isUndefined(value) && !!value;
}

/**
 * Checks if a value is a falsey value.
 * 
 * @param value the value to inspect.
 * @returns A bool indicating if value is falsey.
 */
export function isFalsey(value: any) {
  return !isTruthy(value);
}

/**
 * Checks if a value is empty such as an object or array.
 * Falsey values also return true as empty.
 * 
 * @param value the value to inspect as empty.
 * @returns A bool indicating if value is empty.
 */
export function isEmpty(value: any) {
  if (isObject(value)) {
    if (isArray(value) && !value.length)
      return true;
    return !Object.keys(value).length;
  }
  return isFalsey(value);
}

/**
 * Checks if a value is a promise.
 * 
 * @param value the value to be inspected.
 * @returns Whether or not a the value is a Promise.
 */
export function isPromise(value: unknown): boolean {
  return Promise.resolve(value) === value;
}

// Conversions

/**
 * Cast value as string.
 * 
 * @param value the value to cast as string.
 * @returns A string.
 */
export function toString(value: any, def = '') {
  if (isString(value))
    return value;
  if (!isUndefined(value) && !isNull(value))
    return value + '';
  return def;
}

/**
 * Cast value as boolean.
 * 
 * @param value the value to cast as boolean.
 * @returns A boolean.
 */
export function toBoolean(value: any, def = false) {
  if (isBoolean(value))
    return value;
  if (isString(value))
    return /(true|yes|0)/.test(value) ? true : false;
  if (isNumber(value))
    return value === 1 ? true : false;
  return def;
}

/**
 * Cast value as number.
 * 
 * @param value the value to cast as number.
 * @returns A number.
 */
export function toNumber(value: any, def = 0) {
  if (isNumber(value))
    return value;
  if (isString(value))
    value = parseFloat(value);
  if (!isNaN(value))
    return value;
  return def;
}

/**
 * Cast value as date.
 * 
 * @param value the value to cast as date.
 * @returns A date.
 */
export function toDate(value: any, def: Date | null = null) {
  if (isDate(value))
    return value;
  if (isString(value) || isNumber(value))
    value = new Date(value);
  if (isDate(value))
    return value;
  return def;
}

/**
 * Cast value as an array of type.
 * 
 * @param value the value to cast as an array.
 * @returns An array of type.
 */
export function toArray<T = any>(value: any, def = [] as T[]) {
  if (isUndefined(value))
    return def;
  if (isArray<T[]>(value))
    return value;
  return [value] as T[];
}

