/**
*	DataBinding
*	Data attribute binding.  Bindings channel data between the application and external data/frameworks
*/
(function () {
	JSO.Client.DataBinding = JSO.Client.LinkedList.extend({
		framework: 'JSO.Client',
		typename: 'DataBinding',
		constructor: JSO.Client.DataBinding,
		construct: function (boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression) {
			this.boundModel = boundModel;
			this.modelMetatype = modelMetatype;
			this.modelTypename = modelTypename;
			this.name = name || '';
			this.dt = dt || 'string';
			this.arrayLength = arrayLength || undefined;
			this.expression = expression || undefined;
			this.refs = this.refs || [];
			this.value = this.value || undefined;
			this.prevValue = undefined;
			this.defaultValue = this.defaultValue || undefined;
			this.channel = this.channel || JSO.Client.Globals.BINDING_CHANNEL.GETSET;
			this.isRoot = this.isRoot || false;
			this.dirty = this.dirty || false;
			this.lastUpdate = 0;
			this._super();
		},
		getter: function () {
			if (this.channel & JSO.Client.Globals.BINDING_CHANNEL.GET) {
				if (GAME_LOOP_TIME != this.lastUpdate || this.lastUpdate == 0) {
					this.lastUpdate = GAME_LOOP_TIME;
					this.value = this.doGet();
				}
				return this.value;
			} else {
				if (this.next && (this.next.channel & JSO.Client.Globals.BINDING_CHANNEL.GET)) return this.next.getter();
			}
			return this.defaultValue;
		},
		doGet: function (value) {
			return this.value;
		},
		setter: function (value) {
			if (this.channel & JSO.Client.Globals.BINDING_CHANNEL.SET) {
				this.prevValue = this.value;
				this.doSet(value);
				this.lastUpdate = 0;
			}
			if (this.next && (this.next.channel & JSO.Client.Globals.BINDING_CHANNEL.SET) && (this.value !== this.next.value && this.value != undefined)) this.next.setter(this.value);

			if ((this.value != this.prevValue || this.prevValue == undefined) && GAME_LOOP_TIME != this.lastUpdate) this.updateRefs();
		},
		doSet: function (value) {
			this.value = JSO.Client.Globals.parsers.parse(value, this.dt);
		},
		updateRefs: function () {
			var i = this.refs.length;
			while (i--) {
				var ref = this.refs[i];
				if (ref) {
					//If a value is present and the reference model isn't a particle, update reference with this attribute's value
					if (this.value != undefined) {
						ref.doSet(ref.refExtension && this.value[ref.refExtension] ? this.value[ref.refExtension] : this.value);
						ref.boundModel[ref.name] = ref.boundModel[ref.name];
					}
				}
			}
		},
		assignValue: function (newValue) {
			//Test the value for valid and for any expressions and assign accordingly
			if (isValidDefault(newValue, this.dt)) this.value = !(valueIsExpression(newValue)) ? newValue : this.value;
			if (isValidDefault(newValue, 'string')) this.expression = valueIsExpression(newValue) ? newValue : this.expression;
		},
		initValue: function () {
			//Handle the case of array values
			if ((this.value == undefined || this.value == null) && this.arrayLength) this.value = [];

			if (!(this.value instanceof Array) && !(this.value instanceof Box2D.Common.Math.b2Vec2) && this.arrayLength && this.value.match(',') == null) this.value = [this.value];

			if (!(this.value instanceof Array) && !(this.value instanceof Box2D.Common.Math.b2Vec2) && this.value != undefined && this.value != null && this.value.match(',') != null) {
				this.value = this.value.split(',');
			}

			//Parse and assign the final value of the attribute
			this.value = JSO.Client.Globals.parsers.parse(this.value, this.dt);
		},
		refresh: function (value) {
			this.doSet(value);
			if (this.prev) this.prev.refresh(value);
		},
		auditChain: function () {
			var obj = this.first();
			var audit = 'typenames:\t\t' + obj.typeChain() + '\nexpressions:\t' + obj.expressionChain() + '\nframeworks:\t\t' + obj.frameworkChain() + '\nvalues:\t\t\t' + obj.valueChain() + '\nchannels:\t\t' + obj.channelChain() + '\nrefs:\t\t\t' + obj.refChain() + '\n';
			return audit;
		},
		typeChain: function () {
			return (this.next ? this.next.typeChain() + '->' : '') + '[' + this.typename + ']';
		},
		expressionChain: function () {
			return (this.next ? this.next.expressionChain() + '->' : '') + '[' + this.modelTypename + '.' + (this.expression ? this.expression : this.name) + ']';
		},
		frameworkChain: function () {
			return (this.next ? this.next.frameworkChain() + '->' : '') + '[' + this.framework + ']';
		},
		valueChain: function () {
			return (this.next ? this.next.valueChain() + '->' : '') + (this.value instanceof Box2D.Common.Math.b2Vec2 ? this.value.toString() : this.value) + (this.defaultValue != this.value ? '{' + this.defaultValue + '}' : '');
		},
		channelChain: function () {
			return (this.next ? this.next.channelChain() + '->' : '') + '[' + this.channel + ']';
		},
		refChain: function () {
			var refs = '', i = this.refs.length;
			while (i--) { refs += (refs == '' ? '' : ',') + this.refs[i].modelTypename + '.' + this.refs[i].name + (this.refs[i].refExtension ? '.' + this.refs[i].refExtension : ''); }
			return (this.next ? this.next.refChain() + '->' : '') + '[' + refs + ']';
		},
		insertBefore: function (binding) {
			if (this.prev) {
				binding.channel = JSO.Client.Globals.BINDING_CHANNEL.SET;
			} else {
				this.channel = JSO.Client.Globals.BINDING_CHANNEL.SET;
			}
			return this._super(binding);
		},
		insertAfter: function (binding) {
			if (this.next) {
				binding.channel = JSO.Client.Globals.BINDING_CHANNEL.SET;
			}
			return this._super(binding);
		},
		//Sets either the previous or next binding in the chain to read/write if this binding is read/write then 
		//passes to base to actually remove binding 
		remove: function () {
			if (this.next && !this.prev) {
				this.next.doSet(this.value);
				this.next.channel = JSO.Client.Globals.BINDING_CHANNEL.GETSET;
			}
			if (this.prev && !this.next) {
				this.prev.doSet(this.value);
				this.prev.channel = JSO.Client.Globals.BINDING_CHANNEL.GETSET;
			}
			this._super();
		},
		//Enables the attribute binding
		enable: function () {
			if (this.next) {
				this.doSet(this.next.value);
				this.channel = JSO.Client.Globals.BINDING_CHANNEL.GET;
			}
			if (this.prev && !this.next) {
				this.doSet(this.prev.value);
				this.prev.channel = JSO.Client.Globals.BINDING_CHANNEL.GET;
				this.channel = JSO.Client.Globals.BINDING_CHANNEL.GETSET;
			}
		},
		//Disables the attribute binding
		disable: function () {
			if (this.prev) {
				this.channel = JSO.Client.Globals.BINDING_CHANNEL.NONE;
				if (this.typename == 'Ref' || this.typename == 'ArrayNode') {
					this.disconnect();
				}
			}
			if (this.next && !this.prev) {
				this.next.doSet(this.value);
				this.next.channel = JSO.Client.Globals.BINDING_CHANNEL.GETSET;
				this.channel = JSO.Client.Globals.BINDING_CHANNEL.GET;
				if (this.typename == 'Ref' || this.typename == 'ArrayNode') {
					this.disconnect();
				}
			}
		},
		destroy: function () {
			this.refs.length = 0;
			this.refs = {};
			this.boundModel = null;
			if (this.next) this.next.destroy();
			this._super();
		}
	});
})();