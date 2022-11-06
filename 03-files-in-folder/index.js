const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

(async function (pathToDir) {
    try {
        const files = await readdir(pathToDir, {withFileTypes: true});
        for (const file of files) {
            if(file.isFile()) {
                let element = file.name;
                let fileName = element.slice(0, element.indexOf('.'));
                let fileExt = path.extname(element).slice(1);
                fs.stat(path.join(__dirname, 'secret-folder', `${element}`), (err, stats) => {
                  if(err) {
                    console.error(err);
                  } else {
                    let fileSize = `${(stats.size / 1024).toFixed(3)} kb`;
                    console.log(fileName + ' - ' + fileExt + ' - ' + fileSize);
                  }
                });
            }
        }
      } catch (err) {
        console.error(err);
      }
  })(path.join(__dirname, 'secret-folder'));