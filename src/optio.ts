import readline from 'readline';
import MuteStream from 'mute-stream';
import split from 'split-string';
import figures from 'figures';
import { defaultCommands } from './commands';
import { defaultPlugins, initPlugin } from './plugins';
import { appendHistory, loadHistory, getHistoryPath, hasColorSupport, APP_NAME, colorize, promisify } from './utils/helpers';
import { isString, isUndefined, toArray } from './utils/isto';
import type { IEvent, IOptions, WritableStream, Answers, FinishHandler, ActionResult, DefaultPlugins, Primitive, OptioInterface, IOptionsInternal, PluginInitHandler, TypedEvent } from './types';

const DEFAULTS: IOptions = {
  name: APP_NAME,
  terminal: true,
  input: process.stdin,
  output: process.stdout,
  color: hasColorSupport(),
  confirmExit: true,
  hints: true,
  defaultsColor: 'dim',
  prefixColor: 'green',
  errorColor: 'red',
  timeout: 0,
  plugins: defaultPlugins
};

/**
 * Normalizes options extends with defaults.
 * 
 * @param options Optio options to be normalized.
 * @returns Normalized object/map of Optio options.
 */
function normalizeOptions<P extends DefaultPlugins>(options?: IOptions<P>) {

  const ms = new MuteStream();
  const input = options?.input || process.stdin;
  const stdout = options?.output || process.stdout;
  ms.pipe(options?.output || process.stdout);

  if (!input.isTTY)
    throw new Error(`Optio cannot render prompts in non-TTY environments.`);

  input.setRawMode(true);

  options = {
    ...DEFAULTS,
    ...options
  } as Required<IOptions<P>>;

  options.input = input;
  options.output = ms;
  options.stdout = stdout as WritableStream;
  options.defaultsColor = toArray(options.defaultsColor);
  options.prefixColor = toArray(options.prefixColor);
  options.errorColor = toArray(options.errorColor);

  // Cast here we'll fix plugins in constructor.
  return options as unknown as IOptionsInternal<P>

}

export class Optio<E extends Record<string, IEvent> = Record<string, IEvent>, P extends DefaultPlugins = DefaultPlugins> {

  private unsubscribeListeners!: () => void;

  input: NodeJS.ReadableStream & {
    isTTY: boolean;
    setRawMode: (raw: boolean) => void;
  }
  output: MuteStream;
  stdout: WritableStream;
  events = {} as { [K in keyof E]: TypedEvent<E[K]> };
  keyMap: Record<string, keyof E>;
  indexes: Extract<Extract<keyof E, string>, string>[];
  answers = {} as Answers<E>;

  muted = false;
  mutedHistory = false;
  running = false;
  active?: TypedEvent;
  isREPL = false;
  onDone?: FinishHandler<Answers<E>>;

  options: IOptionsInternal<P>;

  rl: OptioInterface;

  constructor(events: E, options: IOptionsInternal<P>) {
    options.completer = this.initCompleter(options);
    options.plugins = this.initPlugins(options.plugins as any);
    const { events: initEvents, keyMap, indexes } = this.initEvents(events, options.plugins);
    this.events = initEvents;
    this.keyMap = keyMap;
    this.indexes = indexes;
    this.options = options;
    this.input = options.input;
    this.stdout = options.stdout;
    this.output = options.output;
    this.rl = readline.createInterface(options) as OptioInterface;
    this.unsubscribeListeners = this.bindListeners();
    this.initHistory();
    this.rl.resume();
  }

  /**
   * Binds event listeners to process and Readline interface.
   * 
   * @returns A method for unsubscribing bound listeners.
   */
  private bindListeners() {
    process.on('exit', this.kill.bind(this));
    this.rl.on('SIGINT', this.kill.bind(this));
    this.rl.on('line', this.onLine.bind(this));
    return () => {
      process.removeListener('exit', this.kill.bind(this));
      this.rl.removeListener('SIGINT', this.kill.bind(this));
      this.rl.removeListener('line', this.onLine.bind(this));
    };
  }

