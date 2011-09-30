var fs = require('fs'),
files = require('./conf.js');
var jslist = files.jsList,
csslist = files.cssList,
path = files.path,
name = files.name;
//console.log(jslist[0], csslist);

fs.writeFile(name + '.js', '', function(err){
	if (err) throw err;
});

fs.writeFile(name + '.css', '', function(err){
	if (err) throw err;
});

fs.open(name + '.js', 'a', 666, function(e, id) {
	var rw = function(i) {
		fs.readFile(path + jslist[i], function(err, data) {
			if (err) throw err;
			fs.write(id, data + '\n', null, 'utf8', function() {
				if (++i === jslist.length) fs.close(id, function() {
					console.log('整体js文件生成成功！马上进行压缩...');
				});
				else rw(i);
			});
		});
	};
	if (jslist && jslist.length > 0) rw(0);
});

fs.open(name + '.css', 'a', 666, function(e, id) {
	var rw = function(i) {
		fs.readFile(path + csslist[i], function(err, data) {
			if (err) throw err;
			fs.write(id, data + '\n', null, 'utf8', function() {
				if (++i === csslist.length) fs.close(id, function() {
					console.log('整体css文件生成成功！（注：该软件无法压缩css文件）');
				});
				else rw(i);
			});
		});
	};
	if (csslist && csslist.length > 0) rw(0);
});

var data = 'node ../UglifyJS/bin/uglifyjs ' + name + '.js > ../' + name + '.js\n\
		   del ' + name + '.js\n move ' + name + '.css ../' + name + '.css\nPAUSE\ndel tmp.bat\n';
fs.writeFile('tmp.bat', data, function(err) {
	if (err) throw err;
});
