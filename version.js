const fs = require('fs');
const fileName = './io-package.json';
const ioPackage = require(fileName);
var myArgs = process.argv.slice(2);

ioPackage.common.version = myArgs[0];

fs.writeFile(fileName, JSON.stringify(ioPackage), function writeJSON(err) {
    if (err) return console.log(err);
    console.log('writing to ' + fileName);
});