  /**
   * Binds history for REPL.
   */
  private initHistory() {

    const path = getHistoryPath(this.options.name);
    const history = loadHistory(path, this.options.historySize);
    const addHistory = this.rl._addHistory;

    this.rl._addHistory = () => {
      const last = this.rl.history[0];
      const line = addHistory.call(this.rl);
      if (line.length > 0 && line !== last && !this.mutedHistory)
        appendHistory(path, line);
      return line;
    };

    if (history.length)
      this.rl.history.push.apply(this.rl.history, history);

  }

  /**
   * Builds string array of command name hints.
   * 
   * @returns An array of command names.
   */
  private loadHints() {
    return Object.keys(this.events).reduce((a, c) => {
      const event = this.events[c];
      if (!event.config?.isCommand) return a;
      return [...a, c];
    }, [] as string[]);
  }

  /**
   * Creates and binds the default completer.
   * 
   * @returns A completer function for matching commands.
   */
  private initCompleter(options: IOptionsInternal<P>) {

    // Completer already configured.
    if (!!options.completer)
      return options.completer;

    // Get hints.
    const hints = !options.hints
      ? [] : options.hints === true
        ? this.loadHints()
        : options.hints;

    // Default completer.
    return (line: string) => {
      const hits = hints.filter(v => v.startsWith(line));
      return [hits.length ? hits : hints, line];
    };

  }

  /**
   * Initializes plugins and returns.
   * 
   * @param plugins type plugins to be initialized.
   * @returns A map of initialized plugins.
   */
  private initPlugins(plugins: P) {
    // Cast as any just initting applying context
    // and defaults. The resulting handler will have
    // the same signature. Clean this up later.
    for (const k in plugins) {
      plugins[k as keyof P] = initPlugin(plugins[k] as any, this as any) as any;
    }
    return plugins as unknown as Record<keyof P, PluginInitHandler>;
  }

  /**
   * Normalizes the map of events.
   * 
   * @param events the map of events.
   * @param plugins initialized plugins for initializing events.
   * @returns The normalized events.
   */
  private initEvents(events: E, plugins: Record<keyof P, PluginInitHandler>) {

    const indexes = [] as Extract<keyof E, string>[];
    const keyMap = {} as Record<string, keyof E>;
    const _events = {} as { [K in keyof E]: TypedEvent<E[K]> };

    for (const k in events) {

      const event = events[k];
      indexes.push(k);
      (event as any).name = k;
      event.alias = toArray(event.alias);
      event.alias.unshift(k);
      event.describe = event.describe || k;

      // Default to require unless defined or a when event is defined.
      if (isUndefined(event.isRequired) && !event.when)
        event.isRequired = true;

      // Iterate alias keys and build reverse keymap
      // for looking up events by alias.
      event.alias.forEach(key => {
        if (keyMap[key])
          throw new Error(`Duplicate Event key ${key} for ${k} detected.`);
        keyMap[key] = k;
      });

      if (typeof event.action === 'function')
        (event as any).isCommand = true;

      if (event.action && !event.isCommand)
        throw new Error(`Event ${k} has "action" but is NOT a command.`);

      _events[k] = plugins[event.type](event);

    }

    return { indexes, keyMap, events: _events };

  }

  /**
   * Readline on line listener, listens for line input.
   * 
   * @param line the current line.
   * @returns A promise of void.
   */
  private async onLine(line: string) {

    if (this.muted || !this.isREPL) return;

    line = line.trim();

    const args = split(line, { separator: ' ', quotes: ['"', "'"] });
    const name = args.shift();
    const event = this.getEventByName(name as Extract<keyof E, string>);

    // If no event or not a command type event just prompt.
    if (!event || !event.config.isCommand) {
      console.log(`command not found: ${name}`);
      return this.rl.prompt();
    }

    // Run the command
    await this.runCommand(event, args);

    // Reprompt.
    this.rl.prompt();

  }

  /**
   * Returns Readline built-in module.
   */
  get readline() {
    return readline;
  }

  /**
   * Figure characters for use with prompts.
   */
  get figures() {
    return figures;
  }

  get plugins() {
    return this.options.plugins;
  }

  /**
   * Creates a new Optio module.
   * 
   * @param events the events for the instance.
   * @param options options for the ReadLine interface
   * @returns A new instance of Optio.
   */
  createModule<V extends Record<string, IEvent>, L extends DefaultPlugins = DefaultPlugins>(events: V, options?: IOptions<L>) {
    const optio =
      new Optio(events, normalizeOptions({ ...this.options, ...options }));
    return optio;
  }

