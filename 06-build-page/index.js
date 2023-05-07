const fs = require('fs');
const path = require('path');
const { copyFile, mkdir, readdir } = require('fs/promises');

(async function () {
    try {
        await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
        const outputIndex = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
        const outputStyle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
        const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
        let temp = '';

        input.on('data', chunk => temp += chunk);
        input.on('end', () => {
            fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, data) => {
                if (err) throw (err);
                for (const file of data) {
                    let place = `{{${file.name.slice(0, file.name.indexOf('.'))}}}`;
                    if (file.isFile() && temp.includes(place)) {
                        let component = '';
                        let stream = fs.createReadStream(path.join(__dirname, 'components', file.name), 'utf-8');
                        stream.on('data', chunk => component += chunk);
                        stream.on('end', () => {
                            temp = temp.replace(place, component);
                            if (!temp.includes('{{')) outputIndex.write(temp);;
                        });
                    }
                }
            });
        })

        fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, data) => {
            if (err) throw (err);
            for (const file of data) {
                if (file.isFile() && path.extname(file.name) == '.css') {
                    let stream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
                    stream.pipe(outputStyle);
                }
            }
        });

        copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

    } catch (err) {
        console.error(err);
    }
})();

async function copyDir(sourcePath, destinationPath) {
    try {
        await mkdir(destinationPath, { recursive: true });
        const files = await readdir(sourcePath, { withFileTypes: true });
        for (const file of files) {
            try {
                if (file.isDirectory()) {
                    let sourcePath = path.join(__dirname, 'assets', file.name);
                    let destinationPath = path.join(__dirname, 'project-dist', 'assets', file.name);
                    copyDir(sourcePath, destinationPath);
                } else {
                    await copyFile(path.join(sourcePath, file.name), path.join(destinationPath, file.name), fs.constants.COPYFILE_EXCL);
                }
            } catch (err) {
                if (err.code == 'EEXIST') {
                    fs.rm(path.join(destinationPath, file.name), () => {
                        copyFile(path.join(sourcePath, file.name), path.join(destinationPath, file.name));
                    });
                } else {
                    console.error(err);
                }
            }
        }

    } catch (err) {
        console.error(err);
    }
};
