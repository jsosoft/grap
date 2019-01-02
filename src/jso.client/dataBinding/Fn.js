/**
*	Fn (Function)
*	Functions are valid javascript embedded in xml model/view and attribute values, compiled when the object is created.  
*	Read-only binding
*/
(function () {
	JSO.Client.DataBinding.Fn = JSO.Client.DataBinding.extend({
		framework: 'Expression',
		typename: 'Fn',
		channel: JSO.Client.Globals.BINDING_CHANNEL.GETSET,
		constructor: JSO.Client.DataBinding.Fn,
		construct: function (boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression) {
			this.parameters = [];

			//Extract any references from the function and create bindings
			if ((/\[(.*?)\]/g).test(expression)) {
				var exs = extractPattern(expression, /\[(.*?)\]/g);

				//Replace the references with their parameter index
				var exLen = exs.length;
				for (var i = 0; i < exLen; i++) {
					expression = expression.replace('[' + exs[i] + ']', 'params[' + i + ']');
					var param = new JSO.Client.DataBinding.Ref(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, exs.shift());
					this.parameters.push(param);
				}
			}
			eval('this.fn = function(params) { return ' + expression + '; }');
			this._super(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression);
		},
		doGet: function () {
			var params = [];
			//Functions maintain a references list, pull from that list to get parameters for the function
			for (var i = 0; i < this.parameters.length; i++) {
				params.push(this.parameters[i].doGet());
			}
			value = this.fn(params);

			return value;
		},
		doSet: function (value) {
			this.value = this.doGet();
		},
		remove: function () {
			var i = this.parameters.length;
			while (i--) {
				this.parameters[i].remove();
			}
			this._super();
		},
		destroy: function () {
			var i = this.parameters.length;
			while (i--) {
				this.parameters[i].destroy();
			}
			this._super();
		}
	});
})();