/**
*  Object
*  Models any interacting or non-interacting object
*/
(function()
{
	JSO.Client.Model.Object = JSO.Client.Model.extend({
		constructor: JSO.Client.Model.Object,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'object');
			this.goals = [];
			this.screenPosition = new Box2D.Common.Math.b2Vec2(0, 0);
			this.gridPos = new Box2D.Common.Math.b2Vec2(0, 0);
			this._calcGoal = false;
		},

		//Initialize model, populate necessary attrs and build box2d elements for physics modelling
		initialize: function(){
			this.GOAL_RESOLUTION = JSO.Client.Globals.GOAL_RESOLUTION;
			this.PLAYFIELD_SCALE = JSO.Client.Globals.PLAYFIELD_SCALE;
			
			this.scaleHeight = Math.round(this.scale.y / this.GOAL_RESOLUTION.y);
			this.scaleWidth = Math.round(this.scale.x / this.GOAL_RESOLUTION.x);
			
			//Assign grid and grid scale vals from game model
			if(!this.grid){ this.grid = JSO.Client.Globals.gameController.model.grid; }
			this.goalAvoidSign = this.goalAvoid ? -1 : 1;
			this.gridPos =  new Box2D.Common.Math.b2Vec2(Math.round((this.position.x + (this.PLAYFIELD_SCALE.x/2)) / this.GOAL_RESOLUTION.x), Math.round((this.position.y + (this.PLAYFIELD_SCALE.y/2)) / this.GOAL_RESOLUTION.y));
			
			if(this.typeChainString.indexOf('actor') == -1) this.grid.setWalkableAt(this.gridPos.x, this.gridPos.y, false);
			
			//Initialize all attributes with their startup vals
			for(var name in this.attributes){
				this[name] = this[name];
			}
			
			//Initialize object in camera view
			this.mainCam = JSO.Client.Globals.gameController.cameras[0].model;
			
			this._super();
		},
		//Update object in the application
		update: function(){
			this._super();
			var pos = this.position.Copy();
			if(this.mainCam.isInView(pos, this.scale)){
				this.screenPosition = this.mainCam.lookAt(pos);
				this.inView = true;
			} else if(this.inView){
				this.screenPosition = this.mainCam.lookAt(pos);
				this.inView = false;
			}
		},
		destroy: function(){
			this.mainCam = null;
			this._super();
		}
	});
})();