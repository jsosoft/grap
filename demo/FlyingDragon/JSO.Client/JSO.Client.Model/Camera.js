/**
*  Camera
*  Models game cameras
*/
(function()
{
	JSO.Client.Model.Camera = JSO.Client.Model.Actor.extend({
		constructor: JSO.Client.Model.Camera,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'camera');
		},
		isInView: function(pos,scale){
			var camPos = this.position.Copy(), camScale = this.scale.Copy();
			var cam = {
				left: camPos.x - (camScale.x/2),
				right: camPos.x + (camScale.x/2),
				top: camPos.y - (camScale.y/2),
				bottom: camPos.y + (camScale.y/2)
			}
			
			var obj = {
				left: pos.x - (scale.x/2),
				right: pos.x + (scale.x/2),
				top: pos.y - (scale.y/2),
				bottom: pos.y + (scale.y/2)
			}
			delete camPos; delete camScale;
			return intersect(cam,obj);
		},
		lookAt: function(pos){
			var thisPos = this.position;
			return new Box2D.Common.Math.b2Vec2(pos.x - thisPos.x, pos.y - thisPos.y);
		}
	});
})();