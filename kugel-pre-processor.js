let kugel    = require('kugel');
let chokidar = require('chokidar');

const Component = kugel.Component;

let sassProcedure = require('./procedures/sass/sass.js');
let pugProcedure  = require('./procedures/pug/pug.js');

Component.on('sass-pre-processor', sassProcedure);
Component.on('pug-pre-processor',  pugProcedure);
