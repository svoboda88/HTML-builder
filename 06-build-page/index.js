const stylesFolder = __dirname + '/styles';
const fs = require('fs');
const path = require('path');
const FSP = require('fs').promises;
// -------- создание папки project-dist



const destFilename  = __dirname + '/project-dist';
function createFolder() {

  return fs.promises.mkdir('06-build-page/project-dist');
}
const fileExists = (file) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
};

// ------- создание бандла css
function createBundleCss() {


  const getReadFilePromise = (file) => new Promise((resolve) => {
    fs.readFile(__dirname + '/styles/' + file, (err, data) => {
      resolve(data);
    });
  });

  fs.readdir(stylesFolder, (err, files) => {
    const styleFileNames = files.filter(file => file.match(/\.css$/g));

    fileExists(__dirname + '/project-dist/style.css').then((exists) => {

      if(exists) {
        fs.unlink(__dirname + '/project-dist/style.css', (err) => {
          if(err) console.log(err);
          const readPromises = styleFileNames.map((el) => getReadFilePromise(el));
  
          Promise.all(readPromises).then((values) =>{
  
            fs.writeFile(__dirname + '/project-dist/style.css', values.join(''), ()=> {});
          });
        });
      } else {
        const readPromises = styleFileNames.map((el) => getReadFilePromise(el));
  
        Promise.all(readPromises).then((values) =>{
  
          fs.writeFile(__dirname + '/project-dist/style.css', values.join(''), ()=> {});
        });
  
      }
    });

  });
}
// ------------------ копирование папки assets

function copyAssets() {
  const srcFilename  = __dirname + '/assets';
  const destFilename  = __dirname + '/project-dist/assets';

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
}

const readComponent = (componentName) => new Promise((resolve) => 
  fs.readFile((__dirname, `06-build-page/components/${componentName}.html`), 'utf-8', function(error, fileContent){
    if(error) throw error; 
    resolve(fileContent); 
  }));

const insertComponents = async () => {


  const componentsParseResults = new Promise((resolve) => {
    fs.readdir(__dirname + '/components', (err, files) => {
      resolve(files.map((file) => {
        const parseResult = file.match(/(.+)\.html$/);
        if(parseResult) {
          const componentName = parseResult[1];
	
          return  [componentName , readComponent(componentName)];
			
        } else return null;
      }));
    });
  });

  const insertComponent =  (compName, compData) => {
    return new Promise((resolve )=> {
      fileExists(__dirname + '/project-dist/index.html').then((isExists) => {
        let fileToChange = isExists ? __dirname + '/project-dist/index.html' : __dirname + '/template.html';
        fs.readFile(fileToChange, (err, data) => {
          let newData = `${data}`;
	
          newData = newData.replace(`{{${compName}}}`, compData);
          fs.writeFile(__dirname + '/project-dist/index.html', newData, () => resolve(newData));
        });

      });

    });
  };

  componentsParseResults.then((result)=> {
    const filteredResult = result.filter(Boolean);


    const kek = async () => {
      for(let i = 0; i< filteredResult.length; i++) {
        const data = await filteredResult[i][1];

        await insertComponent(filteredResult[i][0], data);


      }
		
    };


    kek();


  });

};



const createDist = async () => {
  await createFolder();
  createBundleCss();
  copyAssets();
  insertComponents();
};






const dirExists = (file) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
};

  
const build = async () => {
  const isDirExists = await dirExists(destFilename);
  if(isDirExists) {
    fs.rm(destFilename, { recursive: true },  () => {
      createDist();
    });
  } else {
    createDist();
  }

};

build();