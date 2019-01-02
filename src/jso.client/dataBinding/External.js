/**
*  Attribute binding for external frameworks object attributes
*/
(function () {
	JSO.Client.DataBinding.External = JSO.Client.DataBinding.extend({
		constructor: JSO.Client.DataBinding.External,
		construct: function (boundModel, modelMetatype, modelTypename, name, dt, arrayLength, getmap, setmap, scaleFactor) {
			this.getmap = getmap;
			this.setmap = setmap;
			this.scaleFactor = scaleFactor;
			this._super(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, getmap + ',' + setmap);
		},
		doGet: function () {
			if (!this.boundModel || !this.boundModel.el) return undefined;

			this.value = this.boundModel.el[this.getmap]();
			
			if (this.scaleFactor > 0) {
				this.value = JSO.Client.Globals.scaleValue(this.value, this.dt, 1 / this.scaleFactor);
			}
			
			return this.value;
		},
		doSet: function (value) {
			if (!this.boundModel || !this.boundModel.visible || !this.boundModel.el) return;

			this.value = JSO.Client.Globals.parsers.parse(value, this.dt);
			
			if (this.scaleFactor > 0) {
				this.value = JSO.Client.Globals.scaleValue(this.value, this.dt, this.scaleFactor);
			}
			
			this.boundModel.el[this.setmap](this.value);
		}
	});
})();