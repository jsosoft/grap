/**
* Game
* Primary game model
*/
(function()
{
	JSO.Client.Model.Game = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Game,
		construct: function(id, typename, metatype){
			this._super(id,'game');
			this.listenerlist = [];
			this.running = false;
		},
		initialize: function(){
			this.lasttime = 0;
			JSO.Client.Globals.PLAYFIELD_SCALE = this.scale;
			JSO.Client.Globals.GOAL_RESOLUTION = this.goalResolution;
			//Initialize grid for pathfinding
			this.gridDimensions = this.scale.Divide(this.goalResolution);
			this.grid = new PF.Grid(Math.round(this.gridDimensions.x) + 1, Math.round(this.gridDimensions.y) + 1); 
			this._super();
		},
		step: function(time, timer){
			if(this.renderFn) this.renderFn(timer);
		}
	});
})();