const kugel = require('kugel');
const fs    = require('fs');
const path  = require('path');

const Component = kugel.Component;

let procedures = fs.readdirSync(path.join(__dirname, 'procedures'));

procedures.forEach(folder => {

    if(folder.indexOf('.') !== -1) return;

    let procedure = require('./procedures/' + folder + '/' + folder + '.js');

    Component.on(`${folder}-pre-processor`, procedure);

});