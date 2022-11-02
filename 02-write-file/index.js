const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = process;
const output = fs.createWriteStream(path.join(__dirname, 'output.txt'), 'utf-8');

stdout.write('Hello! You can leave your message here\n');

stdin.on('data', (chunk) => {
    if(chunk.toString().trim() == 'exit') {
        process.exit();
    }
    output.write(chunk);
});

process.on('exit', (code) => {
    if(code === 0) {
        stdout.write('Your message has been saved. Have a nice day!\n');
    } else {
        stderr.write(`Error code ${code}`);
    }
});
process.on('SIGINT', () => process.exit());

stdin.on('error', error => console.log('Error', error.message));