/// <reference types="node" />
import type { AsyncCompleter, Completer, Interface, ReadLineOptions } from 'readline';
import type { StylesType } from 'ansi-colors';
import type MuteStream from 'mute-stream';
import type { defaultPlugins } from './plugins';
import type { Optio } from './optio';
import type { defaultCommands } from './commands';
export declare type AnsiStyle = Extract<keyof StylesType<any>, string>;
export declare type ErrorExt<Ext extends Record<string, any> = Record<string, any>> = Error & Ext;
export declare type InferArray<T extends any[]> = T extends (infer U)[] ? [U, ...U[]] : never;
export declare type Merge<A, B> = {
    [K in keyof (A | B)]: K extends keyof B ? B[K] : A[K];
};
export declare type DefaultCommands = typeof defaultCommands;
export declare type DefaultPlugins = typeof defaultPlugins;
export declare type Primitive = string | boolean | number;
export declare type AnyTypeBase = Primitive | null | Date | RegExp | Symbol;
export declare type AnyType = AnyTypeBase | Record<string, AnyTypeBase>;
export declare type OptioInterface = Interface & {
    _addHistory: any;
    history: string[];
    completer: Completer | AsyncCompleter;
};
export interface KeyEvent {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}
export declare type Answer = Primitive | Primitive[] | null | undefined;
export declare type Answers<E extends Record<string, IEvent>> = Record<keyof E, Answer>;
export declare type FinishHandler<A extends Answers<any>> = (answers: A) => void;
export declare type WhenHandler = <E extends Record<string, IEvent>, A extends Answers<E>>(answers: A, done?: (shouldDisplay: boolean) => void) => boolean | Promise<boolean>;
export declare type TransformHandler = (answer: string, done?: (answer: Answer) => void) => Answer;
export declare type ValidateResponse = boolean | string;
export declare type ValidateHandler = (answer: Answer, done?: (validity: ValidateResponse) => void) => ValidateResponse | Promise<ValidateResponse>;
export declare type RenderHandler = (err?: string, done?: (answer: Answer) => void) => string | Promise<string>;
export declare type ActionResult = string | [string, any[]];
export declare type ActionHandler = (args: string[], optio: Optio, cb?: (result: ActionResult) => void) => void | ActionResult | Promise<ActionResult>;
export declare type PluginInitHandler = <E extends IEvent>(event: E) => TypedEvent<E>;
export declare type PluginInit = <H extends PluginHandler, O extends Optio>(fn: H, optio: O) => PluginInitHandler;
export declare type PluginHandler = <E extends IEvent, O extends Optio>(event: E, optio: O) => IPlugin;
export declare type Plugin<O extends Record<string, any>> = (options?: O) => PluginHandler;
export interface IPlugin {
    when?: WhenHandler;
    transform?: TransformHandler;
    validate?: ValidateHandler;
    render?: RenderHandler;
    action?: ActionHandler;
}
export declare type TypedEvent<E extends IEvent = IEvent> = Required<IPlugin> & {
    config: E;
};
export interface IEvent<P extends DefaultPlugins = DefaultPlugins> extends Omit<IPlugin, 'render'> {
    readonly name?: string;
    readonly isCommand?: boolean;
    alias?: string[];
    type: keyof P;
    describe?: string;
    defaultOption?: string;
    defaultValue?: Primitive;
    isArray?: boolean;
    isRequired?: boolean;
}
export declare type CommandParser = (args: string[]) => Record<string, any>;
export declare type WritableStream = NodeJS.WriteStream & {
    fd: 1;
};
export declare type InputStream = NodeJS.ReadableStream & {
    isTTY: boolean;
    setRawMode: (raw: boolean) => void;
};
export interface IOptions<P extends DefaultPlugins = DefaultPlugins> extends Omit<ReadLineOptions, 'input'> {
    name?: string;
    input?: InputStream;
    output?: MuteStream | WritableStream;
    stdout?: WritableStream;
    confirmExit?: boolean;
    color?: boolean;
    hints?: boolean | string[];
    defaultsColor?: AnsiStyle | AnsiStyle[];
    prefixColor?: AnsiStyle | AnsiStyle[];
    errorColor?: AnsiStyle | AnsiStyle[];
    timeout?: number;
    plugins?: P;
}
export interface IOptionsInternal<P extends DefaultPlugins = DefaultPlugins> extends Required<Omit<IOptions<P>, 'plugins'>> {
    output: MuteStream;
    defaultsColor: AnsiStyle[];
    prefixColor: AnsiStyle[];
    errorColor: AnsiStyle[];
    plugins: Record<keyof P, PluginInitHandler>;
}
