const fs   = require('fs');
const path = require('path');

module.exports = {

    add(procedure, content){

        let procedurePath = path.join(__dirname, 'procedures', procedure, procedure + '.js');

        if(!fs.existsSync(procedurePath)) return;

        require(procedurePath)(content);

    }

}