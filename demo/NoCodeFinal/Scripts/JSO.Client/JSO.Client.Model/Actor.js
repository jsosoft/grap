/**
* Actor
* Models game actor - moveable and interacting objects
*/
(function()
{
	JSO.Client.Model.Actor = JSO.Client.Model.Object.extend({
		constructor: JSO.Client.Model.Actor,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'actor');
			this.lastUpdated = 0;
		},
		initialize: function(){
			if(this.goalmethod){
				switch(this.goalmethod.toLowerCase()){
					case 'astar':
						this.goalfinder = new PF.AStarFinder();
						break;
					case 'breadthfirst':
						this.goalfinder = new PF.BreadthFirstFinder();
						break;
					case 'bestfirst':
						this.goalfinder = new PF.BestFirstFinder();
						break;
					case 'dijkstra':
						this.goalfinder = new PF.DijkstraFinder();
						break;
					case 'biastar':
						this.goalfinder = new PF.BiAStarFinder();
						break;
					case 'bibestfirst':
						this.goalfinder = new PF.BiBestFirstFinder();
						break;
					case 'bidijkstra':
						this.goalfinder = new PF.BiDijkstraFinder();
						break;
					case 'bibreadthfirst':
						this.goalfinder = new PF.BiBreadthFirstFinder();
						break;
					case 'jumppoint':
						this.goalfinder = new PF.JumpPointFinder();
						break;
					default:
				}
				if(this.goalfinder) {		
					this.goalfinder.allowDiagonal = true;
					this.goalfinder.dontCrossCorners = true;
				}
				if(this.goalheuristic && this.goalfinder){
					switch(this.goalheuristic.toLowerCase()){
						case 'manhattan':
							//Default
							this.goalfinder.heuristic = PF.Heuristic.manhattan;
							break;
						case 'chebyshev':
							this.goalfinder.heuristic = PF.Heuristic.chebyshev;
							break;
						case 'euclidean':
							this.goalfinder.heuristic = PF.Heuristic.euclidean;
							break;
						default:
					}
				}
			}
			this._super();
		},

		update: function () {
			if((this._calcGoal && !GOAL_REFRESH_FPS) || (this._calcGoal && this.goals.length == 0)) this.goalFind();
			this._super();
		},
		goalFind: function(){
			if(!this._calcGoal) return
			var vx = this.velocity.x;
			var vy = this.velocity.y;
			var nextPos =  new Box2D.Common.Math.b2Vec2(this.position.x + vx + (this.PLAYFIELD_SCALE.x >> 1), this.position.y + vy + (this.PLAYFIELD_SCALE.y >> 1));

			//Evaluate the next grid position and if it changed, update the game grid with the new 
			var nextGridPos = new Box2D.Common.Math.b2Vec2(0,0);
			nextGridPos.x = isNaN(nextPos.x) ? 0 : parseInt(nextPos.x / this.GOAL_RESOLUTION.x);
			nextGridPos.y = isNaN(nextPos.y) ? 0 : parseInt(nextPos.y / this.GOAL_RESOLUTION.y);
			nextGridPos.x = Math.round(nextGridPos.x < this.scaleWidth ? this.scaleWidth : nextGridPos.x >= this.grid.width - this.scaleWidth ? this.grid.width - this.scaleWidth : nextGridPos.x);
			nextGridPos.y = Math.round(nextGridPos.y < this.scaleHeight ? this.scaleHeight : nextGridPos.y >= this.grid.height - this.scaleHeight ? this.grid.height - this.scaleHeight : nextGridPos.y);

			//If there's a goal, head toward it
			if(this.goals.length > 0){
				var goalX = this.goals[0].gridPos.x;
				var goalY = this.goals[0].gridPos.y;
				
				//Perform a* search between this model's position and goal position
				this.path = this.goalfinder.findPath(nextGridPos.x, nextGridPos.y, goalX, goalY, this.grid.clone())
				var inRadius = true;
				var dist = 0;
				var pathLen = this.path.length;
				var goalstrength = this.goalstrength;
				
				//Get the distance to the next path position
				if(pathLen > 1){
					var distX = this.path[1][0] - nextGridPos.x;
					var distY = this.path[1][1] - nextGridPos.y;
					squaredDist = (distX * distX) + (distY * distY);
					dist = Math.sqrt(squaredDist);
					
					//If a goal radius defined, check if model is inside
					if(this.goalradius != undefined){ 
						var goalDistX = goalX - nextGridPos.x;
						var goalDistY = goalY - nextGridPos.y;
						var squaredGoalDist = (goalDistX * goalDistX) + (goalDistY * goalDistY);
						inRadius = (squaredGoalDist <= (this.goalradius ^ 2));
						//goalstrength = this.goalstrength * Math.abs(((this.goalradius/this.GOAL_RESOLUTION.x) - Math.sqrt(squaredGoalDist))/(this.goalradius/this.GOAL_RESOLUTION.x));
					}
				}

				//If we have a this.path to the goal, adjust the direction of the model based on relationship to the goal
				if(pathLen > 1 && inRadius){

					//Set direction to goal and allocate the x and y components accordingly
					var xSign = (distX != 0 ? distX/Math.abs(distX) : (Math.abs(vx) != 0 ? vx/Math.abs(vx) : 1));
					var ySign = (distY != 0 ? distY/Math.abs(distY) : (Math.abs(vy) != 0 ? vy/Math.abs(vy) : 1));
					vx = Math.abs(vx) * ((dist == 0 ? 1 : Math.abs(distX)/ dist) * xSign);
					vy = Math.abs(vy) * ((dist == 0 ? 1 : Math.abs(distY)/ dist) * ySign); 

					//The ultimate dirction is determined by whether the goal should avoid or chase
					vx = (vx + (this.goalstrength ? goalstrength * xSign: 0)) * this.goalAvoidSign;
					vy = (vy + (this.goalstrength ? goalstrength * ySign: 0)) * this.goalAvoidSign;
					var vel = new Box2D.Common.Math.b2Vec2(vx, vy);
					if (vel.x !== this.velocity.x && vel.y !== this.velocity.y) this.velocity = vel;
				}
			}
			delete nextPos;
			this.gridPos = nextGridPos;
		},
		destroy: function(){
			this.goals.length = 0;
			this.grid = null;
			this._super();
		}
	});
})();