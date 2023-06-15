const fs   = require('fs');
const path = require('path');

module.exports = {

    tree: function (dir, done) {

        let results = [];

        fs.readdir(dir, function (err, list) {

            if (err) return done(err);

            let i = 0;

            (function next() {

                let file = list[i++];

                if (!file) return done(null, results);

                file = path.resolve(dir, file);

                fs.stat(file, function (err, stat) {

                    if (stat && stat.isDirectory()) {

                        module.exports.tree(file, function (err, res) {

                            results = results.concat(res);

                            next();

                        });

                    } else {

                        results.push(file);

                        next();

                    }

                });

            })();

        });

    }
   
}