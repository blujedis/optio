import { toBoolean, toNumber, toString, isBoolean, isNumber, isString, toArray, ensureValue, isUndefined, isArray } from '../utils';
import type { Answer, KeyEvent, Plugin } from '../types';

export interface IInputPlugin {
  dataType: keyof typeof TYPE_MAP;
}

const TYPE_MAP = {
  string: toString,
  number: toNumber,
  boolean: toBoolean
};

const VALIDATE_MAP = {
  string: isString,
  number: isNumber,
  boolean: isBoolean
};

export const inputPlugin: Plugin<IInputPlugin> = (options) => (event, optio) => {

  const opts = {
    dataType: 'string',
    ...options
  } as Required<IInputPlugin>;

  return {

    transform: (answer) => {
      let result = event.isArray ? toArray(answer) : ensureValue(answer);
      if (event.isArray)
        return (result as any[]).map(v => TYPE_MAP[opts.dataType](v));
      return TYPE_MAP[opts.dataType](result);
    },

    validate: (answer: Answer) => {
      if (event.isRequired && isUndefined(answer) || answer === '')
        return `${event.name} is required`;
      if (event.isArray) {
        if (!isArray(answer))
          return `${event.name} requires array but got ${typeof answer}`;
        let invalid = answer.reduce((a, c, i) => {
          if (!VALIDATE_MAP[opts.dataType](c))
            a.push(`${c}(${i})`);
          return a;
        }, [] as string[]);
        if (invalid.length)
          return `${event.name} has invalid values: ${invalid.join(', ')}`;
      }
      else if (!VALIDATE_MAP[opts.dataType](answer)) {
        return `${event.name} expects type ${opts.dataType} but bot ${typeof answer}`;
      }
      return true;
    },

    render: (err) => {

      const { formatted } = optio.formatPrompt(event.describe, event.defaultOption);
      const formattedErr = err ? optio.formatError(err) : '';

      return new Promise<string>(res => {

        let result = '';

        optio.input.on('keypress', function inputHandler(data: string, e: KeyEvent) {

          if (e.name === 'backspace') {
            result = result.slice(0, -1);
          }
          else if (e.name === 'return') {
            optio.input.removeListener('keypress', inputHandler);
            res(result);
          }
          else {
            result += data;
          }

        });

        if (err)
          optio.output.write(formattedErr + '\n');

        optio.rl.setPrompt(formatted);
        optio.rl.prompt();

      });

    }

  };

};

