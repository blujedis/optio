import { toBoolean, toNumber, toString } from '../utils';
import type { Plugin } from '../types';
export interface IInputPlugin {
    dataType: keyof typeof TYPE_MAP;
}
declare const TYPE_MAP: {
    string: typeof toString;
    number: typeof toNumber;
    boolean: typeof toBoolean;
};
export declare const inputPlugin: Plugin<IInputPlugin>;
export {};
