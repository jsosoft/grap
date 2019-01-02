/**
* Particle
* Particle controller.  Handles the game particles
*/
(function()
{
	JSO.Client.Controller.Particle = JSO.Client.Controller.Actor.extend({
		constructor: JSO.Client.Controller.Particle,
		construct: function(model, parent){
			this._super(model, parent);
		},
		initialize: function(){
			this._super();
			if(this.model.delay > 0){
				var timer = new JSO.Client.Timer(this, this.hide, 1/this.model.delay);
				this.timers.push(timer);
			}
		}
	});
})();
