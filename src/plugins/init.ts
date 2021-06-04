
import type { IEvent, IPlugin, TypedEvent, PluginInit } from '../types';
import { ensureDefaults } from '../utils/helpers';

const defaults: IPlugin = {

  when: () => {
    return true;
  },

  transform: (answer) => {
    return answer;
  },

  validate: () => {
    return true;
  },

  render: () => {
    throw new Error(`Render NOT implemented.`);
  },

  action: () => {
    throw new Error(`Action NOT implemented.`);
  },

};

export const initPlugin: PluginInit = (fn, optio) => {
  return <E extends IEvent>(event: E) => {
    const { transform, validate, action, when } = event;
    const plugin = ensureDefaults(defaults, fn(event, optio));
    const result = ensureDefaults(plugin, { transform, validate, action, when }) as TypedEvent<E>;
    (result as any).config = event;
    return { ...result };
  };
};