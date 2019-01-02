/**
*	XMLAttribute
*	XML attribute class.  Interface between the models views and their xml attribute data, including inheritance chains
*/
(function () {
	JSO.Client.DataBinding.XMLAttribute = JSO.Client.DataBinding.extend({
		typename: 'XMLAttribute',
		framework: 'JSO.Client',
		channel: JSO.Client.Globals.BINDING_CHANNEL.GETSET,
		constructor: JSO.Client.DataBinding.XMLAttribute,
		construct: function (boundModel, modelNode, attrNode, dataNode) {
			this.attrNode = attrNode;
			this.modelNode = modelNode;
			this.dataNode = dataNode;
			this.name = attrNode.attributes['typename'].value;
			this.defaultValue = attrNode.attributes['defaultValue'] ? attrNode.attributes['defaultValue'].value : undefined;
			this.value = undefined;
			this.expression = valueIsExpression(this.defaultValue) ? this.defaultValue : undefined;
			if (this.expression instanceof Array && this.expression.length > 0 && !this.arrayLength) this.arrayLength = this.expression.length;
			this.arrayLength = attrNode.attributes['arrayLength'] ? attrNode.attributes['arrayLength'].value : 0;
			this.getmap = attrNode.attributes['getmap'] ? attrNode.attributes['getmap'].value : '';
			this.setmap = attrNode.attributes['setmap'] ? attrNode.attributes['setmap'].value : '';
			this.dt = attrNode.attributes['dt'] ? attrNode.attributes['dt'].value.toLowerCase() : 'string';
			this.scaleFactor = attrNode.attributes['scaleFactor'] ? parseFloat(attrNode.attributes['scaleFactor'].value) : 0.0;
			this.isDefault = true;

			//Replace any defaults in the value with the real val
			for (var name in window.SETTINGS) {
				if (this.value) this.value.replace('[' + name + ']', window.SETTINGS[name]);
				if (this.defaultValue) this.defaultValue.replace('[' + name + ']', window.SETTINGS[name]);
			}

			this.assign();
			this._super(boundModel, modelNode.tagName, modelNode.attributes['typename'].value, this.name, this.dt, this.arrayLength, this.expression);
		},
		rootGetter: function () {
			return this.first().getter();
		},
		rootSetter: function (value) {
			this.first().setter(value);
		},
		insertBefore: function (binding) {
			if (binding.value == undefined || binding.value == null || binding.value == [] || (this.value != this.defaultValue && binding.value == binding.defaultValue)) {
				binding.assignValue(this.value);
			}
			this._super(binding);
		},
		insertAfter: function (binding) {
			binding.assignValue(this.value);
			this._super(binding);
		},
		assign: function () {
			this.assignValue(this.defaultValue);
			if (this.modelNode.attributes[this.name]) this.assignValue(this.modelNode.attributes[this.name].value);
			if (this.dataNode) this.assignValue(this.dataNode.attributes[this.name].value);
			this.initValue();
		}
	});
})();