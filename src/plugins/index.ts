import { inputPlugin } from './input';
import { passwordPlugin } from './password';
import { commandPlugin } from './command';

export * from './init';

export const defaultPlugins = {
  string: inputPlugin({ dataType: 'string' }),
  number: inputPlugin({ dataType: 'number' }),
  boolean: inputPlugin({ dataType: 'boolean' }),
  password: passwordPlugin({ mask: '*' }),
  command: commandPlugin()
};