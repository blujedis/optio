import type { Plugin } from '../types';

export interface ICommandPlugin { }

export const commandPlugin: Plugin<ICommandPlugin> = (options?) => (event, optio) => {
  return {
    action: () => {
      throw new Error(`Command ${event.name} `)
    }

  };

};