  /**
   * Finds an Event by it's key name or an alias.
   * 
   * @param name the key used to lookup an event.
   * @returns A found event looked up by its key or alias.
   */
  getEventByName(name: Extract<keyof E, string> | undefined) {
    if (!name) return undefined;
    const eventKey = this.keyMap[name];
    return this.events[eventKey];
  }

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
  getEventIndex(nameOrEvent: Extract<keyof E, string> | TypedEvent) {

    const key = typeof nameOrEvent === 'string'
      ? this.keyMap[nameOrEvent]
      : nameOrEvent.config.name;

    const event = this.events[key as keyof E];
    // Commands aren't indexed.
    if (!event || event.config?.isCommand)
      return undefined;

    return this.indexes.indexOf(key as Extract<keyof E, string>);

  }

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
  getNextEvent(nameOrEvent?: string | TypedEvent) {

    nameOrEvent = nameOrEvent || this.active?.config?.name;

    if (!nameOrEvent)
      return this.events[this.indexes[0]];

    const key = (typeof nameOrEvent === 'string'
      ? this.keyMap[nameOrEvent]
      : nameOrEvent?.config.name) as Extract<keyof E, string>;

    const idx = this.getEventIndex(key);

    if (!~idx)
      return undefined;

    const nextName = this.indexes[idx + 1];

    return this.events[nextName];

  }

  /**
   * Gets an event offset from the specified or current event.
   * 
   * @param current the current/active event to offset from.
   * @param offset the numeric position to offset with.
   */
  offsetEvent(current: TypedEvent | undefined = this.active, offset = 1): TypedEvent | undefined {

    // No current event get the first.
    if (typeof current === 'undefined')
      return this.events[this.indexes[0]];

    const currentIdx = this.indexes.indexOf(current.config?.name as Extract<keyof E, string>);

    if (!~currentIdx)
      return undefined;

    const nextIdx = currentIdx + offset;

    if (!this.indexes[nextIdx])
      return undefined;

    return this.events[this.indexes[nextIdx]];

  }

  /**
   * Moves the cursor to a specific set of coordinates.
   * 
   * @param x the x coordinate to set cursor to.
   * @param y the y coordinate to set cursor to.
   * @param cb an optional callback on completion.
   * @returns A bool indicating if successful.
   */
  cursorTo(x: number, y?: number, cb?: () => void): boolean {
    return readline.cursorTo(this.stdout, x, y, cb);
  }

  /**
   * Moves the cursor relative to the current position.
   * 
   * @param dx the x coordinate.
   * @param dy the y coordinate.
   * @param cb optional callback on done.
   * @returns A bool indicating if successful.
   */
  cursorMove(dx: number, dy: number, cb?: () => void) {
    return readline.moveCursor(this.stdout, dx, dy, cb)
  }

  /**
   * Clears the screen down from the current position.
   * 
   * @returns A bool indicating if the clear screen down was successful.
   */
  clearDown() {
    return readline.clearScreenDown(this.stdout);
  }

  /**
   * Clears the line by direction.
   * 
   * @param direction the direction to clear before, all, after.
   * @param onClear an optional callback on cleared.
   * @returns A bool indicating if the line was cleared.
   */
  clearLine(direction: -1 | 0 | 1 = 0, onClear: () => void = (() => { })) {
    return readline.clearLine(this.stdout, direction, () => onClear);
  }

  /**
   * Mutes the output stream.
   * 
   * @returns The Optio context.
   */
  mute() {
    this.output.mute();
    this.muted = true;
    return this;
  }

  /**
   * Unmutes the output stream.
   * 
   * @returns The Optio context.
   */
  unmute() {
    this.output.unmute();
    this.muted = false;
    return this;
  }

  /**
   * Mutes the output stream.
   * 
   * @returns The Optio context.
   */
  muteHistory() {
    this.mutedHistory = true;
    return this;
  }

  /**
   * Unmutes the output stream.
   * 
   * @returns The Optio context.
   */
  unmuteHistory() {
    this.mutedHistory = false;
    return this;
  }

