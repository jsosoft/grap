/**
* Actor
* Actor controller.  Root class for any interactive - i.e. movable and event-handled.
*/
(function()
{
	JSO.Client.Controller.Actor = JSO.Client.Controller.Object.extend({
		constructor: JSO.Client.Controller.Actor,
		construct: function(model, parent){
			this._super(model, parent);
		},
		initialize: function(){
			this._super();
			if(GOAL_REFRESH_FPS){
				if(this.model._calcGoal){
					var timer = new JSO.Client.Timer(this.model, this.model.goalFind, GOAL_REFRESH_FPS);
					this.timers.push(timer);
				}
			}
		}
	});
})();
