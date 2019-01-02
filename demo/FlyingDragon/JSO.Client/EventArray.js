/**
*  EventArray extends native js Array with event handlers and other helper functions
*/
(function () {
	this.EventArray = function (name, handler, context) {
		EventArray.prototype.constructor = EventArray;
		this.context = context;
		this.handlers = {};
		if (name) {
			this.context = context;
			this.handlers[name] = handler;
		}
	};
	EventArray.prototype = [];

	EventArray.prototype.push = function () {
		for (var i = 0; i < arguments.length; i++) {
			Array.prototype.push.call(this, arguments[i]);
		}
		if (this.handlers['push']) {
			this.handlers['push'].apply(this.context || this, ['push', arguments[0]]);
		}
	};
	EventArray.prototype.pop = function () {
		var itm = Array.prototype.pop.call(this, []);
		if (this.handlers['pop']) {
			this.handlers['pop'].apply(this.context || this, ['pop', itm]);
		}
		return itm;
	};
	EventArray.prototype.setHandler = function (name, f, context) {
		this.context = context;
		this.handlers[name] = f;
	};
	EventArray.prototype.callHandler = function (name) {
		if (this.handlers[name]) {
			this.handlers[name].apply(this.context || this, name);
		}
	};
	EventArray.prototype.call = function (fn) {
		var rv = [];
		var i = this.length;
		while (i--) {
			var obj = this[i];
			if (typeof (obj) == 'object') rv.push(obj[fn]());
		}
		return rv;
	};
	EventArray.prototype.move = function (old_index, new_index) {
		while (old_index < 0) {
			old_index += this.length;
		}
		while (new_index < 0) {
			new_index += this.length;
		}
		if (new_index >= this.length) {
			var k = new_index - this.length;
			while ((k--) + 1) {
				this.push(undefined);
			}
		}
		this.splice(new_index, 0, this.splice(old_index, 1)[0]);
		return this; // for testing purposes
	};
})();