  /**
   * Enables REPL mode.
   * 
   * @returns The current instance.
   */
  repl() {
    this.isREPL = true;
    return this;
  }

  /**
   * Disable REPL mode restoring to Query mode.
   * 
   * @returns The current instance.
   */
  unrepl() {
    this.isREPL = false;
    return this;
  }

  /**
   * Formats a prompt to be displayed.
   * 
   * @param message the prompt message to be displayed.
   * @param defaults any defaults that should be shown.
   * @param prefix any prefix indicating type that should be shown.
   * @returns Object containing formatted prompt params and args.
   */
  formatPrompt(message?: string, defaults?: Primitive, prefix: string | undefined = '?') {

    message = message || '';

    const color = this.options.color;
    let formatted = message

    // A template when prompt has been answered.
    let answered = message;

    if (prefix) {
      color
        ? formatted = colorize(prefix, ...this.options.prefixColor) + ' ' + formatted
        : formatted = prefix + ' ' + formatted;
      answered = formatted;
    }

    if (defaults)
      color
        ? formatted = formatted + ' ' + colorize(defaults + '', ...this.options.defaultsColor)
        : formatted = formatted + ' ' + defaults;

    formatted = formatted + ' ';

    return {
      prefix,
      message,
      defaults,
      formatted,
      answered
    };

  }

  /**
   * Formats an error message for display.
   * 
   * @param err the error message to be displayed.
   * @param prefix the optional prefix typically a pointer.
   * @returns A styled error message.
   */
  formatError(err: string, prefix = figures.pointer) {
    if (prefix)
      err = prefix + ' ' + err;
    return colorize(err, ...this.options.errorColor);
  }

  /**
   * Writes an answer to the output stream after rendered and validated.
   * 
   * @param message the message to be written.
   * @param answer the answer that was given.
   */
  writeAnswered(message: string, answer: string) {
    this.clearLine(0);
    this.output.write(message + ' ' + answer + '\n');
  }

  /**
   * Parse an event.action response.
   * 
   * @param response the Action result response.
   * @returns The next event and argumnts if any.
   */
  parseAction(response: ActionResult | void): { next: TypedEvent | undefined, args: any[] } {

    let result: { next: TypedEvent | undefined, args: any[] } = { next: undefined, args: [] };

    if (!response)
      return result;

    if (typeof response === 'string' || Array.isArray(response)) {

      const nextName = (typeof response === 'string' ? response : response[0]) as Extract<keyof E, string>;
      const nextEvent = this.getEventByName(nextName);
      const nextArgs = Array.isArray(response) ? response.slice(1) : [];

      result.next = nextEvent
      result.args = nextArgs;

    }

    return result;

  }

  /**
   * Promisifies readline's built-in "question" prompt.
   * 
   * @param question the question to be prompted.
   * @returns A promise resolving the provided answer.
   */
  runQuestion(question: string) {
    return new Promise<string>(res => {
      this.rl.question(question, (answer) => {
        res(answer);
      });
    });
  }

  /**
   * Runs a command
   * 
   * @param event the command event to run.
   * @param params arguments to be passed to the command.
   * @returns An action result for next command or undefined.
   */
  async runCommand(event: TypedEvent | undefined, params = [] as any[]): Promise<ActionResult | undefined> {

    if (!event)
      return undefined;

    // Ensure flat args array.
    params = params.flat(Infinity);

    const response = await promisify(event.action)(params, this as any);
    const { next, args } = this.parseAction(response);

    return this.runCommand(next, args);

  }

  /**
   * Runs a prompt renders, validates and displays.
   * 
   * @param event the event to be run
   * @param err error that should be passed when reprompting.
   * @returns A promise containing the next event if any.
   */
  async runPrompt(event: TypedEvent | undefined, err?: string): Promise<Answers<E>> {

    if (!event)
      return this.stop();

    this.active = event;

    // Check if should display.
    const shouldDisplay = await promisify(event.when)(this.answers);

    // If shouldn't display get the next event.
    if (!shouldDisplay)
      return this.runPrompt(this.getNextEvent(event));

    // Renders the prompt pass in any error when reprompting.
    const result = await promisify(event.render)(err);

    // Transforms the prompts result into type desired type.
    const transformed = await promisify(event.transform)(result);

    // Validate
    const isValid = await promisify(event.validate)(transformed);

    if (isValid === false || typeof isValid === 'string') {
      const err = isString(isValid) ? isValid : `Event ${event.config.name} is invalid.`;
      return this.runPrompt(event, err);
    }

    // Everything is successful update answers with the transformed result.
    this.answers[event.config.name as keyof E] = transformed;

    // Get the next event and prompt!
    // if no event stop will be called.
    return this.runPrompt(this.getNextEvent(event));

  }

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

