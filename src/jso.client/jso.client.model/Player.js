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
		}
	});
})();