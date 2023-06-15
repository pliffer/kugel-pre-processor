const chokidar = require('chokidar');
const sass = require('node-sass');
const fs = require('fs');

const Util = require('../../util.js');

// @todo Implementar filter

function renderSASS(filePath){

    if(filePath.indexOf('.sass') !== -1 || filePath.indexOf('.scss') !== -1){

        let outPath = filePath.replace('.scss', '.css').replace('.sass', '.css');

        sass.render({
            file: filePath,
            outFile: outPath,
        }, function(error, result){

            if(error) return console.log(error);

            fs.writeFile(outPath, result.css, function(err){

                console.log('Rendered ' + outPath);

                if(err) return console.log(err);

            });

        });

    }

}

module.exports = (folder) => {

    console.log('SASS pre-processor', folder)

    Util.tree(folder, (err, files) => {

        if(err) return console.log(err);

        files.forEach(file => {

            console.log(file);

            renderSASS(file);

        });

    });

    chokidar.watch(folder, {
        persistent: true
    }).on('change', renderSASS);

}
