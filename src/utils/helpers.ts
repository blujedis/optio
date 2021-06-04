import ansiStyles from 'ansi-colors';
import supportsColor from 'supports-color';
import { join } from 'path';
import { homedir } from 'os';
import fsExtra from 'fs-extra'; // import as default for esm.
import type { AnsiStyle, ErrorExt, Merge } from '../types';

const { appendFileSync, ensureDirSync, existsSync, readFileSync, readJSONSync } = fsExtra;

export const PKG = readPkg();
export const PACKAGE_NAME = 'optio';
export const APP_NAME = PKG.name || PACKAGE_NAME;

// Base Utils

/**
 * Checks TTY mode.
 * 
 * @returns Whether or not stdout is TTY.
 */
export function isTTY() {
  return process.stdout.isTTY;
}

/**
 * Checks if the current environment/terminal supports color.
 * 
 * @returns A bool indicating whether terminal supports color.
 */
export function hasColorSupport(): boolean {
  return !!supportsColor;
}

export function readPkg(path?: string) {
  path = path || join(process.cwd(), 'package.json');
  return readJSONSync(path, { throws: false }) || {};
}

/**
 * Gets a history path for use with repl.
 * 
 * @param appName the application's name.
 * @param rootDir the root directory where history is stored.
 * @returns A history path normalized with appName.
 */
export function getHistoryPath(appName?: string, rootDir?: string) {
  rootDir = !rootDir ? join(homedir(), `.${APP_NAME}`) : rootDir;
  ensureDirSync(rootDir);
  return join(rootDir, (appName || 'default') + '.txt');
}

/**
 * Loads the REPL history file.
 * 
 * @param path the path to the history file.
 * @param max the maximum lines for the history file.
 * @returns The repl history file. 
 */
export function loadHistory(path: string, max = 50) {
  if (!existsSync(path))
    return [];
  return readFileSync(path, 'utf8')
    .toString().split('\n')
    .slice(0, -1)
    .reverse()
    .slice(0, max);
}

/**
 * Appends to history file.
 * 
 * @param path the path to save the history to.
 * @param line the line to be appended.
 */
export function appendHistory(path: string, line: string) {
  appendFileSync(path, line + '\n');
}

// Helpers

/**
 * Wraps a promise return object containing error and promise result.
 * 
 * @param prom - the promise to be wrapped.
 * @returns An object containing error and result.
 */
export function promise<T, E extends ErrorExt = ErrorExt>(prom: Promise<T>): Promise<{ err?: E, data?: T }> {
  return prom
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

/**
 * Converts a function to a promise.
 * 
 * @param fn the function to be promisified.
 * @param options isMulti to return all params, isNode for node style callbacks, rejectErrors.
 * @returns A promisified function.
 */
export function promisify<F extends (...args: any) => any>(fn: F, options?: { isMulti?: boolean, isNode?: boolean, rejectErrors: boolean }) {
  options = { isNode: false, isMulti: false, rejectErrors: false, ...options };
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise(async function promiseWrapper(this: typeof promiseWrapper, res, rej) {
      function cb(errOrData: any, ...params: any[]) {
        if (errOrData && options?.isNode || errOrData && errOrData instanceof Error && options?.rejectErrors)
          return rej(errOrData);
        if (options?.isNode)
          return res(options?.isMulti ? params : params[0]);
        res(options?.isMulti ? [errOrData, ...params] : errOrData);
      }
      args.push(cb);
      const result = await fn.call(this, ...args);
      return res(result);
    });
  }
}

/**
 * Applies ansi styles to a string.
 * 
 * @param str the string to be colorized.
 * @param styles the ansi styles to be applied.
 * @returns An ansi styled string.
 */
export function colorize(str: string, ...styles: AnsiStyle[]) {
  if (!supportsColor || !str)
    return str;
  return styles.reduce((a, c) => {
    if (typeof ansiStyles[c] !== 'undefined')
      a = ansiStyles[c](a);
    return a;
  }, str);
}

/**
 * Generates a unique ID. 
 * 
 * @param radix the quantity or base of numbers.
 */
export function generateUID(radix = 16) {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(radix);
}

/**
 * Ensures a value is returned, it's default or fallsback to null.
 * 
 * @param value the value to inspect as defined.
 * @param def a default value when value is undefined.
 * @returns A defined value or null.
 */
export function ensureValue<T>(value: T, def: T | undefined = undefined) {
  if (typeof value !== 'undefined')
    return value;
  return def;
}

/**
 * Merges two objects ensuring that target is not overwritten with undefined value preserving defaults.
 * 
 * @param target the target object.
 * @param source the source object.
 * @returns An object merged ensuring defaults.
 */
export function ensureDefaults<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): Merge<T, S> {
  const result = target as Merge<T, S>;
  for (const k in source) {
    if (!source.hasOwnProperty(k)) continue;
    if (typeof source[k] !== 'undefined')
      result[k] = source[k];
  }
  return result;
}

