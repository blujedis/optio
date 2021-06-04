import Optio from '../';

// Gets built in default commands such as
// :clear, :exit
const defaultCommands = Optio.defaultCommands;

const optio = Optio.create({
  ...defaultCommands
});

optio.start(true);

