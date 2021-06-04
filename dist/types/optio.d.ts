/// <reference types="node" />
import readline from 'readline';
import MuteStream from 'mute-stream';
import type { IEvent, IOptions, WritableStream, Answers, FinishHandler, ActionResult, DefaultPlugins, Primitive, OptioInterface, IOptionsInternal, PluginInitHandler, TypedEvent } from './types';
export declare class Optio<E extends Record<string, IEvent> = Record<string, IEvent>, P extends DefaultPlugins = DefaultPlugins> {
    private unsubscribeListeners;
    input: NodeJS.ReadableStream & {
        isTTY: boolean;
        setRawMode: (raw: boolean) => void;
    };
    output: MuteStream;
    stdout: WritableStream;
    events: { [K in keyof E]: TypedEvent<E[K]>; };
    keyMap: Record<string, keyof E>;
    indexes: Extract<Extract<keyof E, string>, string>[];
    answers: Answers<E>;
    muted: boolean;
    mutedHistory: boolean;
    running: boolean;
    active?: TypedEvent;
    isREPL: boolean;
    onDone?: FinishHandler<Answers<E>>;
    options: IOptionsInternal<P>;
    rl: OptioInterface;
    constructor(events: E, options: IOptionsInternal<P>);
    /**
     * Binds event listeners to process and Readline interface.
     *
     * @returns A method for unsubscribing bound listeners.
     */
    private bindListeners;
    /**
     * Binds history for REPL.
     */
    private initHistory;
    /**
     * Builds string array of command name hints.
     *
     * @returns An array of command names.
     */
    private loadHints;
    /**
     * Creates and binds the default completer.
     *
     * @returns A completer function for matching commands.
     */
    private initCompleter;
    /**
     * Initializes plugins and returns.
     *
     * @param plugins type plugins to be initialized.
     * @returns A map of initialized plugins.
     */
    private initPlugins;
    /**
     * Normalizes the map of events.
     *
     * @param events the map of events.
     * @param plugins initialized plugins for initializing events.
     * @returns The normalized events.
     */
    private initEvents;
    /**
     * Readline on line listener, listens for line input.
     *
     * @param line the current line.
     * @returns A promise of void.
     */
    private onLine;
    /**
     * Returns Readline built-in module.
     */
    get readline(): typeof readline;
    /**
     * Figure characters for use with prompts.
     */
    get figures(): {
        (string: string): string;
        readonly main: {
            readonly tick: string;
            readonly cross: string;
            readonly star: string;
            readonly square: string;
            readonly squareSmall: string;
            readonly squareSmallFilled: string;
            readonly play: string;
            readonly circle: string;
            readonly circleFilled: string;
            readonly circleDotted: string;
            readonly circleDouble: string;
            readonly circleCircle: string;
            readonly circleCross: string;
            readonly circlePipe: string;
            readonly circleQuestionMark: string;
            readonly bullet: string;
            readonly dot: string;
            readonly line: string;
            readonly ellipsis: string;
            readonly pointer: string;
            readonly pointerSmall: string;
            readonly info: string;
            readonly warning: string;
            readonly hamburger: string;
            readonly smiley: string;
            readonly mustache: string;
            readonly heart: string;
            readonly nodejs: string;
            readonly arrowUp: string;
            readonly arrowDown: string;
            readonly arrowLeft: string;
            readonly arrowRight: string;
            readonly radioOn: string;
            readonly radioOff: string;
            readonly checkboxOn: string;
            readonly checkboxOff: string;
            readonly checkboxCircleOn: string;
            readonly checkboxCircleOff: string;
            readonly questionMarkPrefix: string;
            readonly oneHalf: string;
            readonly oneThird: string;
            readonly oneQuarter: string;
            readonly oneFifth: string;
            readonly oneSixth: string;
            readonly oneSeventh: string;
            readonly oneEighth: string;
            readonly oneNinth: string;
            readonly oneTenth: string;
            readonly twoThirds: string;
            readonly twoFifths: string;
            readonly threeQuarters: string;
            readonly threeFifths: string;
            readonly threeEighths: string;
            readonly fourFifths: string;
            readonly fiveSixths: string;
            readonly fiveEighths: string;
            readonly sevenEighth: string;
        };
        readonly windows: {
            readonly tick: string;
            readonly cross: string;
            readonly star: string;
            readonly square: string;
            readonly squareSmall: string;
            readonly squareSmallFilled: string;
            readonly play: string;
            readonly circle: string;
            readonly circleFilled: string;
            readonly circleDotted: string;
            readonly circleDouble: string;
            readonly circleCircle: string;
            readonly circleCross: string;
            readonly circlePipe: string;
            readonly circleQuestionMark: string;
            readonly bullet: string;
            readonly dot: string;
            readonly line: string;
            readonly ellipsis: string;
            readonly pointer: string;
            readonly pointerSmall: string;
            readonly info: string;
            readonly warning: string;
            readonly hamburger: string;
            readonly smiley: string;
            readonly mustache: string;
            readonly heart: string;
            readonly nodejs: string;
            readonly arrowUp: string;
            readonly arrowDown: string;
            readonly arrowLeft: string;
            readonly arrowRight: string;
            readonly radioOn: string;
            readonly radioOff: string;
            readonly checkboxOn: string;
            readonly checkboxOff: string;
            readonly checkboxCircleOn: string;
            readonly checkboxCircleOff: string;
            readonly questionMarkPrefix: string;
            readonly oneHalf: string;
            readonly oneThird: string;
            readonly oneQuarter: string;
            readonly oneFifth: string;
            readonly oneSixth: string;
            readonly oneSeventh: string;
            readonly oneEighth: string;
            readonly oneNinth: string;
            readonly oneTenth: string;
            readonly twoThirds: string;
            readonly twoFifths: string;
            readonly threeQuarters: string;
            readonly threeFifths: string;
            readonly threeEighths: string;
            readonly fourFifths: string;
            readonly fiveSixths: string;
            readonly fiveEighths: string;
            readonly sevenEighth: string;
        };
    } & {
        readonly tick: string;
        readonly cross: string;
        readonly star: string;
        readonly square: string;
        readonly squareSmall: string;
        readonly squareSmallFilled: string;
        readonly play: string;
        readonly circle: string;
        readonly circleFilled: string;
        readonly circleDotted: string;
        readonly circleDouble: string;
        readonly circleCircle: string;
        readonly circleCross: string;
        readonly circlePipe: string;
        readonly circleQuestionMark: string;
        readonly bullet: string;
        readonly dot: string;
        readonly line: string;
        readonly ellipsis: string;
        readonly pointer: string;
        readonly pointerSmall: string;
        readonly info: string;
        readonly warning: string;
        readonly hamburger: string;
        readonly smiley: string;
        readonly mustache: string;
        readonly heart: string;
        readonly nodejs: string;
        readonly arrowUp: string;
        readonly arrowDown: string;
        readonly arrowLeft: string;
        readonly arrowRight: string;
        readonly radioOn: string;
        readonly radioOff: string;
        readonly checkboxOn: string;
        readonly checkboxOff: string;
        readonly checkboxCircleOn: string;
        readonly checkboxCircleOff: string;
        readonly questionMarkPrefix: string;
        readonly oneHalf: string;
        readonly oneThird: string;
        readonly oneQuarter: string;
        readonly oneFifth: string;
        readonly oneSixth: string;
        readonly oneSeventh: string;
        readonly oneEighth: string;
        readonly oneNinth: string;
        readonly oneTenth: string;
        readonly twoThirds: string;
        readonly twoFifths: string;
        readonly threeQuarters: string;
        readonly threeFifths: string;
        readonly threeEighths: string;
        readonly fourFifths: string;
        readonly fiveSixths: string;
        readonly fiveEighths: string;
        readonly sevenEighth: string;
    };
    get plugins(): Record<keyof P, PluginInitHandler>;
    /**
     * Creates a new Optio module.
     *
     * @param events the events for the instance.
     * @param options options for the ReadLine interface
     * @returns A new instance of Optio.
     */
    createModule<V extends Record<string, IEvent>, L extends DefaultPlugins = DefaultPlugins>(events: V, options?: IOptions<L>): Optio<V, Record<keyof P, PluginInitHandler> | L>;
    /**
     * Finds an Event by it's key name or an alias.
     *
     * @param name the key used to lookup an event.
     * @returns A found event looked up by its key or alias.
     */
    getEventByName(name: Extract<keyof E, string> | undefined): { [K in keyof E]: TypedEvent<E[K]>; }[keyof E] | undefined;
    /**
     * Gets the index of an event.
     *
     * @param event the Event to get index for.
     * @returns The index of the specified event.
     */
    getEventIndex(event: TypedEvent): number;
    /**
    * Gets the index of an event.
    *
    * @param name the Event name to get index for.
    * @returns The index of the specified event.
    */
    getEventIndex(name: Extract<keyof E, string>): number;
    /**
     * Gets the next event from current event.
     *
     * @param event the Event used to get current event.
     * @returns The next event.
     */
    getNextEvent(event: TypedEvent): TypedEvent | undefined;
    /**
    * Gets the next event from current event name.
    *
    * @param name the Event name used to get next event.
    * @returns The next event.
    */
    getNextEvent(name?: Extract<keyof E, string>): TypedEvent | undefined;
    /**
     * Gets an event offset from the specified or current event.
     *
     * @param current the current/active event to offset from.
     * @param offset the numeric position to offset with.
     */
    offsetEvent(current?: TypedEvent | undefined, offset?: number): TypedEvent | undefined;
    /**
     * Moves the cursor to a specific set of coordinates.
     *
     * @param x the x coordinate to set cursor to.
     * @param y the y coordinate to set cursor to.
     * @param cb an optional callback on completion.
     * @returns A bool indicating if successful.
     */
    cursorTo(x: number, y?: number, cb?: () => void): boolean;
    /**
     * Moves the cursor relative to the current position.
     *
     * @param dx the x coordinate.
     * @param dy the y coordinate.
     * @param cb optional callback on done.
     * @returns A bool indicating if successful.
     */
    cursorMove(dx: number, dy: number, cb?: () => void): boolean;
    /**
     * Clears the screen down from the current position.
     *
     * @returns A bool indicating if the clear screen down was successful.
     */
    clearDown(): boolean;
    /**
     * Clears the line by direction.
     *
     * @param direction the direction to clear before, all, after.
     * @param onClear an optional callback on cleared.
     * @returns A bool indicating if the line was cleared.
     */
    clearLine(direction?: -1 | 0 | 1, onClear?: () => void): boolean;
    /**
     * Mutes the output stream.
     *
     * @returns The Optio context.
     */
    mute(): this;
    /**
     * Unmutes the output stream.
     *
     * @returns The Optio context.
     */
    unmute(): this;
    /**
     * Mutes the output stream.
     *
     * @returns The Optio context.
     */
    muteHistory(): this;
    /**
     * Unmutes the output stream.
     *
     * @returns The Optio context.
     */
    unmuteHistory(): this;
    /**
     * Enables REPL mode.
     *
     * @returns The current instance.
     */
    repl(): this;
    /**
     * Disable REPL mode restoring to Query mode.
     *
     * @returns The current instance.
     */
    unrepl(): this;
    /**
     * Formats a prompt to be displayed.
     *
     * @param message the prompt message to be displayed.
     * @param defaults any defaults that should be shown.
     * @param prefix any prefix indicating type that should be shown.
     * @returns Object containing formatted prompt params and args.
     */
    formatPrompt(message?: string, defaults?: Primitive, prefix?: string | undefined): {
        prefix: string;
        message: string;
        defaults: Primitive | undefined;
        formatted: string;
        answered: string;
    };
    /**
     * Formats an error message for display.
     *
     * @param err the error message to be displayed.
     * @param prefix the optional prefix typically a pointer.
     * @returns A styled error message.
     */
    formatError(err: string, prefix?: string): string;
    /**
     * Writes an answer to the output stream after rendered and validated.
     *
     * @param message the message to be written.
     * @param answer the answer that was given.
     */
    writeAnswered(message: string, answer: string): void;
    /**
     * Parse an event.action response.
     *
     * @param response the Action result response.
     * @returns The next event and argumnts if any.
     */
    parseAction(response: ActionResult | void): {
        next: TypedEvent | undefined;
        args: any[];
    };
    /**
     * Promisifies readline's built-in "question" prompt.
     *
     * @param question the question to be prompted.
     * @returns A promise resolving the provided answer.
     */
    runQuestion(question: string): Promise<string>;
    /**
     * Runs a command
     *
     * @param event the command event to run.
     * @param params arguments to be passed to the command.
     * @returns An action result for next command or undefined.
     */
    runCommand(event: TypedEvent | undefined, params?: any[]): Promise<ActionResult | undefined>;
    /**
     * Runs a prompt renders, validates and displays.
     *
     * @param event the event to be run
     * @param err error that should be passed when reprompting.
     * @returns A promise containing the next event if any.
     */
    runPrompt(event: TypedEvent | undefined, err?: string): Promise<Answers<E>>;
    /**
     * Starts Optio in REPL mode.
     *
     * @param prompt the REPL prompt to be displayed.
     * @param preserveCursor when true the cursor position is preserved.
     */
    start(prompt: string, preserveCursor?: boolean): void;
    /**
    * Starts Optio in REPL mode.
    *
    * @param replMode when true starts in REPL mode.
    * @param preserveCursor when true the cursor position is preserved.
    */
    start(replMode: true, preserveCursor?: boolean): void;
    /**
     * Starts Optio in Prompt mode.
     *
     * @param done the handler to call on finished completed.
     */
    start(done: FinishHandler<Answers<E>>): Promise<Answers<E>>;
    /**
     * Starts Optio in Prompt mode.
     */
    start(): Promise<Answers<E>>;
    /**
     * Stops the application and returns the results.
     *
     * @returns The current prompt answers.
     */
    stop(): Promise<Answers<E>>;
    flush(): Promise<unknown>;
    /**
     * Confirms with the user if should exit or not.
     *
     * @returns A promise indicating whether to exit or not.
     */
    confirmExit(): Promise<boolean>;
    /**
     * Handler to kill event listeners such as "exit" or "SIGINT".
     *
     * @param shouldPrompt bool indicating if should prompt before exiting.
     */
    kill(shouldPrompt?: boolean): Promise<void>;
}
export declare function createOptio<E extends Record<string, IEvent | keyof P>, P extends DefaultPlugins = DefaultPlugins>(events: E, options?: IOptions<P>): Optio<Record<keyof E, IEvent>, P>;
export declare const optioApi: {
    defaultCommands: Record<string, IEvent<{
        string: import("./types").PluginHandler;
        number: import("./types").PluginHandler;
        boolean: import("./types").PluginHandler;
        password: import("./types").PluginHandler;
        command: import("./types").PluginHandler;
    }>>;
    defaultPlugins: {
        string: import("./types").PluginHandler;
        number: import("./types").PluginHandler;
        boolean: import("./types").PluginHandler;
        password: import("./types").PluginHandler;
        command: import("./types").PluginHandler;
    };
    create: typeof createOptio;
};