  start(promptOrPreserveOrHandler?: string | boolean | FinishHandler<Answers<E>>, preserveCursor?: boolean): void | Promise<Answers<E>> {

    let handler: undefined | FinishHandler<Answers<E>>;

    if (typeof promptOrPreserveOrHandler === 'boolean') {
      preserveCursor = promptOrPreserveOrHandler;
      promptOrPreserveOrHandler = undefined;
    }

    else if (typeof promptOrPreserveOrHandler === 'function') {
      preserveCursor = undefined;
      handler = promptOrPreserveOrHandler;
      promptOrPreserveOrHandler = undefined;
    }

    else if (typeof promptOrPreserveOrHandler === 'undefined') {
      handler = (() => { }); // just so we know its prompt mode.
    }

    if (handler) {
      this.onDone = handler;
      return this.runPrompt(this.getNextEvent());
    }

    const currentPrompt = this.rl.getPrompt();

    let prompt = typeof promptOrPreserveOrHandler === 'string'
      ? promptOrPreserveOrHandler
      : this.options.prompt;

    prompt = prompt || currentPrompt;
    if (prompt === '> ')
      prompt = APP_NAME + '> ';

    this.repl();
    this.rl.setPrompt(prompt);
    this.rl.prompt(preserveCursor);

  }

  /**
   * Stops the application and returns the results.
   * 
   * @returns The current prompt answers.
   */
  stop() {
    this.running = false;
    this.active = undefined;
    this.unsubscribeListeners();
    this.output.end();
    this.rl.pause();
    this.rl.close();
    if (this.onDone)
      this.onDone(this.answers);
    return Promise.resolve(this.answers);
  }

  flush() {
    return new Promise(res => {
      this.clearLine(1, () => res(null));
    });
  }

  /**
   * Confirms with the user if should exit or not.
   * 
   * @returns A promise indicating whether to exit or not. 
   */
  async confirmExit() {
    this.muteHistory(); // no need to store this result.
    const isMuted = this.muted;
    this.unmute();
    const prompt = this.formatPrompt(`Are you sure you want to exit?`, 'y/N');
    const answer = await this.runQuestion(prompt.formatted);
    this.unmuteHistory();
    if (answer.toLowerCase().startsWith('y'))
      return true;
    if (isMuted) // reset mute back to previous state.
      this.mute();
    return false;
  }

  /**
   * Handler to kill event listeners such as "exit" or "SIGINT".
   * 
   * @param shouldPrompt bool indicating if should prompt before exiting.
   */
  async kill(shouldPrompt = this.options.confirmExit) {
    if (shouldPrompt) { // don't confirm exit when in prompt mode.
      const shouldExit = await this.confirmExit();
      if (!shouldExit) {
        this.rl.prompt();
        return;
      }
    }
    this.rl.pause();
    this.rl.close();
    process.kill(process.pid, 'SIGINT');
    console.log('');
  }

}

export function createOptio<E extends Record<string, IEvent | keyof P>, P extends DefaultPlugins = DefaultPlugins>(events: E, options?: IOptions<P>): Optio<Record<keyof E, IEvent>, P> {
  const normalizedOptions = normalizeOptions(options);
  const normalizedEvents = events as Record<keyof E, IEvent>;
  // Allows for setting value of config as simple
  for (const k in normalizedEvents) {
    if (typeof normalizedEvents[k] === 'string') {
      const val = normalizedEvents[k] as unknown as keyof P;
      normalizedEvents[k] = {
        type: val
      } as IEvent;
    }
  }
  return new Optio(normalizedEvents, normalizedOptions);
}

export const optioApi = {
  defaultCommands,
  defaultPlugins,
  create: createOptio
};



