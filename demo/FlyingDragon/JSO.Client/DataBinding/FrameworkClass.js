/**
*	FrameworkClass
*	Base class for any framework binding layers
*/
(function () {
	JSO.Client.DataBinding.FrameworkClass = JSO.Client.Class.extend({
		constructor: JSO.Client.DataBinding.FrameworkClass,
		construct: function (boundModel) {
			this.events = {};
			this.bound = false;
			this.boundModel = boundModel;
		}
	});
})();