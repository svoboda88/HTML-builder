const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

const getFileInfo = (fileName) => {
  fs.stat(`${dirPath}/${fileName}`, (err, stats) => {
    if(err) throw err;
    if (stats.isFile()) {
      const result = fileName.match(/(.+?)(\.[^.]*$|$)/);

      console.log(`${result[1]} - ${result[2]}`+' - ' + stats['size'] + ' bytes');
    }
  
  });
};

fs.readdir(dirPath, (err, files) => {
  files.forEach((file) => {
    getFileInfo(file);
  });
});

