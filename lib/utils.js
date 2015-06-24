/**
 * Helper utilities
 */
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var helpers = {};

helpers.extend = function (a, b) {
	for (var key in b) {
		if (b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
};

helpers.write = function (filepath, data, callback) {
	mkdirp(path.dirname(filepath), function (err) {
		if (err) {
			throw err;
		}
		fs.writeFile(filepath, data, function (err) {
			if (err) {
				throw err;
			}
			if (callback) {
				callback(null, filepath);
			} else {
				console.log('File ' + filepath + ' successfully created.');
			}
		});
	});
};

module.exports = helpers;