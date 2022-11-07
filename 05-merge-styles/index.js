const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err,data) => {
    if(err) throw (err);
    for(const file of data) {
        if(file.isFile()&&path.extname(file.name) == '.css') {
            let stream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
            stream.pipe(output);
        }
    }
})