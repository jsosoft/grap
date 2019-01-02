/**
*  External binding class to the KineticJS top-level stage object
*/
(function () {
	JSO.Client.DataBinding.KineticJSStage = JSO.Client.DataBinding.FrameworkClass.extend({
		typename: 'KineticJSStage',
		framework: 'KineticJS',
		_renderGarbage: [],
		constructor: JSO.Client.DataBinding.KineticJSStage,
		construct: function (boundModel) {
			boundModel.stage = new Kinetic.Stage({ container: window.container });
			boundModel.stage.width = 800;
			boundModel.el = new Kinetic.Layer();
			this._super(boundModel);
		},
		show: function () {
			this.boundModel.renderFn = this.renderFn.bind(this);
			this.boundModel.stage.add(this.boundModel.el);
		},
		hide: function () {
			this.boundModel.renderFn = undefined;
		},
		destroy: function () {
			JSO.Client.Globals.gameController.firstView.bindings.kineticjs._renderGarbage.push(this.boundModel.el);
		},
		renderFn: function (timer) {
			this.boundModel.el.draw();
			if (this._renderGarbage.length) {
				var el = this._renderGarbage.pop();
				if (el != undefined) el.remove();
			}
		}
	});
})();