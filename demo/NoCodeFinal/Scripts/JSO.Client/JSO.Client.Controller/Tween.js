/**
* Tween
* Tween controller.  Handles tweening timing and any tween related updates to view ui
*/
(function()
{
	JSO.Client.Controller.Tween = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Tween,
		construct: function(model, parent){
			this._super(model, parent);
		},
		initialize: function(){
			this._super();
			//Add animation tween timer
			var timer = new JSO.Client.Timer(this.model, this.model.animate, this.model.fps);
			this.timers.push(timer);
		}
	});
})();
