/**
*  CanvasElement
*  Handles canvas element display
*/
(function()
{
	JSO.Client.View.CanvasElement = JSO.Client.View.extend({
		constructor: JSO.Client.View.CanvasElement,
		construct: function(id, typename){
			this._super(id, typename || 'canvasElement');
		},
		initialize: function () {
			for(var name in this.attributes){
				this[name] = this[name];
			}
			this.el.setVisible(true);
			this.inView = true;
			this._super();
		},
		//Update view UI - show/hide objects in main camera view
		update: function (model) {
			if(model.inView && !this.inView){
				this.el.setVisible(true);
				this.inView = true;
			} else if(!model.inView && this.inView){
				this.el.setVisible(false);
				this.inView = false;
			}
			this._super(model);
		}
	});
})();