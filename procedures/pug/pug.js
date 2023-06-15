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

            if(process.env.VERBOSE) console.log('Rendered ' + outPath);

            if(err) return console.log(err);

        });

    });

}

module.exports = (folder) => {

    let filter = () => true;

    if(folder.filter) filter = folder.filter;
    if(folder.src) folder = folder.src;

    Util.tree(folder, (err, files) => {

        if(err) return console.log(err);

        files.forEach(file => {

            if(filter(file)) renderPug(file);

        });

    });

    chokidar.watch(folder, {
        persistent: true
    }).on('change', file => {

        if(filter(file)) renderPug(file);

    });

}
