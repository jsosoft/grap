/**
* Particle
* Handles particle emissions
*/
(function()
{
	JSO.Client.Model.Particle = JSO.Client.Model.Actor.extend({
		constructor: JSO.Client.Model.Particle,
		construct: function(id, typename, metatype){
			this._super(id, typename || 'particle');
			this.time = 0;
			this.spawned = false;
		}
	});
})();