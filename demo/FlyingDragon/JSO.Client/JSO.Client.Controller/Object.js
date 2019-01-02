/**
* Object
* Generic controller for interacting objects.  No movement is implemented here.
*/
(function()
{
	JSO.Client.Controller.Object = JSO.Client.Controller.extend({
		constructor: JSO.Client.Controller.Object,
		construct: function(model, parent){
			this._super(model, parent);
			this.collideList = [];	
		},
		initialize: function(){
			this._super();
			
			var mdl = this.model;
			//Assign goals so they can be tracked
			if(mdl.goal != '' && mdl.goal != undefined){
				var goal = this.find(JSO.Client.Globals.MODEL, mdl.goal);
				//Mark goal and actor for performance reasons
				goal._calcGoal = true;
				mdl._calcGoal = true;
				if(goal != null) { mdl.goals.push(goal); }
			}
		}
	});
})();
