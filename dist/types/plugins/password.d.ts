import type { Plugin } from '../types';
export interface IPasswordPlugin {
    mask?: string;
    allowedChars?: '*' | string[] | RegExp;
    minLength?: number;
}
export declare const passwordPlugin: Plugin<IPasswordPlugin>;
