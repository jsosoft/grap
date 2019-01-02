/**************
*Library extensions and other globals
*/

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*
Helper objects/functions
Global classes or functions for use by the application
*/

// Super amazing, cross browser property function, based on http://thewikies.com/
function addProperty(obj, name, onGet, onSet) {

	// wrapper functions
	var
        oldValue = obj[name],
        getFn = function () {
        	return onGet.apply(obj, [oldValue]);
        },
        setFn = function (newValue) {
        	return oldValue = onSet.apply(obj, [newValue]);
        };

	// Modern browsers, IE9+, and IE8 (must be a DOM object),
	if (Object.defineProperty) {

		Object.defineProperty(obj, name, {
			get: getFn,
			set: setFn
		});

		// Older Mozilla
	} else if (obj.__defineGetter__) {

		obj.__defineGetter__(name, getFn);
		obj.__defineSetter__(name, setFn);

		// IE6-7
		// must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
	} else {

		var onPropertyChange = function (e) {

			if (event.propertyName == name) {
				// temporarily remove the event so it doesn't fire again and create a loop
				obj.detachEvent("onpropertychange", onPropertyChange);

				// get the changed value, run it through the set function
				var newValue = setFn(obj[name]);

				// restore the get function
				obj[name] = getFn;
				obj[name].toString = getFn;

				// restore the event
				obj.attachEvent("onpropertychange", onPropertyChange);
			}
		};

		obj[name] = getFn;
		obj[name].toString = getFn;

		obj.attachEvent("onpropertychange", onPropertyChange);

	}
};

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
	//return typeof o === 'number' && isFinite(o);
};

function padNumber(number, pad, pad_char) {
	var c = typeof pad_char !== 'undefined' ? pad_char : '0';
	var p = new Array(1 + pad).join(c);
	return (p + number).slice(-p.length);
};

function isValidDefault(value, dt) {
	switch (dt.toLowerCase()) {
		case 'string':
			return (value && value != undefined);
			break;
		case 'int':
			return (value && parseFloat(value) != 0);
			break;
		case 'float':
			return (value && parseFloat(value) != 0);
			break;
		case 'bool':
			return (value && value != undefined);
			break;
		case 'b2vec2':
			//Not implemented at the moment
			return true;
			break;
		default:
	}
};

function isFloat(value) {
	if (/\./.test(value)) {

		return true;

	} else {

		return false;
	}
};

function extractPattern(str, re) {
	var results = [], text;

	while (text = re.exec(str)) {
		results.push(text[1]);
	}
	return results;
};

function valueIsExpression(value) {
	if (typeof (value) != 'string') return false;
	return (value.indexOf('[') >= 0 || value.indexOf(']') >= 0 || value.indexOf('{') >= 0 || value.indexOf('}') >= 0);
};
function isPointInPoly(poly, pt) {
	for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
		&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
		&& (c = !c);
	return c;
};
function intersect(a, b) {
	return (a.left <= b.right &&
			b.left <= a.right &&
			a.top <= b.bottom &&
			b.top <= a.bottom)
};

function clone(src) {
	function mixin(dest, source, copyFunc) {
		var name, s, i, empty = {};
		for (name in source) {
			// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
			// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
			// don't overwrite it with the toString() method that source inherited from Object.prototype
			s = source[name];
			if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}
		return dest;
	}

	if (!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]") {
		// null, undefined, any non-object, or function
		return src;	// anything
	}
	if (src.nodeType && "cloneNode" in src) {
		// DOM Node
		return src.cloneNode(true); // Node
	}
	if (src instanceof Date) {
		// Date
		return new Date(src.getTime());	// Date
	}
	if (src instanceof RegExp) {
		// RegExp
		return new RegExp(src);   // RegExp
	}
	var r, i, l;
	if (src instanceof Array) {
		// array
		r = [];
		for (i = 0, l = src.length; i < l; ++i) {
			if (i in src) {
				r.push(clone(src[i]));
			}
		}
		// we don't clone functions for performance reasons
		//		}else if(d.isFunction(src)){
		//			// function
		//			r = function(){ return src.apply(this, arguments); };
	} else {
		// generic objects
		r = src.constructor ? new src.constructor() : {};
	}
	return mixin(r, src, clone);

};
function deepCopy(obj) {
	if (Object.prototype.toString.call(obj) === '[object Array]') {
		var out = [], i = 0, len = obj.length;
		for (; i < len; i++) {
			out[i] = arguments.callee(obj[i]);
		}
		return out;
	}
	if (typeof obj === 'object') {
		var out = {}, i;
		for (i in obj) {
			out[i] = arguments.callee(obj[i]);
		}
		return out;
	}
	return obj;
};
/*
Native/Framework object extensions
Any extensions of existing native or framework objects
*/

$.fn.filterNodeByAttr = function(attr, value) {
      return this.find('*').filter(function() {
		if(this.attributes[attr]){
			return this.attributes[attr].value == value;
		} else return false;
      });
    };

$.fn.filterNode = function(name) {
      return this.find('*').filter(function() {
        return this.nodeName === name;
      });
    };
	
jQuery.extend({
    deepclone: function(objThing) {
        // return jQuery.extend(true, {}, objThing);
        // Fix for arrays, without this, arrays passed in are returned as OBJECTS! WTF?!?!
        if ( jQuery.isArray(objThing) ) {
            return jQuery.makeArray( jQuery.deepclone($(objThing)) );
        }
        return jQuery.extend(true, {}, objThing);
    },
});

//Todays date;
Date.prototype.today = function(){ 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() 
};
//Time now
Date.prototype.timeNow = function(){
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
	
Array.prototype.clone = function() { return this.slice(0); }
Array.prototype.flatten = function() { return [].concat.apply([], this); }

//Box2D mods
Box2D.Common.Math.b2Vec2.prototype.Divide = function (a) {
	var newVal = new Box2D.Common.Math.b2Vec2(this.x, this.y);

	if (a instanceof Box2D.Common.Math.b2Vec2 && a.x != 0 && a.y != 0) {
		newVal.x /= a.x; newVal.y /= a.y;
	}
	return newVal;
};
Box2D.Common.Math.b2Vec2.prototype.toString = function () {
	return this.x + ',' + this.y;
};