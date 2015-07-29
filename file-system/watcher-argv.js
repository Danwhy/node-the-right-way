const fs = require('fs');
const filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}

fs.watch('target.txt', function() {
  console.log("File " + filename + " just changed!");
});

console.log("Now watching target.txt for changes...");
