const chokidar = require('chokidar');
const sass     = require('sass');
const fs       = require('fs');

const Util = require('../../util.js');

function renderSASS(filePath){

    if(filePath.indexOf('.sass') !== -1 || filePath.indexOf('.scss') !== -1){

        let outPath = filePath.replace('.scss', '.css').replace('.sass', '.css');

        sass.render({
            file: filePath,
            outFile: outPath,
        }, function(error, result){

            if(error) return console.log(error);

            fs.writeFile(outPath, result.css, function(err){

                if(process.env.VERBOSE) console.log('Rendered ' + outPath);

                if(err) return console.log(err);

            });

        });

    }

}

module.exports = (folder) => {

    let filter = () => true;

    if(folder.filter) filter = folder.filter;
    if(folder.src) folder = folder.src;

    Util.tree(folder, (err, files) => {

        if(err) return console.log(err);

        files.forEach(file => {

            if(filter(file)) renderSASS(file);

        });

    });

    chokidar.watch(folder, {
        persistent: true
    }).on('change', (file) => {
        
        if(filter(file)) renderSASS(file);

    });

}
