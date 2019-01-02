/**
*  GameWindow
*  Handles window display
*/
(function()
{
	JSO.Client.View.GameWindow = JSO.Client.View.extend({
		constructor: JSO.Client.View.GameWindow,
		construct: function(id, typename){
			this._super(id, typename || 'gameWindow');
		},
		initialize: function(){
			//this.el = this.layer.canvas.getElement();
			this.stage.setWidth(JSO.Client.Globals.gameController.cameras[0].model.scale.x / 2);
			this.stage.setHeight(JSO.Client.Globals.gameController.cameras[0].model.scale.y / 2);
			this._super();
		},
		render: function(time){
			if(this.renderFn){
				this.renderFn(time);
			}
		}
	});
})();