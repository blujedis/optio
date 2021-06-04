import type { IEvent } from './types';
import { spawn } from 'child_process';

export const defaultCommands: Record<string, IEvent> = {
  ':clear': {
    type: 'command',
    action: (args, optio) => {
      optio?.cursorTo(0, 0);
      optio?.clearDown();
      optio?.rl.prompt();
    }
  },
  ':exit': {
    type: 'command',
    alias: [':quit'],
    action: (args, optio) => {
      optio?.kill(false);
    }
  },
  ':run': {
    type: 'command',
    action: (args, optio) => {
      // spawnSync(args.shift() as string, args, { stdio: 'inherit' });
      spawn(args.shift() as string, args, { stdio: 'inherit' });
    }
  }

};