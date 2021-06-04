import type { Answer, KeyEvent, Plugin } from '../types';
import { isArray, isRegExp, isString, toString } from '../utils';

export interface IPasswordPlugin {
  mask?: string;
  allowedChars?: '*' | string[] | RegExp;
  minLength?: number;
}

export const passwordPlugin: Plugin<IPasswordPlugin> = (options) => (event, optio) => {

  const opts = {
    mask: '*',
    allowedChars: '*',
    minLength: 0,
    ...options
  } as Required<IPasswordPlugin>;

  return {

    transform: (answer) => {
      return toString(answer);
    },

    validate: (answer: Answer) => {
      if (!isString(answer))
        return `${event.name} expected password but got ${typeof answer}`;
      if (isRegExp(opts.allowedChars) && !opts.allowedChars.test(answer))
        return `${event.name} contains invalid characters`
      if (isArray(opts.allowedChars) && !answer.split('').some(v => !(opts.allowedChars as string[]).includes(v))) // if chars ensure in list.
        return `${event.name} contains invalid characters`;
      return true;
    },

    render: (err?: string) => {

      const { formatted } = optio.formatPrompt(event.describe, event.defaultOption);
      const formattedErr = err ? optio.formatError(err) : '';

      return new Promise<string>(res => {

        let result = '';

        function inputHandler(data: string, e: KeyEvent) {

          if (e.name === 'backspace') {
            result = result.slice(0, -1);
          }

          else if (e.name === 'return') {
            optio.input.removeListener('keypress', inputHandler);
            optio.unmute();
            optio.rl.write('\n'); // ensure new line.
            res(result);
          }

          else if (e.sequence.length === 1 && !e.ctrl) {
            optio.stdout.write(opts.mask);
            result += data;
          }

          else {
            optio.input.removeListener('keypress', inputHandler);
          }

        }

        if (err)
          optio.output.write(formattedErr + '\n');

        optio.input.on('keypress', inputHandler);
        optio.rl.setPrompt(formatted);
        optio.rl.prompt();
        optio.mute();

      });

    }

  };

};

