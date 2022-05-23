const fs = require('fs');
const { stdout, stdin, exit } = process;
const path = require('path');

stdout.write('enter the text!');

const textFilePath = path.join(__dirname, 'text.txt');

const result = fs.createWriteStream(textFilePath);

stdin.on('data', data => {
  data.toString().replace(/\s/g, '') === 'exit' ? exit() : result.write(data);
});

process.on('exit', () => stdout.write('\nBye!'));
process.on('SIGINT',() => {
  process.exit();
});
