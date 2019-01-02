/**
* Player
* Models player-specific functionality
*/
(function()
{
	JSO.Client.Model.Player = JSO.Client.Model.Actor.extend({
		constructor: JSO.Client.Model.Player,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'player');
		},
		update: function(){
			var rotation = this.rotation;
			this.orientation = new Box2D.Common.Math.b2Vec2(Math.cos(rotation * (Math.PI/180)), Math.sin(rotation * (Math.PI/180)));
			var rotation = Math.floor(Math.abs(rotation) / 360) > 0 ? rotation + ((rotation > 0 ? -1 : 1) * (Math.floor(Math.abs(rotation) / 360) * 360)) : rotation;
			rotation += this.angularImpulse;
			this.rotation = (rotation < 0 ? rotation + 360 : (rotation >360 ? rotation - 360 : rotation));
			
			this.angularImpulse = this.angularImpulse - ((this.angularImpulse<0 ? -1 : 1) * this.angularDamping/GAME_REFRESH_FPS);
			this.velocityNormal = this.velocity.Copy();
			this.velocityNormal.Normalize();
			this._super();
		}
	});
})();