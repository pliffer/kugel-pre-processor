const chokidar = require('chokidar');
const pug = require('pug');
const fs = require('fs');

const Util = require('../../util.js');

function renderPug(filePath){

    if(filePath.indexOf('.pug') == -1) return;

    let outPath = filePath.replace('.pug', '.html');

    pug.renderFile(filePath, function(error, result){

        if(error) return console.log(error);

        fs.writeFile(outPath, result, function(err){

            console.log('Rendered ' + outPath);

            if(err) return console.log(err);

        });

    });

}

module.exports = (folder, filter) => {

    Util.tree(folder, (err, files) => {

        if(err) return console.log(err);

        files.forEach(file => {

            if(filter && filter(file) == false) return;

            renderPug(file);

        });

    });

    chokidar.watch(folder, {
        persistent: true
    }).on('change', file => {

        if(filter && filter(file) == false) return;

        renderPug(file);

    });

}
