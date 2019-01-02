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
			this.acceleration = new Box2D.Common.Math.b2Vec2(0, 0);
			this.orientation = new Box2D.Common.Math.b2Vec2(0, 0);
			this.direction = new Box2D.Common.Math.b2Vec2(0, 0);
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
		update: function () {
			var vel = this.velocity.Copy();
			var rot = this.rotation;
			if (this.acceleration.x > 0 || this.acceleration.y > 0 || this.acceleration.x < 0 || this.acceleration.y < 0) vel = this.velocity.Add(this.acceleration);

			if (vel.x > .01 || vel.x < -.01) {
				this.direction.x = Math.cos(rot * (Math.PI / 180));
			}	

			if (vel.y > .01 || vel.y < -.01) {
				this.direction.y = Math.sin(rot * (Math.PI / 180));
			}

			vel.x = ((vel.x < 0.01 && vel.x > 0) || (vel.x > -0.01 && vel.x < 0) ? 1 : vel.x);
			vel.y = ((vel.y < 0.01 && vel.y > 0) || (vel.y > -0.01 && vel.y < 0) ? 1 : vel.y);

			if (vel.x >= 0) {
				vel.x = vel.x < this.minVelocity.x ? -this.minVelocity.x : vel.x > this.maxVelocity.x ? this.maxVelocity.x : vel.x;
			} else {
				vel.x = vel.x > -this.minVelocity.x ? this.minVelocity.x : vel.x < -this.maxVelocity.x ? -this.maxVelocity.x : vel.x;
			}

			if (vel.y >= 0) {
				vel.y = vel.y < this.minVelocity.y ? -this.minVelocity.y : vel.y > this.maxVelocity.y ? this.maxVelocity.y : vel.y;
			} else {
				vel.y = vel.y > -this.minVelocity.y ? this.minVelocity.y : vel.y < -this.maxVelocity.y ? -this.maxVelocity.y : vel.y;
			}
			
			if (vel.x !== this.velocity.x || vel.y !== this.velocity.y) {
				this.velocity = vel;
			}
			if (this.angularImpulse) {
				rot = Math.floor(Math.abs(rot) / 360) > 0 ? rot + ((rot > 0 ? -1 : 1) * (Math.floor(Math.abs(rot) / 360) * 360)) : rot;
				rot += this.angularImpulse;
				this.rotation = (rot < 0 ? rot + 360 : (rot > 360 ? rot - 360 : rot));
				this.orientation = new Box2D.Common.Math.b2Vec2(Math.cos(this.rotation * (Math.PI / 180)), Math.sin(this.rotation * (Math.PI / 180)));
			}
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