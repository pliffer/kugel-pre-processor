const chokidar = require('chokidar');
const pug      = require('pug');
const fs       = require('fs-extra');
const path     = require('path');

const Util = require('../../util.js');

let debounce = {};

async function debounceRenderPug(file){

    return new Promise((resolve) => {

        if(debounce[file]){

            resolve(false);
            clearTimeout(debounce[file]);

        }

        debounce[file] = setTimeout(() => {

            resolve(true);
            delete debounce[file];

        }, 100);

    });

}

async function renderPug(filePath, dest){

    if(filePath.indexOf('.pug') == -1) return;

    let outPath = filePath.replace('.pug', '.html');

    if(!await debounceRenderPug(filePath)) return;

    if(dest) outPath = dest(outPath);

    await fs.ensureDir(path.dirname(outPath));

    pug.renderFile(filePath, {
        pretty: "\t"
    }, (error, result) => {

        if(error) return console.log(error);

        fs.writeFile(outPath, result, function(err){

            if(process.env.VERBOSE == 'true') console.log('Rendered ' + outPath);

            if(err) return console.log(err);

        });

    });

}

module.exports = (folder) => {

    let filter = () => true;
    let pre    = () => true;
    let dest   = () => true;

    if(folder.filter) filter = folder.filter;
    if(folder.pre)    pre    = folder.pre;
    if(folder.dest)   dest   = folder.dest;

    if(folder.src) folder = folder.src;

    Util.tree(folder, (err, files) => {

        if(err) return console.log(err);

        files.forEach(file => {

            if(filter(file)) renderPug(file, dest);

        });

    });

    chokidar.watch(folder, {
        persistent: true
    }).on('change', file => {

        if(pre) file = pre(file);

        if(filter(file)) renderPug(file, dest);

    });

}
