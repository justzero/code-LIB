var fs = require('fs');
var file = 'readme.txt';

fs.readFile(file, 'utf8', function(err, data) {
	if (err) throw err;
	console.log(data);
});
