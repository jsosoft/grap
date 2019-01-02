/**
* Animation
* Animnation controller.  Handles animation timing and any animation related updates to view ui
*/
(function()
{
	JSO.Client.Controller.Animation = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Animation,
		construct: function(model, parent){
			this._super(model, parent);
		},
		initialize: function(){
			this._super();
			//Add animation timer
			var timer = new JSO.Client.Timer(this.model, this.model.animate, this.model.fps);
			this.timers.push(timer);
				
			this.model.animate();
		}
	});
	
})();
