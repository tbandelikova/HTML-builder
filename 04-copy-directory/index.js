const fs = require('fs');
const path = require('path');
const { copyFile, mkdir, readdir } = require('fs/promises');

(async function copyDir(sourcePath, destinationPath) {
    try {
        await mkdir(destinationPath, { recursive: true });
        const files = await readdir(sourcePath, {withFileTypes: true});
        for(const file of files) {
            try {
                if(file.isDirectory()) {
                    await mkdir(path.join(__dirname, 'files-copy', file.name), { recursive: true });
                } else {
                    await copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), fs.constants.COPYFILE_EXCL);
                }
            } catch(err) {
                if(err.code == 'EEXIST') {
                    fs.rm(path.join(__dirname, 'files-copy', file.name), () => {
                        copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
                    });
                } else {
                    console.error(err);
                }
            }
        }

    } catch (err) {
        console.error(err);
    }
})(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
