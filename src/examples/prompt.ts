import Optio from '..';

// const optio = Optio.create({
//   'What is your name:': 'string',
//   'What is your age:': {
//     type: 'number',
//     isArray: true,
//     when: (answers) => {
//       return answers['What is your name:'] !== 'bob';
//     }
//   }
// });

const optio = Optio.create({
  'Please enter your username:': 'string',
  'Please enter your password:': 'password'
});

optio.start((answers) => {
  console.log(answers);
});

