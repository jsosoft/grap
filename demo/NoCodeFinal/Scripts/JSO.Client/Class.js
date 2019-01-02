
/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
(function () {
	var initializing = false,
		fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	//Modified by js.  Original code assigned Class object to empty function, changed to Backbone.Model
	//so it's functionality will be available throughout the application
	var grapClass = namespace('JSO.Client.Class');
	JSO.Client.Class = function () { };
	JSO.Client.Class.prototype.clonable = true;

	JSO.Client.Class.prototype.clone = function (clonedList, clones) {
		var clonedList = clonedList || [];
		var clones = clones || [];
		var clone = {};
		clonedList.push(this.uid);
		clones.push(clone);
		for (var key in this) {
			clone[key] = this.cloneAttr(key, clonedList, clones);
		}
		clone.uid = JSO.Client.Globals.uniqueId();
		clone.uidString = padNumber(clone.uid, 32);
		return clone;
	}
	JSO.Client.Class.prototype.cloneAttr = function (key, clonedList, clones) {
		if (['attributes', 'events', 'bindings'].indexOf(key) > -1) {
			var node = {};
			for (var subkey in this[key]) {
				if (this[key][subkey].clone && this[key][subkey].uid) {
					if (this[key][subkey].clonable) {
						node[subkey] = this[key][subkey].clone(clonedList, clones);
					} else node[subkey] = this[key][subkey];
				}
			}
			return node;
		} else if (typeof (this[key]) == 'object') {
			if (this[key].uid) {
				if (this[key].clonable) {
					if (clonedList.indexOf(this[key].uid) == -1) {
						return this[key].clone(clonedList, clones);
					} else return clones[clonedList.indexOf(this[key].uid)];
				} else this[key];
			} else if (this[key].Copy) { return this[key].Copy(); }
			else if (this[key] instanceof Array) {
				var node = [];
				var i = this[key].length
				while (i--) {
					if (typeof (this[key][i]) == 'object') {
						if (this[key][i].uid) {
							if (this[key][i].clonable) {
								if (clonedList.indexOf(this[key][i].uid) == -1) {
									node[i] = this[key][i].clone(clonedList, clones);
								} else node[i] = clones[clonedList.indexOf(this[key][i].uid)];
							} else node[i] = this[key][i];
						} else if (this[key][i].Copy) node[i] = this[key][i].Copy();
						else if (this[key][i].clone) node[i] = this[key][i].clone();
						else node[i] = this[key][i];
					} else node[i] = this[key][i];
				}
				return node;
			} else if (this[key].clone) { return this[key].clone(); }
			else return this[key];
		} else {
			return this[key];
		}
	}

	// Create a new Class that inherits from this class
	JSO.Client.Class.extend = function (prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;

		var prototype = new this();

		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == 'function' &&
                typeof _super[name] == 'function' && fnTest.test(prop[name]) ?
                (function (name, fn) {
                	return function () {
                		var tmp = this._super;

                		// Add a new ._super () method that is the same method
                		// but on the super-class
                		this._super = _super[name];

                		// The method only need to be bound temporarily, so we
                		// remove it when we're done executing
                		var ret = fn.apply(this, arguments);
                		this._super = tmp;

                		return ret;
                	};
                })(name, prop[name]) : prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.construct) {
				if (!this.constructed) { this.construct.apply(this, arguments); }
				this.constructed = true;
				this.uid = JSO.Client.Globals.uniqueId();
				this.uidString = padNumber(this.uid, 32);
			}
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();
