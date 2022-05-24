const stylesFolder = __dirname + '/styles';

const fs = require('fs');

const fileExists = (file) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
};

const getReadFilePromise = (file) => new Promise((resolve) => {
  fs.readFile(__dirname + '/styles/' + file, (err, data) => {
    resolve(data);
  });
});

fs.readdir(stylesFolder, (err, files) => {
  const styleFileNames = files.filter(file => file.match(/\.css$/g));

  fileExists(__dirname + '/project-dist/bundle.css').then((exists) => {

    if(exists) {
      fs.unlink(__dirname + '/project-dist/bundle.css', (err) => {
        if(err) console.log(err);
        const readPromises = styleFileNames.map((el) => getReadFilePromise(el));
  
        Promise.all(readPromises).then((values) =>{
  
          fs.writeFile(__dirname + '/project-dist/bundle.css', values.join(''), ()=> {});
        });
      });
    } else {
      const readPromises = styleFileNames.map((el) => getReadFilePromise(el));
  
      Promise.all(readPromises).then((values) =>{
  
        fs.writeFile(__dirname + '/project-dist/bundle.css', values.join(''), ()=> {});
      });
  
    }
  });

});