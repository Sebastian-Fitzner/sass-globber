var chokidar = require('chokidar');
var Chalk = require('chalk');
var Helpers = require('./utils');
var Events = require('./events');

var Watcher = function (obj, cb) {
	this.options = {
		sassRoot: 'tmp',
		source: 'styles.scss',
		output: 'styles.tmp.scss'
	};

	this.options = Helpers.extend(this.options, obj);
	this.initialize(cb);
};


Watcher.prototype.initialize = function (cb) {
	var _this = this;
	this.watchDir = null;
	this.watchFile = null;
	this.sassRootFiles = this.options.sassRoot + '/**/*';

	this.watch();
};

Watcher.prototype.watch = function () {
	this.watchDir = chokidar.watch(this.sassRootFiles, {
		persistent: true
	});

	this.watchFile = chokidar.watch(this.options.sassRoot + '/' + this.options.source, {
		persistent: true
	});

	this.watchDir.add(this.sassRootFiles);

	this.ready();
};

Watcher.prototype.ready = function () {
	var _this = this;

	this.watchDir.on('ready', function () {
		console.log(Chalk.green('Sass file scan in ' + Chalk.cyan(_this.options.sassRoot) + ' is done!'));

		_this.bindEvents();
	});
};

Watcher.prototype.bindEvents = function (cb) {
	this.watchDir.on('add', function (path) {
		Events.emitEvent('sassGlobber:addFile');
		console.log(Chalk.green('File', path, 'has been added'));
	});

	this.watchDir.on('unlink', function (path) {
		Events.emitEvent('sassGlobber:deleteFile');
		console.log(Chalk.magenta('File', path, 'has been deleted'));
	});

	this.watchFile.on('change', function (path) {
		Events.emitEvent('sassGlobber:changedFile');
		console.log(Chalk.yellow('File', path, 'has been changed'));
	});
};

Watcher.prototype.close = function () {
	this.watchDir.close();
	this.watchFile.close();
};


module.exports = function (obj) {
	return new Watcher(obj);
};