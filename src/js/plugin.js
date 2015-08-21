'use strict';

/**
 *  Plug-in Boilerplate
 */

var PluginName = function(options) {

	var defaults = {
		test		: ''
	};

	if (arguments[0] && typeof arguments[0] === 'object') {
		this.options = _extendDefaults(defaults, arguments[0]);
	}

	this.test			= this.options.test;
	this.currentLoop	= 0;

};

function _extendDefaults(source, properties) {
	var property;
	for (property in properties) {
		if (properties.hasOwnProperty(property)) {
			source[property] = properties[property];
		}
	}
	return source;
}

PluginName.prototype = {

	_sayHello: function() {
		console.log(this.test);
	},

	_loop: function() {
		var self = this;
		this.requestId = requestAnimationFrame(function() {
			self._loop();
			self._sayHello();
			self.currentLoop++;
			if (self.currentLoop >= 3) {
				self.stop();
			}
		});
	},

	init: function() {
		this._loop();
	},

	stop: function() {
		window.cancelAnimationFrame(this.requestId);
	}

};
