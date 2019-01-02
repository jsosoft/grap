/**
*	Ref
*	Handles bound internal application references 
*/
(function () {
	JSO.Client.DataBinding.Ref = JSO.Client.DataBinding.extend({
		framework: 'Expression',
		typename: 'Ref',
		channel: JSO.Client.Globals.BINDING_CHANNEL.GETSET,
		constructor: JSO.Client.DataBinding.Ref,
		construct: function (boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression) {
			this.refName = '';
			this.refObject = undefined;
			this.connected = false;
			if (modelMetatype == 'model') expression = expression.replace('model', 'this');
			else expression = expression.replace('model', 'this.model').replace('view', 'this');

			this._super(boundModel, modelMetatype, modelTypename, name, dt, arrayLength, expression);
		},
		doGet: function () {
			if (!this.connected) this.connect();
			if (this.connected) this.value = (this.refExtension && this.refObject[this.refName] ? this.refObject[this.refName][this.refExtension] : this.refObject[this.refName]);
			return this.value;
		},
		doSet: function (value) {
			this.value = value;
		},
		connect: function () {
			//If the object is already bound (and the bound object is still present) return
			if (!this.refObject) {
				//Get the reference and retrieve the bound object instance
				var objchain = this.expression.split('.');
				objchain.shift();

				this.refObject = JSO.Client.Globals.getChainNonReservedObj(this.boundModel, objchain);
				if (!this.refObject) return;
				this.refName = objchain[0];
				this.refQualifiedName = this.expression.substr(0, this.expression.indexOf(this.refName) + this.refName.length);
				var ext = this.expression.split('.');
				this.refExtension = (this.refName != ext[ext.length - 1] ? ext[ext.length - 1] : '');
				this.fullName = this.modelTypename + '.' + this.refQualifiedName + this.refExtension;

				//This binding gets attached to the foreign object's setters - when it is set, this value will be refreshed
				if (this.refObject.attributes[this.refName]) {
					var foreignRefs = this.refObject.attributes[this.refName].refs;
					var i = this.refObject.attributes[this.refName].refs.length, found = false;
					while (i--) {
						if (this.refObject.attributes[this.refName].refs[i].fullName == this.fullName) {
							found = true;
						}
					}
					if (!found) {
						this.refObject.attributes[this.refName].refs.push(this);
					}
				}
				this.connected = true;
			}
		},
		disconnect: function () {
			if (this.refObject != null && this.refObject.attributes != null && this.refObject.attributes[this.refName] != null) {
				var foreignRefs = this.refObject.attributes[this.refName].refs;
				var i = foreignRefs.length;
				while (i--) {
					if (foreignRefs[i].fullName == this.fullName) {
						foreignRefs.splice(i, 1);
					}
				}
			}
		},
		remove: function () {
			if (this.bound && this.refObject != null && this.refObject.attributes != null && this.refObject.attributes[this.refName] != null) {
				var foreignRefs = this.refObject.attributes[this.refName].refs;
				var i = foreignRefs.length;
				while (i--) {
					if (foreignRefs[i].fullName == this.fullName) {
						foreignRefs.splice(i, 1);
					}
				}
			}
			this._super();
		}
	});
})();