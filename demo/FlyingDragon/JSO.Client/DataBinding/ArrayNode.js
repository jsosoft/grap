/**
*	ArrayNode
*	Handles array nodes on the binding chain
*/
(function () {
	JSO.Client.DataBinding.ArrayNode = JSO.Client.DataBinding.extend({
		framework: 'Expression',
		typename: 'ArrayNode',
		channel: JSO.Client.Globals.BINDING_CHANNEL.GETSET,
		constructor: JSO.Client.DataBinding.ArrayNode,
		construct: function (boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression, arrayType) {
			var expTxt = expression.join(',');
			this.arrayType = arrayType;
			this.nodes = new Array(arrayLength);

			var exLen = expression.length;
			for (var i = 0; i < exLen; i++) {
				switch (this.arrayType) {
					case 'Fn':
						this.nodes[i] = new JSO.Client.DataBinding.Fn(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression.shift());
						break;
					case 'Ref':
						this.nodes[i] = new JSO.Client.DataBinding.Ref(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression.shift());
						break;
					default:
				}
			}
			this.values = new Array(this.nodes.length);

			//Assign default values if expressions are not present for one of the defined array positions
			for (var i = 0; i < this.values.length; i++) {
				this.values[i] = ('int,float,b2vec2').match(dt) ? 0.0 : dt == 'bool' ? false : '';
			}
			this.defaultValues = this.values.clone();

			this._super(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expTxt);
		},
		doGet: function () {
			for (var i = 0; i < this.values.length; i++) {
				if (this.nodes[i]) this.values[i] = this.nodes[i].doGet();
				else this.values[i] = this.defaultValues[i];
			}
			return JSO.Client.Globals.parsers.parse(this.values, this.dt);
		},
		doSet: function (value) {
			this.value = this.doGet();
		},
		disconnect: function () {
			var i = this.nodes.length;
			while (i--) {
				if(this.nodes[i].typename == 'Ref') this.nodes[i].disconnect();
			}
		},
		remove: function () {
			var i = this.nodes.length;
			while (i--) {
				this.nodes[i].remove();
			}
			this._super();
		},
		destroy: function () {
			var i = this.nodes.length;
			while (i--) this.nodes[i].destroy();
			this._super();
		}
	});
})();