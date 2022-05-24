const path = require('path');
const FSP = require('fs').promises;
const fs = require('fs');

const srcFilename  = __dirname + '/files';
const destFilename  = __dirname + '/files-copy';

const dirExists = (file) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
};

async function createCopyDir(src,dest) {
  const entries = await FSP.readdir(src, {withFileTypes: true});
  await FSP.mkdir(dest);
  for(let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) {
      await createCopyDir(srcPath, destPath);
    } else {
      await FSP.copyFile(srcPath, destPath);
    }
  }
}

async function copyDir () {
  const isDirExists = await dirExists(destFilename);

  if(isDirExists) {
    fs.rm(destFilename, { recursive: true },  () => {
      createCopyDir(srcFilename, destFilename);
    });

  } else {
    createCopyDir(srcFilename, destFilename);
  }

}

copyDir();

