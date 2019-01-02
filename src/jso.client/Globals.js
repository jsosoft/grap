///////////////////////////////////////////////////////////////////////
//  Globals
//  Global functions for use across MVC framework
///////////////////////////////////////////////////////////////////////
/**************
*Root namespace
*/
var loc = window.location.pathname;
var dir = loc.substring(0, loc.lastIndexOf('/'));
this.baseURL = dir + '/';
var JSO = namespace('JSO');
var JSO_Client = namespace('JSO.Client');

var DEBUG = false;

if (typeof exports != 'undefined') {
    JSO.Client = exports;
} else {
    JSO.Client = this.JSO.Client = {};
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

(function() {
	/**************
	*Globals
	*/
	var Globals = namespace('JSO.Client.Globals')

	this.FLOAT_ARRAY = Float32Array;
	this.GAME_LOOP_TIME = 0;
	this.RADS_TO_DEGREES = (180 / Math.PI);
	this.DEGREES_TO_RADS = (Math.PI / 180); 
	JSO.Client.Globals = {
		MODEL: 'model',
		VIEW: 'view',
		CONTROLLER: 'controller',
		SEARCH_UP: 1 << 1,
		SEARCH_DOWN: 1 << 2,
		SEARCH_UPDOWN: 2 ^ 4,
		BINDING_TYPES: {
			BASE: 0,
			ROOT: 1,
			OBJ: 2,
			ATTR: 3,
			REF: 4,
			FN: 5,
			FRAMEWORK: 6,
			NATIVE: 7,
			XML_ATTRIBUTE: 8,
			XML_CLASS: 9
		},
		BINDING_CHANNEL: {
			NONE: 0,
			GET: 1 << 1,
			SET: 1 << 2,
			GETSET: 2 ^ 4
		},
		REST_METHOD: {
			GET: 1,
			PUT: 2,
			POST: 3,
			DELETE: 4
		},
		currentUid: 0,
		uniqueId: function(){ return this.currentUid++; },
		currentUBit: 0,
		uniqueBit: function(){ JSO.Client.Globals.currentUBit++; return 1 << JSO.Client.Globals.currentUBit; },
		collisionBits: {},
		validators: {
			isValidString: function(value){ return value != undefined; },
			isValidInt: function(value){ return !isNaN(parseInt(value)) && isFinite(value); },
			isValidFloat: function(value){ return !isNaN(parseFloat(value)) && isFinite(value); },
			isValidBool: function(value){ return (value != undefined && ('true,false,0,1,-1'.match(value) != undefined)); },
			isValidB2Vec2: function(value){ 
				if(value != undefined && (value instanceof Box2D.Common.Math.b2Vec2)){
					return !isNaN(parseFloat(value.x)) && isFinite(value.x) && !isNaN(parseFloat(value.y)) && isFinite(value.y)
				} else return false;
			},
			validateType: function (value, type) {
				switch(type.toLowerCase()){
					case 'string':
						return this.isValidString(value);
						break;
					case 'int':
						return this.isValidInt(value);
						break;
					case 'float':
						return this.isValidFloat(value);
						break;
					case 'bool':
						return this.isValidBool(value);
						break;
					case 'b2vec2':
						return this.isValidB2Vec2(value);
						break;
					default:
				}
			},
			fn: function (type) {
				switch(type.toLowerCase()){
					case 'string':
						return this.isValidString;
						break;
					case 'int':
						return this.isValidInt;
						break;
					case 'float':
						return this.isValidFloat;
						break;
					case 'bool':
						return this.isValidBool;
						break;
					case 'b2vec2':
						return this.isValidB2Vec2;
						break;
					default:
				}
			},
			validate: function(value, type){ 
				if(type == 'b2Vec2'){
					return this.validateType(value, type);
				} else if(value instanceof Array){
					var i = value.length;
					while(i--){
						if(!this.validateType(value[i], type)) return false;
					}
					return true;
				} else {
					return typeof(value) == 'string' ? (value + '').match(',') != null ? this.parse(validate.split(','), type) : this.validateType(value, type) : this.validateType(value, type);
				}
			}
		},
		parsers: {
			parseString: function(value){ return (JSO.Client.Globals.validators.isValidString(value) ? value : ''); },
			parseInt: function(value){ return (JSO.Client.Globals.validators.isValidInt(value) ? Math.floor(value) : 0); },
			parseFloat: function(value){ return (JSO.Client.Globals.validators.isValidFloat(value) ? parseFloat(value) : 0.0); },
			parseBool: function(value){ return (JSO.Client.Globals.validators.isValidBool(value) ? ('true,1,-1'.match(value) != undefined) : false); },
			parseB2Vec2: function(value){ 
				if(value != undefined){
					if(value instanceof Box2D.Common.Math.b2Vec2){
						return JSO.Client.Globals.validators.isValidB2Vec2(value) ? value : new Box2D.Common.Math.b2Vec2(this.parseFloat(value.x),this.parseFloat(value.y));
					} else if(value instanceof Array){
						if(value.length >= 2){ return new Box2D.Common.Math.b2Vec2(this.parseFloat(value[0]),this.parseFloat(value[1]))
						} else if(value.length = 1){ return new Box2D.Common.Math.b2Vec2(this.parseFloat(value[0]),0.0)
						} else { return  new Box2D.Common.Math.b2Vec2(0.0,0.0); }
					} else {
						return typeof(value) == 'string' ? JSO.Client.Globals.parsers.parseB2Vec2(value.split(',')) : new Box2D.Common.Math.b2Vec2(this.parseFloat(value),0.0)
					}
				} else return new Box2D.Common.Math.b2Vec2(0.0,0.0);
			},
			parseType: function (value, type) {
				switch(type){
					case 'string':
						return this.parseString(value);
						break;
					case 'int':
						return this.parseInt(value);
						break;
					case 'float':
						return this.parseFloat(value);
						break;
					case 'bool':
						return this.parseBool(value);
						break;
					case 'b2vec2':
						return this.parseB2Vec2(value);
						break;
					default:
				}
			},
			fn: function (type) {
				switch(type.toLowerCase()){
					case 'string':
						return this.parseString;
						break;
					case 'int':
						return this.parseInt;
						break;
					case 'float':
						return this.parseFloat;
						break;
					case 'bool':
						return this.parseBool;
						break;
					case 'b2vec2':
						return this.parseB2Vec2;
						break;
					default:
				}
			},
			parse: function (value, type) {
				if(type.toLowerCase() == 'b2vec2'){
					return this.parseType(value, type);
				} else if(value instanceof Array){
					var arr = [];
					var i = value.length;
					while(i--){
						arr[i] = this.parseType(value[i], type);
					}
					return arr;
				} else {
					return typeof(value) == 'string' ? (value + '').match(',') != null ? this.parse(value.split(','), type) : this.parseType(value, type) : this.parseType(value, type);
				}
			}
		},
		scaleValue: function(value, type, scale){
			if(!JSO.Client.Globals.validators.isValidFloat(scale)) return;

			if(value instanceof Box2D.Common.Math.b2Vec2){
				return new Box2D.Common.Math.b2Vec2(value.x/scale, value.y/scale);
			} else if(type == 'b2Vec2'){
				return JSO.Client.Globals.scaleValue(JSO.Client.Globals.parsers.parse(value, type));
			} else if(value instanceof Array){ 
				var newVal = [];
				var i = value.length;
				while(i--){
					newVal[i] = JSO.Client.Globals.parsers.parse(value[i]/scale, type);
				}
				return newVal;
			} else return JSO.Client.Globals.parsers.parse(value/scale, type);
		},
		/*
		Object chain functions
		Useful for navigating a chain of dotted objects
		*/
		readChainAttr: function(source, attrArray) {
			var attr = attrArray.shift();
			if(attrArray.length > 0){
				return readChainAttr(source[attr], attrArray);
			} else {
				return (source == undefined ? undefined : source[attr]);
			}
		},
		getChainAttr: function(source, attrArray) {
			var attr = attrArray.shift();
			if(attrArray.length > 0){
				return getChainAttr(source[attr], attrArray);
			} else {
				return (source == undefined ? undefined : source);
			}
		},
		getChainObj: function(source, attrArray) {
			var attr = attrArray.shift();
			if(typeof source == 'object'){
				return getChainObj(source[attr], attrArray);
			} else {
				return (source == undefined ? undefined : source);
			}
		},
		getChainNonReservedObj: function(source, attrArray) {
			var attr = attrArray.shift();
			var match = (KEYWORDS + ',object').match(attr);
			if(match != '' && match != undefined && attrArray.length){
				if(source[attr]) return JSO.Client.Globals.getChainNonReservedObj(source[attr], attrArray);
				return undefined;
			} else {
				attrArray.unshift(attr);
				return (source == undefined ? undefined : source);
			}
		},
		getChainNonReservedAttr: function(source, attrArray) {
			var attr = attrArray.shift();
			var match = (KEYWORDS + ',object').match(attr);
			if(match != '' && match != undefined && attrArray.length){
				return getChainNonReservedAttr(source[attr], attrArray);
			} else {
				attrArray.unshift(attr);
				return attr;
			}
		}
	}

	JSO.Client.Clonable = function() {	
		this.clone = function(source) {
			for (i in source) {
				if (typeof source[i] == 'source') {
					this[i] = new this.clone(source[i]);
				}
				else{
					this[i] = source[i];
				}
			}
		}
	}
})();