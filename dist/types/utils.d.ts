import type { AnsiStyle, ErrorExt, Merge } from './types';
export declare const PKG: any;
export declare const PACKAGE_NAME = "optio";
export declare const APP_NAME: any;
/**
 * Checks TTY mode.
 *
 * @returns Whether or not stdout is TTY.
 */
export declare function isTTY(): boolean;
/**
 * Checks if the current environment/terminal supports color.
 *
 * @returns A bool indicating whether terminal supports color.
 */
export declare function hasColorSupport(): boolean;
export declare function readPkg(path?: string): any;
/**
 * Gets a history path for use with repl.
 *
 * @param appName the application's name.
 * @param rootDir the root directory where history is stored.
 * @returns A history path normalized with appName.
 */
export declare function getHistoryPath(appName?: string, rootDir?: string): string;
/**
 * Loads the REPL history file.
 *
 * @param path the path to the history file.
 * @param max the maximum lines for the history file.
 * @returns The repl history file.
 */
export declare function loadHistory(path: string, max?: number): string[];
/**
 * Appends to history file.
 *
 * @param path the path to save the history to.
 * @param line the line to be appended.
 */
export declare function appendHistory(path: string, line: string): void;
/**
 * Wraps a promise return object containing error and promise result.
 *
 * @param prom - the promise to be wrapped.
 * @returns An object containing error and result.
 */
export declare function promise<T, E extends ErrorExt = ErrorExt>(prom: Promise<T>): Promise<{
    err?: E;
    data?: T;
}>;
/**
 * Checks if a value is a promise.
 *
 * @param value the value to be inspected.
 * @returns Whether or not a the value is a Promise.
 */
export declare function isPromise(value: unknown): boolean;
/**
 * Converts a function to a promise.
 *
 * @param fn the function to be promisified.
 * @param options isMulti to return all params, isNode for node style callbacks, rejectErrors.
 * @returns A promisified function.
 */
export declare function promisify<F extends (...args: any) => any>(fn: F, options?: {
    isMulti?: boolean;
    isNode?: boolean;
    rejectErrors: boolean;
}): (...args: Parameters<F>) => Promise<ReturnType<F>>;
/**
 * Applies ansi styles to a string.
 *
 * @param str the string to be colorized.
 * @param styles the ansi styles to be applied.
 * @returns An ansi styled string.
 */
export declare function colorize(str: string, ...styles: AnsiStyle[]): string;
/**
 * Generates a unique ID.
 *
 * @param radix the quantity or base of numbers.
 */
export declare function generateUID(radix?: number): string;
/**
 * Ensures a value is returned, it's default or fallsback to null.
 *
 * @param value the value to inspect as defined.
 * @param def a default value when value is undefined.
 * @returns A defined value or null.
 */
export declare function ensureValue<T>(value: T, def?: T | undefined): T | undefined;
/**
 * Ensures value is an array.
 *
 * @param value the value to inpsect as an array.
 * @param def the default array if value is undefined.
 * @returns Returns value as an array.
 */
/**
 * Merges two objects ensuring that target is not overwritten with undefined value preserving defaults.
 *
 * @param target the target object.
 * @param source the source object.
 * @returns An object merged ensuring defaults.
 */
export declare function ensureDefaults<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): Merge<T, S>;
